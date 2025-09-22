import dayjs from "dayjs";

export const formatToReadableDate = (dateString: string): string => {
  return dayjs(dateString).format("MMMM D, YYYY");
};

export const isToday = (dateString: string): boolean => {
  if (!dateString) return false;
  return dayjs(dateString).isSame(dayjs(), "day");
};

export const isPast = (dateString: string): boolean => {
  if (!dateString) return false;
  return dayjs(dateString).isBefore(dayjs(), "day");
};

export const isFuture = (dateString: string): boolean => {
  if (!dateString) return false;
  return dayjs(dateString).isAfter(dayjs(), "day");
};

export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  return dayjs(dateString).isValid();
};
