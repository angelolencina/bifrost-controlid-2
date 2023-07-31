export const isValidToken = (expiresIn: string) => {
  if (!expiresIn) return false;
  const isExprires = expiresIn ? new Date(expiresIn) : new Date();
  const now = new Date();
  return now < isExprires;
};
