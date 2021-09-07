import * as React from 'react';
import { StyleSheet, FlatList, Text, View, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import oHelper from '../utils/orderHelper'
import api from '../utils/Api'

// import EditScreenInfo from '../components/EditScreenInfo';
// import { View as CustomView } from '../components/Themed';
// import { orders } from '../sampledata.json'
import { Order, RootTabScreenProps } from '../types';
import { useSocketUrl, useSocket } from '../contexts/context';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import moment from 'moment';

export default function DeliveryScreen({ navigation }: RootTabScreenProps<'Delivery'>) {
  const orderstatuses = [
    { sid: -1, name: "cancelled" },
    { sid: 0, name: "Placed" },
    { sid: 1, name: "Accepted" },
    { sid: 2, name: "Preparing" },
    { sid: 3, name: "Food Ready" },
    { sid: 4, name: "Dispatched" },
    { sid: 5, name: "Delivered" }
  ]

  const anyArr: any[] = []
  const [orders, setOrders] = useState(anyArr);
  const [refreshing, setRefresState] = useState(false);
  // const [tables, setTables] = useState(anyArr);

  const { url, setUrl } = useSocketUrl();
  const { socket, connect } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getdata(new URL('finddata', url).href, { dbname: "preorders", findQuery: { OrderTypeId: 3 } })
        const data = await response.data
        setOrders(data)
        _eventregistration()
      } catch (error) {
        // console.log(error)
      }
    };

    fetchData();
  }, []);

  async function _getData() {
    try {
      const response = await api.getdata(new URL('finddata', url).href, { dbname: "preorders", findQuery: { OrderTypeId: 3 } })
      const data = await response.data
      // console.log(data)
      setOrders(data)
      setRefresState(false)
    } catch (error) {
      console.log("error",new URL('finddata', url).href)
      setRefresState(false)
    }
  }

  function _eventregistration() {
    // console.log("event registering ...")
    socket.on("preorder:update", (payload) => {
      // console.log("preorder:update")
      _getData()
    })
  }

  function _orderOptions() {
    const options = {
      tableid: null,
      typeid: 3,
      tablekey: null,
      username: "mohamed",
      userid: null
    }
    return options
  }

  async function _viewOrderDetails(order: Order) {
    await AsyncStorage.setItem(
      '@order:view',
      JSON.stringify(order)
    );
    navigation.navigate('OrderDetails')
  }

  async function _newOrder() {
    await AsyncStorage.removeItem('@order:edit')
    await AsyncStorage.setItem(
      '@order:edit',
      JSON.stringify(oHelper.neworder(_orderOptions()))
    );
    // socket.emit('order:create', oHelper.newPayload(_orderOptions()))
    navigation.navigate('Cart',{url:url})
  }

  async function _editOrder(order: Order) {
    await AsyncStorage.removeItem('@order:edit')
    await AsyncStorage.setItem(
      '@order:edit',
      JSON.stringify(order)
    );
    // socket.emit('order:create', oHelper.newPayload(_orderOptions()))
    navigation.navigate('Cart',{url:url})
  }

  function _onreferesh() {
    setRefresState(true)
    _getData()
  }

  return (
    <View style={styles.container}>
      <View style={[{ flex: 1, flexDirection: 'row', maxHeight: '8%' }]}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          // onChangeText={onChangeNumber}
          // value={number}
          placeholder="Search..."
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.button, { flex: 1, flexDirection: 'row', width: 40 }]}
          onPress={() => _newOrder()}>
          <Ionicons size={20} name="add-sharp" color="white" style={[{ marginRight: 10 }]} />
          <Text style={[{ color: 'white' }]}>New Delivery</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        ListHeaderComponent={_listHeader}
        ListHeaderComponentStyle={[{ backgroundColor: '#c4e7ff' }]}
        ItemSeparatorComponent={_listItemSeparator}
        renderItem={({ item, index }) => _renderOrder(item, index)}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onreferesh}
          />
        }
      >
      </FlatList>
    </View>
  );

  function _renderOrder(item: any, index: number) {
    const order: Order = item
    return (
      <TouchableOpacity style={[styles.item, styles.orderLI, { marginTop: index == 0 ? 30 : 0 }]}
        onPress={() => _editOrder(order)}
      >
        <View style={[{ flex: 2 }]}>
          <TouchableOpacity style={[{ marginBottom: 10 }]}
            onPress={() => _viewOrderDetails(item)}>
            <Text style={[styles.linkText]}>#{order.InvoiceNo}</Text>
          </TouchableOpacity>
          <Text>{order.CustomerDetails.PhoneNo || 'N/A'}</Text>
          <Text>{order.CustomerDetails.Name || 'N/A'}</Text>
        </View>
        <Text style={[{ flex: 1, alignSelf: 'center' }]}>{order.BillAmount}</Text>
        <Text style={[{ flex: 1, alignSelf: 'center' }]}>{order.PaidAmount}</Text>
        <Text style={[{ flex: 1, alignSelf: 'center' }]}>{orderstatuses.filter(x => x.sid == order.OrderStatusId)[0].name}</Text>
      </TouchableOpacity>
    )
  }

  function _listItemSeparator() {
    return (
      <View
        style={[styles.separator]}
      />
    )
  }

  function _listHeader() {
    return (
      <View style={[styles.item, styles.orderLH]}>
        <Text style={[{ flex: 2, alignSelf: 'center', color: '#2f95dc', fontSize: 16, fontWeight: 'bold' }]}>#Orderno</Text>
        <Text style={[{ flex: 1, alignSelf: 'center', color: '#2f95dc', fontSize: 16, fontWeight: 'bold' }]}>Bill</Text>
        <Text style={[{ flex: 1, alignSelf: 'center', color: '#2f95dc', fontSize: 16, fontWeight: 'bold' }]}>Paid</Text>
        <Text style={[{ flex: 1, alignSelf: 'center', color: '#2f95dc', fontSize: 16, fontWeight: 'bold' }]}>Status</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
    backgroundColor: "#eee",
    alignSelf: 'center'
  },
  item: {
    // backgroundColor: '#f9c2ff',
    // paddingVertical: 20,
    // marginVertical: 8,
    marginHorizontal: 16,
  },
  orderLI: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  orderLH: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    // backgroundColor: 'blue'
  },
  linkText: {
    // fontSize: 12,
    textDecorationLine: 'underline',
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#eee',
    borderRadius: 5
  },
  button: {
    height: 40,
    margin: 12,
    alignItems: "center",
    backgroundColor: "#2f95dc",
    padding: 10,
    color: 'white',
    borderRadius: 5
  },
});
