// src/utils/generateTransactionId.ts
export const generateTransactionId = () => {
  // const clientId = "999283";
  const clientId = "090736"

  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const dateTime = `${yy}${mm}${dd}${hh}${min}${ss}`;

  const random12 = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  return `${clientId}${dateTime}${random12}`;
};