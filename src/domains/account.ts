import { IntegrationRequestDto } from '../dto/integration-request.dto';

type AccountProps = {
  accountCode: string;
  integration: IntegrationRequestDto;
};
export class Account {
  #code: string;
  #integration: IntegrationRequestDto;
  constructor(props: AccountProps) {
    this.#code = props.accountCode;
    this.#integration = props.integration;
  }

  get code(): string {
    return this.#code;
  }

  get integration() {
    return this.#integration;
  }

  toJson() {
    return {
      code: this.code,
      integration: this.integration,
    };
  }
}
