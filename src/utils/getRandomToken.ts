export function getRandomToken4(): string {
  const min = 1000;
  const max = 9999;
  const token = Math.floor(Math.random() * (max - min + 1) + min);
  return token.toString();
}

export function getRandomToken6(): string {
  const min = 100000;
  const max = 999999;
  const token = Math.floor(Math.random() * (max - min + 1) + min);
  return token.toString();
}
