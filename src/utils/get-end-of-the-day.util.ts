export const getEndOfDay = (date?: string) => {
  const endOfDay = date ? new Date(date) : new Date();
  endOfDay.setHours(23);
  endOfDay.setMinutes(59);
  endOfDay.setSeconds(59);

  return endOfDay;
};
