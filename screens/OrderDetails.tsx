import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { FlatList, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Order, OrderItem } from '../types';

interface IProps {
}

interface IState {
    order?: Order;
}

class OrderDetails extends React.Component<IProps, IState> {

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
    _renderDetail(key: any, value: any) {
        return (
            <View style={[{ flexDirection: 'row' }]}>
                <Text style={[{ fontWeight: 'bold', fontStyle: 'italic' }]}>{key}: </Text>
                <Text>{value}</Text>
            </View>
        )
    }
    _listItemSeparator() {
        return (
            <View
                style={[styles.separator]}
            />
        )
    }

    _listHeader() {
        return (
            <View style={[styles.listItem]}>
                <Text style={[{ flex: 1, alignSelf: 'center', color: '#2f95dc', fontSize: 16, fontWeight: 'bold' }]}>product</Text>
                <Text style={[{ flex: 1, alignSelf: 'center', color: '#2f95dc', fontSize: 16, fontWeight: 'bold' }]}>Quantity</Text>
                <Text style={[{ flex: 1, alignSelf: 'center', color: '#2f95dc', fontSize: 16, fontWeight: 'bold' }]}>Amount</Text>
                {/* <Text style={[{ flex: 1, alignSelf: 'center', color: '#2f95dc', fontSize: 16, fontWeight: 'bold' }]}>Status</Text> */}
            </View>
        )
    }

    _renderItem(item: OrderItem, index: any) {
        return (
            <View style={[styles.listItem, { marginTop: index == 0 ? 30 : 0 }]}>
                <Text style={[{ flex: 1, alignSelf: 'center' }]}>{item.showname}</Text>
                <Text style={[{ flex: 1, alignSelf: 'center' }]}>{item.Quantity} ({item.ComplementryQty})</Text>
                <Text style={[{ flex: 1, alignSelf: 'center' }]}>{item.TotalAmount}</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>#{this.state.order?.InvoiceNo}</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <View style={[{ flexDirection: 'row' }]}>
                    <View style={[{ flex: 1, paddingHorizontal: 10 }]}>
                        <Text style={[styles.sectionHeader]}>Bill Details</Text>
                        {this._renderDetail("InvoiceNo", this.state.order?.InvoiceNo)}
                        {this._renderDetail("BillAmount", this.state.order?.BillAmount)}
                        {this._renderDetail("PaidAmount", this.state.order?.PaidAmount)}
                        {this._renderDetail("Note", this.state.order?.Note)}
                    </View>
                    <View style={styles.verticleLine}></View>
                    <View style={[{ flex: 1, paddingHorizontal: 10 }]}>
                        <Text style={[styles.sectionHeader]}>Customer Details</Text>
                        {this._renderDetail("Name", this.state.order?.CustomerDetails.Name)}
                        {this._renderDetail("Phone", this.state.order?.CustomerDetails.PhoneNo)}
                        {this._renderDetail("Address", this.state.order?.CustomerDetails.Address)}
                        {this._renderDetail("Email", this.state.order?.CustomerDetails.Email)}
                    </View>
                </View>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <View style={[{ paddingHorizontal: 10, flexDirection: 'row' }]}>
                    <View style={[{ flex: 1, paddingHorizontal: 10 }]}>
                        <Text style={[styles.sectionHeader]}>Item Details</Text>
                        <FlatList
                            data={this.state.order?.Items}
                            ListHeaderComponent={this._listHeader}
                            ListHeaderComponentStyle={[{ backgroundColor: 'red' }]}
                            ItemSeparatorComponent={this._listItemSeparator}
                            renderItem={({ item, index }) => this._renderItem(item, index)}
                        >
                        </FlatList>
                    </View>
                </View>
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
    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#909090',
    },
    sectionHeader: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'center'
    },

});

export default OrderDetails