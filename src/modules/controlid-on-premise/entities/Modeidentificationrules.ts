import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Identificationrules } from './Identificationrules';
import { Identificationmodes } from './Identificationmodes';

@Index('fkModeIdentificationRules', ['idIdentificationRule'], {})
@Index('fkModeIdentificationRules2', ['idIdentificationMode'], {})
@Entity('modeidentificationrules', { schema: 'acesso' })
export class Modeidentificationrules {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idIdentificationRule' })
  idIdentificationRule: string;

  @Column('bigint', { name: 'idIdentificationMode' })
  idIdentificationMode: string;

  @ManyToOne(
    () => Identificationrules,
    (identificationrules) => identificationrules.modeidentificationrules,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'idIdentificationRule', referencedColumnName: 'id' }])
  idIdentificationRule2: Identificationrules;

  @ManyToOne(
    () => Identificationmodes,
    (identificationmodes) => identificationmodes.modeidentificationrules,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'idIdentificationMode', referencedColumnName: 'id' }])
  idIdentificationMode2: Identificationmodes;
}
