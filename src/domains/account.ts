import { IIntegration } from '../interface/integration.interface';
import { ISettings } from '../interface/settings.interface';

type AccountProps = {
  code: string;
  settings?: ISettings;
  integration?: IIntegration[];
};
export class Account {
  #code: string;
  #settings: string;
  #integration: string;
  constructor(props: AccountProps) {
    this.#code = props.code;
    this.#settings = JSON.stringify(props.settings);
    this.#integration = JSON.stringify(props.integration);
  }

  get code(): string {
    return this.#code;
  }

  get settings(): ISettings {
    console.log()
    return JSON.parse(this.#settings);
  }

  get integration(): IIntegration[] {
    return JSON.parse(this.#integration);
  }
  
  toJson() {
    return {
      code: this.code,
      settings: this.settings,
      integration: this.integration,
    };
  }
}
