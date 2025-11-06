/**
 * Generates a unique payment reference for mobile banking transactions.
 * Format: NIPMINI1/<timestamp>
 * @returns {string} A unique payment reference string
 */
export function generatePaymentReference(): string {
  const prefix = "NIPMINI1/";
  const timestamp = new Date().getTime();
  return `${prefix}${timestamp}`;
}
