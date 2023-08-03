interface ControlidOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  sqLitePath?: string;
  apiUrl?: string;
  apiUser?: string;
  apiPassword?: string;
  activeAccessControl?: boolean;
  automatedCheckin?: boolean;
  genQrCode?: boolean;
  mailsToExcludeFromAccessControl: string[];
  mailOnHomologation: string[];
  inHomologation: boolean;
  activePlaces: string[];
}

export default ControlidOptions;
