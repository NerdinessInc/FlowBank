import { create } from 'zustand';
import { getCookie, setCookie } from './utils/cookies';
import { UserDataResponse } from './types/auth';

interface AppStore {
	userData: UserDataResponse | null;
	setUserData: (userData: UserDataResponse) => void;
	login: (userData: UserDataResponse) => void;
	logout: () => void;
}

const appStore = create<AppStore>()((set) => ({
	// userData: getCookie('nomase_u')
	// 	? JSON.parse(getCookie('nomase_u') || '')
	// 	: null,
	userData: JSON.parse(localStorage.getItem('nomase_u') || ''),
	setUserData: (userData: UserDataResponse) => set({ userData }),

	login: (state) => {
		set(() => ({
			userData: state,
		}));

		const menuControls = state.mMenuControls;
    

		// setCookie('nomase_u', JSON.stringify(state));

		location.href = '/dashboard';
	},

	logout: () => {
		set(() => ({
			userData: null,
		}));

		setCookie('nomase_u', '');
	},
}));

export { appStore };
