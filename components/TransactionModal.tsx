import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatNumber";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "failed";
  transactionData?: {
    responseCode?: string;
    sessionID?: string;
    amount?: number;
    beneficiaryAccountName?: string;
    beneficiaryAccountNumber?: string;
    paymentReference?: string;
    transactionId?: string;
    errorMessage?: string;
  };
}

export default function TransactionModal({
  isOpen,
  onClose,
  type,
  transactionData,
}: TransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white flex flex-col items-center justify-center rounded-lg p-5 sm:p-6 w-[100%] max-w-[640px] sm:max-w-[540px] shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center gap-3 sm:gap-5 w-full">
          {/* Icon */}
          {type === "success" ? (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-center">
            {type === "success" ? "Transaction Successful" : "Transaction Failed"}
          </h2>

          {/* Transaction Details */}
          <div className="w-full text-left text-gray-600 space-y-2 text-sm sm:text-base">
            {type === "success" && transactionData && (
              <div>
                <p className="flex items-center gap-2 sm:gap-[8px] mb-2 sm:mb-3">
                  <span className="font-medium">Amount:</span>{" "}
                  {formatCurrency(transactionData.amount || 0)}
                </p>
                <p className="flex items-center gap-2 sm:gap-[8px] mb-2 sm:mb-3">
                  <span className="font-medium">Beneficiary:</span>{" "}
                  <span className="break-words">{transactionData.beneficiaryAccountName}</span>
                </p>
                <p className="flex items-center gap-2 sm:gap-[8px] mb-2 sm:mb-3">
                  <span className="font-medium">Account Number:</span>{" "}
                  {transactionData.beneficiaryAccountNumber}
                </p>
                <p className="flex items-center gap-2 sm:gap-[8px] mb-2 sm:mb-3">
                  <span className="font-medium">Transaction ID:</span>{" "}
                  <span className="break-all">{transactionData.transactionId}</span>
                </p>
                <p className="flex items-center gap-2 sm:gap-[8px] mb-2 sm:mb-3">
                  <span className="font-medium">Reference:</span>{" "}
                  <span className="break-all">{transactionData.paymentReference}</span>
                </p>
              </div>
            )}
            {type === "failed" && transactionData?.errorMessage && (
              <p className="break-words text-center">
                <span className="font-medium">Error:</span>{" "}
                {transactionData.errorMessage}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2 sm:gap-3 w-full">
            {type === "failed" && (
              <Button
                variant="outline"
                onClick={onClose}
                className="text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2"
              >
                Try Again
              </Button>
            )}
            <Button
              onClick={onClose}
              className={`text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 ${
                type === "success" ? "bg-green-600 hover:bg-green-700" : ""
              }`}
            >
              {type === "success" ? "Done" : "Close"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}