import SM3Digest from './crypto/sm3-1.0'
import SM4 from './crypto/sm4-1.0'
import Hex from './hex'
import { Base64 } from 'js-base64'

const gm = {
  sm3(s, returnHex = false) {
    var dataBy = Hex.utf8StrToBytes(s)

    var sm3 = new SM3Digest()
    sm3.update(dataBy, 0, dataBy.length) // 数据很多的话，可以分多次update
    var sm3Hash = sm3.doFinal() // 得到的数据是个byte数组
    if (returnHex) {
      return Hex.encode(sm3Hash, 0, sm3Hash.length) // 编码成16进制可见字符
    } else {
      const u8s = new Uint8Array(sm3Hash)
      return Base64.fromUint8Array(u8s)
    }
  },
  sm4_enc_ecb(s, hexKey) {
    var inputBytes = Hex.utf8StrToBytes(s)
    var key = Hex.decode(hexKey)
    var sm4 = new SM4()
    var cipher = sm4.encrypt_ecb(key, inputBytes)
    return Hex.encode(cipher, 0, cipher.length)
  },
  sm4_dec_ecb(s, hexKey) {
    var inputBytes = Hex.decode(s)
    var key = Hex.decode(hexKey)
    var sm4 = new SM4()
    var plain = sm4.decrypt_ecb(key, inputBytes)
    return Hex.bytesToUtf8Str(plain)
  },
  sm4_enc_cbc(s, hexKey, hexIv = '00000000000000000000000000000000') {
    var inputBytes = Hex.utf8StrToBytes(s)
    var key = Hex.decode(hexKey)
    var iv = Hex.decode(hexIv)
    var sm4 = new SM4()
    var cipher = sm4.encrypt_cbc(key, iv, inputBytes)
    return Hex.encode(cipher, 0, cipher.length)
  },
  sm4_dec_cbc(s, hexKey, hexIv = '00000000000000000000000000000000') {
    var inputBytes = Hex.decode(s)
    var key = Hex.decode(hexKey)
    var iv = Hex.decode(hexIv)
    var sm4 = new SM4()
    var plain = sm4.decrypt_cbc(key, iv, inputBytes)
    return Hex.bytesToUtf8Str(plain)
  }
}
export default gm
