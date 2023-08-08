import { Account } from '../domains/account';
import { IntegrationRequestDto } from '../dto/integration-request.dto';
import { IIntegration } from '../interface/integration.interface';
import { ISettings } from '../interface/settings.interface';

type AccountProps = {
  accountCode: string;
  integration: IntegrationRequestDto;
};
export default class AccountFactory {
  static createAccount(props: AccountProps): Account {
    return new Account(props);
  }
}
