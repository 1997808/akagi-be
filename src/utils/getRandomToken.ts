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

export function getRandomToken(
  groupId: number,
  createdByMemberId: number,
): string {
  const random = getRandomToken6();
  const now = Date.now();
  const token = random + now + groupId + createdByMemberId;
  return token.toString();
}
