// import base64js from 'base64-js'
import { MessageBox, Message } from 'element-ui'
import { IPK_OK, ipkError, pinError } from './ipk-error.js'
import { IPKDevice, IPKUserType } from './ipk-device-type.js'

const OCX_IPK_NAME = 'OCX_IPK'

function Ipk (disable = false) {
  this.disable = disable
  this._ocx = document.getElementById(OCX_IPK_NAME)

  // method
  this.messageBox = function (ret) {
    var message = ''
    if (pinError(ret.status)) {
      message =
        ret.data === 0
          ? '设备已锁定'
          : '口令错误，剩余重试次数' + ret.data + '次'
    } else {
      message = ipkError(ret.status)
    }
    MessageBox.alert(message, '提示', {
      confirmButtonText: '确定'
    })
  }

  /**
   * 从已经打开的U盾读取标识
   * @param keyIndex 密钥位置，默认：1
   */
  this._getKeyId = function (keyIndex = 1) {
    if (this.disable) return true

    var ret = JSON.parse(this._ocx.GetKeyId(keyIndex))
    if (ret.status !== IPK_OK) {
      console.error('读取U盾标识失败，返回错误码：' + ipkError(ret.status))
      return ''
    }

    return ret.data
  }

  this._asyncSignPromise = async function (
    data,
    userPin,
    keyIndex,
    pinCallback
  ) {
    let result = await this._signPromise(data, userPin, keyIndex, pinCallback)
    return result
  }

  this._signPromise = function (data, userPin, keyIndex, pinCallback) {
    let promise = new Promise((resolve, reject) => {
      this.verifyPin(IPKUserType.USER, userPin, '签名', pinCallback)
        .then(reason => {
          var ret = JSON.parse(this._ocx.SignData(keyIndex, data))
          if (ret.status !== IPK_OK) {
            this.messageBox(ret)
            reject(new Error('数据签名失败：' + ipkError(ret.status)))
          } else {
            resolve(ret.data)
          }
        })
        .catch(reason => {
          console.log(reason)
          reject(new Error('数据签名失败：' + reason))
        })
    })

    return promise
  }

  this._writeKeyData = function (keyIndex, keyData, userPin) {
    let adminPinVerify = this.verifyPin(IPKUserType.ADMIN, '', '写密钥')
    let userPinVerify = this.verifyPin(IPKUserType.USER, userPin, '写密钥')
    // 写密钥
    return new Promise((resolve, reject) => {
      adminPinVerify
        .then(() => userPinVerify)
        .then(value => {
          // console.log('写密钥，密钥索引：' + keyIndex + '数据：' + keyData)
          var ret = JSON.parse(this._ocx.WriteKey(keyIndex, keyData))
          console.log('写密钥，返回码：' + ret.status + ' 数据：' + ret.data)
          if (ret.status !== IPK_OK) {
            reject(new Error('写密钥失败：' + ipkError(ret.status)))
          } else {
            resolve(0)
          }
        })
        .catch(reason => {
          console.error(reason)
        })
    })
  }
} // end of class

Ipk.prototype.destroy = function () {
  // console.log('destroy:' + OCX_IPK_NAME)
  // Ipk.prototype._ocx = null
}

/**
 * 获取控件版本
 */
Ipk.prototype.getVersion = function () {
  if (this.disable) return ''

  var ret = JSON.parse(this._ocx.GetVersion())
  if (ret.status !== IPK_OK) {
    this.messageBox(ret)
    return ''
  }

  return ret.data
}

Ipk.prototype.isOcxReady = function () {
  if (this.disable) return true

  try {
    var data = this._ocx.GetVersion()
    var ret = JSON.parse(data)
    // console.log(ret)
    return ret.status === 0
  } catch (e) {
    console.error(e)
  }
  return false
}

/**
 * 打开设备
 * @param devType   硬件设备类型(0:用户Key;  1:IPK Card;  2:TF Card; 3: IPK VKey，4：管理员KEY) ,
 * @param vkeyFile  软件盾数据文件(含路径)
 * @return true 成功， false 失败
 */
Ipk.prototype.openDevice = function (
  devType = IPKDevice.ADMIN_KEY,
  vkeyFile = ''
) {
  if (this.disable) return true

  var data = this._ocx.OpenDevice(devType, vkeyFile)
  // console.log('OpenDevice ret:' + data)
  var ret = JSON.parse(data)
  if (ret.status !== IPK_OK) {
    //  this.messageBox(ret)
    throw new Error(
      (devType === IPKDevice.ADMIN_KEY
        ? '管理员KEY打开失败:'
        : '用户KEY打开失败：') + ipkError(ret.status)
    )
  }

  return true
}

/**
 * 关闭设备
 * @return true 成功， false 失败
 */
Ipk.prototype.closeDevice = function (tips = '') {
  if (this.disable) return true

  console.log('关闭设备，调用来源：' + tips)
  var ret = JSON.parse(this._ocx.CloseDevice())
  if (ret.status !== IPK_OK) {
    console.error('关闭设备失败，errcode:' + ret.status)
    return false
  }

  return true
}

/**
 * 口令验证
 * @param userType 1: 管理员，2：用户
 * @param pin PIN 码，若值为空''则采用默认 PIN 进行验证
 * @param pinCallback 输入PIN的回调函数
 * @paarm title 弹出框title
 */
Ipk.prototype.verifyPin = function (
  userType,
  pin,
  title,
  pinCallback = x => { }
) {
  if (this.disable) {
    return new Promise((resolve) => {
      resolve(userType)
    })
  }

  let promise = new Promise((resolve, reject) => {
    var ret = JSON.parse(this._ocx.VerifyPin(userType, pin))
    if (ret.status !== IPK_OK) {
      // 再次尝试
      MessageBox.prompt(
        userType === IPKUserType.ADMIN
          ? '请输入正确的管理员PIN码'
          : '请输入正确的用户PIN码',
        'PIN重试—' + title,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'password',
          inputPattern: /^[0-9a-zA-Z~!@#$%^&*]{8}$/,
          inputErrorMessage: 'PIN格式不正确，允许8位数字、字母或符号的组合'
        }
      )
        .then(({ value }) => {
          if (pinCallback && typeof pinCallback === 'function') {
            pinCallback(value)
          }
          var ret = JSON.parse(this._ocx.VerifyPin(userType, value))
          if (ret.status !== IPK_OK) {
            this.messageBox(ret)
            reject(
              new Error(
                userType === IPKUserType.ADMIN
                  ? '管理员PIN验证失败'
                  : '用户PIN验证失败'
              )
            )
          } else {
            console.log(
              userType === IPKUserType.ADMIN
                ? '管理员PIN验证成功'
                : '用户PIN验证成功'
            )
            resolve(userType)
          }
        })
        .catch(() => {
          Message({
            type: 'info',
            message:
              userType === IPKUserType.ADMIN
                ? '取消验证管理员PIN'
                : '取消验证用户PIN'
          })
          reject(
            new Error(
              userType === IPKUserType.ADMIN
                ? '取消验证管理员PIN'
                : '取消验证用户PIN'
            )
          )
        })
    } else {
      // 首次验证PIN成功
      console.log(
        userType === IPKUserType.ADMIN ? '管理员PIN验证成功' : '用户PIN验证成功'
      )
      resolve(userType)
    }
  })

  return promise
}

/**
 * 获取设备标识
 * @param devType 设备类型，0：用户KEY，4：管理员key，默认：4
 * @param keyIndex 密钥位置，默认：1
 * @return 成功返回设备标识，失败返回空
 */
Ipk.prototype.getDevId = function (
  devType = IPKDevice.ADMIN_KEY,
  keyIndex = 1,
  vkeyFile = ''
) {
  if (this.disable) return ''

  var result = ''
  this.openDevice(devType, vkeyFile)
  try {
    result = this._getKeyId(keyIndex)
  } finally {
    this.closeDevice('FUNC-getDevId')
  }

  return result
}

/**
 * 数据签名
 * @param data 签名数据
 * @param userPin 用户PIN，默认：''
 * @param pinCallback 用户PIN再次输入的回调函数，
 * @param devType 设备类型，0：用户KEY，4：管理员key，默认：4
 * @param keyIndex 密钥位置，默认：1
 *
 * @return 返回base64签名结果
 */
Ipk.prototype.sign = async function (
  data,
  userPin = '',
  pinCallback = x => { },
  devType = IPKDevice.ADMIN_KEY,
  keyIndex = 1,
  vkeyFile = ''
) {
  if (this.disable) return {}

  var sign = ''
  var identifier = ''

  this.openDevice(devType, vkeyFile)
  try {
    identifier = this._getKeyId(keyIndex)
    sign = await this._asyncSignPromise(data, userPin, keyIndex, pinCallback)
  } catch (e) {
    throw e
  } finally {
    this.closeDevice('FUNC-sign')
  }

  return {
    sign: sign,
    identifier: identifier
  }
}

/**
 * 密钥下载申请
 * string KeyRequset(string kmsId)
 * @param kmsId 服务器密钥ID
 * @param devType 设备类型，默认：0
 * @param defaultSuPin 管理员口令标识，true:默认口令，false:非默认口令
 */
Ipk.prototype.applyKey = function (kmsId, pin) {
  if (this.disable) {
    return new Promise((resolve) => {
      resolve('')
    })
  }

  let promise = new Promise((resolve, reject) => {
    this.openDevice(IPKDevice.KEY, '')
    this.verifyPin(IPKUserType.USER, pin, '密钥申请')
      .then(result => {
        var ret = JSON.parse(this._ocx.KeyRequset(kmsId))
        resolve(ret)
      })
      .catch(reason => {
        reject(new Error(reason))
      })
      .finally(() => {
        this.closeDevice('FUN-applyKey')
      })
  })
  return promise
}

/**
 * 密钥下载
 * 接口原型：char * WriteKey (int devType, int keyIndex, char *keyData);
 * @param keyData 密钥数据
 * @param index 密钥位置，默认：1
 * @param devType 设备类型，默认：0
 * @param userPin 用户PIN码
 */
Ipk.prototype.writeKey = function (
  keyData,
  keyIndex = 1,
  devType = IPKDevice.KEY,
  userPin = '',
  vkeyFile = ''
) {
  if (this.disable) return null

  return new Promise((resolve, reject) => {
    this.openDevice(devType, vkeyFile)
    var devId = this._getKeyId(keyIndex)
    if (devId !== '') {
      MessageBox.confirm(
        '该设备中已经存在密钥,\r\n标识为:' + devId + ',\r\n是否覆盖此密钥?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this._writeKeyData(keyIndex, keyData, userPin, this)
            .then(value => {
              // console.log('writeKeyData返回：' + value)
              resolve(value)
            })
            .finally(() => this.closeDevice('FUN:writeKey'))
        })
        .catch(() => {
          reject(new Error('取消密钥写入操作'))
        })
    } else {
      this._writeKeyData(keyIndex, keyData, userPin, this)
        .then(value => {
          // console.log('writeKeyData返回：' + value)
          resolve(value)
        })
        .finally(() => this.closeDevice('FUN:writeKey'))
    } // end if
  })
}

/**
 * 修改 PIN
 * 接口原型：string ModifyPin(int userType, string oldPin, string newPin)
 * @param oldPin 旧PIN码
 * @param newPin 新PIN码
 * @param devType 设备类型，默认：4
 */
Ipk.prototype.modifyPin = function (
  oldPin,
  newPin,
  devType = IPKDevice.ADMIN_KEY,
  vkeyFile = ''
) {
  if (this.disable) return true

  // 打开设备
  this.openDevice(devType, vkeyFile)
  try {
    var ret = JSON.parse(this._ocx.ModifyPin(oldPin, newPin))
    if (ret.status !== IPK_OK) {
      console.error('修改PIN失败:' + ret.status)
      throw new Error('修改PIN失败，剩余重试次数：' + ret.data)
    }
  } finally {
    this.closeDevice('FUNC-modifyPin')
  }

  return true
}

/**
 *  PIN 重置申请
 * 接口原型：char* GetPinResetReq ();
 * @param defaultSuPin 管理员PIN，默认：''
 * @param devType 设备类型，默认：0
 * @param vkeyFile 软件盾文件，默认：''
 */
Ipk.prototype.applyResetPin = function (
  defaultSuPin = '',
  devType = IPKDevice.KEY,
  vkeyFile = ''
) {
  if (this.disable) return null

  let promise = new Promise((resolve, reject) => {
    // 打开设备
    this.openDevice(devType, vkeyFile)

    // 验证管理员PIN
    this.verifyPin(IPKUserType.ADMIN, defaultSuPin, 'PIN重置申请')
      .then(
        reason => {
          var ret = JSON.parse(this._ocx.GetPinResetReq())
          if (ret.status !== IPK_OK) {
            reject(new Error('用户PIN重置失败：' + ipkError(ret.status)))
          } else {
            resolve(ret.data)
          }
        },
        reason => {
          throw new Error(reason)
        }
      )
      .finally(() => {
        this.closeDevice('FUN:applyResetPin')
      })
  })

  return promise
}

/**
 * PIN 重置
 * 接口原型：string ResetPin(string innerSKey, string newPin)
 * @param devId 设备标识
 * @param skey 会话密钥
 * @param devType 设备类型，默认：0
 */
Ipk.prototype.resetPin = function (
  innerSKey,
  newPin,
  defaultSuPin = true,
  devType = IPKDevice.KEY,
  vkeyFile = ''
) {
  if (this.disable) return null

  let promise = new Promise((resolve, reject) => {
    this.openDevice(devType, vkeyFile)
    // 验证管理员PIN
    this.verifyPin(IPKUserType.ADMIN, defaultSuPin, 'PIN重置')
      .then(
        reason => {
          var ret = JSON.parse(this._ocx.ResetPin(innerSKey, newPin))
          if (ret.status !== IPK_OK) {
            throw new Error('重置PIN失败:' + ipkError(ret.status))
          }
        },
        reason => {
          throw new Error('重置PIN失败:' + reason)
        }
      )
      .finally(() => {
        this.closeDevice('FUN:resetPin')
      })
  })

  return promise
}

export default Ipk
