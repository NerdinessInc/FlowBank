import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const cookies = request.cookies;

	const userData = cookies.get('nomase_user')?.value || null;

	const path = request.nextUrl.pathname;

	if (userData) {
		// User is logged in
		if (path === '/') {
			// Redirect to dashboard if trying to access login page
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
	} else {
		// User is not logged in
		if (path !== '/') {
			// Redirect to login for any page other than login
			return NextResponse.redirect(new URL('/', request.url));
		}
	}

	// Allow the request to continue
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
