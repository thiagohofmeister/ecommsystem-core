import { IErrorReason } from "../Interfaces/IErrorReason";

export abstract class BaseError extends Error {
  private code: string;

  constructor(public message: string, private reasons: IErrorReason[] = []) {
    super(message);
  }

  public getMessage(): string {
    return this.message;
  }

  public addReason(reason: IErrorReason): this {
    this.reasons.push(reason);
    return this;
  }

  public getReasons(): IErrorReason[] {
    return this.reasons;
  }

  public setCode(code: string): this {
    this.code = code;
    return this;
  }

  public getCode(): string {
    if (!!this.code) {
      return this.code;
    }

    return `${this.constructor.name
      .substring(0, 1)
      .toLowerCase()}${this.constructor.name.substring(
      1,
      this.constructor.name.length
    )}`;
  }
}
