import { BaseError } from "./BaseError";

export class DataNotFoundException extends BaseError {
  constructor(message: string = "Item not found.") {
    super(message);
  }
}
