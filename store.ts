import { create } from 'zustand';
import { getCookie, setCookie, clearCookie } from './utils/cookies';
import { UserDataResponse } from './types/auth';

interface AppStore {
	userData: Partial<UserDataResponse> | null;
	appData: UserDataResponse | null;
	menuControlData: UserDataResponse | null;
	mainMenuData: UserDataResponse | null;
	accessCode: any;
	setUserData: (userData: UserDataResponse) => void;
	setAppData: (appData: UserDataResponse) => void;
	setMenuControlData: (menuControlData: UserDataResponse) => void;
	setMainMenuData: (mainMenuData: UserDataResponse) => void;
	setAccessCode: (accessCode: string) => void;
	login: (userData: UserDataResponse) => void;
	logout: () => void;
}

const safeParseJSON = (data: any) => {
	if (!data) return null;

	try {
		return JSON.parse(data);
	} catch (e) {
		return null;
	}
};

const appStore = create<AppStore>()((set) => ({
	userData: safeParseJSON(getCookie('nomase_user')) || null,
	setUserData: (userData: UserDataResponse) => set({ userData }),

	appData: safeParseJSON(getCookie('nomase_app')) || null,
	setAppData: (appData: any) => set({ appData }),

	menuControlData: safeParseJSON(getCookie('nomase_menu')) || null,
	setMenuControlData: (menuControlData: any) => set({ menuControlData }),

	mainMenuData: safeParseJSON(getCookie('nomase_main')) || null,
	setMainMenuData: (mainMenuData: any) => set({ mainMenuData }),

	accessCode: safeParseJSON(getCookie('nomase_access')) || '',
	setAccessCode: (accessCode: string) => {
		set({ accessCode });

		setCookie('nomase_access', JSON.stringify(accessCode));
	},

	login: (state) => {
		set(() => ({
			userData: state,
		}));

		const userRec = state.UserRec;
		const acctCollection = state.AcctCollection;
		const codProd = state.cod_prod;
		const companyUsers = state.CompanyUsers;
		const acctBlocks = state.AcctBlocks;
		const menuControls = state.mMenuControls;
		const xMainMenu = state.xMainMenu;
		const pLimitsObject = state.pLimitsObject;

		const appCookieData = {
			codProd,
			companyUsers,
			menuControls,
			acctBlocks,
		};

		const userCookieData = {
			userRec,
			acctCollection,
			pLimitsObject,
		};

		const mainMenuCookieData = {
			xMainMenu,
		};

		setCookie('nomase_app', JSON.stringify(appCookieData));
		setCookie('nomase_user', JSON.stringify(userCookieData));
		setCookie('nomase_main', JSON.stringify(mainMenuCookieData));

		location.href = '/dashboard';
	},

	logout: () => {
		set(() => ({
			userData: null,
			appData: null,
			menuControlData: null,
			mainMenuData: null,
		}));

		clearCookie('nomase_user');
		clearCookie('nomase_app');

		clearCookie('nomase_main');

		location.href = '/';
	},
}));

export { appStore };
