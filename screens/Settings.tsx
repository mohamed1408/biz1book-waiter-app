import * as React from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useSocketUrl, useSocket } from '../contexts/context';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';

export default function SettingScreen({ navigation }: RootTabScreenProps<'Setting'>) {

    const { url, setUrl } = useSocketUrl();
    const { socket, connect } = useSocket();

    const [serverUrl, setServerUrl] = useState(url);

    function _changeUrl(text: string) {
        setServerUrl(text)
    }

    async function updateUrl() {
        await AsyncStorage.setItem("@serverurl", "http://" + serverUrl.replace("http://", ''))
        setUrl("http://" + serverUrl.replace("http://", ''))
        connect(io(url))
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
                <Button
                    title="Save Url"
                    color="#2f95dc"
                    onPress={() => updateUrl()}
                />
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
    }
});
