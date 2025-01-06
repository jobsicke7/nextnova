import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
    const client = await clientPromise;
    const collection = client.db('servicedata').collection('posts');
    const posts = await collection.find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const session = await getServerSession();
    if (!session) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, content, authorName } = await request.json();

    const client = await clientPromise;
    const collection = client.db('servicedata').collection('posts');

    const post = {
        Date: '2024-01-01',
        title,
        content,
        authorName,
        views: 0,
        createdAt: new Date(),
        authorEmail: session.user?.email
    };

    const result = await collection.insertOne(post);
    return NextResponse.json({ ...post, _id: result.insertedId });
}