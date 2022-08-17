import * as jwt from 'jsonwebtoken'

export class JWT {
  constructor(private privateKey: string) {}

  public sign(data: any) {
    return jwt.sign(data, this.privateKey, {
      algorithm: 'HS256'
    })
  }
}
