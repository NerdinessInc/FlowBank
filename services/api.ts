import { soapRequest } from '@/utils';
// import { getCookie } from '@/utils/cookies';
import WebClasses from '@/utils/webClasses';

const webClasses = new WebClasses();

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

	console.log(AcctDetail2Body);
	const { data } = await soapRequest(
		'/NibssService/NibssAppService.asmx',
		AcctDetail2Body
	);

	try {
		const result = data['ReturnAcctDetails2Result'];
		const responseString = result.rs.string;
		console.log(responseString);
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
		console.log('ReturnAcctDetails2Result');
		console.log(parsedAccountDetails);
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

		console.log(data);

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

	console.log(SaveBenefInfoBody);
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

export const ReturngetOTUP = async (userRec: any, values: any) => {
	const SaveBenefInfoBody = `
	<ReturngetOTUP xmlns="http://con.Ibplc.org/">
      <pUserTrfToken>
        <pusername>${userRec.pUserName}</pusername>
        <penqaccess>${userRec.PXfChar2}</penqaccess>
        <pacesscode>${userRec.pAcessCode}</pacesscode>
        <ppassword>${userRec.pPassword}</ppassword>
        <ptrfcode>string</ptrfcode>
        <pjobtype>string</pjobtype>
        <pprocesstype>string</pprocesstype>
        <pjobsubmittedby>${userRec.pFullName}</pjobsubmittedby>
        <psessionID>string</psessionID>
        <pemail1>string</pemail1>
        <pphone1>string</pphone1>
      </pUserTrfToken>
      <Sendoption>1</Sendoption>
    </ReturngetOTUP>

	<returnSaveBenefInfo xmlns="http://con.Ibplc.org/">
      <pUsername>${userRec.pUserName}</pUsername>
      <pAccountnumber>${values.accountNumber}</pAccountnumber>
      <pCustomerid>${userRec.PXfChar2}</pCustomerid>
      <pAccountnameNew>${values.accountName}</pAccountnameNew>
      <pAcctCurrency>${values.currency}</pAcctCurrency>
    </returnSaveBenefInfo>`
		.trim()
		.replace(/\s+/g, ' ');

	console.log(SaveBenefInfoBody);
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
