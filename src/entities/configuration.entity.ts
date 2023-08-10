import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CredentialDto } from '../dto/credential.dto';

@Entity('configurations')
export class ConfigurationEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'simple-json', nullable: true })
  credential: CredentialDto;

  @Column()
  @Index({ unique: true })
  account: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ type: 'datetime', nullable: true })
  token_expires_in?: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
