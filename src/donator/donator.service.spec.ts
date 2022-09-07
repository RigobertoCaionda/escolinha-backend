import { Test, TestingModule } from '@nestjs/testing';
import { DonatorService } from './donator.service';

describe('DonatorService', () => {
  let service: DonatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonatorService],
    }).compile();

    service = module.get<DonatorService>(DonatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
