// pages/api/getSessionId.js
import { getCookie, setCookie } from "@/utils/cookieHelper";

export default function handler(req, res) {
  // Get sessionID from cookies
  let sessionID = getCookie(req.headers.cookie, "sessionID");

  if (!sessionID) {
    // Generate a random number
    const randomNumber = Math.floor(Math.random() * 100000);

    // Get the client IP (fallback for localhost)
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    // Concatenate the random number with the IP
    sessionID = `${randomNumber}_${ip}`;

    // Set the sessionID as a cookie
    setCookie(res, "sessionID", sessionID);
  }

  // Return the sessionID
  res.status(200).json({ sessionID });
}
