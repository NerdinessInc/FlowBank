// export async function GET(req: {
// 	headers: { get: (arg0: string) => any };
// 	connection: { remoteAddress: any };
// }) {
// 	const randomNumber = Math.floor(Math.random() * 1000000);

// 	const ip =
// 		req.headers.get('x-forwarded-for') ||
// 		req.connection?.remoteAddress ||
// 		'127.0.0.1';

// 	const sessionID = `${randomNumber} ${ip}`;

// 	return new Response(JSON.stringify({ sessionID }), {
// 		status: 200,
// 		headers: { 'Content-Type': 'application/json' },
// 	});
// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Extract real client IP
  let ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Generate random numeric session ID
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  // You can keep them separate or combine safely
  const sessionID = `${randomNumber} ${ip.replace(/\s+/g, "")}`;

  return NextResponse.json({ sessionID, ip }, { status: 200 });
}

