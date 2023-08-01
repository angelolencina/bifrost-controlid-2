import { IIntegration } from '../interface/integration.interface';
import { ISettings } from '../interface/settings.interface';

type AccountProps = {
  code: string;
  settings: ISettings;
  integration: IIntegration[];
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
  code: string;
  settings: ISettings;
  integration: IIntegration[];
}
