// src/app/api/members/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch("https://api.wakscord.com/v2/member/list", {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
            },
        });

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json(
            { error: 'Failed to fetch members' },
            { status: 500 }
        );
    }
}