/** http://www.isthe.com/chongo/tech/comp/fnv/#FNV-param */
const FNV_PRIME = 0x100000001b3n;

/**
 * @param {string} input to hash
 */
export function fnv1a64(str) {
  let hash = 0xcbf29ce484222325n; // 64-bit offset basis

  for (const char of str) {
    hash ^= BigInt(char.codePointAt(0));
    hash *= FNV_PRIME;
    hash &= 0xFFFFFFFFFFFFFFFFn; // Ensure 64-bit wraparound
  }

  return hash;
}