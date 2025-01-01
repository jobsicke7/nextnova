import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: '모든 필드를 입력해주세요' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        // 이메일 중복 체크
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: '이미 존재하는 이메일입니다' },
                { status: 400 }
            );
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 12);

        // 새 사용자 생성
        const result = await db.collection('users').insertOne({
            email,
            password: hashedPassword,
            name,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: '회원가입이 완료되었습니다', userId: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}