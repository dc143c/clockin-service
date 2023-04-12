import { Moment, RelatoryEntity } from '@/shared/entities';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Between, MoreThan, Repository } from 'typeorm';
import {
  calculateTotalWorkedPerDay,
  isLunchTimeInvalid,
  isTheSameTime,
  isWeekEnd,
  toHoursAndMinutes,
} from './utils/validations';
import { Relatory } from './dto/relatory.dto';

@Injectable()
export class ClockInService {
  constructor(
    @InjectRepository(Moment)
    private readonly momentRepository: Repository<Moment>,

    @InjectRepository(RelatoryEntity)
    private readonly relatoryRepository: Repository<RelatoryEntity>,
  ) {}

  async getTodayByUser(userId: string) {
    const yesterday = moment().subtract(1, 'days').endOf('day').toDate();
    const foundRegisters = await this.momentRepository.find({
      where: {
        author: userId,
        createdAt: MoreThan(yesterday),
      },
      order: { createdAt: 'ASC' },
    });

    return foundRegisters;
  }

  async findAllFromMonthByUser(month: any, userId: string): Promise<Relatory> {
    const formattedMonth = moment(`${month}-01`).toDate(),
      endOfMonth = moment(`${month}-01`).endOf('month').toDate();

    const relatory = await this.relatoryRepository.find({
      where: {
        userId: userId,
        createdAt: Between(formattedMonth, endOfMonth),
      },
    });

    if (relatory.length === 0) {
      throw new NotFoundException('Não há registros para o mês informado.');
    }

    const momentList = await this.momentRepository.find({
      where: {
        author: userId,
        createdAt: Between(formattedMonth, endOfMonth),
      },
      order: { createdAt: 'ASC' },
    });

    const generalRelatory = relatory.reduce((acc, curr) => {
      acc.workedMinutes += curr.workedMinutes;
      acc.exceedingMinutes += curr.exceedingMinutes;
      acc.missingMinutes += curr.missingMinutes;

      return acc;
    });

    return {
      month: month,
      workedHours: toHoursAndMinutes(generalRelatory.workedMinutes),
      exceedingHours: toHoursAndMinutes(generalRelatory.exceedingMinutes),
      missingHours: toHoursAndMinutes(generalRelatory.missingMinutes),
      moments: momentList,
    };
  }

  async create(moment: Moment): Promise<Moment> {
    if (isWeekEnd()) {
      throw new ForbiddenException(
        'Sábado e domingo não são permitidos como dia de trabalho.',
      );
    }

    const moments = await this.getTodayByUser(moment.author);

    if (moments.length > 0) {
      const foundLast = moments[0];

      if (moments.length === 2 && foundLast) {
        if (isLunchTimeInvalid(foundLast.createdAt, moment.createdAt)) {
          throw new ForbiddenException(
            'Deve haver no mínimo 1 hora de almoço.',
          );
        }
      }

      if (moments.length >= 4 && foundLast) {
        throw new ForbiddenException(
          'Não é permitido mais de 4 batidas por dia.',
        );
      }

      if (isTheSameTime(foundLast.createdAt, moment.createdAt) && foundLast) {
        throw new ConflictException('Horário já registrado.');
      }

      if (moments.length === 3 && foundLast) {
        await this.relatoryRepository.save(calculateTotalWorkedPerDay(moments));
      }
    }

    const creation = await this.momentRepository.save(moment);

    return creation;
  }

  async deleteAll() {
    return this.momentRepository.delete({});
  }
}
