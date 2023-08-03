export const sortByStartDateDesc = (bookings: any[]) => {
  return bookings.sort((a, b) => {
    const dateA: any = new Date(a.start_date);
    const dateB: any = new Date(b.start_date);
    return dateB - dateA;
  });
};
