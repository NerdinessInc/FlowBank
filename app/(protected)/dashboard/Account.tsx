import { useEffect, useState } from "react";
import { ReturnAcctDetails2 } from "@/services/apiAuth";

export default function AccountDetails({ reqType, userRec, accounts }) {
  const [accountDetails, setAccountDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const response = await ReturnAcctDetails2(reqType, userRec, accounts);

      if (response.success) {
        setAccountDetails(response.data);
        setError("");
      } else {
        setError(response.errorMessage || "Unable to fetch account details");
      }

      setLoading(false);
    };

    if (accounts?.length > 0) {
      fetchDetails();
    }
  }, [reqType, userRec, accounts]);

  if (loading) return <p>Loading account details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Account Details:</h3>
      <pre>{JSON.stringify(accountDetails, null, 2)}</pre>
    </div>
  );
}
