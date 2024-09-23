import { soapRequest } from '@/utils';
import { getCookie } from '@/utils/cookies';
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
// <sid>${values.sessionID}</sid>
//<sid>${getCookie('sessionID') || ' 104.28.219.97'}</sid>

export const authUser = async (values: any) => {
	
	const authUserBody = `
	<ReturnAuthuser xmlns="http://con.Ibplc.org/">
		<acCode>${webClasses.encryptText(values.accessCode)}</acCode>
		<pwd>${webClasses.encryptText(values.password)}</pwd>
		<uname>${webClasses.encryptText(values.username)}</uname>
		<sid>'test 104.28.219.97'}</sid>
		
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

	console.log(authUserBody)
	const { data } = await soapRequest(
		'/NibssService/NibssAppService.asmx',
		authUserBody
	);

	try {
		const result = data['ReturnAuthuserResult'];
		console.log(result)

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
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: 'Something went wrong!',
		};
	}
};
