import * as React from 'react';
import { Dimensions, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { SocketUrlContext, useSocketUrl, useSocket } from '../contexts/context';
import api from '../utils/Api'
import oHelper from '../utils/orderHelper'
import axios from 'axios'
import { FlatList } from 'react-native-gesture-handler';
import { Order, OrderPayload, RootTabParamList, RootTabScreenProps } from '../types';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParamListBase } from '@react-navigation/native';

export default function DineInScreen({ navigation }: RootTabScreenProps<'DineIn'>) {

  const { url, setUrl } = useSocketUrl();
  const { socket } = useSocket();

  // const [count, setCount] = useState(1);

  // useEffect(() => {
  //   setCount(1);
  // }, [setCount]);

  const anyArr: any[] = []
  const [areas, setAreas] = useState(anyArr);
  const [tables, setTables] = useState(anyArr);
  const [refreshing, setRefresState] = useState(false);

  const cache: any = {}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getdineindata(new URL('getdbdata', url).href)
        const data = await response.data
        cache["diningarea"] = data.diningarea
        cache["diningtable"] = data.diningtable
        setAreas(cache.diningarea)
        setTables(_sortTable(cache.diningtable))
        _eventregistration()
      } catch (error) {
        // console.log(error)
      }
    };
    let mounted = true
    if (mounted)
      fetchData();
      
    return function cleanup() {
      mounted = false
    }
  }, []);

  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height
  const numColumns = 3

  function _sortTable(tables: any[]) {
    // console.log(tables.length)
    return tables.sort((_a, _b) => {
      if (_a.TableName.toUpperCase() < _b.TableName.toUpperCase()) {
        return -1;
      }
      if (_a.TableName.toUpperCase() > _b.TableName.toUpperCase()) {
        return 1;
      }
      return 0;
    })
  }

  function _getData() {
    console.log("fetching data")
    api.getdineindata(new URL('getdbdata', url).href).then(response => {
      setAreas(response.data.diningarea)
      setTables(_sortTable(response.data.diningtable))
      setRefresState(false)
      console.log("succss")
    }, error => {
      setRefresState(false)
      console.log("error")
    })
  }

  // function _getOrder(tableKey: string) {
  //   return api.getdata(new URL('finddata', url).href, { dbname: "tableorders", findQuery: { diningtablekey: tableKey } })
  // }

  function _onTableStatusChange(tableKey: string, statusid: number) {
    cache.diningtable.forEach((tbl: any) => {
      if (tbl.TableKey == tableKey) {
        // console.log(tbl.TableName)
        tbl.TableStatusId = statusid
      }
    })
    setTables(cache.diningtable)
  }
  function _eventregistration() {
    console.log("event registration ...")

    // socket.off("table:lock")
    // socket.off("table:release")

    socket.on("table:lock", (payload) => {
      // console.log("table:lock", payload.tableKey)
      _onTableStatusChange(payload.tableKey, 1)
    })

    socket.on("table:release", (payload) => {
      // console.log("table:release", payload.tableKey)
      _onTableStatusChange(payload.tableKey, 0)
    })

    socket.on("tableorder:update", (_payload) => {
      // console.log("tableorder:update")
      _getData()
    })
  }
  function _orderOptions(tablekey: string) {
    const options = {
      tableid: +tablekey.split('_')[0],
      typeid: 1,
      tablekey: tablekey,
      username: "mohamed",
      userid: null
    }
    return options
  }
  async function _editOrder(tableKey: string) {
    console.log(new URL('finddata', url).href)
    const order_arr = await (await api.getdata(new URL('finddata', url).href, { dbname: "tableorders", findQuery: { diningtablekey: tableKey } })).data
    await AsyncStorage.removeItem('@order:edit')
    if (order_arr[0])
      await AsyncStorage.setItem(
        '@order:edit',
        JSON.stringify(order_arr[0])
      );
    else {
      await AsyncStorage.setItem(
        '@order:edit',
        JSON.stringify(oHelper.neworder(_orderOptions(tableKey)))
      );
      socket.emit('order:create', oHelper.newPayload(_orderOptions(tableKey)))
    }
    navigation.navigate('Cart', { url: url })
  }

  function _tableColor(tblstsid: number) {
    if (tblstsid == 0) {
      return 'white'
    } else if (tblstsid == 1) {
      // console.log("pending")
      return '#3ba25f'
    }
  }

  function _onreferesh() {
    setRefresState(true)
    _getData()
  }

  function _renderTable(table: any) {
    const tableW = ((screenWidth - styles.tblList.padding * 2) / 3) - styles.table.margin * 2
    const oarr = [111, 112, 113]
    return (
      <TouchableOpacity
        onPress={() => _editOrder(table.item.TableKey)}
        style={[styles.table, { width: tableW, borderBottomColor: _tableColor(table.item.TableStatusId) }]}>
        <Text style={[{ fontWeight: 'bold', fontSize: 15 }]}>{table.item.TableName}</Text>
        <Text style={[{ color: '#5f5f5f' }]}>{table.item.UserName}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.tblList]}>
        <FlatList
          data={tables}
          renderItem={_renderTable}
          keyExtractor={(_item, index) => index.toString()}
          numColumns={numColumns}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_onreferesh}
            />
          }
        />
      </View>
    </View>
  );
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
  tblList: {
    padding: 10
  },
  table: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: "#000",
    elevation: 2,
    borderRadius: 2,
    borderBottomWidth: 3,
  }
});
function NavigatorScreenParams<T, U>(arg0: number) {
  throw new Error('Function not implemented.');
}

