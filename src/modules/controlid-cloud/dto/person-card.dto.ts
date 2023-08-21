import { CardType } from '../constants/card-type.enum';

export class PersonCardDto {
  id: number;
  personId: number;
  type: CardType;
  cardNumber: string;
  readableCode: string;
}
