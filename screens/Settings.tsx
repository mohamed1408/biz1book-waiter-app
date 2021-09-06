import * as React from 'react';
import { Button, StyleSheet, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useSocketUrl, useSocket } from '../contexts/context';
import api from '../utils/Api'

export default function SettingScreen({ navigation }: RootTabScreenProps<'Setting'>) {

    const { url, setUrl } = useSocketUrl();
    const { socket, connect } = useSocket();

    const [serverUrl, setServerUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log(url)
        const gethost = () => {
            try {
                return new URL(url).host
            } catch (err) {
                return ""
            }
        }
        setServerUrl(gethost())
    }, [""]);
    function _changeUrl(text: string) {
        setServerUrl(text)
    }

    async function updateUrl() {
        api.checkserverstatus(new URL('checkserverstatus', "http://" + serverUrl).href).then(async response => {
            console.log(response.data.status)
            setLoading(false)
            if (response.data.status == 200) {
                setUrl("http://" + serverUrl)
                connect(io(url))
                setMessage("")
                await AsyncStorage.setItem("@serverurl", "http://" + serverUrl)
                ToastAndroid.show("Connection established", ToastAndroid.SHORT)
                navigation.replace('Root')
            }
        }, error => {
            setLoading(false)
            console.log("error")
            setMessage("No server running in this address")
            ToastAndroid.show("No server running in this address", ToastAndroid.SHORT)
        })

        // await AsyncStorage.setItem("@serverurl", "http://" + serverUrl)
        // setUrl("http://" + serverUrl)
        // connect(io(url))
    }
    return (
        <View style={styles.container}>
            <View style={[{ flexDirection: 'row' }]}>
                <Text style={[{ flex: 1, alignSelf: 'center' }]}>Server</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={_changeUrl}
                    value={serverUrl}
                />
                <TouchableOpacity disabled={!serverUrl} onPress={() => updateUrl()} style={styles.link}>
                    <Text style={styles.linkText}>Connect</Text>
                </TouchableOpacity>
                {/* <Button
                    title="Save Url"
                    color="#2f95dc"
                    onPress={() => updateUrl()}
                /> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 5,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    input: {
        flex: 2
    },
    link: {
        // marginTop: 15,
        // paddingVertical: 15,
        alignSelf: 'center',
        padding: 3
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
