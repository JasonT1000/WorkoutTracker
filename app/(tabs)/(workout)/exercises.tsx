import OptionsHeader from '@/components/OptionsHeader';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Exercises() {
    return (
        <SafeAreaView style={styles.main}>
            <OptionsHeader title="Exercises" />

            <View style={styles.body}>
                <View style={styles.searchContainer}>
                    <AntDesign name="search1" size={24} color='#858585ff' />
                    <TextInput
                        style={styles.searchBoxText}
                        placeholder='Search exercises'
                        placeholderTextColor={'#858585ff'}
                        maxLength={33}
                    />
                </View>
                <View>
                    <Text style={styles.containerHeadingtext}>Search buttons</Text>
                </View>
                <View>
                    <Text style={styles.containerHeadingtext}>Exercise list</Text>
                    <View style={styles.exerciseContainer}>
                        <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                        <View style={styles.exerciseTextContainer}>
                            <Text style={styles.exerciseNameText}>Exercise Name</Text>
                            <Text style={styles.exerciseTypeText}>Exercise area</Text>
                        </View>
                        <Text style={styles.exerciseInfoButton}>Info</Text>
                    </View>
                    <View style={styles.exerciseContainer}>
                        <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                        <View style={styles.exerciseTextContainer}>
                            <Text style={styles.exerciseNameText}>Exercise Name</Text>
                            <Text style={styles.exerciseTypeText}>Exercise area</Text>
                        </View>
                        <Text style={styles.exerciseInfoButton}>Info</Text>
                    </View>
                </View>
                <Button
                    title="Add # exercise"
                    color={'#0fb800ff'}
                    onPress={() => Alert.alert('Added exercise/s')}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#353535ff',
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    containerHeadingtext: {
        color: '#b6b6b6ff',
        fontSize: 20,
        paddingBottom: 7,
    },
    searchBoxText: {
        color: '#858585ff',
        fontSize: 18,
    },

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