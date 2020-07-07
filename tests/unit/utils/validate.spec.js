import { validUsername, isExternal, urlMacher, uriMacher } from '@/utils/validate.js'

describe('Utils:validate', () => {
  it('validUsername', () => {
    expect(validUsername('admin')).toBe(true)
    expect(validUsername('editor')).toBe(true)
    expect(validUsername('xxxx')).toBe(true)
  })
  it('isExternal', () => {
    expect(isExternal('http://localhost:8090/doc.html')).toBe(true)
    expect(isExternal('https://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(isExternal('http://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(isExternal('github.com/PanJiaChen/vue-element-admin')).toBe(false)
    expect(isExternal('/dashboard')).toBe(false)
    expect(isExternal('./dashboard')).toBe(false)
    expect(isExternal('dashboard')).toBe(false)
  })
  it('url-matcher', () => {
    expect(urlMacher('http://192.168.8.116:8090/kms/key/apply/new?t=121343', 'kms/key/apply/new')).toBe(true)
    expect(urlMacher('http://192.168.8.116:8090/kms/key/apply/newD?t=121343', 'kms/key/apply/new')).toBe(false)

    expect(urlMacher('http://192.168.8.116:8090/kms/key/download?t=121343', 'kms/key/download')).toBe(true)
    expect(urlMacher('http://192.168.8.116:8090/kms/key/download?t=121343', 'kms/key/downloadComplete')).toBe(false)

    expect(urlMacher('http://192.168.8.116:8090/kms/key/download/id123/werew32?t=121343', 'kms/key/download/*')).toBe(true)

    expect(urlMacher('http://192.168.8.116:8090/kms/key/downloadComplete?t=121343', 'kms/key/downloadComplete')).toBe(true)
    expect(urlMacher('http://192.168.8.116:8090/kms/key/downloadComplete?t=121343', 'kms/key/download')).toBe(false)
    expect(urlMacher('http://192.168.8.116:8090/kms/key/downloadComplete?t=121343', 'kms/key/download/*')).toBe(false)

    expect(urlMacher('http://192.168.8.116:8090/kms/key/delete/123?t=121343', 'kms/key/delete/*')).toBe(true)
    expect(urlMacher('http://192.168.8.116:8090/kms/key/delete?t=121343', 'kms/key/delete')).toBe(true)
  })
  it('uri-matcher', () => {
    expect(uriMacher('/api/kms/key/apply/new', 'kms/key/apply/new')).toBe(true)
    expect(uriMacher('/api/kms/key/download/id12132?t=1212', 'kms/key/download/*')).toBe(true)
    expect(uriMacher('/api/kms/key/download/id12132', 'kms/key/download/*')).toBe(true)

    expect(uriMacher('/api/kms/key/apply/new?t=121343', 'kms/key/apply/new')).toBe(true)
    expect(uriMacher('/api/kms/key/apply/newD?t=121343', 'kms/key/apply/new')).toBe(false)

    expect(uriMacher('/api/kms/key/download?t=121343', 'kms/key/download')).toBe(true)
    expect(uriMacher('/api/kms/key/download?t=121343', 'kms/key/downloadComplete')).toBe(false)

    expect(uriMacher('/api/kms/key/download/id123/werew32?t=121343', 'kms/key/download/*')).toBe(true)

    expect(uriMacher('/api/kms/key/downloadComplete?t=121343', 'kms/key/downloadComplete')).toBe(true)
    expect(uriMacher('/api/kms/key/downloadComplete?t=121343', 'kms/key/download')).toBe(false)
    expect(uriMacher('/api/kms/key/downloadComplete?t=121343', 'kms/key/download/*')).toBe(false)

    expect(uriMacher('/api/kms/key/delete/123?t=121343', 'kms/key/delete/*')).toBe(true)
    expect(uriMacher('/api/kms/key/delete?t=121343', 'kms/key/delete')).toBe(true)

    expect(uriMacher('/api/sys/login', 'kms/key/apply/new')).toBe(false)
  })
})
