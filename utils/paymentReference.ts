/**
 * Generates a unique payment reference for mobile banking transactions.
 * Format: NIPMINI1/<timestamp>
 * @returns {string} A unique payment reference string
 */
export function generatePaymentReference(): string {
  const prefix = "NIPMINI1/";
  const timestamp = new Date().getTime();
  const random12 = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");

  return `${prefix}${random12}${timestamp}`;
}
