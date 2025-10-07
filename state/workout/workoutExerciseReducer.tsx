import { NewWorkoutExercise, NewWorkoutExerciseSet, NewWorkoutExerciseSetKey } from "@/helperFiles/helperTypes";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type State = {
    routineId: number,
    datetime: string,
    duration: number,
    notes: string,
    workoutExercises: NewWorkoutExercise[],
    startDatetime: number
}

export type Action =
    | { type: 'UPDATE_ROUTINEID'; payload: number }
    | { type: 'UPDATE_WORKOUTDATE'; }
    | { type: 'UPDATE_WORKOUTDURATION'; payload: number }
    | { type: 'UPDATE_WORKOUTNOTES'; payload: { exerciseIndex: number, notes: string } }
    | { type: 'ADD_NEWWORKOUTEXERCISES'; payload: NewWorkoutExercise[] }
    | { type: 'REPLACE_NEWWORKOUTEXERCISES'; payload: NewWorkoutExercise[] }
    | { type: 'REMOVE_NEWWORKOUTEXERCISE'; payload: { exerciseIndex: number } }
    | { type: 'ADD_NEWWORKOUTEXERCISESET'; payload: { newWorkoutExerciseIndex: number, newExerciseSet: NewWorkoutExerciseSet } }
    | { type: 'SET_NEWWORKOUTEXERCISESET'; payload: { newWorkoutExerciseIndex: number, setIndex: number, exerciseSet: NewWorkoutExerciseSet } }
    | { type: 'UPDATE_NEWWORKOUTEXERCISESET'; payload: { newWorkoutExerciseIndex: number, setIndex: number, field: keyof NewWorkoutExerciseSet, value: number | Float | boolean } }
    | { type: 'REMOVE_NEWWORKOUTEXERCISESET'; payload: { newWorkoutExerciseIndex: number, setIndex: number } }
    | { type: 'CLEAR_NEWWORKOUTEXERCISES' }
    | { type: 'RESET_NEWWORKOUT' }
    | { type: 'UPDATE_WORKOUTSTARTDATETIME' };

export const initialState: State = {
    routineId: -1,
    datetime: new Date().toISOString(),
    duration: 0,
    notes: '',
    workoutExercises: [],
    startDatetime: -1
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "UPDATE_ROUTINEID":
            return { ...state, routineId: action.payload }
        case "UPDATE_WORKOUTDATE":
            return { ...state, datetime: new Date().toISOString() }
        case "UPDATE_WORKOUTDURATION":
            return { ...state, duration: action.payload }
        case "UPDATE_WORKOUTNOTES":
            return { ...state, workoutExercises: updateExerciseNotes(state, action.payload.exerciseIndex, action.payload.notes) }
        case "ADD_NEWWORKOUTEXERCISES":
            return { ...state, workoutExercises: [...state.workoutExercises, ...action.payload] }
        case "REPLACE_NEWWORKOUTEXERCISES":
            return { ...state, workoutExercises: [...action.payload] }
        case "REMOVE_NEWWORKOUTEXERCISE":
            return { ...state, workoutExercises: removeExercise(state, action.payload.exerciseIndex) }
        case "ADD_NEWWORKOUTEXERCISESET":
            return { ...state, workoutExercises: addExerciseSet(state, action.payload.newWorkoutExerciseIndex, action.payload.newExerciseSet) }
        case "SET_NEWWORKOUTEXERCISESET":
            return { ...state, workoutExercises: setExerciseSet(state, action.payload.newWorkoutExerciseIndex, action.payload.setIndex, action.payload.exerciseSet) }
        case "UPDATE_NEWWORKOUTEXERCISESET":
            return { ...state, workoutExercises: updateExerciseSet(state, action.payload.newWorkoutExerciseIndex, action.payload.setIndex, action.payload.field, action.payload.value) }
        case "REMOVE_NEWWORKOUTEXERCISESET":
            return { ...state, workoutExercises: removeExerciseSet(state, action.payload.newWorkoutExerciseIndex, action.payload.setIndex) }
        case "CLEAR_NEWWORKOUTEXERCISES":
            return { ...state, workoutExercises: [] }
        case "RESET_NEWWORKOUT":
            return { routineId: -1, datetime: '', duration: 0, notes: '', workoutExercises: [], startDatetime: -1 }
        case "UPDATE_WORKOUTSTARTDATETIME":
            return { ...state, startDatetime: Date.now() }
        default:
            return state;
    }
}

const updateExerciseNotes = (state: State, exerciseIndex: number, newNotes: string): NewWorkoutExercise[] => {
    let newStateWorkoutExercises = [...state.workoutExercises]
    newStateWorkoutExercises[exerciseIndex].notes = newNotes

    return newStateWorkoutExercises
}

const removeExercise = (state: State, exerciseIndex: number): NewWorkoutExercise[] => {
    let newStateWorkoutExercises = [...state.workoutExercises]
    newStateWorkoutExercises = newStateWorkoutExercises.filter(exercise => exercise.positionIndex !== exerciseIndex)

    return newStateWorkoutExercises.map((workoutExercise: NewWorkoutExercise, index: number) => { return { ...workoutExercise, positionIndex: index } })
}

const addExerciseSet = (state: State, newWorkoutExerciseIndex: number, newExerciseSet: NewWorkoutExerciseSet): NewWorkoutExercise[] => {
    // const workoutExerciseIndex = state.workoutExercises.findIndex(re => re.positionIndex === newWorkoutExerciseIndex)

    // if (workoutExerciseIndex >= 0) {
    let newStateWorkoutExercises = [...state.workoutExercises]
    newStateWorkoutExercises[newWorkoutExerciseIndex].workoutExerciseSets.push(newExerciseSet)

    return newStateWorkoutExercises
    // }

    // return state.workoutExercises
}

const setExerciseSet = (state: State, newWorkoutExerciseIndex: number, setIndex: number, newExerciseSet: NewWorkoutExerciseSet): NewWorkoutExercise[] => {
    console.log('newExerciseSet')
    console.log(newExerciseSet)
    const newWorkoutExercises = state.workoutExercises.map(workoutExercise => {
        if (workoutExercise.positionIndex === newWorkoutExerciseIndex) {
            const newExerciseSets = workoutExercise.workoutExerciseSets.map((exerciseSet, index) => {
                if (index === setIndex) {
                    return { ...newExerciseSet }
                }

                return exerciseSet
            });

            return { ...workoutExercise, workoutExerciseSets: newExerciseSets };
        }

        return workoutExercise;
    });

    return newWorkoutExercises;
}

const updateExerciseSet = (state: State, newWorkoutExerciseIndex: number, setIndex: number, field: keyof NewWorkoutExerciseSet, value: number | Float | boolean): NewWorkoutExercise[] => {
    const newWorkoutExercises = state.workoutExercises.map(workoutExercise => {
        if (workoutExercise.positionIndex === newWorkoutExerciseIndex) {
            const newExerciseSets = workoutExercise.workoutExerciseSets.map((exerciseSet, index) => {
                if (index === setIndex) {
                    if (field === NewWorkoutExerciseSetKey.CARDIOPROGRAMID && value as number < 0) {
                        const { [field]: _, ...filteredExerciseSet } = exerciseSet
                        return filteredExerciseSet
                    }

                    return { ...exerciseSet, [field]: value }
                }

                return exerciseSet
            }
            );
            return { ...workoutExercise, workoutExerciseSets: newExerciseSets };
        }
        return workoutExercise;
    });

    return newWorkoutExercises;
}

const removeExerciseSet = (state: State, newWorkoutExerciseIndex: number, setIndex: number): NewWorkoutExercise[] => {
    const newWorkoutExercises = state.workoutExercises.map(workoutExercise => {
        if (workoutExercise.positionIndex === newWorkoutExerciseIndex) {
            const exerciseSets = workoutExercise.workoutExerciseSets.filter((set, index) => index !== setIndex)

            return { ...workoutExercise, workoutExerciseSets: exerciseSets }
        }
        return workoutExercise
    })
    return newWorkoutExercises;
}

