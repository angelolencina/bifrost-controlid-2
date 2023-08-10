import { subtractMinutesFromDate } from './subtract-minutes-from-date';

export const subtractMinutesFromNow = (minutes: number) => {
  const now = new Date();
  return subtractMinutesFromDate(now, minutes);
};
