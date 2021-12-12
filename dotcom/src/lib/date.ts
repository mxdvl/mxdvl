export const cleanDate = (date: string) => new Date(date).toISOString().slice(0, 7);
