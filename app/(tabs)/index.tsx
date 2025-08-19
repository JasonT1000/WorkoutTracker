import RoutineList from '@/components/RoutineList';
import * as schema from '@/db/schema';
import { convertUTCtoNZDateTime } from '@/functions/helperFunctions';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { router } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Index() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useDrizzleStudio(db);

  useEffect(() => {
    const load = async () => {
      const data = await drizzleDb.query.workout.findMany();
      if (data) {
        convertUTCtoNZDateTime(data[0].datetime)
      }
    }

    // load()

  }, []);

  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.topSectionContainer}>
        <Text style={styles.containerHeadingtext}>Workout</Text>
        <TouchableNativeFeedback
          onPress={() => Alert.alert('Simple Button pressed')}
          background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
          <View style={styles.addExercisesButton}>
            <Text style={styles.addExercisesButtonText}>New Workout</Text>
          </View>
        </TouchableNativeFeedback>
      </View>

      <View style={styles.topSectionContainer}>
        <Text style={styles.containerHeadingtext}>Routines</Text>
        <TouchableNativeFeedback
          onPress={() => router.navigate({ pathname: '/routine' })}
          background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
          <View style={styles.addExercisesButton}>
            <Text style={styles.addExercisesButtonText}>New Routine</Text>
          </View>
        </TouchableNativeFeedback>
      </View>

      <RoutineList />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    // flex: 1,
    height: '100%',
    margin: 15,
  },
  topSectionContainer: {
    // borderWidth: 1,
    // borderColor: 'yellow',
    paddingBottom: 10,
  },
  containerHeadingtext: {
    color: 'white',
    fontSize: 24,
    paddingBottom: 7,
  },

  addExercisesButton: {
    width: '100%',
    backgroundColor: '#0fb800ff',
    padding: 8,
    borderRadius: 10,
  },
  addExercisesButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffffff'
  },
});