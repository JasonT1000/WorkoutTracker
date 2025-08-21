import { NewRoutineExercise, NewRoutineExerciseSet } from "@/functions/helperTypes";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type State = {
    routineExercises: NewRoutineExercise[]
}

export type Action =
    | { type: 'ADD_NEWROUTINEEXERCISE'; payload: NewRoutineExercise[] }
    | { type: 'REPLACE_NEWROUTINEEXERCISES'; payload: NewRoutineExercise[] }
    | { type: 'REMOVE_NEWROUTINEEXERCISE'; payload: number }
    | { type: 'ADD_NEWROUTINEEXERCISESET'; payload: { newRoutineExerciseIndex: number, newExerciseSet: NewRoutineExerciseSet } }
    | { type: 'UPDATE_NEWROUTINEEXERCISESET'; payload: { newRoutineExerciseIndex: number, setIndex: number, field: keyof NewRoutineExerciseSet, value: number | Float } }
    | { type: 'REMOVE_NEWROUTINEEXERCISESET'; payload: { newRoutineExerciseIndex: number, setIndex: number } }
    | { type: 'CLEAR_NEWROUTINEEXERCISES' };

export const initialState: State = {
    routineExercises: [],
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_NEWROUTINEEXERCISE":
            return { ...state, routineExercises: [...state.routineExercises, ...action.payload] }
        case "REPLACE_NEWROUTINEEXERCISES":
            return { routineExercises: [...action.payload] }
        case "REMOVE_NEWROUTINEEXERCISE":
            // Add functionality
            return state
        case "ADD_NEWROUTINEEXERCISESET":
            // Add functionality
            return { routineExercises: addExerciseSet(state, action.payload.newRoutineExerciseIndex, action.payload.newExerciseSet) }
        case "UPDATE_NEWROUTINEEXERCISESET":
            // Add functionality
            return { routineExercises: updateExerciseSet(state, action.payload.newRoutineExerciseIndex, action.payload.setIndex, action.payload.field, action.payload.value) }
        case "REMOVE_NEWROUTINEEXERCISESET":
            // Add functionality
            return { routineExercises: removeExerciseSet(state, action.payload.newRoutineExerciseIndex, action.payload.setIndex) }
        case "CLEAR_NEWROUTINEEXERCISES":
            return { ...state, routineExercises: [] }
        default:
            return state;
    }
}

const addExerciseSet = (state: State, newRoutineExerciseIndex: number, newExerciseSet: NewRoutineExerciseSet): NewRoutineExercise[] => {
    const routineExerciseIndex = state.routineExercises.findIndex(re => re.positionIndex === newRoutineExerciseIndex)

    if (routineExerciseIndex >= 0) {
        let newStateRoutineExercises = [...state.routineExercises]
        newStateRoutineExercises[routineExerciseIndex].routineExerciseSets.push(newExerciseSet)

        return newStateRoutineExercises
    }

    return state.routineExercises
}

const updateExerciseSet = (state: State, newRoutineExerciseIndex: number, setIndex: number, field: keyof NewRoutineExerciseSet, value: number | Float): NewRoutineExercise[] => {
    const newRoutineExercises = state.routineExercises.map(routineExercise => {
        if (routineExercise.positionIndex === newRoutineExerciseIndex) {
            const newExerciseSets = routineExercise.routineExerciseSets.map((exerciseSet, index) =>
                index === setIndex ? { ...exerciseSet, [field]: value } : exerciseSet
            );
            return { ...routineExercise, routineExerciseSets: newExerciseSets };
        }
        return routineExercise;
    });

    return newRoutineExercises;
}

const removeExerciseSet = (state: State, newRoutineExerciseIndex: number, setIndex: number): NewRoutineExercise[] => {
    const newRoutineExercises = state.routineExercises.map(routineExercise => {
        if (routineExercise.positionIndex === newRoutineExerciseIndex) {
            const exerciseSets = routineExercise.routineExerciseSets.filter((set, index) => index !== setIndex)

            return { ...routineExercise, routineExerciseSets: exerciseSets }
        }
        return routineExercise
    })
    return newRoutineExercises;
}

