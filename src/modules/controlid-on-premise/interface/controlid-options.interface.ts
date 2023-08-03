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
  automatedCheckIn?: boolean;
  genQrCode?: boolean;
  mailsToExcludeFromAccessControl: string[];
  groupsUuidToExcludeFromAccessControl: string[];
  mailOnHomologation: string[];
  inHomologation: boolean;
  activePlaces: string[];
}

export default ControlidOptions;
