import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topSectionContainer}>
        <Text style={styles.text}>Routines</Text>
        <Button
          title="New Routine"
          color={'#0fb800ff'}
          onPress={() => Alert.alert('Simple Button pressed')}
        />
      </View>

      <View style={styles.bottomSectionContainer}>
        <Text style={styles.text}>My Routines</Text>
        {/* list all routine elements here */}
        <View style={styles.routineContainer}>
          <Text style={styles.routineTextHeading}>Deadlifts</Text>
          <Text style={styles.routineText}>Deadlift (Barbell), Bent Over Row (Barbell), Shrug (Barbell), Standing Calf Raise (Barbell)</Text>
          <Text style={styles.routineText}></Text>
          <Button
            title="Start Routine"
            onPress={() => Alert.alert('Simple Button pressed')}
          />
        </View>
        <View style={styles.routineContainer}>
          <Text style={styles.routineTextHeading}>Squats</Text>
          <Text style={styles.routineText}>Squats (Barbell), Front Squats (Barbell), Standing Calf Raise (Barbell)</Text>
          <Text style={styles.routineText}></Text>
          <Button
            title="Start Routine"
            onPress={() => Alert.alert('Simple Button pressed')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    margin: 15,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  routineTextHeading: {
    color: 'white',
    fontSize: 24,
  },
  routineText: {
    color: '#b6b6b6ff',
    fontSize: 18,
  },

  topSectionContainer: {
    borderWidth: 1,
    borderColor: 'yellow',
  },
  days: {
    // flex: 1,
  },
  imagesContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: 'red'
  },
  imageSvg: {
    alignSelf: 'center',
  },
  image: {
    position: 'absolute',
    alignSelf: 'center',
    resizeMode: 'contain',
  },

  bottomSectionContainer: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'green'
  },
  routineContainer: {
    flexDirection: 'column',
    borderRadius: 12,
    padding: 18,
    backgroundColor: '#5c5b5bff',
    marginBottom: 10,
  }
});