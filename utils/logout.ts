import { BrowserStorage, clearCookie } from "@/utils/storage";

export const logout = async (showAlert = true) => {
  try {
    // Clear stored tokens and user data from localStorage
    await BrowserStorage.deleteItem("auth_token");
    await BrowserStorage.deleteItem("auth_token_expiry");
    await BrowserStorage.deleteItem("nomase_user");

    // Clear relevant cookies
    clearCookie("auth_token");
    clearCookie("auth_token_expiry");
    clearCookie("nomase_user");
    clearCookie("nomase_app");
    clearCookie("nomase_main");
    clearCookie("nomase_access");

    // Optional alert
    if (showAlert && typeof window !== "undefined") {
      alert("Session Expired. Please log in again.");
    }

    console.log("User logged out. Local storage and cookies cleared.");

    // Redirect to login page (only in browser)
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
