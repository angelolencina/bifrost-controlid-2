import { IntegrationName } from '../domains/integration.enum';

export interface IIntegration {
  name: IntegrationName;
  mysql?: MySqlDataBase;
  sqlite?: SqLiteDataBase;
  api?: ApiDto;
}

class MySqlDataBase {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

class SqLiteDataBase {
  path: string;
}

interface ApiDto {
  url: string;
  token?: string;
  credential?: CredentialDto;
  scope?: string;
  login?: string;
  password?: string;
  bankAccount?: number;
  enterpriseId?: number;
  campaignId?: number;
  partnerAccessKey?: string;
  profileId?: string;
}

interface CredentialDto {
  clientId: string;
  clientSecret: string;
}
