import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../../../lib/mongodb';

// 라우트 컨텍스트 타입 지정
export async function GET(
    _request: Request,
    { params }: { params: { id: string } } // Next.js에서 요구하는 정확한 타입
) {
    try {
        const client = await clientPromise;
        const collection = client.db('community').collection('comments');

        const comments = await collection
            .find({ postId: params.id })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } } // Next.js에서 요구하는 정확한 타입
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { content } = await request.json();
        if (!content || typeof content !== 'string') {
            return new NextResponse('Invalid content', { status: 400 });
        }

        const client = await clientPromise;
        const collection = client.db('community').collection('comments');

        const comment = {
            postId: params.id,
            content,
            authorName: session.user?.name || 'Anonymous',
            createdAt: new Date(),
        };

        const result = await collection.insertOne(comment);
        if (!result.acknowledged) {
            throw new Error('Failed to insert comment');
        }

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error posting comment:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
