export const isValidYear = (year: string): boolean => {
  const yearNum = parseInt(year, 10);
  return year.trim().length === 4 &&
         /^[0-9]{4}$/.test(year) &&
         !isNaN(yearNum) &&
         yearNum >= 1950 &&
         yearNum <= 2024;
};
