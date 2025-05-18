import { useEffect } from 'react';
import { sliceActions } from './slices/Slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, MessagePayload } from './Types';

let DB_NAME = null as null | 'MarsDB' | 'EarthDB';

const DB_VERSION = 1;

const USER_STORE = 'user';
const MSG_STORE = 'messages';

function openDatabase(): Promise<IDBDatabase> {
    if (!DB_NAME) {
        if (window.MARS) {
            DB_NAME = 'MarsDB';
        } else {
            DB_NAME = 'EarthDB';
        }
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME!, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(USER_STORE)) {
                db.createObjectStore(USER_STORE, {
                    keyPath: 'id',
                    autoIncrement: true,
                });
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

export function useMessages() {
    const messages = useSelector((state: RootState) => state.slice.messages);
    const dispatch = useDispatch();

    useEffect(() => {
        getMessages().then((messages) => {
            if (!messages) return;

            dispatch(sliceActions.setMessages(messages));
        });
    }, []);

    return { messages };
}

export async function saveMessage(payload: MessagePayload): Promise<void> {
    const db = await openDatabase();
    const tx = db.transaction(MSG_STORE, 'readwrite');
    tx.objectStore(MSG_STORE).put({ ...payload });
}

export async function getMessages(): Promise<MessagePayload[]> {
    const db = await openDatabase();
    const tx = db.transaction(MSG_STORE, 'readonly');
    return new Promise((resolve, reject) => {
        const req = tx.objectStore(MSG_STORE).getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
