export const convertPattern = (inputString: string) => {
  return inputString
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
    .replace('.entity', 'Entity');
};
