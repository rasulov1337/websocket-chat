import { useEffect } from 'react';
import { sliceActions } from './slices/Slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './Types';

const DB_NAME = 'AppDB';
const DB_VERSION = 1;

const USER_STORE = 'user';
const MSG_STORE = 'messages';

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(USER_STORE)) {
                db.createObjectStore(USER_STORE, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(MSG_STORE)) {
                db.createObjectStore(MSG_STORE, {
                    keyPath: 'id',
                    autoIncrement: true,
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function saveUserNameToDB(name: string): Promise<void> {
    const db = await openDatabase();
    const tx = db.transaction(USER_STORE, 'readwrite');
    const store = tx.objectStore(USER_STORE);
    store.put({ id: 1, name });
}

export async function loadUserNameFromDB(): Promise<string | null> {
    const db = await openDatabase();
    const tx = db.transaction(USER_STORE, 'readonly');
    const store = tx.objectStore(USER_STORE);

    return new Promise((resolve, reject) => {
        const request = store.get(1);
        request.onsuccess = () => {
            resolve(request.result?.name ?? null);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function clearDBData(): Promise<void> {
    const db = await openDatabase();
    const tx = db.transaction([USER_STORE, MSG_STORE], 'readwrite');

    tx.objectStore(USER_STORE).clear();
    tx.objectStore(MSG_STORE).clear();
}

export function useUserName() {
    const username = useSelector((state: RootState) => state.slice.username);
    const dispatch = useDispatch();

    useEffect(() => {
        loadUserNameFromDB().then((name) => {
            if (!name) return;
            dispatch(sliceActions.setUsername(name));
            dispatch(sliceActions.login());
        });
    }, []);

    return { username };
}
