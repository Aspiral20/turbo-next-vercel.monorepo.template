import { GENERATOR_VARIANTS } from "@/utils/constants/generators";

export function genRandomString(length: number, variant = GENERATOR_VARIANTS.MIXED_CHARS) {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += variant.charAt(Math.floor(Math.random() * variant.length));
  }

  return result;
}

export const genRandomKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const random = Array.from(crypto.getRandomValues(new Uint8Array(40)))
    .map(b => chars[b % chars.length])
    .join('');
  return `sk_live_${random}`;
};