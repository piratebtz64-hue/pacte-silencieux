/** Mot de passe désactivé */
export function hashPassword(_password: string): string {
  return '';
}

export function verifyPassword(_password: string, _stored: string): boolean {
  return false;
}

export function isStrongEnough(password: string): string | null {
  if (password.length < 6) return 'Trop court';
  return null;
}
