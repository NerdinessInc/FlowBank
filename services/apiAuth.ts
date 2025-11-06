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
// AUTHENTICATE USER
export const authUser = async (values: any) => {
  try {
    const payload = {
      sessionId: values.sessionId,
      remote_IP: values.remote_IP || "0.0.0.0",
      userName: webClasses.encryptText(values.userName),
      password: webClasses.encryptText(values.password),
    };
    const response = await api.post("/user/new/AuthenticateUser", payload);
    const result = response.data;
    const loginResult = {
      success: !result.oraresp?.errors,
      errorMessage: result.oraresp?.errmsg,
      profileNotFound: result.enumRec?.ProfileNotFound,
      accessCodeWrong: result.enumRec?.AccessCodeWrong,
      passwordWrong: result.enumRec?.PasswordWrong,
      userNameWrong: result.enumRec?.UserNameWrong,
      userAccountLocked: result.enumRec?.UserAccountLocked,
      numberOfAccounts: Number.parseInt(result.NumberOfAccounts, 10),
      ...result,
    };
    localStorage.setItem("loginResponse", JSON.stringify(loginResult));
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
    const response = await api.post("/nibss/account", payload);
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

// ────────────────────────────────────────────────────────────
// GET ACCOUNT STATEMENT
export const getAccountHistory = async (
  accountNumber: string,
  startDate: string,
  endDate: string
) => {
  try {
    const response = await api.post("/nibss/statement", {
      accountNumber,
      startDate,
      endDate,
    });

    const result = response.data?.rs;
    console.log("statement full response", result);

    // Check if result exists and is an array
    if (!result || !Array.isArray(result)) {
      throw new Error("Invalid response format");
    }

    // Check if there's data to process (skip first element if it's a header)
    if (result.length <= 1) {
      return {
        success: true,
        data: [],
      };
    }

    // The API now returns objects directly instead of pipe-delimited strings
    const parseResult = result
      .slice(1) // Skip the first element (likely header)
      .map((account: any, index: number) => {
        try {
          // Check if account is already an object (new format)
          if (typeof account === "object" && account !== null) {
            // Handle object format - map the object properties directly
            return {
              COD_ACCT_NO: account.COD_ACCT_NO || "",
              DAT_TXN: account.DAT_TXN || "",
              DAT_VALUE: account.DAT_VALUE || "",
              AMT_TXN: account.AMT_TXN || 0,
              CheckNo: account.CheckNo || "",
              trandesc: account.trandesc || "",
              TXT_TXN_DESC: account.TXT_TXN_DESC || "",
              tranCode: account.tranCode || "",
              COD_DRCR: account.COD_DRCR || "",
              userid: account.userid || "",
              postseq: account.postseq || 0,
              NAM_CUST_FULL: account.NAM_CUST_FULL || "",
              mobile: account.mobile || "",
              address: account.address || "",
              Ref_num: account.Ref_num || "",
              balance: account.balance || 0,
              RUNNING_BAL: account.RUNNING_BAL || 0,
              DEBIT_AMT: account.DEBIT_AMT || 0,
              CREDIT_AMT: account.CREDIT_AMT || 0,
              OPENING_BAL: account.OPENING_BAL || 0,
              CLOSING_BAL: account.CLOSING_BAL || 0,
              pSTART_DATE: account.pSTART_DATE || "",
              END_DATE: account.END_DATE || "",
              TXT_CUSTADR_ADD1: account.TXT_CUSTADR_ADD1 || "",
              TXT_CUSTADR_ADD2: account.TXT_CUSTADR_ADD2 || "",
              TXT_CUSTADR_ADD3: account.TXT_CUSTADR_ADD3 || "",
              NAM_CUST_SHRT: account.NAM_CUST_SHRT || "",
              COD_ACCT_TITLE: account.COD_ACCT_TITLE || "",
              COD_PROD: account.COD_PROD || "",
              COD_CC_BRN: account.COD_CC_BRN || "",
              COD_CC_BRN_TXN: account.COD_CC_BRN_TXN || 0,
              RAT_INT_RD: account.RAT_INT_RD || 0,
              NAM_PRODUCT: account.NAM_PRODUCT || "",
              NAM_BRANCH: account.NAM_BRANCH || "",
            };
          }

          // Handle string format (legacy) - keep existing parsing logic
          if (typeof account === "string") {
            const parts = account.split("|");

            if (parts.length < 33) {
              console.warn(
                `Account at index ${index} has insufficient parts:`,
                parts.length
              );
              return null;
            }

            const [
              COD_ACCT_NO,
              DAT_TXN,
              DAT_VALUE,
              AMT_TXN,
              CheckNo,
              trandesc,
              TXT_TXN_DESC,
              tranCode,
              COD_DRCR,
              userid,
              postseq,
              NAM_CUST_FULL,
              mobile,
              address,
              Ref_num,
              balance,
              RUNNING_BAL,
              DEBIT_AMT,
              CREDIT_AMT,
              OPENING_BAL,
              CLOSING_BAL,
              pSTART_DATE,
              END_DATE,
              TXT_CUSTADR_ADD1,
              TXT_CUSTADR_ADD2,
              TXT_CUSTADR_ADD3,
              NAM_CUST_SHRT,
              COD_ACCT_TITLE,
              COD_PROD,
              COD_CC_BRN,
              COD_CC_BRN_TXN,
              RAT_INT_RD,
              NAM_PRODUCT,
              NAM_BRANCH,
            ] = parts;

            return {
              COD_ACCT_NO,
              DAT_TXN,
              DAT_VALUE,
              AMT_TXN,
              CheckNo,
              trandesc,
              TXT_TXN_DESC,
              tranCode,
              COD_DRCR,
              userid,
              postseq,
              NAM_CUST_FULL,
              mobile,
              address,
              Ref_num,
              balance,
              RUNNING_BAL,
              DEBIT_AMT,
              CREDIT_AMT,
              OPENING_BAL,
              CLOSING_BAL,
              pSTART_DATE,
              END_DATE,
              TXT_CUSTADR_ADD1,
              TXT_CUSTADR_ADD2,
              TXT_CUSTADR_ADD3,
              NAM_CUST_SHRT,
              COD_ACCT_TITLE,
              COD_PROD,
              COD_CC_BRN,
              COD_CC_BRN_TXN,
              RAT_INT_RD,
              NAM_PRODUCT,
              NAM_BRANCH,
            };
          }

          // If neither object nor string, log and return null
          console.warn(
            `Account at index ${index} has unexpected type:`,
            typeof account,
            account
          );
          return null;
        } catch (parseError) {
          console.error(`Error parsing account at index ${index}:`, parseError);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries

    console.log("Parsed result:", parseResult);

    return {
      success: true,
      data: parseResult,
    };
  } catch (error) {
    console.error("Account history fetch error:", error);
    return {
      success: false,
      errorMessage:
        "Failed to retrieve account history details. Please try again.",
    };
  }
};

// ────────────────────────────────────────────────────────────
// GET NEFT BRANCHES
export const getNeftBanks = async () => {
  try {
    const response = await api.get("/nibss/neft-banks");
    const result = response.data;

    if (!Array.isArray(result)) {
      throw new Error("Invalid response format");
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("NEFT branches fetch error:", error);
    return {
      success: false,
      errorMessage: "Failed to fetch NEFT branches. Please try again.",
    };
  }
};

// ────────────────────────────────────────────────────────────
// NAME ENQUIRY
export const returnNameEnquiry = async (values: {
  channelCode: string;
  accountNumber: string;
  destinationInstitutionCode: string;
  transactionId: string;
}) => {
  try {
    const response = await api.post("/nibss/nameEnquiry", values);
    const result = response.data;
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Name enquiry error:", error);
    return {
      success: false,
      errorMessage: "Failed to fetch Account details. Please try again.",
    };
  }
};

//BALANCE ENQIRY
export const balanceEnquiry = async (payload: {
  channelCode: string;
  targetAccountName: string;
  targetAccountNumber: string;
  targetBankVerificationNumber: string;
  authorizationCode: string;
  destinationInstitutionCode: string;
  billerId: string;
  transactionId: string;
}) => {
  try {
    const response = await api.post("/nibss/balanceEnquiry", payload);
    return response.data;
  } catch (error: any) {
    console.log("Balance Enquiry Error: ", error?.response || error);
    throw error;
  }
};

//FUND TRANSFER
export const fundTransfer = async (values: {
  sourceInstitutionCode: string;
  amount: number;
  beneficiaryAccountName: string;
  beneficiaryAccountNumber: string;
  beneficiaryBankVerificationNumber: string;
  beneficiaryKYCLevel: number;
  channelCode: string;
  originatorAccountName: string;
  originatorAccountNumber: string;
  originatorBankVerificationNumber: string | number;
  originatorKYCLevel: number;
  destinationInstitutionCode: string | number;
  mandateReferenceNumber: string;
  nameEnquiryRef: string;
  originatorNarration: string;
  paymentReference: string;
  transactionId: string;
  transactionLocation: string;
  beneficiaryNarration: string;
  billerId: string;
  initiatorAccountNumber: string;
  initiatorAccountName: string;
}) => {
  try {
    console.log("Sending fundTransfer with:", values);

    const response = await api.post("/nibss/fundsTransfer", values);
    console.log("fundTransfer response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("fundTransfer error status:", error.response?.status);
    console.error("fundTransfer error data:", error.response?.data);
    console.error("fundTransfer error message:", error.message);
    throw error;
  }
};
