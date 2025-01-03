import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME || '');

export const uploadImage = async (file: Buffer, originalName: string): Promise<string> => {
    const fileExtension = originalName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const blob = bucket.file(fileName);

    try {
        await blob.save(file);
        await blob.makePublic();
        return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload image');
    }
};