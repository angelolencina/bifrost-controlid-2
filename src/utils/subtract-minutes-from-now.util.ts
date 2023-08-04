export const subtractMinutesFromNow = (minutes: number) => {
  const now = new Date();
  const timeToSubtract = minutes * 60 * 1000;
  const date = new Date(now.getTime() - timeToSubtract);
  return date;
};
