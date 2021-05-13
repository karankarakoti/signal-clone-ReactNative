import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, StatusBar, KeyboardAvoidingView, Platform, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native'
import firebase, { auth, db }  from '../firebase'

const ChatScreen = ({ navigation, route }) => {

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])

    const scrollViewRef = useRef()

    const sendMessage=()=>{
        Keyboard.dismiss()
        db.collection('chats')
            .doc(route.params.id)
            .collection('messages')
            .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            })
            setInput('')
    }

    useEffect(()=>{
        scrollViewRef.current.scrollToEnd({animated: true})
    },[messages])

    useLayoutEffect(()=>{
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View
                    style={{
                        flexDirection:"row",
                        alignItems:"center"
                    }}
                >
                    <Avatar
                        rounded
                        source={{
                            uri:
                                messages[messages.length-1]?.data.photoURL
                                ||
                                'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png'
                        }}
                    />
                    <Text
                        style={{
                            color: 'white',
                            marginLeft: 10,
                            fontWeight:'700'
                        }}
                    >
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerLeft: ()=>(
                <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={navigation.goBack}
                >
                    <AntDesign name='arrowleft' size={24} color='white' />
                </TouchableOpacity>
            ),
            headerRight: () =>(
                <View
                    style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        width: 80,
                        marginRight: 20
                    }}
                >
                    <TouchableOpacity>
                        <FontAwesome 
                            name='video-camera'
                            size={24}
                            color='white'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons
                            name='call'
                            size={24}
                            color='white' 
                        />
                    </TouchableOpacity>
                </View>
            )
        })
    },[navigation, messages])

    useLayoutEffect(()=>{
        const unsubscribe = db.collection('chats')
                                .doc(route.params.id)
                                .collection('messages')
                                .orderBy('timestamp','asc')
                                .onSnapshot((snapshot)=>setMessages(
                                    snapshot.docs.map(doc=>({
                                        id: doc.id,
                                        data: doc.data()
                                    }))
                                ))
        return unsubscribe
    },[route])


    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: 'white',                
            }}        
        >
            <StatusBar style='light'/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={90}                
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                    <ScrollView contentContainerStyle={{
                        paddingTop:15,
                        marginLeft: 4,
                        marginRight: 4,
                        height: '80vh'                        
                    }}
                        ref={scrollViewRef}
                    >

                        {
                            messages.map(({id, data})=>(
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.receiver}>
                                        <Avatar
                                            rounded
                                            source={{
                                                uri: data.photoURL
                                            }}
                                            size={30}
                                            position='absolute'
                                            bottom={-15}
                                            right={-15}
                                            containerStyle={{
                                                position:'absolute',
                                                bottom:-15,
                                                right:-15
                                            }}
                                        />
                                        <Text style={styles.receiverText}>{data.message}</Text>
                                        <Text style={styles.receiverMessageTime}>{new Date(data.timestamp?.toDate()).toLocaleString()}</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar
                                            rounded
                                            source={{
                                                uri: data.photoURL
                                            }}
                                            size={30}
                                            position='absolute'
                                            bottom={-15}
                                            left={-15}
                                            containerStyle={{
                                                position:'absolute',
                                                bottom:-15,
                                                left:-15
                                            }}
                                        />
                                        <Text style={styles.senderText}>{data.message}</Text>
                                        <Text style={styles.senderName}>{data.displayName}</Text>
                                        <Text style={styles.senderMessageTime}>{new Date(data.timestamp?.toDate()).toLocaleString()}</Text>
                                    </View>
                                )
                            ))
                        }

                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput
                            placeholder='Enter Message'
                            value={input}
                            onChangeText={text=>setInput(text)}
                            style={styles.textInput}
                        />
                        <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                            <Ionicons name='send' size={24} color="#2B68E6" />
                        </TouchableOpacity>
                    </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({   
    container:{
        flex: 1,
    },
    footer:{
        flexDirection:'row',
        alignItems: 'center',
        width: '100%',
        padding: 15
    },
    textInput:{
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: 'transparent',
        backgroundColor: '#ECECEC',
        borderWidth: 1,
        padding: 10,
        color: 'grey',
        borderRadius: 30
    },
    receiver:{
        padding: 15,
        backgroundColor: '#ECECEC',
        alignSelf:'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    sender:{
        padding: 15,
        backgroundColor: '#2B68E6',
        alignSelf:'flex-start',
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    senderName:{
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white'
    },
    senderMessageTime:{
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white'
    },
    receiverMessageTime:{
        right: 10,
        paddingLeft: 10,
        fontSize: 10,
        color: 'black'
    },
    senderText:{
        color:'white',
        fontWeight: '500',
        left: 10,
        marginBottom: 8
    },
    receiverText:{
        color:'black',
        fontWeight: '500',
        marginLeft: 10,  
        marginBottom: 8      
    }
})
