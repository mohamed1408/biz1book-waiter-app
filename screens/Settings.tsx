import * as React from 'react';
import { ActivityIndicator, Button, Pressable, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useSocketUrl, useSocket } from '../contexts/context';
import api from '../utils/Api'
import { AntDesign, EvilIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar, BottomSheet, Icon, ListItem } from 'react-native-elements';

export default function SettingScreen({ navigation }: RootTabScreenProps<'Setting'>) {

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={() => navigation.navigate('Camera')}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>
                    <MaterialCommunityIcons
                        name="qrcode-plus"
                        size={25}
                        color={'#2f95dc'}
                        style={{ marginRight: 15 }} />
                </Pressable>
            )
        })
    })

    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height

    const { url, setUrl } = useSocketUrl();
    const { socket, connect } = useSocket();

    const [serverUrl, setServerUrl] = useState(url.replace("http://", "").replace("https://", ""));
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [share, setShare] = useState(false);
    const [qrurl, setORUrl] = useState("");

    function _changeUrl(text: string) {
        setServerUrl(text)
    }

    async function updateUrl() {
        setLoading(true)
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
    function getQrcode() {
        const options = { url: serverUrl }
        api.getqrurl(new URL('getQrcode', "http://" + serverUrl).href, options).then(response => {
            console.log(response.data)
            if (response.data.imgUrl) {
                setORUrl(response.data.imgUrl)
                setShare(true)
            }
        })
    }
    return (
        <View style={styles.container}>
            {/* <View style={[{ flexDirection: 'row' }]}>
                <Text style={[{ flex: 1, alignSelf: 'center' }]}>Server</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={_changeUrl}
                    value={serverUrl}
                />
                {!loading ?
                    (
                        <TouchableOpacity disabled={!serverUrl} onPress={() => updateUrl()} style={styles.link}>
                            <Text style={styles.linkText}>Connect</Text>
                        </TouchableOpacity>
                    ) :
                    (
                        <ActivityIndicator size="small" color="#0000ff" style={styles.link} />
                    )}

            </View>
            <Text style={styles.message}>{message}</Text> */}
            <ListItem.Accordion
                content={
                    <>
                        <Feather
                            name="globe"
                            size={25}
                            color={'#2f95dc'}
                            style={{ marginRight: 15 }} />
                        <ListItem.Content>
                            <ListItem.Title>SERVER URL</ListItem.Title>
                            <ListItem.Subtitle>{serverUrl}</ListItem.Subtitle>
                        </ListItem.Content>
                        <Pressable
                            onPress={() => getQrcode()}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <AntDesign
                                name="qrcode"
                                size={25}
                                color={'#2f95dc'}
                                style={{ marginRight: 15 }} />
                        </Pressable>
                    </>
                }
                isExpanded={expanded}
                onPress={() => {
                    setExpanded(!expanded);
                }}
            >
                <ListItem key={"i"}>
                    {/* <Avatar title={"Appointment"} source={{ uri: l.avatar_url }} /> */}
                    <ListItem.Content>
                        {/* <ListItem.Title>{"Appointment"}</ListItem.Title> */}
                        {/* <ListItem.Subtitle>{"appointment"}</ListItem.Subtitle> */}
                        <View style={[{ flexDirection: 'row' }]}>
                            <TextInput
                                style={[{ borderWidth: 1, height: 40, flex: 1, borderColor: '#e9e9eb', padding: 10, borderRadius: 10 }]}
                                onChangeText={_changeUrl}
                                value={serverUrl}
                            />
                            {!loading ?
                                (
                                    <TouchableOpacity disabled={!serverUrl} onPress={() => updateUrl()} style={styles.link}>
                                        <Text style={styles.linkText}>Connect</Text>
                                    </TouchableOpacity>
                                ) :
                                (
                                    <ActivityIndicator size="small" color="#0000ff" style={styles.link} />
                                )}

                        </View>
                    </ListItem.Content>
                </ListItem>
            </ListItem.Accordion>
            <BottomSheet
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                modalProps={{
                    visible: share,
                    animationType: 'slide',
                    // hardwareAccelerated: true,
                }}>
                <View style={[{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20, justifyContent: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={[{ fontSize: 20, flex: 1 }]}>Scan code to connect</Text>
                    <TouchableOpacity style={[{ alignSelf: 'flex-end' }]} onPress={() => setShare(false)}>
                        <EvilIcons size={30} name="close" color="black" style={[{ alignSelf: 'flex-end' }]} />
                    </TouchableOpacity>
                </View>
                <View style={styles.separatorfull} lightColor="lightgrey" darkColor="rgba(255,255,255,0.1)" />
                <View style={[{ maxHeight: screenHeight * 0.65, minHeight: screenHeight * 0.65, backgroundColor: 'white', justifyContent: 'center' }]}>
                    <Text style={[{ fontSize: 20, color: 'red', fontStyle: 'italic', alignSelf: 'center', paddingHorizontal: 5 }]}>{serverUrl}</Text>
                    <Image
                        style={[{ width: '80%', height: '80%', alignSelf: 'center' }]}
                        source={{
                            uri: qrurl,
                        }}
                    />
                </View>
            </BottomSheet>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // marginTop: 20,
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
        flex: 1,
        padding: 3,
        // borderWidth: 1
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
        alignSelf: 'flex-end'
    },
    message: {
        fontSize: 16,
        color: 'red',
    },
    separatorfull: {
        // marginVertical: 10,
        height: 1,
        width: '100%',
    },
});
