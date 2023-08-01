import { Account } from '../domains/account';
import { IIntegration } from '../interface/integration.interface';
import { ISettings } from '../interface/settings.interface';

type AccountProps = {
  code: string;
  settings: ISettings;
  integration: IIntegration[];
};
export default class AccountFactory {
  static createAccount(props: AccountProps): Account {
    return new Account(props);
  }
}
