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

/**
 * @param {string} str input 
 * @returns {bigint} 32-bit unsigned integer
 */
export function murmur3Hash(str) {
  const c1 = 0xcc9e2d51n;
  const c2 = 0x1b873593n;
  const r1 = 15n;
  const r2 = 13n;
  const m = 5n;
  const n = 0xe6546b64n;

  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const padded = zeroPadToBlock(bytes, 4);

  let h1 = 0n;

  for (let i = 0; i < padded.length; i += 4) {
    const k1 =
      (BigInt(padded[i])     ) |
      (BigInt(padded[i + 1]) << 8n) |
      (BigInt(padded[i + 2]) << 16n) |
      (BigInt(padded[i + 3]) << 24n);

    let k = BigInt.asUintN(32, k1 * c1);
    k = rotl32n(k, r1);
    k = BigInt.asUintN(32, k * c2);

    h1 ^= k;
    h1 = rotl32n(h1, r2);
    h1 = BigInt.asUintN(32, h1 * m + n);
  }

  // Finalization
  h1 ^= BigInt(bytes.length); // not padded length

  h1 ^= h1 >> 16n;
  h1 = BigInt.asUintN(32, h1 * 0x85ebca6bn);
  h1 ^= h1 >> 13n;
  h1 = BigInt.asUintN(32, h1 * 0xc2b2ae35n);
  h1 ^= h1 >> 16n;

  return BigInt.asUintN(32, h1);
}

/**
 * @param {Uint8Array} input
 * @param {number} blockSize
 * @returns {Uint8Array}
 */
export function zeroPadToBlock(input, blockSize = 4) {
  const pad = (blockSize - (input.length % blockSize)) % blockSize;
  return pad === 0
    ? input
    : new Uint8Array([...input, ...new Uint8Array(pad)]);
}

/**
 * Rotate a 32-bit BigInt left by r bits.
 * @param {bigint} x
 * @param {bigint} r
 * @returns {bigint}
 */
export function rotl32n(x, r) {
  x = BigInt.asUintN(32, x);
  r &= 31n;
  return BigInt.asUintN(32, (x << r) | (x >> (32n - r)));
}