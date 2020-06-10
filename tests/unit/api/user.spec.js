import { login } from '@/api/user'

describe('api:user', () => {
  it('login', async () => {
    const params = { username: 'admin', password: '1234' }
    // console.log(params)
    var res = await login(params)
    // console.log(res)
    expect(res.code === 200).toBe(true)
  })
})
