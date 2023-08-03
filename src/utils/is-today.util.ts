export const isToday = (dateToCheck: string) => {
  const date = new Date(dateToCheck);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
