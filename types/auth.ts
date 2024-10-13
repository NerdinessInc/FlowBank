export interface UserDataResponse {
  success: boolean;
  errorMessage: string;
  profileNotFound: boolean;
  accessCodeWrong: boolean;
  passwordWrong: boolean;
  userNameWrong: boolean;
  userAccountLocked: boolean;
  numberOfAccounts?: null;
  enumRec: EnumRec;
  UserRec: UserRec;
  oraresp: Oraresp;
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
  mMenuControls2: MenuControls2;
  messageTemplate: MessageTemplate;
  NumberOfAdminRoles: number;
  xNotify: XNotify;
  pLimitsObject: PLimitsObject;
  xMainMenu: XMainMenu;
  xappParams: XappParams;
  oNarrateDefault: ONarrateDefault;
  oDate: string;
  oDays: number;
  oStatus: boolean;
}
export interface EnumRec {
  ProfileNotFound: boolean;
  AccessCodeWrong: boolean;
  PasswordWrong: boolean;
  UserNameWrong: boolean;
  UserAccountLocked: boolean;
}
export interface UserRec {
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
export interface Oraresp {
  errmsg: string;
  errors: boolean;
}
export interface AcctCollection {
  AcctStruct?: (AcctStructEntity)[] | null;
}
export interface AcctStructEntity {
  failedlqogin?: number | null;
  CustomerID?: number | null;
  AccountNumber?: number | null;
  accountName?: string | null;
  ccy_code?: number | null;
  cod_prod?: number | null;
  cod_ccy_swift?: number | null;
  cod_acct_stat?: number | null;
  cod_acct_type?: string | null;
  cod_acct_title?: string | null;
  MasterCustID?: number | null;
  nam_currency?: string | null;
  OnceLimit?: number | null;
  IsoCurrencyName?: string | null;
  ptrflocalint?: string | null;
  ptrflocalthrdp?: string | null;
  ptrfintbankthrdp?: string | null;
  ptrftotaldaily?: string | null;
  Email?: string | null;
  Gsm?: number | null;
  failedlogin?: number | null;
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

export interface CompanyUsers {
  string?: (string)[] | null;
}

export interface MenuControls2 {
  MenuControls?: (2 | string)[] | null;
}
export interface MessageTemplate {
  MessageTemplateTypeId: string;
  MessageTemplateDescription: string;
  OperationOk: boolean;
  ErrorsOccured: boolean;
  ErrorMessage: string;
  MessageTemplateArray: MessageTemplateArray;
}
export interface MessageTemplateArray {
  anyType?: (AnyTypeEntity)[] | null;
}
export interface AnyTypeEntity {
  MessageTemplateTypeId: number;
  MessageTemplateDescription: string;
  OperationOk: boolean;
  ErrorsOccured: boolean;
  ErrorMessage: string;
  MessageTemplateArray: string;
}
export interface XNotify {
  NotiFyList: NotiFyList;
  NotiFyOpt: string;
  HasRows: boolean;
}
export interface NotiFyList {
  anyType?: (AnyTypeEntity1)[] | null;
}
export interface AnyTypeEntity1 {
  NotiFyID: number;
  NotiFyName: string;
}
export interface PLimitsObject {
  LimitsObject?: (LimitsObjectEntity)[] | null;
}
export interface LimitsObjectEntity {
  CustomerID?: number | null;
  Accountnumber?: number | null;
  CurrencyCode?: number | null;
  TotalLimit: number;
  InterBankLimit: number;
  ThirdPartyLimit: number;
  InternalXferLimit: number;
  LimitCategory?: string | null;
}
export interface XMainMenu {
  MainMenuControls?: (MainMenuControlsEntity)[] | null;
}
export interface MainMenuControlsEntity {
  MainMenuId?: number | null;
  MainMenuDescr?: string | null;
  MainMenuState?: number | null;
  hasRows: boolean;
  OperationOk: boolean;
  errorsOccured: boolean;
}
export interface XappParams {
  Notification: string;
  NextItem: string;
  NewItem: NewItem;
}
export interface NewItem {
  appParamsItems?: (AppParamsItemsEntity)[] | null;
}
export interface AppParamsItemsEntity {
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




