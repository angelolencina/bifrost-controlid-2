export const addMinutesFromDate = (date: Date, minutes: number) => {
  const timeToAdd = minutes * 60 * 1000;
  return new Date(date.getTime() + timeToAdd);
};
