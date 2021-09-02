import * as React from 'react';
import { StyleSheet, FlatList, Text, View, Alert, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// import EditScreenInfo from '../components/EditScreenInfo';
// import { View as CustomView } from '../components/Themed';
import { orders } from '../sampledata.json'
import { Order, RootTabScreenProps } from '../types';

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
          onPress={() => navigation.navigate('Cart')}>
          <Ionicons size={20} name="add-sharp" color="white" style={[{ marginRight: 10 }]} />
          <Text style={[{ color: 'white' }]}>New Delivery</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        ListHeaderComponent={_listHeader}
        ListHeaderComponentStyle={[{backgroundColor: '#c4e7ff'}]}
        ItemSeparatorComponent={_listItemSeparator}
        renderItem={({ item, index }) => _renderOrder(item, index)}
      >

      </FlatList>
    </View>
  );

  function _renderOrder(item: any, index: number) {
    const order: Order = item
    return (
      <View style={[styles.item, styles.orderLI, { marginTop: index == 0 ? 30 : 0 }]}>
        <View style={[{ flex: 2 }]}>
          {/* <Text>{order.InvoiceNo}</Text> */}
          <TouchableOpacity style={[{ marginBottom: 10 }]}>
            <Text style={[styles.linkText]}>#{order.InvoiceNo}</Text>
          </TouchableOpacity>
          <Text>{order.CustomerDetails.PhoneNo}</Text>
          <Text>{order.CustomerDetails.Name}</Text>
        </View>
        <Text style={[{ flex: 1, alignSelf: 'center' }]}>{order.BillAmount}</Text>
        <Text style={[{ flex: 1, alignSelf: 'center' }]}>{order.PaidAmount}</Text>
        <Text style={[{ flex: 1, alignSelf: 'center' }]}>{orderstatuses.filter(x => x.sid == order.OrderStatusId)[0].name}</Text>
      </View>
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
