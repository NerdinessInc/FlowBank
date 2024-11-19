// utils/cookieHelper.js
import cookie from "cookie";

export function getCookie(cookies, name) {
  const parsedCookies = cookie.parse(cookies || "");
  return parsedCookies[name] || null;
}

export function setCookie(res, name, value, options = {}) {
  const stringValue = value;

  const serializedCookie = cookie.serialize(name, stringValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    ...options,
  });

  res.setHeader("Set-Cookie", serializedCookie);
}
