export const generateCardNumber = () => {
  const generatedNumbers = new Set();

  let number;
  do {
    number = Math.floor(Math.random() * 900000) + 100000;
  } while (generatedNumbers.has(number));

  generatedNumbers.add(number);
  return number;
};