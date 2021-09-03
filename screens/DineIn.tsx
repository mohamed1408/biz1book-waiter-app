import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { SocketUrlContext } from '../contexts/context';
import api from '../utils/Api'
import axios from 'axios'
import { FlatList } from 'react-native-gesture-handler';
interface IProps {

}

interface IState {
  url: string
  areas?: any;
  tables?: any;
  numColumns: number;
  // list: any
  // categoryFilter: string
  // sectionList: any
  screenHeight: number
  screenWidth: number
  // ptImages: any
}

export default class DineInScreen extends React.Component<IProps, IState> {
  static contextType = SocketUrlContext

  constructor(props: IProps) {
    super(props);

    this._renderTable = this._renderTable.bind(this)

    this.state = {
      url: "",
      areas: [],
      tables: [],
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      numColumns: 3
    }
  }

  componentDidMount = async () => {
    const urlContext = this.context
    console.log(urlContext)
    const dineindata = await api.getdineindata(new URL('getdata', urlContext.url).href)
    this.setState({ areas: dineindata.diningarea, tables: dineindata.diningtable })
  }

  _tableColor(tblstsid: number) {

  }

  _renderTable(table: any) {
    const tableW = ((this.state.screenWidth - styles.tblList.padding * 2) / 3) - styles.table.margin * 2
    const oarr = [111, 112, 113]
    return (
      <View style={[styles.table, { width: tableW, borderBottomColor: oarr.includes(table.item.Id) ? 'red' : 'white' }]}>
        <Text>{table.item.TableName}</Text>
      </View>
    )
  }

  render() {
    const { areas, tables, numColumns } = this.state
    return (
      <View style={styles.container}>
        <View style={[styles.tblList]}>
          <FlatList
            data={tables}
            renderItem={this._renderTable}
            keyExtractor={item => item.TableKey}
            numColumns={numColumns}
          />
        </View>
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
