import { formatTimerTime } from '@/helperFiles/helperFunctions'
import { EXERCISETYPE, ExerciseTypes, NewWorkoutExerciseSet } from '@/helperFiles/helperTypes'
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'

type PreviousSetTextProps = {
    // setIndex: number
    // exerciseSet: NewWorkoutExerciseSet
    // workoutExercisePositionIndex: number
    exerciseTypeId: number
    previousExerciseSet: NewWorkoutExerciseSet | null
    usePrevSetVales: () => void
}

export default function PreviousSetText({ exerciseTypeId, previousExerciseSet, usePrevSetVales }: PreviousSetTextProps) {

    const getPrevSetTextComponent = () => {
        if (previousExerciseSet) {
            switch (ExerciseTypes[exerciseTypeId]) {
                case EXERCISETYPE.BODYWEIGHT:
                    return <Text style={styles.prevWorkoutExerciseSetDataText}>x {previousExerciseSet.reps}</Text>
                case EXERCISETYPE.WEIGHT:
                    return <Text style={styles.prevWorkoutExerciseSetDataText}>{previousExerciseSet.weight}kg x{previousExerciseSet.reps}</Text>
                case EXERCISETYPE.CARDIO:
                    // 1.5km in 10:45
                    return <Text style={styles.prevWorkoutExerciseSetDataText}>{previousExerciseSet.distance}km in {formatTimerTime(previousExerciseSet.time ?? 0)} {previousExerciseSet.cardioProgramId}</Text>
                case EXERCISETYPE.STRETCH:
                    // 10:44
                    return <Text style={styles.prevWorkoutExerciseSetDataText}>{formatTimerTime(previousExerciseSet.time ?? 0)}</Text>
                default:
                    break;
            }
        }

        return <Text style={styles.prevWorkoutExerciseSetDataText}>-</Text>
    }

    return (
        <TouchableNativeFeedback
            onPress={usePrevSetVales}
            background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
            <View>
                {
                    getPrevSetTextComponent()
                }
            </View>
        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    prevWorkoutExerciseSetDataText: {
        width: 75,
        minHeight: 40,
        fontSize: 18,
        color: '#858585ff',
        paddingLeft: 6,
        verticalAlign: 'middle',
        padding: 0,
        margin: 0,
    }
});