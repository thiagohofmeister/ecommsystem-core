import { BaseRequest } from "../../Modules/Request/BaseRequest";

export abstract class ProviderContract<TRequest extends BaseRequest> {
  constructor(readonly request: TRequest) {}

  protected getRequest(): TRequest {
    return this.request.createInstance().withHeaders(this.getDefaultHeaders());
  }

  protected getDefaultHeaders(): any {
    return {};
  }
}
