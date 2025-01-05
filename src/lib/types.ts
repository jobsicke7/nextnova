export interface Post {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    views: number;
    createdAt: Date;
}

export interface Comment {
    _id: string;
    postId: string;
    content: string;
    authorName: string;
    createdAt: Date;
}