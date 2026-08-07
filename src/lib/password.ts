import crypto from 'crypto';

const PEPPER = process.env.PASSWORD_PEPPER || 'pacte-silencieux-v1';

/** Hash scrypt (robuste, natif Node) */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .scryptSync(password + PEPPER, salt, 32)
    .toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const next = crypto
      .scryptSync(password + PEPPER, salt, 32)
      .toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(next, 'hex'));
  } catch {
    return false;
  }
}

export function isStrongEnough(password: string): string | null {
  if (password.length < 6) return 'Le mot de passe doit faire au moins 6 caractères';
  if (password.length > 72) return 'Mot de passe trop long';
  return null;
}
