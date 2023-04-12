import { Moment } from '@/shared/entities';
import { ApiProperty } from '@nestjs/swagger';

export class Relatory {
  @ApiProperty()
  month: string;

  @ApiProperty()
  workedHours: string;

  @ApiProperty()
  exceedingHours: string;

  @ApiProperty()
  missingHours: string;

  @ApiProperty()
  moments: Moment[];
}
