// Browser-compatible storage utilities (replacing Expo SecureStore)
export class BrowserStorage {
  private static isClient = typeof window !== "undefined";

  static async setItem(key: string, value: string): Promise<void> {
    if (!this.isClient) return;

    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    if (!this.isClient) return null;

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  }

  static async deleteItem(key: string): Promise<void> {
    if (!this.isClient) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error deleting item from storage:", error);
    }
  }

  static async clear(): Promise<void> {
    if (!this.isClient) return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }
}

// Cookie utilities for server-side compatibility
export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const clearCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
