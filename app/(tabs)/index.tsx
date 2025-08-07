import RoutineList from '@/components/RoutineList';
import * as schema from '@/db/schema';
import { convertUTCtoNZDateTime } from '@/functions/helperFunctions';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, View } from "react-native";
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
        <Button
          title="New Workout"
          color={'#0fb800ff'}
          onPress={() => Alert.alert('Simple Button pressed')}
        />
      </View>
      <View style={styles.topSectionContainer}>
        <Text style={styles.containerHeadingtext}>Routines</Text>
        <Button
          title="New Routine"
          color={'#0fb800ff'}
          onPress={() => Alert.alert('Simple Button pressed')}
        />
      </View>

      <RoutineList />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    margin: 15,
  },
  containerHeadingtext: {
    color: 'white',
    fontSize: 24,
    paddingBottom: 7,
  },
  // containerSubHeadingtext: {
  //   color: '#b6b6b6ff',
  //   fontSize: 20,
  //   paddingBottom: 7,
  // },
  // text: {
  //   color: 'white',
  //   fontSize: 24,
  // },
  // routineTextHeading: {
  //   color: 'white',
  //   fontSize: 24,
  // },
  // routineText: {
  //   color: '#b6b6b6ff',
  //   fontSize: 18,
  // },

  topSectionContainer: {
    borderWidth: 1,
    borderColor: 'yellow',
    paddingBottom: 10,
  },
  // days: {
  //   // flex: 1,
  // },
  // imagesContainer: {
  //   height: 250,
  //   borderWidth: 1,
  //   borderColor: 'red'
  // },
  // imageSvg: {
  //   alignSelf: 'center',
  // },
  // image: {
  //   position: 'absolute',
  //   alignSelf: 'center',
  //   resizeMode: 'contain',
  // },

  // bottomSectionContainer: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   borderWidth: 1,
  //   borderColor: 'green'
  // },
  // routineContainer: {
  //   flexDirection: 'column',
  //   borderRadius: 12,
  //   padding: 18,
  //   backgroundColor: '#5c5b5bff',
  //   marginBottom: 10,
  // },
  // routineHeadingContainer: {
  //   // flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-end',
  // }
});