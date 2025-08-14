import { bodyArea, exercise, exerciseBodyArea, exerciseSetType, exerciseType, routine, routineExercise, routineExerciseSet, workout, workoutExercise, workoutExerciseSet } from "@/db/schema"
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite"
import AsyncStorage from 'expo-sqlite/kv-store'

export const addData = async (db: ExpoSQLiteDatabase) => {
    const value = AsyncStorage.getItemSync('dbInitialized')
    if (value) {
        console.log('Database already populated. Will not run addData')
        return
    }

    console.log('Populating database with workouts')

    await db.run('PRAGMA foreign_keys = ON;');

    await db.insert(exerciseType).values([
        { type: 'bodyweight' },
        { type: 'weight' },
        { type: 'cardio' },
        { type: 'stretch' }
    ])

    await db.insert(exercise).values([
        { name: 'pullup (bar)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'pullup (bar) weighted', imageUrl: null, exerciseTypeId: 2 },
        { name: 'pullup (rings)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'pullup (rings) weighted', imageUrl: null, exerciseTypeId: 2 },
        { name: 'chinup (bar)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'chinup (bar) weighted', imageUrl: null, exerciseTypeId: 2 },
        { name: 'chinup (rings)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'chinup (rings) weighted', imageUrl: null, exerciseTypeId: 2 },
        { name: 'dip (bar)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'dip (bar) weighted', imageUrl: null, exerciseTypeId: 2 },
        { name: 'dip (rings)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'dip (rings) weighted', imageUrl: null, exerciseTypeId: 2 },
        { name: 'incline bench press (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'incline bench press (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'bench press (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'bench press (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'incline chest fly (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'chest fly (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'deadlift (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'deadlift (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'deadlift (kettlebell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'bent over row (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'bent over row (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'shrug (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'shrug (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'front squat (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'front squat (kettlebell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'squat (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'squat (bodyweight)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'goblet squat', imageUrl: null, exerciseTypeId: 2 },
        { name: 'nordic hamstring curl (bodyweight)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'nordic hamstring curl (weight)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'calf raise (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'calf raise (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'calf raise (bodyweight)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'single calf raise (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'single calf raise (bodyweight)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'lateral raise (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'rear delt fly (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'seated leg curl (machine)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'seated cable row', imageUrl: null, exerciseTypeId: 2 },
        { name: 'hack squat (machine)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'preacher curl (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'tricep pulldown', imageUrl: null, exerciseTypeId: 2 },
        { name: 'leg extension', imageUrl: null, exerciseTypeId: 2 },
        { name: 'seated leg press (incline)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'seated leg press (horizontal)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'bicep curl (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'bicep curl (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'lunges (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'lunges (bodyweight)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'seated row', imageUrl: null, exerciseTypeId: 2 },
        { name: 'military press (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'military press (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'cycling (road bike)', imageUrl: null, exerciseTypeId: 3 },
        { name: 'cycling (stationary bike)', imageUrl: null, exerciseTypeId: 3 },
        { name: 'running', imageUrl: null, exerciseTypeId: 3 },
        { name: 'running (treadmill)', imageUrl: null, exerciseTypeId: 3 },
        { name: 'seated calf raises (machine)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'hanging leg raises', imageUrl: null, exerciseTypeId: 1 },

        { name: 'push up', imageUrl: null, exerciseTypeId: 1 },
        { name: 'push up (rings)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'decline push up', imageUrl: null, exerciseTypeId: 1 },
        { name: 'decline push up (rings)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'diamond push up', imageUrl: null, exerciseTypeId: 1 },
        { name: 'one arm push up (ground)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'one arm push up (rings)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'planche tuck hold', imageUrl: null, exerciseTypeId: 1 },
        { name: 'l-sit hold (hanging)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'l-sit hold (floor)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'front lever', imageUrl: null, exerciseTypeId: 1 },
        { name: 'one arm chinup (assisted)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'one arm chinup', imageUrl: null, exerciseTypeId: 1 },
        { name: 'one arm chinup (negative)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'inverted row (bar)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'inverted row (rings)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'tricep extension (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'upright row (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'upright row (dumbbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'hip thrust (barbell)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'hip thrust (bodyweight)', imageUrl: null, exerciseTypeId: 1 },
        { name: 'pistol squat', imageUrl: null, exerciseTypeId: 1 },
        { name: 'pistol squat (weight)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'sissy squat', imageUrl: null, exerciseTypeId: 1 },
        { name: 'sissy squat (weight)', imageUrl: null, exerciseTypeId: 2 },
        { name: 'turkish get up', imageUrl: null, exerciseTypeId: 2 },
        { name: 'clean and jerk', imageUrl: null, exerciseTypeId: 2 },
        { name: 'power clean', imageUrl: null, exerciseTypeId: 2 },
        { name: 'snatch', imageUrl: null, exerciseTypeId: 2 },
        { name: 'power snatch', imageUrl: null, exerciseTypeId: 2 },
    ])

    await db.insert(bodyArea).values([
        { name: 'traps' },
        { name: 'chestTop' },
        { name: 'chestMain' },
        { name: 'deltoidFront' },
        { name: 'deltoidSide' },
        { name: 'deltoidBack' },
        { name: 'teresmajor' },
        { name: 'teresminor' },
        { name: 'infraspinatus' },
        { name: 'biceps' },
        { name: 'brachialis' },
        { name: 'triceps' },
        { name: 'forearms' },
        { name: 'abs' },
        { name: 'absObliques' },
        { name: 'lats' },
        { name: 'lowerback' },
        { name: 'hamstrings' },
        { name: 'glutes' },
        { name: 'adductor' },
        { name: 'quads' },
        { name: 'calves' },
    ])

    await db.insert(exerciseBodyArea).values([
        // pullups (bar)
        { exerciseId: 1, bodyareaId: 16, muscleIntensity: 4, ismajorbodyarea: true }, //lats
        { exerciseId: 1, bodyareaId: 10, muscleIntensity: 3 },
        { exerciseId: 1, bodyareaId: 9, muscleIntensity: 2 },
        { exerciseId: 1, bodyareaId: 7, muscleIntensity: 2 },
        { exerciseId: 1, bodyareaId: 13, muscleIntensity: 2 },
        // pullups (bar) weighted
        { exerciseId: 2, bodyareaId: 16, muscleIntensity: 5, ismajorbodyarea: true }, //lats
        { exerciseId: 2, bodyareaId: 10, muscleIntensity: 4 },
        { exerciseId: 2, bodyareaId: 9, muscleIntensity: 3 },
        { exerciseId: 2, bodyareaId: 7, muscleIntensity: 3 },
        { exerciseId: 2, bodyareaId: 13, muscleIntensity: 3 },
        // pullups (bar)
        { exerciseId: 3, bodyareaId: 16, muscleIntensity: 4, ismajorbodyarea: true }, //lats
        { exerciseId: 3, bodyareaId: 10, muscleIntensity: 3 },
        { exerciseId: 3, bodyareaId: 9, muscleIntensity: 2 },
        { exerciseId: 3, bodyareaId: 7, muscleIntensity: 2 },
        { exerciseId: 3, bodyareaId: 13, muscleIntensity: 2 },
        // pullups (rings) weighted
        { exerciseId: 4, bodyareaId: 16, muscleIntensity: 5, ismajorbodyarea: true }, //lats
        { exerciseId: 4, bodyareaId: 10, muscleIntensity: 4 },
        { exerciseId: 4, bodyareaId: 9, muscleIntensity: 3 },
        { exerciseId: 4, bodyareaId: 7, muscleIntensity: 3 },
        { exerciseId: 4, bodyareaId: 13, muscleIntensity: 3 },

        // chinups (bar)
        { exerciseId: 5, bodyareaId: 16, muscleIntensity: 4, ismajorbodyarea: true }, //lats
        { exerciseId: 5, bodyareaId: 10, muscleIntensity: 3 },
        { exerciseId: 5, bodyareaId: 9, muscleIntensity: 2 },
        { exerciseId: 5, bodyareaId: 7, muscleIntensity: 2 },
        { exerciseId: 5, bodyareaId: 13, muscleIntensity: 2 },
        // chinups (bar) weighted
        { exerciseId: 6, bodyareaId: 16, muscleIntensity: 5, ismajorbodyarea: true }, //lats
        { exerciseId: 6, bodyareaId: 10, muscleIntensity: 4 },
        { exerciseId: 6, bodyareaId: 9, muscleIntensity: 3 },
        { exerciseId: 6, bodyareaId: 7, muscleIntensity: 3 },
        { exerciseId: 6, bodyareaId: 13, muscleIntensity: 3 },
        // chinups (bar)
        { exerciseId: 7, bodyareaId: 16, muscleIntensity: 4, ismajorbodyarea: true }, //lats
        { exerciseId: 7, bodyareaId: 10, muscleIntensity: 3 },
        { exerciseId: 7, bodyareaId: 9, muscleIntensity: 2 },
        { exerciseId: 7, bodyareaId: 7, muscleIntensity: 2 },
        { exerciseId: 7, bodyareaId: 13, muscleIntensity: 2 },
        // chinups (rings) weighted
        { exerciseId: 8, bodyareaId: 16, muscleIntensity: 5, ismajorbodyarea: true }, //lats
        { exerciseId: 8, bodyareaId: 10, muscleIntensity: 4 },
        { exerciseId: 8, bodyareaId: 9, muscleIntensity: 3 },
        { exerciseId: 8, bodyareaId: 7, muscleIntensity: 3 },
        { exerciseId: 8, bodyareaId: 13, muscleIntensity: 3 },

        // dips (bar)
        { exerciseId: 9, bodyareaId: 3, muscleIntensity: 4, ismajorbodyarea: true }, //chestmain
        { exerciseId: 9, bodyareaId: 12, muscleIntensity: 4, ismajorbodyarea: true }, //triceps
        { exerciseId: 9, bodyareaId: 4, muscleIntensity: 2 }, //deltoids front
        { exerciseId: 9, bodyareaId: 16, muscleIntensity: 2 }, //lats
        // dips (bar) weighted
        { exerciseId: 10, bodyareaId: 3, muscleIntensity: 5, ismajorbodyarea: true }, //chestmain
        { exerciseId: 10, bodyareaId: 12, muscleIntensity: 5, ismajorbodyarea: true }, //triceps
        { exerciseId: 10, bodyareaId: 4, muscleIntensity: 3 }, //deltoids front
        { exerciseId: 10, bodyareaId: 16, muscleIntensity: 3 }, //lats
        // dips (rings)
        { exerciseId: 11, bodyareaId: 3, muscleIntensity: 4, ismajorbodyarea: true }, //chestmain
        { exerciseId: 11, bodyareaId: 12, muscleIntensity: 4, ismajorbodyarea: true }, //triceps
        { exerciseId: 11, bodyareaId: 4, muscleIntensity: 2 }, //deltoids front
        { exerciseId: 11, bodyareaId: 16, muscleIntensity: 2 }, //lats
        // dips (rings) weighted
        { exerciseId: 12, bodyareaId: 3, muscleIntensity: 5, ismajorbodyarea: true }, //chestmain
        { exerciseId: 12, bodyareaId: 12, muscleIntensity: 5, ismajorbodyarea: true }, //triceps
        { exerciseId: 12, bodyareaId: 4, muscleIntensity: 3 }, //deltoids front
        { exerciseId: 12, bodyareaId: 16, muscleIntensity: 3 }, //lats

        // incline bench press (barbell)
        { exerciseId: 13, bodyareaId: 2, muscleIntensity: 4, ismajorbodyarea: true }, //chesttop
        { exerciseId: 13, bodyareaId: 3, muscleIntensity: 2 }, //chestmain
        { exerciseId: 13, bodyareaId: 4, muscleIntensity: 3 }, //deltoids front
        // incline bench press (dumbbell)
        { exerciseId: 14, bodyareaId: 2, muscleIntensity: 5, ismajorbodyarea: true }, //chesttop
        { exerciseId: 14, bodyareaId: 3, muscleIntensity: 3 }, //chestmain
        { exerciseId: 14, bodyareaId: 4, muscleIntensity: 4 }, //deltoids front

        // bench press (barbell)
        { exerciseId: 15, bodyareaId: 2, muscleIntensity: 2 }, //chesttop
        { exerciseId: 15, bodyareaId: 3, muscleIntensity: 4, ismajorbodyarea: true }, //chestmain
        { exerciseId: 15, bodyareaId: 4, muscleIntensity: 3 }, //deltoids front
        // bench press (dumbbell)
        { exerciseId: 16, bodyareaId: 2, muscleIntensity: 3 }, //chesttop
        { exerciseId: 16, bodyareaId: 3, muscleIntensity: 5, ismajorbodyarea: true }, //chestmain
        { exerciseId: 16, bodyareaId: 4, muscleIntensity: 4 }, //deltoids front

        // incline chest fly (dumbbell)
        { exerciseId: 17, bodyareaId: 2, muscleIntensity: 5, ismajorbodyarea: true }, //chesttop
        { exerciseId: 17, bodyareaId: 3, muscleIntensity: 4 }, //chestmain
        { exerciseId: 17, bodyareaId: 4, muscleIntensity: 2 }, //deltoids front
        { exerciseId: 17, bodyareaId: 10, muscleIntensity: 3 }, //biceps
        // chest fly (dumbbell)
        { exerciseId: 18, bodyareaId: 2, muscleIntensity: 4 }, //chesttop
        { exerciseId: 18, bodyareaId: 3, muscleIntensity: 5, ismajorbodyarea: true }, //chestmain
        { exerciseId: 18, bodyareaId: 4, muscleIntensity: 2 }, //deltoids front
        { exerciseId: 18, bodyareaId: 10, muscleIntensity: 3 }, //biceps

        // deadlifts (barbell)
        { exerciseId: 19, bodyareaId: 17, muscleIntensity: 5, ismajorbodyarea: true }, //lowerback
        { exerciseId: 19, bodyareaId: 19, muscleIntensity: 4, ismajorbodyarea: true }, //glutes
        { exerciseId: 19, bodyareaId: 18, muscleIntensity: 4, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 19, bodyareaId: 14, muscleIntensity: 2 }, //abs
        { exerciseId: 19, bodyareaId: 1, muscleIntensity: 2 }, //traps
        // deadlifts (dumbbell)
        { exerciseId: 20, bodyareaId: 17, muscleIntensity: 5, ismajorbodyarea: true }, //lowerback
        { exerciseId: 20, bodyareaId: 19, muscleIntensity: 4, ismajorbodyarea: true }, //glutes
        { exerciseId: 20, bodyareaId: 18, muscleIntensity: 4, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 20, bodyareaId: 14, muscleIntensity: 2 }, //abs
        { exerciseId: 20, bodyareaId: 1, muscleIntensity: 2 }, //traps
        // deadlifts (kettlebell)
        { exerciseId: 21, bodyareaId: 17, muscleIntensity: 5, ismajorbodyarea: true }, //lowerback
        { exerciseId: 21, bodyareaId: 19, muscleIntensity: 4, ismajorbodyarea: true }, //glutes
        { exerciseId: 21, bodyareaId: 18, muscleIntensity: 4, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 21, bodyareaId: 14, muscleIntensity: 2 }, //abs
        { exerciseId: 21, bodyareaId: 1, muscleIntensity: 2 }, //traps

        // bent over row (barbell)
        { exerciseId: 22, bodyareaId: 7, muscleIntensity: 5, ismajorbodyarea: true }, //teresmajor
        { exerciseId: 22, bodyareaId: 8, muscleIntensity: 4, ismajorbodyarea: true }, //teresminor
        { exerciseId: 22, bodyareaId: 9, muscleIntensity: 4, ismajorbodyarea: true }, //infraspinatus
        { exerciseId: 22, bodyareaId: 1, muscleIntensity: 2 }, //traps
        { exerciseId: 22, bodyareaId: 16, muscleIntensity: 2, ismajorbodyarea: true }, //lats
        // bent over row (dumbbell)
        { exerciseId: 23, bodyareaId: 7, muscleIntensity: 5, ismajorbodyarea: true }, //teresmajor
        { exerciseId: 23, bodyareaId: 8, muscleIntensity: 4, ismajorbodyarea: true }, //teresminor
        { exerciseId: 23, bodyareaId: 9, muscleIntensity: 4, ismajorbodyarea: true }, //infraspinatus
        { exerciseId: 23, bodyareaId: 1, muscleIntensity: 2 }, //traps
        { exerciseId: 23, bodyareaId: 16, muscleIntensity: 2, ismajorbodyarea: true }, //lats

        // shrugs (barbell)
        { exerciseId: 24, bodyareaId: 1, muscleIntensity: 5, ismajorbodyarea: true }, //traps
        { exerciseId: 24, bodyareaId: 13, muscleIntensity: 2 }, //forearms
        // shrugs (dumbbell)
        { exerciseId: 25, bodyareaId: 1, muscleIntensity: 5, ismajorbodyarea: true }, //traps
        { exerciseId: 25, bodyareaId: 13, muscleIntensity: 2 }, //forearms

        // front squats (barbell)
        { exerciseId: 26, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 26, bodyareaId: 18, muscleIntensity: 3 }, //hamstrings
        { exerciseId: 26, bodyareaId: 19, muscleIntensity: 3 }, //glutes
        { exerciseId: 26, bodyareaId: 22, muscleIntensity: 2 }, //calves
        { exerciseId: 26, bodyareaId: 20, muscleIntensity: 2 }, //adductor
        { exerciseId: 26, bodyareaId: 14, muscleIntensity: 3 }, //abs
        { exerciseId: 26, bodyareaId: 15, muscleIntensity: 3 }, //obliques
        // front squats (kettlebell)
        { exerciseId: 27, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 27, bodyareaId: 18, muscleIntensity: 3 }, //hamstrings
        { exerciseId: 27, bodyareaId: 19, muscleIntensity: 3 }, //glutes
        { exerciseId: 27, bodyareaId: 22, muscleIntensity: 2 }, //calves
        { exerciseId: 27, bodyareaId: 20, muscleIntensity: 2 }, //adductor
        { exerciseId: 27, bodyareaId: 14, muscleIntensity: 3 }, //abs
        { exerciseId: 27, bodyareaId: 15, muscleIntensity: 3 }, //obliques

        // squats (barbell)
        { exerciseId: 28, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 28, bodyareaId: 18, muscleIntensity: 4 }, //hamstrings
        { exerciseId: 28, bodyareaId: 19, muscleIntensity: 4 }, //glutes
        { exerciseId: 28, bodyareaId: 17, muscleIntensity: 3 }, //lower back
        { exerciseId: 28, bodyareaId: 22, muscleIntensity: 2 }, //calves
        { exerciseId: 28, bodyareaId: 20, muscleIntensity: 2 }, //adductor
        { exerciseId: 28, bodyareaId: 14, muscleIntensity: 2 }, //abs
        { exerciseId: 28, bodyareaId: 15, muscleIntensity: 2 }, //obliques
        // squats (bodyweight)
        { exerciseId: 29, bodyareaId: 21, muscleIntensity: 4, ismajorbodyarea: true }, //quads
        { exerciseId: 29, bodyareaId: 18, muscleIntensity: 3 }, //hamstrings
        { exerciseId: 29, bodyareaId: 19, muscleIntensity: 3 }, //glutes
        { exerciseId: 29, bodyareaId: 22, muscleIntensity: 1 }, //calves
        { exerciseId: 29, bodyareaId: 20, muscleIntensity: 1 }, //adductor
        { exerciseId: 29, bodyareaId: 14, muscleIntensity: 1 }, //abs
        { exerciseId: 29, bodyareaId: 15, muscleIntensity: 1 }, //obliques
        // goblet squats
        { exerciseId: 30, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 30, bodyareaId: 18, muscleIntensity: 4 }, //hamstrings
        { exerciseId: 30, bodyareaId: 19, muscleIntensity: 4 }, //glutes
        { exerciseId: 30, bodyareaId: 22, muscleIntensity: 2 }, //calves
        { exerciseId: 30, bodyareaId: 20, muscleIntensity: 2 }, //adductor
        { exerciseId: 30, bodyareaId: 14, muscleIntensity: 2 }, //abs
        { exerciseId: 30, bodyareaId: 15, muscleIntensity: 2 }, //obliques

        // nordic hamstring curl (bodyweight)
        { exerciseId: 31, bodyareaId: 18, muscleIntensity: 4, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 31, bodyareaId: 19, muscleIntensity: 2 }, //glutes
        { exerciseId: 31, bodyareaId: 22, muscleIntensity: 2 }, //calves
        // nordic hamstring curl (weight)
        { exerciseId: 32, bodyareaId: 18, muscleIntensity: 5, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 32, bodyareaId: 19, muscleIntensity: 2 }, //glutes
        { exerciseId: 32, bodyareaId: 22, muscleIntensity: 2 }, //calves

        // calf raises (barbell)
        { exerciseId: 33, bodyareaId: 22, muscleIntensity: 4, ismajorbodyarea: true }, //calves
        // calf raises (dumbbell)
        { exerciseId: 34, bodyareaId: 22, muscleIntensity: 4, ismajorbodyarea: true }, //calves
        // calf raises (bodyweight)
        { exerciseId: 35, bodyareaId: 22, muscleIntensity: 2, ismajorbodyarea: true }, //calves
        // single calf raises (dumbbell)
        { exerciseId: 36, bodyareaId: 22, muscleIntensity: 5, ismajorbodyarea: true }, //calves
        // single calf raises (bodyweight)
        { exerciseId: 37, bodyareaId: 22, muscleIntensity: 3, ismajorbodyarea: true }, //calves

        // lateral raise (dumbbell)
        { exerciseId: 38, bodyareaId: 4, muscleIntensity: 4 }, //deltoidFront
        { exerciseId: 38, bodyareaId: 5, muscleIntensity: 5, ismajorbodyarea: true }, //deltoidSide
        { exerciseId: 38, bodyareaId: 6, muscleIntensity: 3 }, //deltoidBack
        // rear delt fly (dumbbell)
        { exerciseId: 39, bodyareaId: 4, muscleIntensity: 3 }, //deltoidFront
        { exerciseId: 39, bodyareaId: 5, muscleIntensity: 4, ismajorbodyarea: true }, //deltoidSide
        { exerciseId: 39, bodyareaId: 6, muscleIntensity: 5 }, //deltoidBack

        // seated leg curl (machine)
        { exerciseId: 40, bodyareaId: 18, muscleIntensity: 5, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 40, bodyareaId: 22, muscleIntensity: 3 }, //calves

        // seated cable row
        { exerciseId: 41, bodyareaId: 16, muscleIntensity: 4, ismajorbodyarea: true }, //lats
        { exerciseId: 41, bodyareaId: 1, muscleIntensity: 3, ismajorbodyarea: true }, //traps
        { exerciseId: 41, bodyareaId: 10, muscleIntensity: 3 }, //biceps
        { exerciseId: 41, bodyareaId: 6, muscleIntensity: 3, ismajorbodyarea: true }, //deltoidback
        { exerciseId: 41, bodyareaId: 7, muscleIntensity: 3, ismajorbodyarea: true }, //teresmajor
        { exerciseId: 41, bodyareaId: 8, muscleIntensity: 3, ismajorbodyarea: true }, //teresminor
        { exerciseId: 41, bodyareaId: 9, muscleIntensity: 3, ismajorbodyarea: true }, //infraspinatus

        // hack squat (machine)
        { exerciseId: 42, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 42, bodyareaId: 19, muscleIntensity: 5 }, //glutes
        { exerciseId: 42, bodyareaId: 20, muscleIntensity: 4 }, //adductors

        // preacher curls (barbell)
        { exerciseId: 43, bodyareaId: 10, muscleIntensity: 5, ismajorbodyarea: true }, //bicep

        // tricep pulldown
        { exerciseId: 44, bodyareaId: 12, muscleIntensity: 5, ismajorbodyarea: true }, //tricep

        // leg extension
        { exerciseId: 45, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads

        // seated leg press (incline)
        { exerciseId: 46, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 46, bodyareaId: 19, muscleIntensity: 4 }, //glutes
        { exerciseId: 46, bodyareaId: 18, muscleIntensity: 4 }, //hamstrings
        { exerciseId: 46, bodyareaId: 22, muscleIntensity: 3 }, //calves
        // seated leg press (horizontal)
        { exerciseId: 47, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 47, bodyareaId: 19, muscleIntensity: 4 }, //glutes
        { exerciseId: 47, bodyareaId: 18, muscleIntensity: 4 }, //hamstrings
        { exerciseId: 47, bodyareaId: 22, muscleIntensity: 3 }, //calves

        // bicep curl (dumbbell)
        { exerciseId: 48, bodyareaId: 10, muscleIntensity: 5, ismajorbodyarea: true }, //biceps
        { exerciseId: 48, bodyareaId: 13, muscleIntensity: 3 }, //forearms
        { exerciseId: 48, bodyareaId: 11, muscleIntensity: 3 }, //brachialis
        // bicep curl (barbell)
        { exerciseId: 49, bodyareaId: 10, muscleIntensity: 5, ismajorbodyarea: true }, //biceps
        { exerciseId: 49, bodyareaId: 13, muscleIntensity: 3 }, //forearms
        { exerciseId: 49, bodyareaId: 11, muscleIntensity: 3 }, //brachialis

        // lunges (dumbbell)
        { exerciseId: 50, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 50, bodyareaId: 19, muscleIntensity: 4 }, //glutes
        { exerciseId: 50, bodyareaId: 18, muscleIntensity: 4 }, //hamstrings
        { exerciseId: 50, bodyareaId: 22, muscleIntensity: 4 }, //calves
        // lunges (bodyweight)
        { exerciseId: 51, bodyareaId: 21, muscleIntensity: 4, ismajorbodyarea: true }, //quads
        { exerciseId: 51, bodyareaId: 19, muscleIntensity: 3 }, //glutes
        { exerciseId: 51, bodyareaId: 18, muscleIntensity: 3 }, //hamstrings
        { exerciseId: 51, bodyareaId: 22, muscleIntensity: 3 }, //calves

        // seated row
        { exerciseId: 52, bodyareaId: 16, muscleIntensity: 4 }, //lats
        { exerciseId: 52, bodyareaId: 1, muscleIntensity: 3, ismajorbodyarea: true }, //traps
        { exerciseId: 52, bodyareaId: 10, muscleIntensity: 3 }, //biceps
        { exerciseId: 52, bodyareaId: 6, muscleIntensity: 3, ismajorbodyarea: true }, //deltoidback
        { exerciseId: 52, bodyareaId: 7, muscleIntensity: 3, ismajorbodyarea: true }, //teresmajor
        { exerciseId: 52, bodyareaId: 8, muscleIntensity: 3, ismajorbodyarea: true }, //teresminor
        { exerciseId: 52, bodyareaId: 9, muscleIntensity: 3, ismajorbodyarea: true }, //infraspinatus

        // military press (barbell)
        { exerciseId: 53, bodyareaId: 4, muscleIntensity: 5, ismajorbodyarea: true }, //deltoidfront
        { exerciseId: 53, bodyareaId: 5, muscleIntensity: 5, ismajorbodyarea: true }, //deltoidside
        { exerciseId: 53, bodyareaId: 6, muscleIntensity: 5, ismajorbodyarea: true }, //deltoidback
        { exerciseId: 53, bodyareaId: 10, muscleIntensity: 5, ismajorbodyarea: true }, //triceps
        { exerciseId: 53, bodyareaId: 2, muscleIntensity: 3 }, //chesttop
        { exerciseId: 53, bodyareaId: 1, muscleIntensity: 3 }, //traps
        // military press (dumbbell)
        { exerciseId: 54, bodyareaId: 4, muscleIntensity: 5, ismajorbodyarea: true }, //deltoidfront
        { exerciseId: 54, bodyareaId: 5, muscleIntensity: 5, ismajorbodyarea: true }, //deltoidside
        { exerciseId: 54, bodyareaId: 6, muscleIntensity: 5, ismajorbodyarea: true }, //deltoidback
        { exerciseId: 54, bodyareaId: 10, muscleIntensity: 5, ismajorbodyarea: true }, //triceps
        { exerciseId: 54, bodyareaId: 2, muscleIntensity: 3 }, //chesttop
        { exerciseId: 54, bodyareaId: 1, muscleIntensity: 3 }, //traps

        // cycling (road bike)
        { exerciseId: 55, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 55, bodyareaId: 18, muscleIntensity: 5, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 55, bodyareaId: 19, muscleIntensity: 5, ismajorbodyarea: true }, //glutes
        { exerciseId: 55, bodyareaId: 22, muscleIntensity: 4 }, //calves
        // cycling (stationary bike)
        { exerciseId: 56, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 56, bodyareaId: 18, muscleIntensity: 5, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 56, bodyareaId: 19, muscleIntensity: 5, ismajorbodyarea: true }, //glutes
        { exerciseId: 56, bodyareaId: 22, muscleIntensity: 4 }, //calves

        // running
        { exerciseId: 57, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 57, bodyareaId: 18, muscleIntensity: 5, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 57, bodyareaId: 19, muscleIntensity: 5, ismajorbodyarea: true }, //glutes
        { exerciseId: 57, bodyareaId: 22, muscleIntensity: 4, ismajorbodyarea: true }, //calves
        { exerciseId: 57, bodyareaId: 14, muscleIntensity: 4 }, //abs
        // running (treadmill)
        { exerciseId: 58, bodyareaId: 21, muscleIntensity: 5, ismajorbodyarea: true }, //quads
        { exerciseId: 58, bodyareaId: 18, muscleIntensity: 5, ismajorbodyarea: true }, //hamstrings
        { exerciseId: 58, bodyareaId: 19, muscleIntensity: 5, ismajorbodyarea: true }, //glutes
        { exerciseId: 58, bodyareaId: 22, muscleIntensity: 4, ismajorbodyarea: true }, //calves
        { exerciseId: 58, bodyareaId: 14, muscleIntensity: 4 }, //abs

        // seated calf raises (machine)
        { exerciseId: 59, bodyareaId: 22, muscleIntensity: 4, ismajorbodyarea: true }, //calves

        // hanging leg raises
        { exerciseId: 60, bodyareaId: 14, muscleIntensity: 4, ismajorbodyarea: true }, //abs
        { exerciseId: 60, bodyareaId: 15, muscleIntensity: 4 }, //obliques
        { exerciseId: 60, bodyareaId: 13, muscleIntensity: 3 }, //forearms
    ])

    await db.insert(routine).values([
        { name: 'test routine 1' },
        { name: 'test routine 2' },
    ])

    await db.insert(routineExercise).values([
        // rest routine 1
        { positionIndex: 1, routineId: 1, exerciseId: 3, restTimer: 60 },
        { positionIndex: 2, routineId: 1, exerciseId: 7 },
        { positionIndex: 3, routineId: 1, exerciseId: 18, restTimer: 60 },
        { positionIndex: 4, routineId: 1, exerciseId: 40, restTimer: 60 },
        { positionIndex: 5, routineId: 1, exerciseId: 52 },
        { positionIndex: 6, routineId: 1, exerciseId: 38 },
        // test routine 2
        { positionIndex: 1, routineId: 2, exerciseId: 10, restTimer: 120 },
        { positionIndex: 2, routineId: 2, exerciseId: 13 },
        { positionIndex: 3, routineId: 2, exerciseId: 26 },
        { positionIndex: 4, routineId: 2, exerciseId: 24, restTimer: 120 },
        { positionIndex: 5, routineId: 2, exerciseId: 50 },
        { positionIndex: 6, routineId: 2, exerciseId: 88, restTimer: 120 },
    ])

    await db.insert(exerciseSetType).values([
        { type: 'normal set' },
        { type: 'warm up' },
        { type: 'left' },
        { type: 'right' },
        { type: 'partial reps' },
        { type: 'failure' },
    ])

    await db.insert(routineExerciseSet).values([
        // test routine 1
        { routineExerciseId: 1, exerciseSetTypeId: 1, reps: 16 },
        { routineExerciseId: 1, exerciseSetTypeId: 1, reps: 8 },
        { routineExerciseId: 2, exerciseSetTypeId: 1, reps: 10 },
        { routineExerciseId: 2, exerciseSetTypeId: 1, reps: 6 },
        { routineExerciseId: 3, exerciseSetTypeId: 1, reps: 10, weight: 20 },
        { routineExerciseId: 3, exerciseSetTypeId: 1, reps: 8, weight: 21 },
        { routineExerciseId: 3, exerciseSetTypeId: 1, reps: 7, weight: 21 },
        { routineExerciseId: 3, exerciseSetTypeId: 1, reps: 4, weight: 21 },
        { routineExerciseId: 4, exerciseSetTypeId: 1, reps: 10, weight: 47 },
        { routineExerciseId: 4, exerciseSetTypeId: 1, reps: 10, weight: 61 },
        { routineExerciseId: 4, exerciseSetTypeId: 1, reps: 6, weight: 61 },
        { routineExerciseId: 4, exerciseSetTypeId: 1, reps: 4, weight: 61 },
        { routineExerciseId: 5, exerciseSetTypeId: 1, reps: 10, weight: 56 },
        { routineExerciseId: 5, exerciseSetTypeId: 1, reps: 5, weight: 63 },
        { routineExerciseId: 5, exerciseSetTypeId: 1, reps: 7, weight: 58 },
        { routineExerciseId: 5, exerciseSetTypeId: 1, reps: 4, weight: 58 },
        { routineExerciseId: 6, exerciseSetTypeId: 1, reps: 11, weight: 8 },
        // test routine 2
        { routineExerciseId: 7, exerciseSetTypeId: 1, reps: 10, weight: 10 },
        { routineExerciseId: 7, exerciseSetTypeId: 1, reps: 8, weight: 10 },
        { routineExerciseId: 8, exerciseSetTypeId: 1, reps: 10, weight: 40 },
        { routineExerciseId: 8, exerciseSetTypeId: 1, reps: 6, weight: 40 },
        { routineExerciseId: 9, exerciseSetTypeId: 1, reps: 10, weight: 40 },
        { routineExerciseId: 9, exerciseSetTypeId: 1, reps: 8, weight: 55 },
        { routineExerciseId: 9, exerciseSetTypeId: 1, reps: 7, weight: 55 },
        { routineExerciseId: 9, exerciseSetTypeId: 1, reps: 4, weight: 55 },
        { routineExerciseId: 10, exerciseSetTypeId: 1, reps: 10, weight: 47 },
        { routineExerciseId: 10, exerciseSetTypeId: 1, reps: 10, weight: 61 },
        { routineExerciseId: 10, exerciseSetTypeId: 1, reps: 6, weight: 61 },
        { routineExerciseId: 10, exerciseSetTypeId: 1, reps: 4, weight: 61 },
        { routineExerciseId: 11, exerciseSetTypeId: 1, reps: 10, weight: 56 },
        { routineExerciseId: 11, exerciseSetTypeId: 1, reps: 5, weight: 63 },
        { routineExerciseId: 11, exerciseSetTypeId: 1, reps: 7, weight: 58 },
        { routineExerciseId: 11, exerciseSetTypeId: 1, reps: 4, weight: 58 },
        { routineExerciseId: 12, exerciseSetTypeId: 1, reps: 5, weight: 55 },
    ])



    await db.insert(workout).values([
        // gym progress 01
        { datetime: '2018-05-12T18:30:00.000Z', duration: 60 },
        { datetime: '2018-05-15T18:30:00.000Z', duration: 60 },
    ])

    await db.insert(workoutExercise).values([
        //second from top in txt file
        { positionIndex: 1, workoutId: 1, exerciseId: 9 },
        { positionIndex: 2, workoutId: 1, exerciseId: 28 },
        { positionIndex: 3, workoutId: 1, exerciseId: 15 },
        { positionIndex: 4, workoutId: 1, exerciseId: 42 },
        { positionIndex: 5, workoutId: 1, exerciseId: 43 },
        { positionIndex: 6, workoutId: 1, exerciseId: 44 },
        { positionIndex: 7, workoutId: 1, exerciseId: 45 },
        { positionIndex: 8, workoutId: 1, exerciseId: 46 },
        { positionIndex: 9, workoutId: 1, exerciseId: 59 },
        //first from top in txt file
        { positionIndex: 1, workoutId: 2, exerciseId: 1 },
        { positionIndex: 2, workoutId: 2, exerciseId: 5 },
        { positionIndex: 3, workoutId: 2, exerciseId: 19 },
        { positionIndex: 4, workoutId: 2, exerciseId: 40 },
        { positionIndex: 5, workoutId: 2, exerciseId: 52 },
        { positionIndex: 6, workoutId: 2, exerciseId: 59 },
    ])

    await db.insert(workoutExerciseSet).values([
        // second from top in txt file
        { workoutExerciseId: 1, exerciseSetTypeId: 1, reps: 16 },
        { workoutExerciseId: 1, exerciseSetTypeId: 1, reps: 10 },
        { workoutExerciseId: 1, exerciseSetTypeId: 1, reps: 8 },
        { workoutExerciseId: 2, exerciseSetTypeId: 1, reps: 10, weight: 20 },
        { workoutExerciseId: 2, exerciseSetTypeId: 1, reps: 8, weight: 35 },
        { workoutExerciseId: 2, exerciseSetTypeId: 1, reps: 7, weight: 35 },
        { workoutExerciseId: 2, exerciseSetTypeId: 1, reps: 6, weight: 35 },
        { workoutExerciseId: 2, exerciseSetTypeId: 1, reps: 4, weight: 35 },
        { workoutExerciseId: 3, exerciseSetTypeId: 1, reps: 10, weight: 20 },
        { workoutExerciseId: 3, exerciseSetTypeId: 1, reps: 9, weight: 32.5 },
        { workoutExerciseId: 3, exerciseSetTypeId: 1, reps: 7, weight: 32.5 },
        { workoutExerciseId: 3, exerciseSetTypeId: 1, reps: 5, weight: 32.5 },
        { workoutExerciseId: 3, exerciseSetTypeId: 1, reps: 4, weight: 32.5 },
        { workoutExerciseId: 4, exerciseSetTypeId: 1, reps: 10, weight: 25 },
        { workoutExerciseId: 4, exerciseSetTypeId: 1, reps: 9, weight: 25 },
        { workoutExerciseId: 4, exerciseSetTypeId: 1, reps: 7, weight: 25 },
        { workoutExerciseId: 5, exerciseSetTypeId: 1, reps: 5, weight: 20 },
        { workoutExerciseId: 5, exerciseSetTypeId: 1, reps: 3, weight: 18 },
        { workoutExerciseId: 5, exerciseSetTypeId: 1, reps: 1, weight: 18 },
        { workoutExerciseId: 6, exerciseSetTypeId: 1, reps: 5, weight: 50 },
        { workoutExerciseId: 6, exerciseSetTypeId: 1, reps: 8, weight: 50 },
        { workoutExerciseId: 6, exerciseSetTypeId: 1, reps: 7, weight: 50 },
        { workoutExerciseId: 7, exerciseSetTypeId: 1, reps: 10, weight: 40 },
        { workoutExerciseId: 7, exerciseSetTypeId: 1, reps: 10, weight: 75 },
        { workoutExerciseId: 7, exerciseSetTypeId: 1, reps: 8, weight: 75 },
        { workoutExerciseId: 7, exerciseSetTypeId: 1, reps: 7, weight: 75 },
        { workoutExerciseId: 8, exerciseSetTypeId: 1, reps: 4, weight: 95 },
        { workoutExerciseId: 8, exerciseSetTypeId: 1, reps: 3, weight: 95 },
        { workoutExerciseId: 8, exerciseSetTypeId: 1, reps: 2, weight: 95 },
        { workoutExerciseId: 9, exerciseSetTypeId: 1, reps: 18, weight: 115 },
        { workoutExerciseId: 9, exerciseSetTypeId: 1, reps: 15, weight: 115 },
        //first from top in txt file
        { workoutExerciseId: 10, exerciseSetTypeId: 1, reps: 16 },
        { workoutExerciseId: 10, exerciseSetTypeId: 1, reps: 8 },
        { workoutExerciseId: 11, exerciseSetTypeId: 1, reps: 10 },
        { workoutExerciseId: 11, exerciseSetTypeId: 1, reps: 6 },
        { workoutExerciseId: 12, exerciseSetTypeId: 1, reps: 10, weight: 40 },
        { workoutExerciseId: 12, exerciseSetTypeId: 1, reps: 8, weight: 55 },
        { workoutExerciseId: 12, exerciseSetTypeId: 1, reps: 7, weight: 55 },
        { workoutExerciseId: 12, exerciseSetTypeId: 1, reps: 4, weight: 55 },
        { workoutExerciseId: 13, exerciseSetTypeId: 1, reps: 10, weight: 47 },
        { workoutExerciseId: 13, exerciseSetTypeId: 1, reps: 10, weight: 61 },
        { workoutExerciseId: 13, exerciseSetTypeId: 1, reps: 6, weight: 61 },
        { workoutExerciseId: 13, exerciseSetTypeId: 1, reps: 4, weight: 61 },
        { workoutExerciseId: 14, exerciseSetTypeId: 1, reps: 10, weight: 56 },
        { workoutExerciseId: 14, exerciseSetTypeId: 1, reps: 5, weight: 63 },
        { workoutExerciseId: 14, exerciseSetTypeId: 1, reps: 7, weight: 58 },
        { workoutExerciseId: 14, exerciseSetTypeId: 1, reps: 4, weight: 58 },
        { workoutExerciseId: 15, exerciseSetTypeId: 1, reps: 20, weight: 55 },
    ])

    console.log('FINISHED Populating database with workouts')

    AsyncStorage.setItemSync('dbInitialized', 'true')
}