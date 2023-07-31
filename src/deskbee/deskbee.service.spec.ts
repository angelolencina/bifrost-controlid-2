import { Test, TestingModule } from '@nestjs/testing';
import { DeskbeeService } from './deskbee.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigurationEntity } from '../entities/configuration.entity';
import { Repository } from 'typeorm';
import { createTestModule } from '../../test/test.module';
import { DeskbeeModule } from './deskbee.module';
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};
const configurationMockFactory: () => MockType<
  Repository<ConfigurationEntity>
> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  // ...
}));

describe('DeskbeeService', () => {
  let service: DeskbeeService;
  let configurationMock: () => MockType<Repository<ConfigurationEntity>>;
  beforeEach(async () => {
    const module: TestingModule = await createTestModule({
      imports: [DeskbeeModule, TypeOrmModule.forFeature([ConfigurationEntity])],
      providers: [
        DeskbeeService,
        {
          provide: getRepositoryToken(ConfigurationEntity),
          useFactory: configurationMock,
        },
      ],
    });

    service = module.get<DeskbeeService>(DeskbeeService);
    configurationMock = module.get(getRepositoryToken(ConfigurationEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
