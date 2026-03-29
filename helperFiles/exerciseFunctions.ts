import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { formatTime } from "./helperFunctions";
import { EXERCISESETTYPE, ExerciseSetTypes, EXERCISETYPE, ExerciseTypes, NewRoutineExerciseSet, NewWorkoutExerciseSet } from "./helperTypes";

/**
 * Creates a component for a Workout/Routine exercise that displays its set information. The component
 * is styled differently depending on its type id. 
 * @param exerciseSet Workout or Routine exercise set
 * @param exerciseTypeId Type of the exercise eg 'Normal, Warmup, Left, Right' etc
 * @param setIndex Index of set
 * @returns 
 */
export const getSetTypeComponent = (exerciseSet: NewWorkoutExerciseSet | NewRoutineExerciseSet, exerciseTypeId: number, setIndex: number) => {
    const exerciseSetTypeInfo = ExerciseSetTypes[exerciseSet.exerciseSetTypeId]
    let setText = getSetInfoText(exerciseSet, exerciseTypeId)

    switch (exerciseSetTypeInfo.type) {
        case EXERCISESETTYPE.NORMAL:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(Text, { style: [styles.shortCodeText, { color: exerciseSetTypeInfo.colorcode }] }, setIndex + 1),
                React.createElement(Text, { style: [styles.setText, { color: exerciseSetTypeInfo.colorcode }] }, setText)
            )
        default:
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(Text, { style: [styles.shortCodeText, { color: exerciseSetTypeInfo.colorcode }] }, exerciseSetTypeInfo.shortcode),
                React.createElement(Text, { style: [styles.setText, { color: exerciseSetTypeInfo.colorcode }] }, setText)
            )
    }
}

/**
 * Takes a New workout exercise or new routine exercise set and returns a string with the set information
 * to be displayed. This is used when showing an exercises info when collapsed.
 * @param exerciseSet Workout or Routine exercise set
 * @param exerciseTypeId the type of the exercise eg 'Normal, Warmup, Left, Right' etc
 * @returns exercise set string
 */
export const getSetInfoText = (exerciseSet: NewWorkoutExerciseSet | NewRoutineExerciseSet, exerciseTypeId: number): string => {
    let reps: string = '- reps';
    let time: string = '0min';

    console.log("Exercise reps " + exerciseSet.reps)

    if (exerciseSet.reps > 1) { reps = exerciseSet.reps + " reps" }
    else if (exerciseSet.reps === 1) { reps = exerciseSet.reps + " rep" }

    if (exerciseSet.time && exerciseSet.time > 0) { time = formatTime(exerciseSet.time) }

    switch (ExerciseTypes[exerciseTypeId]) {
        case EXERCISETYPE.BODYWEIGHT:
            return reps
        case EXERCISETYPE.WEIGHT:
            let weight: string = '';
            if (exerciseSet.weight && exerciseSet.weight > 0) { weight = exerciseSet.weight + "kgs x" }
            return weight + reps
        case EXERCISETYPE.CARDIO:
            let distance: string = '';
            if (exerciseSet.distance && exerciseSet.distance >= 0) { distance = exerciseSet.distance + "km x" }
            return distance + time
        case EXERCISETYPE.STRETCH:
            return time

        default:
            return 'No set info to display'
    }
}

const styles = StyleSheet.create({
    shortCodeText: {
        fontSize: 16,
        width: 25,
        // height: 40,
        // textAlign: 'center',
        // verticalAlign: 'middle',
        // borderWidth: 1,
        // borderColor: 'green'
    },
    setText: {
        fontSize: 16,
    },
})
