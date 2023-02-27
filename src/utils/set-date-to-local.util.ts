export const setDateToLocal = (date: Date): Date => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date;
};
