export const convertToDatabaseFormat = (localDateString: string) => {
  const [datePart, timePart] = localDateString.split(' ');
  const [day, month, year] = datePart.split('/');

  const isoDateString = `${year}-${month}-${day} ${timePart}`;
  return isoDateString;
};
