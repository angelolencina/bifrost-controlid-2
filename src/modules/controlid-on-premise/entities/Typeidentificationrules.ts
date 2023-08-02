import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Identificationrules } from './Identificationrules';
import { Usertypes } from './Usertypes';

@Index('fkTypeIdentificationRules', ['idIdentificationRule'], {})
@Index('fkTypeIdentificationRules2', ['idType'], {})
@Entity('typeidentificationrules', { schema: 'acesso' })
export class Typeidentificationrules {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idIdentificationRule' })
  idIdentificationRule: string;

  @Column('bigint', { name: 'idType' })
  idType: string;

  @ManyToOne(
    () => Identificationrules,
    (identificationrules) => identificationrules.typeidentificationrules,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'idIdentificationRule', referencedColumnName: 'id' }])
  idIdentificationRule2: Identificationrules;

  @ManyToOne(
    () => Usertypes,
    (usertypes) => usertypes.typeidentificationrules,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'idType', referencedColumnName: 'id' }])
  idType2: Usertypes;
}
