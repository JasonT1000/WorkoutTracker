import OptionsHeader from '@/components/OptionsHeader';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { selectedExercises } = useLocalSearchParams()
  const [title, onChangeTitle] = useState('')

  useEffect(() => {
    console.log("------------- selectedExercises passed to the routine page")
    const parsedExercises = typeof selectedExercises === 'string'
      ? JSON.parse(selectedExercises) as ExerciseWithBodyAreas[]
      : []

    console.log(parsedExercises)

  }, [selectedExercises])

  return (
    <SafeAreaView style={styles.main}>

      <OptionsHeader title='Create Routine' />

      <View style={styles.body}>
        <View>
          <TextInput
            style={styles.routineTitleText}
            onChangeText={onChangeTitle}
            value={title}
            placeholder='Routine title'
            placeholderTextColor={'#858585ff'}
          />
        </View>
        <View>
          <Text style={styles.routineExercisesContainer}>Add some exercises cuzzy</Text>
        </View>

        <Button
          title="Add exercise"
          color={'#0fb800ff'}
          onPress={() => { router.navigate({ pathname: '/exercises' }) }}
        />
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    // margin: 15,
  },
  body: {
    margin: 15,
  },
  routineExercisesContainer: {
    color: 'white',
    fontSize: 24,
    height: 200,
    alignContent: 'center',
    verticalAlign: 'middle',
    textAlign: 'center'
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#353535ff',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  saveButton: {
    backgroundColor: '#afafafff',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 10,
  },
  cancelButton: {
    paddingVertical: 7,
    paddingRight: 13,
    borderRadius: 10,
  },
  optionsText: {
    fontSize: 18,
    color: '#ffffffff',
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#006ec9ff',
  },
  routineTitleText: {
    color: '#858585ff',
    fontSize: 24,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#585858ff',
  },

  topSectionContainer: {
    borderWidth: 1,
    borderColor: 'yellow',
    paddingBottom: 10,
  },
});