export const getStartOfDay = (date?: string) => {
  const startOfDay = date ? new Date(date) : new Date();
  startOfDay.setHours(0);
  startOfDay.setMinutes(0);
  startOfDay.setSeconds(0);
  startOfDay.setMilliseconds(0);

  return startOfDay;
};
