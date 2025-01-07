// app/api/moon/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const { latitude, longitude, date } = await req.json();

        const response = await axios.post(
            'https://api.astronomyapi.com/api/v2/studio/moon-phase',
            {
                style: {
                    moonStyle: 'default',
                    backgroundStyle: 'solid',
                    backgroundColor: '#000000',
                    headingColor: '#000000',
                    textColor: '#000000',
                },
                observer: { latitude, longitude, date },
                view: { type: 'portrait-simple', parameters: {} },
            },
            {
                headers: {
                    Authorization: `Basic NWNiYTRmY2YtMDhhYy00MTljLTgzZjktOWZjZTEyM2I0NjcxOjk3ZmVjYjc3MjJkZGJiNWQxZjVkOTM5NjkzNjA1YmZiNmYwMmU2MjgzODI4YzQ2ZjAwZmEyNzZlY2ZkYTVkODc0MzhlODNiODAyN2MxNDE0ZDBmZjA5NDJmNTVjOTUxY2UzOGVmNzQ0NzA4MzkwNmU2ZGU1MzRkY2NmYjAzN2VkZDEwMDM3N2RlNDUwNWU4OWQzMTQxZTU3MjJmZjY4ODcxMzRhYmI2ODk3ODExMTc0ZDBlZjU5NWY0NjhiZmI4MmViMzcyYzY3MTg4NjA1NzUwY2ZlMWQwYjg3OWQyMzRm`, // Replace with your API Key
                },
            }
        );

        return NextResponse.json(response.data.data);
    } catch (error: any) {
        console.error('API 호출 중 오류:', error.message);
        return NextResponse.json({ error: '달 정보를 가져오는 데 실패했습니다.' }, { status: 500 });
    }
}
