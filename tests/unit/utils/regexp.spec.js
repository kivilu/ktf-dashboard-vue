describe('regexp:replace', () => {
  it('replace', () => {
    expect('app.js'.replace(/(.*\/)*([^.]+).*/ig, '$2')).toBe('app')
  })
  it('getParam', () => {
    const key = '/dev-api/sys/dic/select/'
    const uri = `${key}0?t=1591368743140`
    var tmp = uri.replace(key, '')
    const param = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/ig, '$1')
    expect(param === '0').toBe(true)
  })
  it('regexp-matcher', () => {
    expect(/^once/.test('once upon a time')).toBe(true)
    expect(/^once/.test('There once was a man from NewYork')).toBe(false)
    expect(/^once/.test('There onces was a man from NewYork')).toBe(false)
    expect(/.*?(once).*?/.test('once upon a time')).toBe(true)
    expect(/.*?(once).*?/.test('There once was a man from NewYork')).toBe(true)
    expect(/.*?(bucket)/.test('Who kept all of this cash in a bucket')).toBe(true)
    expect(/.*?(bucket)$/.test('Who kept all of this cash in a buckets')).toBe(false)
  })
})
