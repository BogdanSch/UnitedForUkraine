export const convertDate = (date: string): string => {
  return new Date(date).toISOString().slice(0, 10);
};
