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


export const ReturnAcctDetails2 = async (reqType: any, userRec: any, values: any) => {
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
		const responseString = result.rs.string
		console.log(responseString)
		const parsedAccountDetails = responseString.slice(1).map((accountString: string) => {
        const [accountNumber,
          description,
          bookBalance,
          availBal,
          uncleared,
          currency,
          type] = accountString.split('|');
        return {
          accountNumber,
          description,
          bookBalance,
          availBal,
          uncleared,
          currency,
          type
        };
      });
		console.log("ReturnAcctDetails2Result");
		console.log(parsedAccountDetails);
		return { success: true, data: parsedAccountDetails };
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Something went wrong!',
		};
	}
};
