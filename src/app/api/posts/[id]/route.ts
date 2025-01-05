import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const client = await clientPromise;
    const collection = client.db('community').collection('posts');

    // 조회수 증가
    await collection.updateOne(
        { _id: new ObjectId((await params).id) },
        { $inc: { views: 1 } }
    );

    const post = await collection.findOne({ _id: new ObjectId((await params).id) });
    return NextResponse.json(post);
}