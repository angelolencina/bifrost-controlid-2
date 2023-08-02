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
}

export default ControlidOptions;
