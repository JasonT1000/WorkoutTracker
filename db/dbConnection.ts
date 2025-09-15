import { DATABASE_NAME } from '@/helperFiles/constants';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const db = drizzle(expoDb);