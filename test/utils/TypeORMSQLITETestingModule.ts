import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../../src/entities/account.entity';
import { BookingEntity } from '../../src/entities/booking.entity';
import { ConfigurationEntity } from '../../src/entities/configuration.entity';
import { EntranceLogEntity } from '../../src/entities/entrance-log.entity';
import { PersonalBadgeEntity } from '../../src/entities/personal-badge.entity';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [
      AccountEntity,
      BookingEntity,
      ConfigurationEntity,
      EntranceLogEntity,
      PersonalBadgeEntity,
    ],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    AccountEntity,
    BookingEntity,
    ConfigurationEntity,
    EntranceLogEntity,
    PersonalBadgeEntity,
  ]),
];
