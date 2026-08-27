'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { ColorThemeProvider } from '@/components/providers/ColorThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Providers = ({ children }: { children: any }) => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<ColorThemeProvider>{children}</ColorThemeProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default Providers;
