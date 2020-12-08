export const IPK_OK = 0
const IPK_ERROR = [
  /* COS接口错误号定义 */
  {
    code: 1001,
    desc: 'CLA错误0x6E00'
  },
  {
    code: 1002,
    desc: 'INS错误0x6D00'
  },
  {
    code: 1003,
    desc: 'COS读取数据失败'
  },
  {
    code: 1004,
    desc: 'COS写数据失败0x6581'
  },
  {
    code: 1006,
    desc: '空间不足0x6A84'
  },
  {
    code: 1007,
    desc: 'P1 P2参数错误0x6A86'
  },
  {
    code: 1008,
    desc: '功能不支持0x6A81'
  },
  {
    code: 1009,
    desc: '使用条件不满足0x6985'
  },
  {
    code: 1010,
    desc: '数组越界'
  },
  {
    code: 1011,
    desc: '数据域参数错误0x6A80'
  },
  {
    code: 1012,
    desc: '不满足安全状态0x6982'
  },
  {
    code: 1013,
    desc: '数据通讯错误'
  },
  {
    code: 1014,
    desc: '外部认证失败'
  },
  {
    code: 1015,
    desc: '安全报文数据项不正确或MAC错误0x6988'
  },
  {
    code: 1016,
    desc: '数据长度错误'
  },
  {
    code: 1017,
    desc: '未取随机数0x6984'
  },
  {
    code: 1018,
    desc: '缓冲区不足'
  },
  {
    code: 1019,
    desc: 'LE错误0x6CXX'
  },
  {
    code: 1020,
    desc: '安全报文丢失0x6987'
  },
  {
    code: 1021,
    desc: '文件控制信息错误0x698A'
  },
  {
    code: 1022,
    desc: '时间错误0x698B'
  },
  {
    code: 1023,
    desc: 'CRC校验错误0x6A02'
  },

  {
    code: 2000,
    desc: '设备ID错误'
  },
  {
    code: 2001,
    desc: '设备打开失败'
  },
  {
    code: 2002,
    desc: '设备关闭失败'
  },
  {
    code: 2003,
    desc: '设备未打开'
  },
  {
    code: 2004,
    desc: '连接读卡器失败'
  },
  {
    code: 2005,
    desc: 'USB初始化失败'
  },
  {
    code: 2006,
    desc: 'USB调用接口失败'
  },
  {
    code: 2007,
    desc: '电脑没有发现IPK-U盾' // 设备类型错误(不支持的设备类型或未指定设备类型)
  },
  {
    code: 2008,
    desc: '释放端点失败'
  },
  {
    code: 2009,
    desc: 'VKEY与运行环境不匹配'
  },

  {
    code: 3001,
    desc: 'PIN码类型错'
  },
  {
    code: 3002,
    desc: 'PIN码校验错'
  },
  {
    code: 3003,
    desc: 'PIN码长度错'
  },
  {
    code: 3004,
    desc: '认证方式锁定0x6983'
  },

  {
    code: 4001,
    desc: '文件不存在0x6A82'
  },
  {
    code: 4002,
    desc: '文件已存在0x6A87'
  },
  {
    code: 4003,
    desc: '文件类型错0x6981'
  },
  {
    code: 4004,
    desc: '文件偏移错'
  },
  {
    code: 4005,
    desc: '已达文件最大数'
  },
  {
    code: 4007,
    desc: '文件标识与文件类型不匹配'
  },
  {
    code: 4008,
    desc: '数据超过文件设定长度0x6A88'
  },
  {
    code: 4009,
    desc: '分配的空间不足'
  },
  {
    code: 4010,
    desc: '文件名错误'
  },
  {
    code: 4011,
    desc: '文件系统不存在或卡未初始化0x6A83'
  },
  {
    code: 4012,
    desc: '文件内容为空'
  },
  {
    code: 4013,
    desc: '企业公钥不存在0x6A85'
  },
  {
    code: 4014,
    desc: '系统公钥不存在0x6A89'
  },
  {
    code: 4015,
    desc: '初始化文件锁失败'
  },

  {
    code: 5001,
    desc: '密钥不匹配'
  },
  {
    code: 5002,
    desc: '私钥长度错'
  },
  {
    code: 5003,
    desc: '私钥ID码错'
  },
  {
    code: 5004,
    desc: '没有密(私)钥数据0x6A03'
  },
  {
    code: 5005,
    desc: '随机数长度错误'
  },
  {
    code: 5006,
    desc: '授权生产密钥个数已完'
  },
  {
    code: 5007,
    desc: '没有会话密钥'
  },
  {
    code: 5008,
    desc: '签名内容长度错'
  },
  {
    code: 5009,
    desc: '签名验证失败0x9302'
  },
  {
    code: 5010,
    desc: 'SM2解密失败0x9304'
  },

  {
    code: 6001,
    desc: '设备、私钥、应用等未授权0x6A04'
  },
  {
    code: 6002,
    desc: '授权过期0x6A05'
  },
  {
    code: 6003,
    desc: '超过续费周期'
  },
  {
    code: 6004,
    desc: '未到授权日期0x6A06'
  },
  {
    code: 6005,
    desc: '初始化校验码错误'
  },

  /* 应用接口错误号定义 */
  {
    code: 11001,
    desc: '参数无效'
  },
  {
    code: 11002,
    desc: '无效密钥卡'
  },
  {
    code: 11003,
    desc: '公钥矩阵不匹配'
  },
  {
    code: 11004,
    desc: '算法无效'
  },
  {
    code: 11005,
    desc: '无效密文数据'
  },
  {
    code: 11006,
    desc: '打开文件失败'
  },
  {
    code: 11008,
    desc: '公钥矩阵文件不存在'
  },
  {
    code: 11009,
    desc: '删除文件错误'
  },
  {
    code: 11010,
    desc: '文件重命名错误'
  },
  {
    code: 11011,
    desc: '数字信封类型错误'
  },
  {
    code: 11012,
    desc: '功能不支持'
  },

  {
    code: 12001,
    desc: '申请内存失败'
  },
  {
    code: 12002,
    desc: '公钥体制版本错误'
  },
  {
    code: 12003,
    desc: '新建矩阵结构对象失败'
  },
  {
    code: 12004,
    desc: '摘要信息长度错误'
  },
  {
    code: 12005,
    desc: '格式转换错误'
  },
  {
    code: 12006,
    desc: '密钥ID长度超限'
  },
  {
    code: 12007,
    desc: '新建密钥结构对象失败'
  },

  {
    code: 13001,
    desc: '得到映射算法错误'
  },
  {
    code: 13002,
    desc: '得到私钥失败'
  },
  {
    code: 13003,
    desc: '得到加密算法'
  },
  {
    code: 13004,
    desc: '得到交换密钥失败'
  },

  {
    code: 14001,
    desc: 'HASH运算错误'
  },
  {
    code: 14002,
    desc: '加密失败'
  },
  {
    code: 14003,
    desc: '解密失败'
  },
  {
    code: 14004,
    desc: '签名失败'
  },
  {
    code: 14005,
    desc: '验证签名失败'
  },
  {
    code: 14006,
    desc: '用户自定义公钥错误'
  },
  {
    code: 14007,
    desc: 'MAC码验证失败'
  },
  {
    code: 14008,
    desc: '密钥标识错误'
  },
  {
    code: 14009,
    desc: '矩阵标识错误'
  },
  {
    code: 14010,
    desc: '加密文件版本错误'
  },
  {
    code: 14011,
    desc: '验证校验码错误'
  },
  {
    code: 14012,
    desc: '数据长度超限'
  },

  {
    code: 15001,
    desc: '大整数类型转换错误'
  },
  {
    code: 15002,
    desc: '新建大整数失败'
  },
  {
    code: 15003,
    desc: '生成随机大整数失败'
  },
  {
    code: 15004,
    desc: '大整数求逆失败'
  },

  {
    code: 16001,
    desc: '椭圆曲线点格式错误'
  },
  {
    code: 16002,
    desc: '椭圆曲线点格式转换失败'
  },
  {
    code: 16003,
    desc: '新建椭圆曲线点失败'
  },
  {
    code: 16004,
    desc: '点乘失败'
  },
  {
    code: 16005,
    desc: '得到order失败'
  },
  {
    code: 16006,
    desc: '得到EC_GROUP错误'
  },
  {
    code: 16007,
    desc: '新建椭圆曲线KEY失败'
  },
  {
    code: 16008,
    desc: 'EC_KEY参数设置失败'
  },
  {
    code: 16009,
    desc: 'EC_DSA签名长度错误'
  },
  {
    code: 16010,
    desc: '椭圆曲线不同'
  }
]
/**
 * 获取错误码说明
 */
export function ipkError(code) {
  // console.log(code)
  var result = IPK_ERROR.filter(err => err.code === code)
  //

  return result && result.length > 0 ? result[ 0 ].code + '-' + result[ 0 ].desc : '未定义的错误码：' + code
}

export function pinError(code) {
  const pinError = [ 3002, 3004 ]

  return pinError.includes(code)
}
