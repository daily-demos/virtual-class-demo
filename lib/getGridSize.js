export const getGridSize = width => {
  if (width >= 1200) return '600px';
  if (width >= 1000 && width < 1200) return '400px';
  else return '350px';
};
