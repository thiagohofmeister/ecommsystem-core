export class RedisCollection<TValue> {
  constructor(
    private key: string,
    private value?: TValue,
    private expiration?: Date | number
  ) {}

  public setValue(value: TValue): this {
    this.value = value
    return this
  }

  public getValue(): TValue {
    return this.value
  }

  public getKey(): string {
    return this.key
  }

  public getExpiration(): Date | number {
    return this.expiration
  }
}
