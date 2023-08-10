export const subtractMinutesFromDate = (date: Date, minutes: number) => {
  const timeToSubtract = minutes * 60 * 1000;
  return new Date(date.getTime() - timeToSubtract);
};
