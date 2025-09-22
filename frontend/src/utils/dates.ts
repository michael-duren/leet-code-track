import dayjs from "dayjs";

export const formatToReadableDate = (dateString: string): string => {
  return dayjs(dateString).format("MMMM D, YYYY");
};
