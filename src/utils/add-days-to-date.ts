export const addDaysTodate = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days);
  return date;
};
