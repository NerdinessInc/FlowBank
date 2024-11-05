import { soapRequest } from '@/utils';
import WebClasses from '@/utils/webClasses';

const webClasses = new WebClasses();

// access code
export const getAccessCode = async () => {
	const body = `<ReturnGetThreeCodes xmlns="http://con.Ibplc.org/"><UIx>xxx</UIx></ReturnGetThreeCodes>`;

	const { data } = await soapRequest(
		'/NibssService/NibssAppService.asmx',
		body
	);

	try {
		const result = data['ReturnGetThreeCodesResult'];

		return { success: true, data: result };
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Something went wrong!',
		};
	}
};

// login user
export const authUser = async (values: any) => {
	const authUserBody = `
	<ReturnAuthuser xmlns="http://con.Ibplc.org/">
		<acCode>${webClasses.encryptText(values.accessCode)}</acCode>
		<pwd>${webClasses.encryptText(values.password)}</pwd>
		<uname>${webClasses.encryptText(values.username)}</uname>
		<sid>${values.sid}</sid>
		
		<mThree>
			<Char1>${webClasses.encryptText(values.access.Char1)}</Char1>
			<Char2>${webClasses.encryptText(values.access.Char2)}</Char2>
			<Char3>${webClasses.encryptText(values.access.Char3)}</Char3>
			<bool>${values.access.bool}</bool>
			<retMsg>${values.access.retMsg}</retMsg>
			<cAC>${values.access.cAC || ''}</cAC>
		</mThree>
	</ReturnAuthuser>`
		.trim()
		.replace(/\s+/g, ' ');

	const { data } = await soapRequest(
		'/NibssService/NibssAppService.asmx',
		authUserBody
	);

	try {
		const result = data['ReturnAuthuserResult'];

		const enumRec = result['enumRec'];
		const oraresp = result['oraresp'];

		return {
			success: !oraresp['errors'],
			errorMessage: oraresp['errmsg'],
			profileNotFound: enumRec['ProfileNotFound'],
			accessCodeWrong: enumRec['AccessCodeWrong'],
			passwordWrong: enumRec['PasswordWrong'],
			userNameWrong: enumRec['UserNameWrong'],
			userAccountLocked: enumRec['UserAccountLocked'],
			numberOfAccounts: parseInt(data['NumberOfAccounts'], 10),
			...result,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Something went wrong!',
		};
	}
};

// get account details
export const ReturnAcctDetails2 = async (
	reqType: any,
	userRec: any,
	values: any
) => {
	const AcctDetail2Body = `
	<ReturnAcctDetails2 xmlns="http://con.Ibplc.org/">
	  <ID>${reqType}</ID>
      <CustomerID>${values?.slice(1, 2)?.[0].CustomerID}</CustomerID>
      <AccountNo>${values?.slice(1, 2)?.[0].AccountNumber}</AccountNo>
      <pacesscode>${userRec.pAcessCode}</pacesscode>
      <pUsername>${userRec.pUserName}</pUsername>
	</ReturnAcctDetails2>`
		.trim()
		.replace(/\s+/g, ' ');

	const { data } = await soapRequest(
		'/NibssService/NibssAppService.asmx',
		AcctDetail2Body
	);

	try {
		const result = data['ReturnAcctDetails2Result'];
		const responseString = result.rs.string;

		const parsedAccountDetails = responseString
			.slice(1)
			.map((accountString: string) => {
				const [
					accountNumber,
					description,
					bookBalance,
					availBal,
					uncleared,
					currency,
					type,
				] = accountString.split('|');
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
		return {
			success: false,
			errorMessage: 'Something went wrong!',
		};
	}
};

export const postTransferInternal = async (transferData: any) => {
	const body = `
    <PostTransferInternal xmlns="http://con.Ibplc.org/">
      <Bankmsg>
        <AccountIdentification1Field>${transferData.AccountIdentification1Field}</AccountIdentification1Field>
        <AccountIdentification2Field>${transferData.AccountIdentification2Field}</AccountIdentification2Field>
        <AccountType1Field>${transferData.AccountType1Field}</AccountType1Field>
        <AccountType2Field>${transferData.AccountType2Field}</AccountType2Field>
        <trfTypeField>${transferData.trfTypeField}</trfTypeField>
        <AcquiringInstIDField>${transferData.AcquiringInstIDField}</AcquiringInstIDField>
        <FowardingInstIDField>${transferData.FowardingInstIDField}</FowardingInstIDField>
        <AdditionalAmountsField>${transferData.AdditionalAmountsField}</AdditionalAmountsField>
        <AmountSettlementField>${transferData.AmountSettlementField}</AmountSettlementField>
        <AmountTransactionField>${transferData.AmountTransactionField}</AmountTransactionField>
        <CardAcceptorNameLocationField>${transferData.CardAcceptorNameLocationField}</CardAcceptorNameLocationField>
        <CardAcceptorTerminalIDField>${transferData.CardAcceptorTerminalIDField}</CardAcceptorTerminalIDField>
        <CardAcceptorTerminalIDCodeField>${transferData.CardAcceptorTerminalIDCodeField}</CardAcceptorTerminalIDCodeField>
        <CcyCodeCardHolderBillingField>${transferData.CcyCodeCardHolderBillingField}</CcyCodeCardHolderBillingField>
        <CcyCodeSettlementField>${transferData.CcyCodeSettlementField}</CcyCodeSettlementField>
        <CcyCodeTransField>${transferData.CcyCodeTransField}</CcyCodeTransField>
        <ConvRateCardHolderBillingField>${transferData.ConvRateCardHolderBillingField}</ConvRateCardHolderBillingField>
        <ConvRateSettlementField>${transferData.ConvRateSettlementField}</ConvRateSettlementField>
        <DateCaptureField>${transferData.DateCaptureField}</DateCaptureField>
        <DateLocalTransField>${transferData.DateLocalTransField}</DateLocalTransField>
        <DateSettlementField>${transferData.DateSettlementField}</DateSettlementField>
        <MacField>${transferData.MacField}</MacField>
        <MessageProcessingTypeField>${transferData.MessageProcessingTypeField}</MessageProcessingTypeField>
        <PrimaryAcctNoField>${transferData.PrimaryAcctNoField}</PrimaryAcctNoField>
        <ProcessingCodeField>${transferData.ProcessingCodeField}</ProcessingCodeField>
        <ReservedPrivate127Field>${transferData.ReservedPrivate127Field}</ReservedPrivate127Field>
        <ReservedPrivate60Field>${transferData.ReservedPrivate60Field}</ReservedPrivate60Field>
        <ResponseCodeField>${transferData.ResponseCodeField}</ResponseCodeField>
        <ResponseMessageField>${transferData.ResponseMessageField}</ResponseMessageField>
        <SystemAuditNumberField>${transferData.SystemAuditNumberField}</SystemAuditNumberField>
        <SystemAuditNumberXferField>${transferData.SystemAuditNumberXferField}</SystemAuditNumberXferField>
        <TimeLocalTransField>${transferData.TimeLocalTransField}</TimeLocalTransField>
        <TransDateTimeField>${transferData.TransDateTimeField}</TransDateTimeField>
      </Bankmsg>
    </PostTransferInternal>
  `
		.trim()
		.replace(/\s+/g, ' ');

	try {
		const { data } = await soapRequest(
			'/NibssService/NibssAppService.asmx',
			body
		);

		const result = data['PostTransferInternalResult'];

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Something went wrong with the internal transfer!',
		};
	}
};

// change user password
export const changePassword = async (values: any) => {
	const changePasswordBody = `
    <ReturnChangePass xmlns="http://con.Ibplc.org/">
      <Uname>${values.username}</Uname>
      <PacCode>${values.accessCode}</PacCode>
      <pwd>${values.newPassword}</pwd>
    </ReturnChangePass>`
		.trim()
		.replace(/\s+/g, ' ');

	try {
		const { data } = await soapRequest(
			'/NibssService/NibssAppService.asmx',
			changePasswordBody
		);

		const result = data['ReturnChangePassResult'];

		return {
			success: result.bool,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Failed to change password. Please try again.',
		};
	}
};

// get beneficiaries
export const returnGetBenefInfo = async (userRec: any) => {
	const BenefInfoBody = `
	<returnGetBenefInfo xmlns="http://con.Ibplc.org/">
      <pUsername>${userRec.pUserName}</pUsername>
      <pAccountnumber>''</pAccountnumber>
      <pCustomerid>${userRec.PXfChar2}</pCustomerid>
      <pAccountnameNew>''</pAccountnameNew>
      <pAcctCurrency>''</pAcctCurrency>
    </returnGetBenefInfo>`
		.trim()
		.replace(/\s+/g, ' ');

	const { data } = await soapRequest(
		'/NibssService/NibssAppService.asmx',
		BenefInfoBody
	);

	try {
		const result = data['returnGetBenefInfoResult'];

		const responseString = result.rs.string;

		return { success: true, data: responseString };
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Something went wrong!',
		};
	}
};

// add beneficiary
export const returnSaveBenefInfo = async (userRec: any, values: any) => {
	const SaveBenefInfoBody = `
	<returnSaveBenefInfo xmlns="http://con.Ibplc.org/">
      <pUsername>${userRec.pUserName}</pUsername>
      <pAccountnumber>${values.accountNumber}</pAccountnumber>
      <pCustomerid>${userRec.PXfChar2}</pCustomerid>
      <pAccountnameNew>${values.accountName}</pAccountnameNew>
      <pAcctCurrency>${values.currency}</pAcctCurrency>
    </returnSaveBenefInfo>`
		.trim()
		.replace(/\s+/g, ' ');

	const { data } = await soapRequest(
		'/NibssService/NibssAppService.asmx',
		SaveBenefInfoBody
	);

	try {
		const result = data['returnSaveBenefInfoResult'];
		return {
			success: result['retMsg'],
			retVal2: result['retVal2'],
			retVal: result['retVal'],
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Something went wrong!',
		};
	}
};

// get OTP
export const ReturngetOTUP = async (userRec: any, values: any) => {
	const ReturnOTUPBody = `
	<ReturngetOTUP xmlns="http://con.Ibplc.org/">
      <pUserTrfToken>
        <pusername>${userRec.pUserName}</pusername>
        <penqaccess>${userRec.PXfChar2}</penqaccess>
        <pacesscode>${userRec.pAcessCode}</pacesscode>
        <ppassword>${userRec.pPassword}</ppassword>
        <ptrfcode>''</ptrfcode>
        <pjobtype>''</pjobtype>
        <pprocesstype>''</pprocesstype>
        <pjobsubmittedby>${userRec.pFullName}</pjobsubmittedby>
        <psessionID>${values.sessionID}</psessionID>
        <pemail1>${values.email}</pemail1>
        <pphone1>${values.phone}</pphone1>
      </pUserTrfToken>
      <Sendoption>${values.option}</Sendoption>
    </ReturngetOTUP>`
		.trim()
		.replace(/\s+/g, ' ');

	const { data } = await soapRequest(
		'/NibssService/NibssAppService.asmx',
		ReturnOTUPBody
	);

	console.log(data);

	try {
		const result = data['returnSaveBenefInfoResult'];

		return {
			success: result['retVal'],
			retVal2: result['retVal2'],
			retVal: result['retVal'],
			message: result['retMsg'],
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Something went wrong!',
		};
	}
};

// get banks
export const getNeftBranches = async () => {
	const body = `
    <ReturngetNeftBranches xmlns="http://con.Ibplc.org/" />
  `
		.trim()
		.replace(/\s+/g, ' ');

	try {
		const { data } = await soapRequest(
			'/NibssService/NibssAppService.asmx',
			body
		);

		const result = data['ReturngetNeftBranchesResult'];

		const parseResult = result.rs.string.slice(1).map((branch: string) => {
			const [
				bankcode,
				bankName,
				sortcode,
				sortcode1,
				cbncode,
				cbncode1,
				cbncode2,
				Category,
			] = branch.split('|');

			return {
				bankcode,
				bankName,
				sortcode,
				sortcode1,
				cbncode,
				cbncode1,
				cbncode2,
				category: Category,
			};
		});

		return {
			success: true,
			data: parseResult,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Failed to fetch NEFT branches. Please try again.',
		};
	}
};

// account enquiry
export const returnNameEnquiry = async (
	accountNo: string,
	bankCode: string
) => {
	const body = `
    <ReturnNameEnquiry xmlns="http://con.Ibplc.org/">
      <acctNo>${accountNo}</acctNo>
      <BankCode>${bankCode}</BankCode>
    </ReturnNameEnquiry>
  `
		.trim()
		.replace(/\s+/g, ' ');

	try {
		const { data } = await soapRequest(
			'/NibssService/NibssAppService.asmx',
			body
		);

		const result = data['ReturnNameEnquiryResult'];

		console.log(data);

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Failed to perform name enquiry. Please try again.',
		};
	}
};

export const doNIPTransfer = async (userRec: any, values: any) => {
	const body = `
    <DoNIPTransfer xmlns="http://con.Ibplc.org/">
      <pUserTrfToken>
        <pSessionId>${userRec.pSessionId}</pSessionId>
        <NameEnquiryRef>${values.NameEnquiryRef}</NameEnquiryRef>
        <DestinationInstitutionCode	>${values.DestinationInstitutionCode}</DestinationInstitutionCode>
        <ChannelCode>${values.ChannelCode}</ChannelCode>
        <pInitTime>${userRec.pInitTime}</pInitTime>
        <pTokValue>${userRec.pTokValue}</pTokValue>
        <penqaccess>${userRec.penqaccess}</penqaccess>
        <pUname>${userRec.pUname}</pUname>
        <pStatus>${userRec.pStatus}</pStatus>
        <Pamount>${userRec.Pamount}</Pamount>
        <pTransRef>${userRec.pTransRef}</pTransRef>
        <pTrfType>${userRec.pTrfType}</pTrfType>
        <pTimeStamp>${userRec.pTimeStamp}</pTimeStamp>
        <pGsmStatus>${userRec.pGsmStatus}</pGsmStatus>
        <pUserEmail>${userRec.pUserEmail}</pUserEmail>
        <pUserGSM>${userRec.pUserGSM}</pUserGSM>
        <pSrcAcct>${userRec.pSrcAcct}</pSrcAcct>
        <OriginatorAccountName>${values.OriginatorAccountName}</OriginatorAccountName>
        <OriginatorAccountNumber>${values.OriginatorAccountNumber}</OriginatorAccountNumber>
        <OriginatorBankVerificationNumber>${values.OriginatorBankVerificationNumber}</OriginatorBankVerificationNumber>
        <OriginatorKYCLevel>${values.OriginatorKYCLevel}</OriginatorKYCLevel>
        <pDestAcct>${userRec.pDestAcct}</pDestAcct>
        <BeneficiaryAccountName>${values.BeneficiaryAccountName}</BeneficiaryAccountName>
        <BeneficiaryAccountNumber>${values.BeneficiaryAccountNumber}</BeneficiaryAccountNumber>
        <BeneficiaryBankVerificationNumber>${values.BeneficiaryBankVerificationNumber}</BeneficiaryBankVerificationNumber>
        <BeneficiaryKYCLevel>${values.BeneficiaryKYCLevel}</BeneficiaryKYCLevel>
        <TransactionLocation>${values.TransactionLocation}</TransactionLocation>
        <pFullName>${userRec.pFullName}</pFullName>
        <Narration>${values.Narration}</Narration>
        <PaymentReference>${values.PaymentReference}</PaymentReference>
        <retVal>${values.retVal}</retVal>
        <retMsg>${values.retMsg}</retMsg>
        <theTree>
          <Char1>${values.theTree.Char1}</Char1>
          <Char2>${values.theTree.Char2}</Char2>
          <Char3>${values.theTree.Char3}</Char3>
          <bool>${values.theTree.bool}</bool>
          <retMsg>${values.theTree.retMsg}</retMsg>
          <cAC>${values.theTree.cAC}</cAC>
        </theTree>
        <AcAc>${values.AcAc}</AcAc>
        <pstatusLocal>${userRec.pstatusLocal}</pstatusLocal>
        <pstatusIntBank>${userRec.pstatusIntBank}</pstatusIntBank>
        <pmsgString>${userRec.pmsgString}</pmsgString>
        <pDestAcctIntBnk>${userRec.pDestAcctIntBnk}</pDestAcctIntBnk>
        <pDestBenefIntBnk>${userRec.pDestBenefIntBnk}</pDestBenefIntBnk>
        <pDestBankCode>${userRec.pDestBankCode}</pDestBankCode>
        <psendOptions>${userRec.psendOptions}</psendOptions>
        <pBillPaymentRec>
          <pBillID>${userRec.pBillPaymentRec.pBillID}</pBillID>
          <pPlatformName>${userRec.pBillPaymentRec.pPlatformName}</pPlatformName>
          <pBillRef1>${userRec.pBillPaymentRec.pBillRef1}</pBillRef1>
          <pBillRef2>${userRec.pBillPaymentRec.pBillRef2}</pBillRef2>
          <pBillRef3>${userRec.pBillPaymentRec.pBillRef3}</pBillRef3>
          <pCustName>${userRec.pBillPaymentRec.pCustName}</pCustName>
          <pAcctTitle>${userRec.pBillPaymentRec.pAcctTitle}</pAcctTitle>
          <pSourceAcct>${userRec.pBillPaymentRec.pSourceAcct}</pSourceAcct>
          <pPayeeAcct>${userRec.pBillPaymentRec.pPayeeAcct}</pPayeeAcct>
          <pBillMonth>${userRec.pBillPaymentRec.pBillMonth}</pBillMonth>
          <pBillYear>${userRec.pBillPaymentRec.pBillYear}</pBillYear>
          <pBillStartDt>${userRec.pBillPaymentRec.pBillStartDt}</pBillStartDt>
          <pBillEndDt>${userRec.pBillPaymentRec.pBillEndDt}</pBillEndDt>
          <pTokenRefId>${userRec.pBillPaymentRec.pTokenRefId}</pTokenRefId>
          <pBillPayed>${userRec.pBillPaymentRec.pBillPayed}</pBillPayed>
          <pBillAmount>${userRec.pBillPaymentRec.pBillAmount}</pBillAmount>
          <pDB>${userRec.pBillPaymentRec.pDB}</pDB>
          <pEnqAcess>${userRec.pBillPaymentRec.pEnqAcess}</pEnqAcess>
          <pUserName>${userRec.pBillPaymentRec.pUserName}</pUserName>
        </pBillPaymentRec>
      </pUserTrfToken>
    </DoNIPTransfer>
  `
		.trim()
		.replace(/\s+/g, ' ');

	try {
		const { data } = await soapRequest(
			'/NibssService/NibssAppService.asmx',
			body
		);

		const result = data['DoNIPTransferResult'];

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Failed to perform NIP transfer. Please try again.',
		};
	}
};

export const returnGetFundsTransfer = async (userRec: any, values: any) => {
	const body = `
    <ReturngetFundstransfer xmlns="http://con.Ibplc.org/">
      <pUserTrfToken>
        <pSessionId>${userRec.pSessionId}</pSessionId>
        <NameEnquiryRef>${values.NameEnquiryRef}</NameEnquiryRef>
        <DestinationInstitutionCode>${values.DestinationInstitutionCode}</DestinationInstitutionCode>
        <ChannelCode>${values.ChannelCode}</ChannelCode>
        <pInitTime>${userRec.pInitTime}</pInitTime>
        <pTokValue>${userRec.pTokValue}</pTokValue>
        <penqaccess>${userRec.penqaccess}</penqaccess>
        <pUname>${userRec.pUname}</pUname>
        <pStatus>${userRec.pStatus}</pStatus>
        <Pamount>${userRec.Pamount}</Pamount>
        <pTransRef>${userRec.pTransRef}</pTransRef>
        <pTrfType>${userRec.pTrfType}</pTrfType>
        <pTimeStamp>${userRec.pTimeStamp}</pTimeStamp>
        <pGsmStatus>${userRec.pGsmStatus}</pGsmStatus>
        <pUserEmail>${userRec.pUserEmail}</pUserEmail>
        <pUserGSM>${userRec.pUserGSM}</pUserGSM>
        <pSrcAcct>${userRec.pSrcAcct}</pSrcAcct>
        <OriginatorAccountName>${values.OriginatorAccountName}</OriginatorAccountName>
        <OriginatorAccountNumber>${values.OriginatorAccountNumber}</OriginatorAccountNumber>
        <OriginatorBankVerificationNumber>${values.OriginatorBankVerificationNumber}</OriginatorBankVerificationNumber>
        <OriginatorKYCLevel>${values.OriginatorKYCLevel}</OriginatorKYCLevel>
        <pDestAcct>${userRec.pDestAcct}</pDestAcct>
        <BeneficiaryAccountName>${values.BeneficiaryAccountName}</BeneficiaryAccountName>
        <BeneficiaryAccountNumber>${values.BeneficiaryAccountNumber}</BeneficiaryAccountNumber>
        <BeneficiaryBankVerificationNumber>${values.BeneficiaryBankVerificationNumber}</BeneficiaryBankVerificationNumber>
        <BeneficiaryKYCLevel>${values.BeneficiaryKYCLevel}</BeneficiaryKYCLevel>
        <TransactionLocation>${values.TransactionLocation}</TransactionLocation>
        <pFullName>${userRec.pFullName}</pFullName>
        <Narration>${values.Narration}</Narration>
        <PaymentReference>${values.PaymentReference}</PaymentReference>
        <retVal>${values.retVal}</retVal>
        <retMsg>${values.retMsg}</retMsg>
        <theTree>
          <Char1>${values.theTree.Char1}</Char1>
          <Char2>${values.theTree.Char2}</Char2>
          <Char3>${values.theTree.Char3}</Char3>
          <bool>${values.theTree.bool}</bool>
          <retMsg>${values.theTree.retMsg}</retMsg>
          <cAC>${values.theTree.cAC}</cAC>
        </theTree>
        <AcAc>${values.AcAc}</AcAc>
        <pstatusLocal>${userRec.pstatusLocal}</pstatusLocal>
        <pstatusIntBank>${userRec.pstatusIntBank}</pstatusIntBank>
        <pmsgString>${userRec.pmsgString}</pmsgString>
        <pDestAcctIntBnk>${userRec.pDestAcctIntBnk}</pDestAcctIntBnk>
        <pDestBenefIntBnk>${userRec.pDestBenefIntBnk}</pDestBenefIntBnk>
        <pDestBankCode>${userRec.pDestBankCode}</pDestBankCode>
        <psendOptions>${userRec.psendOptions}</psendOptions>
        <pBillPaymentRec>
          <pBillID>${userRec.pBillPaymentRec.pBillID}</pBillID>
          <pPlatformName>${userRec.pBillPaymentRec.pPlatformName}</pPlatformName>
          <pBillRef1>${userRec.pBillPaymentRec.pBillRef1}</pBillRef1>
          <pBillRef2>${userRec.pBillPaymentRec.pBillRef2}</pBillRef2>
          <pBillRef3>${userRec.pBillPaymentRec.pBillRef3}</pBillRef3>
          <pCustName>${userRec.pBillPaymentRec.pCustName}</pCustName>
          <pAcctTitle>${userRec.pBillPaymentRec.pAcctTitle}</pAcctTitle>
          <pSourceAcct>${userRec.pBillPaymentRec.pSourceAcct}</pSourceAcct>
          <pPayeeAcct>${userRec.pBillPaymentRec.pPayeeAcct}</pPayeeAcct>
          <pBillMonth>${userRec.pBillPaymentRec.pBillMonth}</pBillMonth>
          <pBillYear>${userRec.pBillPaymentRec.pBillYear}</pBillYear>
          <pBillStartDt>${userRec.pBillPaymentRec.pBillStartDt}</pBillStartDt>
          <pBillEndDt>${userRec.pBillPaymentRec.pBillEndDt}</pBillEndDt>
          <pTokenRefId>${userRec.pBillPaymentRec.pTokenRefId}</pTokenRefId>
          <pBillPayed>${userRec.pBillPaymentRec.pBillPayed}</pBillPayed>
          <pBillAmount>${userRec.pBillPaymentRec.pBillAmount}</pBillAmount>
          <pDB>${userRec.pBillPaymentRec.pDB}</pDB>
          <pEnqAcess>${userRec.pBillPaymentRec.pEnqAcess}</pEnqAcess>
          <pUserName>${userRec.pBillPaymentRec.pUserName}</pUserName>
        </pBillPaymentRec>
      </pUserTrfToken>
    </ReturngetFundstransfer>
  `
		.trim()
		.replace(/\s+/g, ' ');

	try {
		const { data } = await soapRequest(
			'/NibssService/NibssAppService.asmx',
			body
		);

		const result = data['ReturngetFundstransferResult'];

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage:
				'Failed to get funds transfer information. Please try again.',
		};
	}
};

export const doNIPTransferReversal = async (userRec: any, values: any) => {
	const body = `
    <DoNIPTransfer_reverasal xmlns="http://con.Ibplc.org/">
      <pUserTrfToken>
        <pSessionId>${userRec.pSessionId}</pSessionId>
        <NameEnquiryRef>${values.NameEnquiryRef}</NameEnquiryRef>
        <DestinationInstitutionCode>${values.DestinationInstitutionCode}</DestinationInstitutionCode>
        <ChannelCode>${values.ChannelCode}</ChannelCode>
        <pInitTime>${userRec.pInitTime}</pInitTime>
        <pTokValue>${userRec.pTokValue}</pTokValue>
        <penqaccess>${userRec.penqaccess}</penqaccess>
        <pUname>${userRec.pUname}</pUname>
        <pStatus>${userRec.pStatus}</pStatus>
        <Pamount>${userRec.Pamount}</Pamount>
        <pTransRef>${userRec.pTransRef}</pTransRef>
        <pTrfType>${userRec.pTrfType}</pTrfType>
        <pTimeStamp>${userRec.pTimeStamp}</pTimeStamp>
        <pGsmStatus>${userRec.pGsmStatus}</pGsmStatus>
        <pUserEmail>${userRec.pUserEmail}</pUserEmail>
        <pUserGSM>${userRec.pUserGSM}</pUserGSM>
        <pSrcAcct>${userRec.pSrcAcct}</pSrcAcct>
        <OriginatorAccountName>${values.OriginatorAccountName}</OriginatorAccountName>
        <OriginatorAccountNumber>${values.OriginatorAccountNumber}</OriginatorAccountNumber>
        <OriginatorBankVerificationNumber>${values.OriginatorBankVerificationNumber}</OriginatorBankVerificationNumber>
        <OriginatorKYCLevel>${values.OriginatorKYCLevel}</OriginatorKYCLevel>
        <pDestAcct>${userRec.pDestAcct}</pDestAcct>
        <BeneficiaryAccountName>${values.BeneficiaryAccountName}</BeneficiaryAccountName>
        <BeneficiaryAccountNumber>${values.BeneficiaryAccountNumber}</BeneficiaryAccountNumber>
        <BeneficiaryBankVerificationNumber>${values.BeneficiaryBankVerificationNumber}</BeneficiaryBankVerificationNumber>
        <BeneficiaryKYCLevel>${values.BeneficiaryKYCLevel}</BeneficiaryKYCLevel>
        <TransactionLocation>${values.TransactionLocation}</TransactionLocation>
        <pFullName>${userRec.pFullName}</pFullName>
        <Narration>${values.Narration}</Narration>
        <PaymentReference>${values.PaymentReference}</PaymentReference>
        <retVal>${values.retVal}</retVal>
        <retMsg>${values.retMsg}</retMsg>
        <theTree>
          <Char1>${values.theTree.Char1}</Char1>
          <Char2>${values.theTree.Char2}</Char2>
          <Char3>${values.theTree.Char3}</Char3>
          <bool>${values.theTree.bool}</bool>
          <retMsg>${values.theTree.retMsg}</retMsg>
          <cAC>${values.theTree.cAC}</cAC>
        </theTree>
        <AcAc>${values.AcAc}</AcAc>
        <pstatusLocal>${userRec.pstatusLocal}</pstatusLocal>
        <pstatusIntBank>${userRec.pstatusIntBank}</pstatusIntBank>
        <pmsgString>${userRec.pmsgString}</pmsgString>
        <pDestAcctIntBnk>${userRec.pDestAcctIntBnk}</pDestAcctIntBnk>
        <pDestBenefIntBnk>${userRec.pDestBenefIntBnk}</pDestBenefIntBnk>
        <pDestBankCode>${userRec.pDestBankCode}</pDestBankCode>
        <psendOptions>${userRec.psendOptions}</psendOptions>
        <pBillPaymentRec>
          <pBillID>${userRec.pBillPaymentRec.pBillID}</pBillID>
          <pPlatformName>${userRec.pBillPaymentRec.pPlatformName}</pPlatformName>
          <pBillRef1>${userRec.pBillPaymentRec.pBillRef1}</pBillRef1>
          <pBillRef2>${userRec.pBillPaymentRec.pBillRef2}</pBillRef2>
          <pBillRef3>${userRec.pBillPaymentRec.pBillRef3}</pBillRef3>
          <pCustName>${userRec.pBillPaymentRec.pCustName}</pCustName>
          <pAcctTitle>${userRec.pBillPaymentRec.pAcctTitle}</pAcctTitle>
          <pSourceAcct>${userRec.pBillPaymentRec.pSourceAcct}</pSourceAcct>
          <pPayeeAcct>${userRec.pBillPaymentRec.pPayeeAcct}</pPayeeAcct>
          <pBillMonth>${userRec.pBillPaymentRec.pBillMonth}</pBillMonth>
          <pBillYear>${userRec.pBillPaymentRec.pBillYear}</pBillYear>
          <pBillStartDt>${userRec.pBillPaymentRec.pBillStartDt}</pBillStartDt>
          <pBillEndDt>${userRec.pBillPaymentRec.pBillEndDt}</pBillEndDt>
          <pTokenRefId>${userRec.pBillPaymentRec.pTokenRefId}</pTokenRefId>
          <pBillPayed>${userRec.pBillPaymentRec.pBillPayed}</pBillPayed>
          <pBillAmount>${userRec.pBillPaymentRec.pBillAmount}</pBillAmount>
          <pDB>${userRec.pBillPaymentRec.pDB}</pDB>
          <pEnqAcess>${userRec.pBillPaymentRec.pEnqAcess}</pEnqAcess>
          <pUserName>${userRec.pBillPaymentRec.pUserName}</pUserName>
        </pBillPaymentRec>
      </pUserTrfToken>
    </DoNIPTransfer_reverasal>
  `
		.trim()
		.replace(/\s+/g, ' ');

	try {
		const { data } = await soapRequest(
			'/NibssService/NibssAppService.asmx',
			body
		);

		const result = data['DoNIPTransfer_reverasalResult'];

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage:
				'Failed to perform NIP transfer reversal. Please try again.',
		};
	}
};

// account history details
export const getAccountHistory = async (
	acctno: string,
	startdate: string,
	enddate: string
) => {
	const body = `
    <ReturnHistDetails xmlns="http://con.Ibplc.org/">
      <acctno>${acctno}</acctno>
      <startdate>${startdate}</startdate>
      <enddate>${enddate}</enddate>
    </ReturnHistDetails>`
		.trim()
		.replace(/\s+/g, ' ');

	try {
		const { data } = await soapRequest(
			'/NibssService/NibssAppService.asmx',
			body
		);

		const result = data['ReturnHistDetailsResult'];

		const parseResult = result?.rs?.string?.slice(1).map((account: string) => {
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
			] = account.split('|');

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
		});

		return {
			success: true,
			data: parseResult,
		};
	} catch (error) {
		return {
			success: false,
			errorMessage:
				'Failed to retrieve account history details. Please try again.',
		};
	}
};
