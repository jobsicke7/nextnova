import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../../../lib/mongodb';

// 컨텍스트 타입 정의를 Next.js 요구사항에 맞게 조정
export async function GET(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const collection = client.db('community').collection('comments');

        const comments = await collection
            .find({ postId: context.params.id })
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
    context: { params: { id: string } }
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
            postId: context.params.id,
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
