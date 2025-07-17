// services/apiAuth.ts
import axios from "axios";
import api, { setToken } from "@/utils/axiosInstance";
import WebClasses from "@/utils/webClasses";

const webClasses = new WebClasses();

const API_USERNAME = process.env.EXPO_PUBLIC_API_USERNAME;
const API_PASSWORD = process.env.EXPO_PUBLIC_API_PASSWORD;
const TOKEN_URL = process.env.EXPO_PUBLIC_TOKEN_URL;

// ────────────────────────────────────────────────────────────
// GET API TOKEN
export const getApiToken = async () => {
  try {
    const response = await axios.post(`${TOKEN_URL}/login`, {
      username: API_USERNAME,
      password: API_PASSWORD,
    });

    const token = response.data?.token;

    if (token) {
      await setToken(token, 4 * 3600); // store securely
      return token;
    } else {
      throw new Error("Token missing from API login response");
    }
  } catch (err) {
    throw err;
  }
};

// ────────────────────────────────────────────────────────────
// GET ACCESS CODE
export const getAccessCode = async () => {
  try {
    const response = await api.get("/user/getMthree");
    console.log(response);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      errorMessage: "Something went wrong!",
    };
  }
};

// ────────────────────────────────────────────────────────────
// AUTHENTICATE USER
export const authUser = async (values: any) => {
  try {
    const payload = {
      sessionId: "123:01",
      remote_IP: "10.0.0.1",
      userName: webClasses.encryptText(values.userName),
      password: webClasses.encryptText(values.password),
      accessCode: webClasses.encryptText(values.accessCode),
      mthree: {
        char1: "U3KVfKhwG2o=",
        char2: "fveXoNA7GCg=",
        char3: "uvtVsVop6ds=",
        retMsg: values.access.retMsg,
        bool: values.access.bool,
        valid: values.access.valid,
        cac: values.access.cac || "",
      },
    };

    const response = await api.post("/user/AuthenticateUser", payload);
    const result = response.data;

    const loginResult = {
      success: !result.oraresp?.errors,
      errorMessage: result.oraresp?.errmsg,
      profileNotFound: result.enumRec?.ProfileNotFound,
      accessCodeWrong: result.enumRec?.AccessCodeWrong,
      passwordWrong: result.enumRec?.PasswordWrong,
      userNameWrong: result.enumRec?.UserNameWrong,
      userAccountLocked: result.enumRec?.UserAccountLocked,
      numberOfAccounts: parseInt(result.NumberOfAccounts, 10),
      ...result,
    };

    localStorage.setItem("loginResponse", JSON.stringify(loginResult)); // ← helpful for debugging

    return loginResult;
  } catch (error) {
    return {
      success: false,
      errorMessage: "Something went wrong!",
    };
  }
};

// ────────────────────────────────────────────────────────────
// GET ACCOUNT DETAILS (REST VERSION of ReturnAcctDetails2)
export const ReturnAcctDetails2 = async (
  reqType: string,
  userRec: { pAcessCode: string; pUserName: string },
  values: any
) => {
  try {
    const payload = {
      ID: reqType,
      CustomerID: values?.slice(1, 2)?.[0]?.CustomerID,
      AccountNo: values?.slice(1, 2)?.[0]?.AccountNumber,
      pacesscode: userRec.pAcessCode,
      pUsername: userRec.pUserName,
    };

    const response = await api.post(
      "/nibbs/account", // TODO: replace with actual endpoint
      payload,
    );

    const rawData = response.data;

    const parsedAccountDetails = rawData.rs?.string
      ?.slice(1)
      .map((accountString: string) => {
        const [
          accountNumber,
          description,
          bookBalance,
          availBal,
          uncleared,
          currency,
          type,
        ] = accountString.split("|");

        return {
          accountNumber,
          description,
          bookBalance,
          availBal,
          uncleared,
          currency,
          type,
        };
      });

    return { success: true, data: parsedAccountDetails };
  } catch (error) {
    console.error("Account details fetch error:", error);
    return {
      success: false,
      errorMessage: "Something went wrong!",
    };
  }
};
