export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  let formattedDateString = date.toISOString().substring(0, 19);
  formattedDateString += '+00:00';
  return formattedDateString;
};
