export type SendDataProps = {
  EnterpriseID: number;
  ParticipantProfileID: number;
  ParticipantLogin: string;
  ParticipantPassword: string;
  ParticipantName: string;
  ParticipantStatusID: number;
};

export class SendDataDto {
  #EnterpriseID: number;
  #ParticipantProfileID: number;
  #ParticipantLogin: string;
  #ParticipantPassword: string;
  #ParticipantName: string;
  #ParticipantStatusID: number;

  constructor(props: SendDataProps) {
    this.#EnterpriseID = props.EnterpriseID;
    this.#ParticipantProfileID = props.ParticipantProfileID;
    this.#ParticipantLogin = props.ParticipantLogin;
    this.#ParticipantPassword = props.ParticipantPassword;
    this.#ParticipantName = props.ParticipantName;
    this.#ParticipantStatusID = props.ParticipantStatusID;
  }

  get EnterpriseID(): number {
    return this.#EnterpriseID;
  }

  get ParticipantProfileID(): number {
    return this.#ParticipantProfileID;
  }

  get ParticipantLogin(): string {
    return this.#ParticipantLogin;
  }

  get ParticipantPassword(): string {
    return this.#ParticipantPassword;
  }

  get ParticipantName(): string {
    return this.#ParticipantName;
  }

  get ParticipantStatusID(): number {
    return this.#ParticipantStatusID;
  }

  toJson(): SendDataProps {
    return {
      EnterpriseID: this.EnterpriseID,
      ParticipantProfileID: this.ParticipantProfileID,
      ParticipantLogin: this.ParticipantLogin,
      ParticipantPassword: this.ParticipantPassword,
      ParticipantName: this.ParticipantName,
      ParticipantStatusID: this.ParticipantStatusID,
    };
  }
}
