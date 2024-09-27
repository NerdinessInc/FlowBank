export async function GET(req: {
	headers: { get: (arg0: string) => any };
	connection: { remoteAddress: any };
}) {
	const randomNumber = Math.floor(Math.random() * 1000000);

	const ip =
		req.headers.get('x-forwarded-for') ||
		req.connection?.remoteAddress ||
		'127.0.0.1';

	const sessionID = `${randomNumber} ${ip}`;

	return new Response(JSON.stringify({ sessionID }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
