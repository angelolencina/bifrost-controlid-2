import { Person } from '../../../dto/person.dto';
import { SendDataDto, SendDataProps } from '../dto/send-data.dto';

type SendDataFactoryProps = {
  enterpriseId: number;
  profileId: number;
  person: Person;
};
export const sendDataFactory = (props: SendDataFactoryProps): SendDataDto => {
  const { enterpriseId, profileId, person } = props;
  const sendDataProps: SendDataProps = {
    EnterpriseID: enterpriseId,
    ParticipantProfileID: profileId,
    ParticipantLogin: person.email,
    ParticipantPassword: person.uuid,
    ParticipantName: person.name,
    ParticipantStatusID: 4,
  };
  return new SendDataDto(sendDataProps);
};
