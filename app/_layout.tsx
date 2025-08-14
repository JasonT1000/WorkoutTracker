import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { ActivityIndicator, useColorScheme } from "react-native";

import { addData } from "@/db/addData";
import migrations from '@/drizzle/migrations';
import { convertNZDateTimetoUTC } from "@/functions/helperFunctions";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { RoutineExerciseProvider } from "../state/routine/routineExerciseContext";

export const DATABASE_NAME = 'db';

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!success) {
      console.log("migration in progress");
      return;
    }

    addData(db)

    const load = async () => {
      // let currentDatetime = new Date().toISOString()
      // await db.insert(measurements).values([
      //   { datetime: currentDatetime, bodyweight: 59.50 },
      // ])

      // convert old record dates to UTC

      convertNZDateTimetoUTC("16/05/18");
    }

    // load()

  }, [success]);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider databaseName={DATABASE_NAME}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RoutineExerciseProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="routine" options={{ headerShown: false }} />
              <Stack.Screen name="exercises" options={{ headerShown: false }} />
            </Stack>
          </RoutineExerciseProvider>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  )
}
