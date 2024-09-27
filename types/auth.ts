interface EnumRec {
	ProfileNotFound: boolean;
	AccessCodeWrong: boolean;
	PasswordWrong: boolean;
	UserNameWrong: boolean;
	UserAccountLocked: boolean;
}

interface UserRec {
	pUserName: string;
	pAcessCode: string;
	pPassword: string;
	pFirstLogin: string;
	pPassChanged: string;
	pLastLogindate: string;
	pProfileType: string;
	pFullName: string;
	RPass: string;
	pUserStatus: string;
	PXfChar: string;
	PXfChar2: number;
}

interface OraResp {
	errmsg: string;
	errors: boolean;
}

interface AcctCollection {
	AcctStruct: AcctStruct[];
}

interface AcctStruct {
	failedlogin: number;
	CustomerID?: number;
	AccountNumber?: number;
	accountName?: string;
	ccy_code?: number;
	cod_prod?: number;
	cod_ccy_swift?: number;
	cod_acct_stat?: number;
	cod_acct_type?: string;
	cod_acct_title?: string;
	MasterCustID?: number;
	nam_currency?: string;
	OnceLimit?: number;
	IsoCurrencyName?: string;
	ptrflocalint?: string;
	ptrflocalthrdp?: string;
	ptrfintbankthrdp?: string;
	ptrftotaldaily?: string;
	Email?: string;
	Gsm?: number;
}

interface CodProd {
	CodRestrictStruct: CodRestrictStruct[];
}

interface CodRestrictStruct {
	PCode: number;
	PName: string;
	PUseAsSource: string;
	PUseAsDest: string;
}

interface CompanyUsers {
	string: string[];
}

interface AcctBlocks {
	AcctRestrictStruct: AcctRestrictStruct[];
}

interface AcctRestrictStruct {
	Pacct: number;
	pUserAsSource: string;
	pUseAsDest: string;
}

interface MenuControls {
	MenuControls: MenuControl[];
}

interface MenuControl {
	FDetailID: string;
	FDetailText: string;
	FAction: number;
}

interface MessageTemplate {
	MessageTemplateTypeId: string;
	MessageTemplateDescription: string;
	OperationOk: boolean;
	ErrorsOccured: boolean;
	ErrorMessage: string;
	MessageTemplateArray: MessageTemplateArray;
}

interface MessageTemplateArray {
	anyType: MessageTemplateType[];
}

interface MessageTemplateType {
	MessageTemplateTypeId: number;
	MessageTemplateDescription: string;
	OperationOk: boolean;
	ErrorsOccured: boolean;
	ErrorMessage: string;
	MessageTemplateArray: string;
}

interface XNotify {
	NotiFyList: NotifyList;
	NotiFyOpt: string;
	HasRows: boolean;
}

interface NotifyList {
	anyType: NotifyType[];
}

interface NotifyType {
	NotiFyID: number;
	NotiFyName: string;
}

interface PLimitsObject {
	LimitsObject: LimitObject[];
}

interface LimitObject {
	CustomerID?: number;
	Accountnumber?: number;
	CurrencyCode?: number;
	TotalLimit: number;
	InterBankLimit: number;
	ThirdPartyLimit: number;
	InternalXferLimit: number;
	LimitCategory?: string;
}

interface XMainMenu {
	MainMenuControls: MainMenuControl[];
}

interface MainMenuControl {
	MainMenuId?: number;
	MainMenuDescr?: string;
	MainMenuState?: number;
	hasRows: boolean;
	OperationOk: boolean;
	errorsOccured: boolean;
}

interface XAppParams {
	Notification: string;
	NextItem: string;
	NewItem: NewItem;
}

interface NewItem {
	appParamsItems: AppParamItem[];
}

interface AppParamItem {
	ParamName: string;
	Paramvalue: string | number;
}

interface ONarrateDefault {
	NarrateDefault: NarrateDefault[];
}

interface NarrateDefault {
	NarrateID?: string;
	NarrateDetl?: string;
}


export interface UserDataResponse {
	success: boolean;
	errorMessage: string;
	profileNotFound: boolean;
	accessCodeWrong: boolean;
	passwordWrong: boolean;
	userNameWrong: boolean;
	userAccountLocked: boolean;
	numberOfAccounts: number | null;
	enumRec: EnumRec;
	UserRec: UserRec;
	oraresp: OraResp;
	AcctCollection: AcctCollection;
	NumberOfAccounts: number;
	userdat: string;
	cod_prod: CodProd;
	NumberOfBlockedProds: number;
	CompanyUsers: CompanyUsers;
	NumberOfCompanyUsers: number;
	NumberOfBrcBranches: number;
	NumberOdCorpRptTypes: number;
	AcctBlocks: AcctBlocks;
	mMenuControls: MenuControls;
	mMenuControls2: MenuControls;
	messageTemplate: MessageTemplate;
	NumberOfAdminRoles: number;
	xNotify: XNotify;
	pLimitsObject: PLimitsObject;
	xMainMenu: XMainMenu;
	xappParams: XAppParams;
	oNarrateDefault: ONarrateDefault;
	oDate: string;
	oDays: number;
	oStatus: boolean;
}