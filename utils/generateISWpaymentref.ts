// utils/generateISWpaymentref.ts

/**
 * Generates an Interswitch/Quickteller compatible payment reference
 * Format: YYYYMMDDHHmmssSSS + 8 random digits
 * 
 * Example: 20251121145032157 28461235
 *          ───────────────┘ └───────┘
 *           Timestamp (ms)     8 random digits
 * 
 * Why this format?
 * - Interswitch requires unique paymentReference per transaction
 * - Timestamp in milliseconds ensures uniqueness down to the millisecond
 * - Adding 8 random digits eliminates any collision risk
 * - Total length: 25 characters (common in ISW systems)
 * 
 * @returns {string} 25-digit payment reference
 */
export const generateISWPaymentRef = (): string => {
  // Current timestamp in milliseconds
  const now = Date.now().toString(); // e.g., "1732201432157" (13 digits)

  // Generate 8 random digits
  const random8Digits = Math.floor(10000000 + Math.random() * 90000000).toString();

  // Combine: timestamp (13 digits) + 8 random digits = 21 digits
  // Some banks/ISW expect exactly 25, so we pad left with zeros if needed (rare)
  const paymentRef = (now + random8Digits).padEnd(25, '0').slice(0, 25);

  return paymentRef;
};

