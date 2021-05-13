import { StatusBar } from 'expo-status-bar'
import React, { useLayoutEffect, useState } from 'react'
import {  KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'
import firebase, { db, auth } from '../firebase'

const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerBackTitle:'Back to Login',
            headerTitleAlign: 'center',
        })
    },[navigation])

    const register = () =>{
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            })
        }).catch(error=>alert(error.message))
    }

    return (
        <KeyboardAvoidingView behavior='height' style={styles.container} enabled>
            <StatusBar style='light'/>
            <Text h4 style={{ marginBottom: 50 }}>
                Create a Signal Account
            </Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder='Full Name'
                    autoFocus
                    type='text'
                    value={name}
                    onChangeText={(text)=>setName(text)}
                />
                <Input
                    placeholder='Email'
                    type='email'
                    value={email}
                    onChangeText={(text)=>setEmail(text)}
                />
                <Input
                    placeholder='Password'
                    secureTextEntry
                    type='password'
                    value={password}
                    onChangeText={(text)=>setPassword(text)}
                />
                <Input
                    placeholder='Profile Image URL (Optional)'
                    type='text'
                    value={imageUrl}
                    onChangeText={(text)=>setImageUrl(text)}
                    onSubmitEditing={register}
                />
            </View>

            <Button
                title='Register'
                onPress={register}
                raised
                containerStyle={styles.button}
            />
            <View style={{height:100}}/>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    inputContainer:{
        width: 300,
    },
    button:{
        width: 200,
        marginTop: 10
    }
})
