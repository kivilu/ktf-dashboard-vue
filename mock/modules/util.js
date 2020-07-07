import path from 'path'
import fs from 'fs'

export function loadjson(filename) {
  const file = path.resolve(__dirname, `../data/${filename}`)
  // 同步读取
  var data = fs.readFileSync(file, 'utf-8')
  return JSON.parse(data)
}

