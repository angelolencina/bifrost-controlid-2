export const createReadableCode = (cardNumber: number) => {
  const area = Math.floor(cardNumber / 65536)
    .toString()
    .padStart(3, '0');
  const code = (cardNumber % 65536).toString();

  return `${area},${code}`;
};
