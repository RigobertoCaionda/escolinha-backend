import { Test, TestingModule } from '@nestjs/testing';
import { DonatorController } from './donator.controller';
import { DonatorService } from './donator.service';

describe('DonatorController', () => {
  let controller: DonatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonatorController],
      providers: [DonatorService],
    }).compile();

    controller = module.get<DonatorController>(DonatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
