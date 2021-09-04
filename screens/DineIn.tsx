import * as React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { SocketUrlContext, useSocketUrl, useSocket } from '../contexts/context';
import api from '../utils/Api'
import axios from 'axios'
import { FlatList } from 'react-native-gesture-handler';
import { RootTabScreenProps } from '../types';
import { useEffect, useState } from 'react';

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

  const cache: any = {}

  useEffect(() => {
    const fetchData = async () => {
      console.log('using effect');
      const response = await api.getdineindata(new URL('getdata', url).href)
      const data = await response.data
      cache["diningarea"] = data.diningarea
      cache["diningtable"] = data.diningtable
      setAreas(cache.diningarea)
      setTables(cache.diningtable)
      _eventregistration()
    };

    fetchData();
  }, []);

  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height
  const numColumns = 3

  function _getData() {
    // console.log("fetching data")
    api.getdineindata(new URL('getdata', url).href).then(response => {
      setAreas(response.data.diningarea)
      setTables(response.data.diningtable)
    })
  }

  function _onTableStatusChange(tableKey: string, statusid: number) {
    cache.diningtable.forEach((tbl: any) => {
      if (tbl.TableKey == tableKey) {
        console.log(tbl.TableName)
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
      console.log("table:lock", payload.tableKey)
      _onTableStatusChange(payload.tableKey, 1)
    })

    socket.on("table:release", (payload) => {
      console.log("table:release", payload.tableKey)
      _onTableStatusChange(payload.tableKey, 0)
    })

    socket.on("tableorder:update", (payload) => {
      console.log("tableorder:update")
      _getData()
    })
  }
  function _tableColor(tblstsid: number) {
    if (tblstsid == 0) {
      return 'white'
    } else if (tblstsid == 1) {
      console.log("pending")
      return '#3ba25f'
    }
  }

  function _renderTable(table: any) {
    const tableW = ((screenWidth - styles.tblList.padding * 2) / 3) - styles.table.margin * 2
    const oarr = [111, 112, 113]
    return (
      <TouchableOpacity style={[styles.table, { width: tableW, borderBottomColor: _tableColor(table.item.TableStatusId) }]}>
        <Text>{table.item.TableName}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.tblList]}>
        <FlatList
          data={tables}
          renderItem={_renderTable}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
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
