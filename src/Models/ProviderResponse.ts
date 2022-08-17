export class ProviderResponse<TBody = any> {
  constructor(private statusCode: number, private body: TBody) {}

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getBody(): TBody {
    return this.body;
  }
}
