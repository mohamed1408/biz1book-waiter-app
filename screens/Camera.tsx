import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { io } from 'socket.io-client';

import { useSocket, useSocketUrl } from '../contexts/context';
import { RootStackScreenProps } from '../types';
import api from '../utils/Api'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen({ navigation }: RootStackScreenProps<'Camera'>) {
    const { url, setUrl } = useSocketUrl();
    const { socket, connect } = useSocket();

    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        console.log(type,data)
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        const sUrl = "http://" + data
        api.checkserverstatus(new URL('checkserverstatus', sUrl).href).then(async response => {
            // console.log(response.data.status)
            if (response.data.status == 200) {
                setUrl(sUrl)
                connect(io(sUrl))
                await AsyncStorage.setItem("@serverurl", sUrl)
                navigation.replace('Root')
            }
        }, async error => {
            console.log("http://" + data + " is not the server")
            // await AsyncStorage.removeItem("@serverurl")
        })
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {/* {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});