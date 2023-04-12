import { Repository } from 'typeorm';
import { ClockInService } from './clockIn.service';
import { Moment } from '@/shared/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClockinController } from './clockin.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { Relatory } from './dto/relatory.dto';
import * as moment from 'moment';
import { calculateTotalWorkedPerDay } from './utils/validations';

describe('ClockInController Unit Tests', () => {
  let clockInService: ClockInService;
  let clockInRepository: Repository<Moment>;
  let relatoryRepository: Repository<Relatory>;
  let clockInController: ClockinController;

  let momentRepo = [];
  let relatoryRepo = [];

  beforeAll(() => {
    momentRepo = [];
    relatoryRepo = [];
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClockInService,
        {
          provide: getRepositoryToken(Moment),
          useValue: {
            find: jest.fn().mockReturnValue(momentRepo.reverse()),
            findOne: jest.fn(),
            save: jest.fn((clockIn: Moment) => {
              momentRepo.push(clockIn);
              return clockIn;
            }),
          },
        },
        {
          provide: getRepositoryToken(Relatory),
          useValue: {
            find: jest.fn().mockReturnValue(relatoryRepo),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
      controllers: [ClockinController],
    }).compile();

    clockInController = module.get<ClockinController>(ClockinController);
    clockInService = module.get<ClockInService>(ClockInService);
    clockInRepository = module.get<Repository<Moment>>(
      getRepositoryToken(Moment),
    );
    relatoryRepository = module.get<Repository<Relatory>>(
      getRepositoryToken(Relatory),
    );
  });

  it('should be defined', () => {
    expect(clockInService).toBeDefined();
  });

  describe('Saving clockIn', () => {
    const request = {
      user: {
        id: '1',
      },
    };

    const clockIn = new Moment();
    clockIn.author = request.user.id;

    it('services should return not null on save', async () => {
      const registered = await clockInService.create(clockIn);
      expect(registered).not.toEqual(null);
    });

    it('Should call method save', async () => {
      const save = await clockInController.clockIn(request, {
        clockIn: '2023-04-12 09:00:00',
      });
      expect(clockInRepository.save).toBeCalled();
    });

    it('Should call method relatory save', async () => {
      const first = await clockInController.clockIn(request, {
        clockIn: moment().add(-3, 'hours').toLocaleString(),
      });
      const second = await clockInController.clockIn(request, {
        clockIn: moment().add(-2, 'hours').toLocaleString(),
      });
      const third = await clockInController.clockIn(request, {
        clockIn: moment().add(-1, 'hours').toLocaleString(),
      });
      const fourth = await clockInController.clockIn(request, {
        clockIn: moment().add(1, 'hours').toLocaleString(),
      });
      expect(relatoryRepository.save).toBeCalled();
    });
  });
});
