import { Test, TestingModule } from '@nestjs/testing';
import { IpremiService } from './ipremi.service';

describe('IpremiService', () => {
  let service: IpremiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpremiService],
    }).compile();

    service = module.get<IpremiService>(IpremiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
