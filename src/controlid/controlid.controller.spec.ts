import { Test, TestingModule } from '@nestjs/testing';
import { ControlidController } from './controlid.controller';
import { ControlidService } from './controlid.service';

describe('ControlidController', () => {
  let controller: ControlidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlidController],
      providers: [ControlidService],
    }).compile();

    controller = module.get<ControlidController>(ControlidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
