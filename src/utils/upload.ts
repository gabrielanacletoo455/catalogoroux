import { appFireBase } from '@/firebase/firebase.config';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const storage = getStorage(appFireBase);

export const uploadImagesToFirebase = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    const promises = files.map(async file => {
        const extension = file.name.split('.').pop();
        const formattedFilename = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;
        const storageRef = ref(storage, formattedFilename);

        await uploadBytesResumable(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
    });

    await Promise.all(promises);
    return urls;
};
