export const formatDateToDatabase = (date: Date, dateTime = true): string => {
  const [dateI, timeI] = date.toISOString().split('T');
  const [time] = timeI.split('.');
  return dateTime ? `${dateI} ${time}` : dateI;
};
