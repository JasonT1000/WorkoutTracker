import { relations, sql } from "drizzle-orm";
import { check, int, primaryKey, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profile = sqliteTable("profile", {
    id: int().primaryKey({ autoIncrement: true }),
    username: text(),
    theme: text({ enum: ['system', 'light', 'dark'] }).default('system').notNull(),
    keepawake: int({ mode: 'boolean' }).default(false),
    firstdayofweek: text({ enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] }).default('mon').notNull(),
    timerSound: int('timer_sound').default(0).notNull(),
    timerVolume: int('timer_volume').default(0).notNull(),
    defaultResttimer: int('default_resttimer').default(0).notNull(),
});

export const measurements = sqliteTable("measurements", {
    id: int().primaryKey({ autoIncrement: true }),
    datetime: text().notNull().unique(),
    bodyweight: real().notNull()
});

export const routine = sqliteTable("routine", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique()
});

export const workout = sqliteTable("workout", {
    id: int().primaryKey({ autoIncrement: true }),
    routineId: int('routine_id').references(() => routine.id, { onDelete: 'set null' }),
    datetime: text().notNull(),
    duration: int().notNull(),
    notes: text()
});

export const exerciseType = sqliteTable("exercise_type", {
    id: int().primaryKey({ autoIncrement: true }),
    type: text().notNull().unique()
});

export const exercise = sqliteTable("exercise", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
    imageUrl: text('image_url'),
    exerciseTypeId: int('exercise_type_id')
        .references(() => exerciseType.id, { onDelete: 'restrict' })
        .notNull()
});

export const routineExerciseSet = sqliteTable("routine_exercise_set", {
    id: int().primaryKey({ autoIncrement: true }),
    routineExerciseId: int('routine_exercise_id')
        .references(() => routineExercise.id, { onDelete: 'cascade' })
        .notNull(),
    reps: int().default(0).notNull(),
    weight: real(),
    distance: real(),
    time: int(),
});

export const workoutExerciseSet = sqliteTable("workout_exercise_set", {
    id: int().primaryKey({ autoIncrement: true }),
    workoutExerciseId: int('workout_exercise_id')
        .references(() => workoutExercise.id, { onDelete: 'cascade' })
        .notNull(),
    reps: int().default(0).notNull(),
    weight: real(),
    distance: real(),
    time: int(),
    heartRate: int('heart_rate')
});

export const routineExercise = sqliteTable("routine_exercise", {
    id: int().primaryKey({ autoIncrement: true }),
    positionIndex: int('position_index').notNull(),
    routineId: int('routine_id')
        .references(() => routine.id, { onDelete: 'cascade' })
        .notNull(),
    exerciseId: int('exercise_id')
        .references(() => exercise.id, { onDelete: 'restrict' })
        .notNull(),
    restTimer: int('rest_timer').notNull().default(0),
    notes: text(),
});

export const workoutExercise = sqliteTable("workout_exercise", {
    id: int().primaryKey({ autoIncrement: true }),
    positionIndex: int('position_index').notNull(),
    workoutId: int('workout_id')
        .references(() => workout.id, { onDelete: 'cascade' })
        .notNull(),
    exerciseId: int('exercise_id')
        .references(() => exercise.id, { onDelete: 'restrict' })
        .notNull(),
    restTimer: int('rest_timer').notNull().default(0),
    notes: text(),
});

export const bodyArea = sqliteTable("bodyarea", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique()
});

export const exerciseBodyArea = sqliteTable("exercise_bodyarea", {
    exerciseId: int('exercise_id')
        .references(() => exercise.id, { onDelete: 'cascade' })
        .notNull(),
    bodyareaId: int('bodyarea_id')
        .references(() => bodyArea.id, { onDelete: 'restrict' })
        .notNull(),
    muscleIntensity: int('muscle_intensity').default(1).notNull(),
    ismajorbodyarea: int({ mode: 'boolean' }).default(false)
},
    (table) => [
        primaryKey({ columns: [table.exerciseId, table.bodyareaId] }),
        check("muscleIntensity_check1", sql`${table.muscleIntensity} > 0 AND ${table.muscleIntensity} < 6`)
    ]
);

// --------------------------------------- RELATIONS ---------------------------------------

export const routineRelations = relations(routine, ({ many }) => ({
    routineExercise: many(routineExercise),
    workout: many(workout),
}))

export const workoutRelations = relations(workout, ({ one, many }) => ({
    routine: one(routine, {
        fields: [workout.routineId],
        references: [routine.id]
    }),
    workoutExercise: many(workoutExercise),
}))

export const routineExerciseRelations = relations(routineExercise, ({ one, many }) => ({
    routine: one(routine, {
        fields: [routineExercise.routineId],
        references: [routine.id],
    }),
    exercise: one(exercise, {
        fields: [routineExercise.exerciseId],
        references: [exercise.id]
    }),
    routineExerciseSet: many(routineExerciseSet)
}));

export const routineExerciseSetRelations = relations(routineExerciseSet, ({ one }) => ({
    routineExercise: one(routineExercise, {
        fields: [routineExerciseSet.routineExerciseId],
        references: [routineExercise.id],
    })
}));

export const workoutExerciseRelations = relations(workoutExercise, ({ one, many }) => ({
    workout: one(workout, {
        fields: [workoutExercise.workoutId],
        references: [workout.id],
    }),
    exercise: one(exercise, {
        fields: [workoutExercise.exerciseId],
        references: [exercise.id]
    }),
    workoutExerciseSet: many(workoutExerciseSet)
}));

export const workoutExerciseSetRelations = relations(workoutExerciseSet, ({ one }) => ({
    workoutExercise: one(workoutExercise, {
        fields: [workoutExerciseSet.workoutExerciseId],
        references: [workoutExercise.id],
    })
}));

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
    routineExercise: many(routineExercise),
    workoutExercise: many(workoutExercise),
    exerciseBodyArea: many(exerciseBodyArea),
    exerciseType: one(exerciseType, {
        fields: [exercise.exerciseTypeId],
        references: [exerciseType.id]
    })
}))

export const exerciseBodyAreaRelations = relations(exerciseBodyArea, ({ one }) => ({
    exercise: one(exercise, {
        fields: [exerciseBodyArea.exerciseId],
        references: [exercise.id],
    }),
    bodyArea: one(bodyArea, {
        fields: [exerciseBodyArea.bodyareaId],
        references: [bodyArea.id]
    })
}));

export const bodyAreaRelations = relations(bodyArea, ({ many }) => ({
    exerciseBodyArea: many(exerciseBodyArea),
}))

export const exerciseTypeRelations = relations(exerciseType, ({ many }) => ({
    exercise: many(exercise)
}))