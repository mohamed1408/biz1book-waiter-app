import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Order } from '../types';

interface IProps {
}

interface IState {
    order?: Order;
}

class OrderDetails extends React.Component<IProps, IState> {
    // var order: Order
    // AsyncStorage.getItem('@order:view').then(data => {
    //     order = JSON.parse(data || '')
    //     console.log(order.InvoiceNo)
    // })
    constructor(props: IProps) {
        super(props);
        this.state = {
            order: undefined
        }
    }
    componentDidMount = async () => {
        const orderData: string = await AsyncStorage.getItem('@order:view') || ''
        const order: Order = JSON.parse(orderData)
        this.setState({ order: order })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.state.order?.InvoiceNo}</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <EditScreenInfo path="/screens/ModalScreen.tsx" />

                {/* Use a light status bar on iOS to account for the black space above the modal */}
                <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
});

export default OrderDetails