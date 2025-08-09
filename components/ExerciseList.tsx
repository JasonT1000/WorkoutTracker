import * as schema from '@/db/schema';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import ExerciseListItem from './ExerciseListItem';


export default function ExerciseList() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    // const [exercises, setExercises] = useState<schema.Exercise[]>([])
    const [exercisesWithBodyAreas, setExercisesWithBodyAreas] = useState<ExerciseWithBodyAreas[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {

            const exercises = await drizzleDb.query.exercise.findMany();
            if (exercises) {
                const exerciseBodyAreas = await drizzleDb.select({
                    exerciseId: schema.exercise.id,
                    exerciseType: schema.exerciseType.type,
                    bodyArea: schema.bodyArea.name
                })
                    .from(schema.exercise)
                    .innerJoin(schema.exerciseType, eq(schema.exercise.exerciseTypeId, schema.exerciseType.id))
                    .leftJoin(schema.exerciseBodyArea, eq(schema.exercise.id, schema.exerciseBodyArea.exerciseId))
                    .where(sql`${schema.exerciseBodyArea.ismajorbodyarea} = '1'`)
                    .innerJoin(schema.bodyArea, eq(schema.exerciseBodyArea.bodyareaId, schema.bodyArea.id))

                console.log("---------------------- exerciseBodyAreas ------------------------------")
                console.log(exerciseBodyAreas)

                if (exerciseBodyAreas) {
                    const exerciseBodyAreasGrouped = exercises.reduce((acc, exercise) => {
                        const bodyAreas = exerciseBodyAreas.filter(eba => eba.exerciseId === exercise.id)
                        acc.push({ ...exercise, bodyAreas })

                        return acc;
                    }, [] as ExerciseWithBodyAreas[])
                    // }, {} as Record<number, { exerciseId: number, exerciseType: string, bodyArea: string }[]>);

                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                    console.log(exerciseBodyAreasGrouped)

                    setExercisesWithBodyAreas(exerciseBodyAreasGrouped)
                    setIsLoading(false)
                }
            }

            // const exercises = await drizzleDb.select({
            //     ...getTableColumns(schema.exercise),
            //     exerciseType: schema.exerciseType.type,
            //     bodyArea: schema.bodyArea.name,
            // })
            //     .from(schema.exercise)
            //     .innerJoin(schema.exerciseType, eq(schema.exercise.exerciseTypeId, schema.exerciseType.id))
            //     .leftJoin(schema.exerciseBodyArea, eq(schema.exercise.id, schema.exerciseBodyArea.exerciseId))
            //     .where(sql`${schema.exerciseBodyArea.ismajorbodyarea} = '1'`)
            //     .innerJoin(schema.bodyArea, eq(schema.exerciseBodyArea.bodyareaId, schema.bodyArea.id))

            // if (exercises) {
            //     console.log(exercises)

            //     // const exercisesWithBodyAreasFiltered = exercises.reduce((acc, exercise) => {
            //     //     acc[exercise.id] = exercises.filter(e => e.id === exercise.id);
            //     //     return acc;
            //     // }, {} as Record<number, { id: number, name: string, imageUrl: string | null, exerciseTypeId: number, exerciseType: string, bodyArea: string }[]>);

            //     // const flatListData = Object.entries(exercisesWithBodyAreasFiltered).map(([id, exercises]) => ({
            //     //     id: Number(id),
            //     //     exercises
            //     // }));


            //     const groupedArray = exercises.reduce((acc, exercise) => {
            //         const existingExercise = acc.find(e => e.id === exercise.id);

            //         if (existingExercise) {
            //             existingExercise.bodyAreas.push({bodyArea: exercise.bodyArea, exerciseType: exercise.exerciseType});
            //         } else {
            //             acc.push({
            //                 id: exercise.id,
            //                 // need to add fields. Can i just add the exercise instead?
            //                 exercises: [exercise]
            //             });
            //         }

            //         return acc;
            //     }, [] as ExerciseWithBodyAreas[]);


            //     // const uniqueExercises = Array.from(
            //     //     new Map(Object.values(exercisesWithBodyAreas).map((obj: any) => [JSON.stringify(obj), obj])).values()
            //     // )

            //     console.log("----------------------------------------------------")
            //     // const keys = Object.keys(exercisesWithBodyAreasFiltered)
            //     // console.log(exercises)
            //     // Object.values(exercisesWithBodyAreasFiltered).forEach(element => {
            //     //     console.log(element)
            //     // });

            // console.log(exercisesWithBodyAreas)
            // setExercises(exercises)
            // setExercisesWithBodyAreas(groupedArray)
            // setIsLoading(false)
            // }
        }

        load()

    }, []);

    if (isLoading) return <ActivityIndicator />

    return (
        <View>
            <Text style={styles.containerHeadingtext}>Exercise list</Text>
            <FlatList
                data={exercisesWithBodyAreas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ExerciseListItem exerciseInfo={item} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    // main: {
    //     flexDirection: 'column',
    //     flex: 1,
    //     // margin: 15,
    // },
    // body: {
    //     margin: 15,
    // },
    // searchContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: '#353535ff',
    //     borderRadius: 10,
    //     paddingHorizontal: 8,
    // },
    containerHeadingtext: {
        color: '#b6b6b6ff',
        fontSize: 20,
        paddingBottom: 7,
    },
    // searchBoxText: {
    //     color: '#858585ff',
    //     fontSize: 18,
    // },

    exerciseContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#585858ff',
        paddingVertical: 10,
    },
    exerciseImage: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    exerciseTextContainer: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    exerciseNameText: {
        color: '#ffffffff',
        fontSize: 20,
    },
    exerciseTypeText: {
        fontSize: 18,
        color: '#858585ff',
    },
    exerciseInfoButton: {
        fontSize: 18,
        color: '#858585ff',
        verticalAlign: 'middle'
    },
    // // containerSubHeadingtext: {
    // //   color: '#b6b6b6ff',
    // //   fontSize: 20,
    // //   paddingBottom: 7,
    // // },
    // // text: {
    // //   color: 'white',
    // //   fontSize: 24,
    // // },
    // // routineTextHeading: {
    // //   color: 'white',
    // //   fontSize: 24,
    // // },
    // // routineText: {
    // //   color: '#b6b6b6ff',
    // //   fontSize: 18,
    // // },

    // topSectionContainer: {
    //     borderWidth: 1,
    //     borderColor: 'yellow',
    //     paddingBottom: 10,
    // },
});