import crypto from 'crypto';

// Use SESSION_SECRET for signing tokens - REQUIRED for security
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required for secure tap token signing');
}

const SECRET = process.env.SESSION_SECRET;

export interface TapTokenPayload {
  userId: string;
  balanceSource: string;
  amountCap: number;
  expiresAt: number; // Unix timestamp
}

/**
 * Generate a signed token for tap & pay sessions
 */
export function generateTapToken(payload: TapTokenPayload): string {
  // Create token payload
  const data = JSON.stringify(payload);
  const encodedData = Buffer.from(data).toString('base64url');
  
  // Sign the token with HMAC
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedData)
    .digest('base64url');
  
  // Return token as: TAP_<data>.<signature>
  return `TAP_${encodedData}.${signature}`;
}

/**
 * Verify and decode a tap token
 * Returns payload if valid, throws error if invalid or expired
 */
export function verifyTapToken(token: string): TapTokenPayload {
  // Check token format
  if (!token.startsWith('TAP_')) {
    throw new Error('Invalid token format');
  }
  
  // Split token into data and signature
  const parts = token.substring(4).split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid token structure');
  }
  
  const [encodedData, providedSignature] = parts;
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedData)
    .digest('base64url');
  
  if (providedSignature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }
  
  // Decode payload
  const data = Buffer.from(encodedData, 'base64url').toString('utf-8');
  const payload: TapTokenPayload = JSON.parse(data);
  
  // Check expiration
  if (Date.now() > payload.expiresAt) {
    throw new Error('Token expired');
  }
  
  return payload;
}

/**
 * Generate a merchant terminal API key
 */
export function generateMerchantApiKey(terminalId: string): string {
  const data = `${terminalId}:${Date.now()}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return `TERM_${hash.substring(0, 32)}`;
}

/**
 * Verify a merchant API key format (basic validation)
 */
export function isValidMerchantApiKey(apiKey: string): boolean {
  return apiKey.startsWith('TERM_') && apiKey.length === 37;
}
