import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST() {
	try {
		const response = await axios.post<{ userName: string; token: string }>(
			`${process?.env?.NEXT_PUBLIC_API_BASE_URL!}/auth/login`,
			{
				username: process?.env?.NEXT_PUBLIC_API_USERNAME!,
				password: process?.env?.NEXT_PUBLIC_API_PASSWORD!,
			}
		);

		return NextResponse.json({
			userName: response.data.userName,
			token: response.data.token, // Returning token in expected format
		});
	} catch (error) {
		console.error('Token refresh failed:', error);

		return NextResponse.json(
			{ error: 'Failed to refresh token' },
			{ status: 500 }
		);
	}
}
