import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid, ActivityIndicator } from 'react-native';
import { io } from 'socket.io-client';

import { useSocket, useSocketUrl } from '../contexts/context';
import { RootStackScreenProps } from '../types';
import api from '../utils/Api'

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
    const { url, setUrl } = useSocketUrl();
    const { socket, connect } = useSocket();

    const [serverUrl, setServerUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function checkStorageUrl() {
        const sUrl: string = await AsyncStorage.getItem("@serverurl") || ''
        console.log("lserver url: ",sUrl)
        api.checkserverstatus(new URL('checkserverstatus', sUrl).href).then(async response => {
            // console.log(response.data.status)
            if (response.data.status == 200) {
                setUrl(sUrl)
                connect(io(sUrl))
                setMessage("")
                await AsyncStorage.setItem("@serverurl", sUrl)
                // ToastAndroid.show("Connection established", ToastAndroid.SHORT)
                navigation.replace('Root')
            }
        }, async error => {
            console.log("error")
            // await AsyncStorage.removeItem("@serverurl")
        })
    }
    checkStorageUrl()
    function onInput(text: string) {
        setServerUrl(text)
    }

    function saveUrl() {
        setServerUrl(serverUrl)
        setLoading(true)
        // console.log(serverUrl)
        // return
        api.checkserverstatus(new URL('checkserverstatus', "http://" + serverUrl).href).then(async response => {
            console.log(response.data.status)
            setLoading(false)
            if (response.data.status == 200) {
                setUrl("http://" + serverUrl)
                console.log(url, serverUrl)
                connect(io("http://" + serverUrl))
                setMessage("")
                AsyncStorage.setItem("@serverurl", "http://" + serverUrl).then(data => console.log("async st success","http://" + serverUrl), error => console.log("async st error",error))
                ToastAndroid.show("Connection established", ToastAndroid.SHORT)
                navigation.navigate('Root')
            }
        }, error => {
            setLoading(false)
            console.log("error")
            setMessage("No server running in this address")
            ToastAndroid.show("No server running in this address", ToastAndroid.SHORT)
        })
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={onInput}
                // value={number}
                placeholder="Enter server address"
                keyboardType="default"
            />
            <Text style={styles.title}>Enter server address.</Text>
            <Text style={styles.message}>{message}</Text>
            {!loading ?
                (
                    <TouchableOpacity disabled={!serverUrl} onPress={() => saveUrl()} style={styles.link}>
                        <Text style={styles.linkText}>Connect</Text>
                    </TouchableOpacity>
                ) :
                (
                    <ActivityIndicator size="small" color="#0000ff" style={styles.link} />
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
        color: 'red',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#e5eaf0',
        padding: 10,
    },
});
