import React, {  useEffect, useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { Button, Input, Image} from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import firebase, { db, auth } from '../firebase'

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                navigation.replace('Home')
            }
        })
        return unsubscribe      
    },[])

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitleAlign: 'center',
        })
    },[navigation])
    const signIn = () =>{
        auth.signInWithEmailAndPassword(email, password)
        .catch((error)=>alert(error))
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='height' enabled>
            <StatusBar style='light' />
            <Image 
                source={{
                    uri:'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
                }}
                style={{
                    width:200,
                    height:200
                }}
            />
            <View style={styles.inputContainer}>
                <Input 
                    placeholder='Email'
                    autoFocus
                    type="email"
                    value={email}
                    onChangeText={(text)=> setEmail(text)}
                />
                <Input 
                    placeholder='Password'
                    secureTextEntry
                    type="password"
                    value={password}
                    onChangeText={(text)=> setPassword(text)}
                    onSubmitEditing={signIn}
                />
            </View>
            <Button 
                title='Login'
                containerStyle={styles.loginButton}
                onPress={signIn}
            />
            <Button 
                title='Sign Up'
                containerStyle={styles.signUpButton}
                type='outline'   
                onPress={()=>navigation.navigate('Register')}             
            />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

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
        marginTop: 5       
    },
    loginButton:{
        width: 200,
        marginTop: 10
    },
    signUpButton:{
        width: 200,
        marginTop: 10
    }
})
