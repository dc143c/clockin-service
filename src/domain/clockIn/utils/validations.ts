import { Moment } from '@/shared/entities';
import * as moment from 'moment';

export const isWeekEnd = () => {
  return moment().day() === 0 || moment().day() === 6;
};

export const isLunchTimeInvalid = (
  lunchTimeStart: Date,
  lunchTimeEnd: Date,
) => {
  const lunchTime = moment
    .duration(moment(lunchTimeEnd).diff(lunchTimeStart))
    .asMinutes();

  if (lunchTime < 60) {
    return true;
  }

  return false;
};

export const isTheSameTime = (time1: Date, time2: Date) => {
  return (
    `${moment(time1).hour()}:${moment(time1).minute()}` ===
    `${moment(time2).hour()}:${moment(time2).minute()}`
  );
};

export const calculateTotalWorkedPerDay = (moments: Moment[]) => {
  const first = moments.shift();
  const last = moments.pop();

  const totalInterval = moment(moments.shift().createdAt).diff(
    last.createdAt,
    'minutes',
  );
  let totalWorked = moment().diff(first.createdAt, 'minutes');

  totalWorked -= totalInterval;

  const exceedingMinutes = totalWorked - 8 * 60;
  const missingMinutes = 8 * 60 - totalWorked;

  return {
    workedMinutes: totalWorked,
    exceedingMinutes: exceedingMinutes < 0 ? 0 : exceedingMinutes,
    missingMinutes: missingMinutes < 0 ? 0 : missingMinutes,
    userId: first.author,
  };
};

export function toHoursAndMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `PT${hours}H${minutes}M`;
}
