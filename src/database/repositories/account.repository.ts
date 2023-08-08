import { Repository } from 'typeorm';
import { AccountEntity } from '../../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository extends Repository<AccountEntity> {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,
  ) {
    super(accountRepo.target, accountRepo.manager, accountRepo.queryRunner);
  }
}
