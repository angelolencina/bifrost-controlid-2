import { formatDateToDatabase } from './format-date.util';
export const getLastDayString = (): string => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return formatDateToDatabase(now);
};
