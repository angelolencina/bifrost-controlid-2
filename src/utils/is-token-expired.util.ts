export const isValidToken = (expiresIn: string) => {
  const isExprires = expiresIn ? new Date(expiresIn) : new Date();
  const now = new Date();
  return now < isExprires;
};
