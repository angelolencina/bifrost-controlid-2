import { PersonCardDto } from './person-card.dto';

export class PersonDto {
  id: number;
  personType: string;
  name: string;
  email: string;
  isOperator: boolean;
  visitorStartDate: Date;
  visitorEndDate: Date;
  personCard: PersonCardDto[];
}
