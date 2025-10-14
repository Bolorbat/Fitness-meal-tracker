/*
Gets current date YYYY-MM-DD format
*/
export const getDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/*
Gets the current year
*/
export const getYear = (): number => {
  return new Date().getFullYear();
};

/*
Gets the current time in HH:MM format
*/
export const getTime = (): string => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
