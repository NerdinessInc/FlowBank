import {
	ArrowLeftRight,
	Clock,
	FileText,
	Home,
	MessageSquare,
	PiggyBank,
	UserCircle,
	Wallet,
	Info,
	CreditCard,
} from 'lucide-react';

export interface Route {
	label: string;
	pathname: string;
	icon?: React.ReactNode;
	children?: Route[];
}

export const sidebarRoutes: Route[] = [
	{
		label: 'Dashboard',
		pathname: '/dashboard',
		icon: <Home className='h-4 w-4' />,
	},
	{
		label: 'Profile',
		pathname: '/profile',
		icon: <UserCircle className='h-4 w-4' />,
	},
	{
		label: 'Account Information',
		pathname: '/account-information',
		icon: <Wallet className='h-4 w-4' />,
		children: [
			{
				label: 'My Accounts',
				pathname: '/my-accounts',
				icon: <CreditCard className='h-4 w-4' />,
			},
			{
				label: 'Summary',
				pathname: '/summary',
				icon: <FileText className='h-4 w-4' />,
			},
			{
				label: 'Details',
				pathname: '/details',
				icon: <Info className='h-4 w-4' />,
			},
		],
	},
	{
		label: 'Time Deposits',
		pathname: '/time-deposits',
		icon: <Clock className='h-4 w-4' />,
	},
	{
		label: 'Statements',
		pathname: '/statements',
		icon: <FileText className='h-4 w-4' />,
	},
	{
		label: 'Transfers',
		pathname: '/transfers',
		icon: <ArrowLeftRight className='h-4 w-4' />,
	},
	{
		label: 'Customers Requests',
		pathname: '/customers-requests',
		icon: <MessageSquare className='h-4 w-4' />,
	},
	{
		label: 'Manage Funds',
		pathname: '/manage-funds',
		icon: <PiggyBank className='h-4 w-4' />,
	},
];

export const navbarRoutes: Route[] = [
	{
		label: '',
		pathname: '/dashboard',
		icon: <Home className='h-6 w-6' />,
	},
	{
		label: 'Manage Team',
		pathname: '/team',
	},
	{
		label: 'Contacts',
		pathname: '/contacts',
	},
	{
		label: 'Invoices',
		pathname: '/invoices',
	},
];