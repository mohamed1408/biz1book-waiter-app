import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, SafeAreaView, ScrollView, SectionList, StyleSheet, Dimensions, TouchableOpacity, Image, Modal, TextInput, Vibration } from 'react-native';
import { Badge, BottomSheet, Button, ListItem, SearchBar } from "react-native-elements";
import { AntDesign, EvilIcons, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment'

import { CartItem } from '../components/cartProduct';
import { Text, View } from '../components/Themed';
import { Order, OrderItem, OrderPayload } from '../types';
// import { category, product, orders } from '../sampledata.json'
import { color } from 'react-native-elements/dist/helpers';
import images from '../assets/images'
import oHelper from '../utils/orderHelper'
import { SocketContext } from '../contexts/context'
import { Socket } from 'socket.io-client';
import Api from '../utils/Api';

interface IProps {
    navigation: any
    route: any
}

interface IState {
    categories?: any;
    products?: any
    cartData?: any
    isVisible: boolean
    list: any
    categoryFilter: string
    sectionList: any
    screenHeight: number
    screenWidth: number
    ptImages: any
    payload: OrderPayload
    searchText: string
    trigger: boolean
    modalVisible: boolean
    pickerOptions: any
}

class Cart extends React.Component<IProps, IState> {
    static contextType = SocketContext
    sectionList: any
    constructor(props: IProps) {
        super(props);

        this._updateSearch = this._updateSearch.bind(this)
        this._searchProduct = this._searchProduct.bind(this)
        this._addItem = this._addItem.bind(this)
        this._scrollTo = this._scrollTo.bind(this)
        this._itemSeparator = this._itemSeparator.bind(this)
        this._setCustomerDetails = this._setCustomerDetails.bind(this)
        this.setDeliveryDate = this.setDeliveryDate.bind(this)
        // this._sectionSeparator = this._sectionSeparator.bind(this)

        this.state = {
            categories: [],
            products: [],
            cartData: [],
            isVisible: false,
            trigger: false,
            list: [
                { title: 'List Item 1' },
                { title: 'List Item 2' },
                {
                    title: 'Cancel',
                    containerStyle: { backgroundColor: 'red' },
                    titleStyle: { color: 'white' },
                    onPress: () => this.setState({ isVisible: false }),
                },
            ],
            categoryFilter: '',
            sectionList: null,
            screenHeight: 0,
            screenWidth: 0,
            ptImages: {
                "1": images.veg,
                "2": images.non_veg,
                "3": images.egg,
                "4": images.none
            },
            payload: {
                OrderTypeId: 0,
                Items: [],
                UserId: 0,
                Transactions: [],
                InvoiceNo: '',
                _id: ''
            },
            searchText: '',
            modalVisible: false,
            pickerOptions: {}
        }
    }

    componentDidMount = async () => {
        const { url } = this.props.route.params
        // return
        const proddata = await (await Api.getproducts(new URL('getdbdata', url).href)).data
        const orderData: string = await AsyncStorage.getItem('@order:edit') || '{}'
        const order: Order = JSON.parse(orderData)
        // console.log(order.diningtablekey, order.UserName, order.Items.length)
        var categories: any = proddata.category.filter((x: any) => x.ParentId != 0)
        var product = proddata.product
        product.forEach((pd: any) => {
            if (order.Items.some(x => x.ProductKey == oHelper.productkeygenerator(pd))) {
                pd.Quantity = order.Items.filter(x => x.ProductKey == oHelper.productkeygenerator(pd))[0].Quantity
            } else {
                pd.Quantity = 0
            }
        })
        order.Items.forEach(it => {
            product.filter((x: any) => x.Id == it.ProductId)[0].Quantity = it.Quantity
        })
        categories.forEach((cat: any) => {
            // cat.Parent = proddata.category.filter((x: any) => x.Id == cat.ParentId)[0].Category
            cat.data = product.filter((x: any) => x.CategoryId == cat.Id)
        })
        const options = {
            tableid: order.DiningTableId,
            typeid: order.OrderTypeId,
            tablekey: order.diningtablekey,
            username: order.UserName,
            userid: order.UserId,
            invoiceno: order.InvoiceNo,
            _id: order._id
        }

        var payload: OrderPayload = oHelper.newPayload(options)
        payload.CustomerDetails = order.CustomerDetails
        payload.DeliveryDateTime = order.DeliveryDateTime
        payload.Items = order.Items
        this.setState({ products: product, cartData: categories, payload: payload, screenHeight: Dimensions.get('window').height, screenWidth: Dimensions.get('window').width })
        // console.log(order.OrderTypeId, options.typeid, this.state.payload.OrderTypeId)
    }

    // async _openClock() {
    //     try {
    //         const {
    //             action,
    //             // year,
    //             // month,
    //             // day
    //         } = await DatePickerAndroid.open({
    //             // Use `new Date()` for current date.
    //             // May 25 2020. Month 0 is January.
    //             date: new Date(2020, 4, 25)
    //         });
    //         if (action !== DatePickerAndroid.dismissedAction) {
    //             // Selected year, month (0-11), day
    //         }
    //     } catch ({ code, message }) {
    //         console.warn('Cannot open date picker', message);
    //     }
    // }
    _productList(product: any, index: number) {

        if (product.Product.toLowerCase().includes(this.state.searchText))
            return (
                <View style={styles.item}>
                    <View style={[{ flex: 3 }]}>
                        <Image
                            style={[{ width: 20, height: 20, marginBottom: 1 }]}
                            source={this.state.ptImages[product.ProductTypeId.toString()]}
                        />
                        <Text style={[{ fontWeight: 'bold', flex: 10, paddingBottom: 5 }]}>{product.Product}</Text>
                        <Text style={[{ fontWeight: '100', flex: 1 }]}>₹ {product.Price}</Text>
                    </View>
                    <View style={[{ flex: 1, justifyContent: 'center' }]}>
                        {(!product.Quantity)
                            ? <View
                                style={[{ borderWidth: 1, borderColor: '#dadde2', backgroundColor: 'white', elevation: 5, alignSelf: 'center', width: this.state.screenWidth * 0.25, paddingHorizontal: 5, paddingVertical: 10, borderRadius: 5 }]}>
                                <TouchableOpacity
                                    style={[{ alignSelf: 'center' }]}
                                    onPress={() => this._addItem(product, 'null')}
                                >
                                    <Text style={[{ fontSize: 15, fontWeight: 'bold', color: 'green' }]}>ADD</Text>
                                </TouchableOpacity>
                            </View>
                            : <View
                                style={[{ borderWidth: 1, borderColor: '#dadde2', backgroundColor: 'white', elevation: 5, alignSelf: 'center', width: this.state.screenWidth * 0.25, borderRadius: 5, flexDirection: 'row' }]}>
                                <TouchableOpacity
                                    style={[{ flex: 1, paddingVertical: 10, paddingLeft: 3 }]}
                                    onPress={() => this._addItem(product, 'minus')}>
                                    <AntDesign size={20} name="minus" color="#d5d5d6" style={[{ marginRight: 10 }]} />
                                </TouchableOpacity>
                                <Text style={[{ alignSelf: 'center', flex: 1, fontSize: 15 }]}>{product.Quantity}</Text>
                                <TouchableOpacity
                                    style={[{ flex: 1, paddingVertical: 10 }]}
                                    onPress={() => this._addItem(product, 'plus')}>
                                    <AntDesign size={20} name="plus" color="green" style={[{ marginRight: 10 }]} />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            )
        else
            return (<View></View>)
    }
    // _sectionSeparator(trailing: any) {
    //     if (trailing)
    //         return (<View style={[{ backgroundColor: '#e5eaf0', paddingVertical: 10 }]} />)
    //     else
    //         return (<View></View>)
    // }
    _itemSeparator(leadingItem: any, section: any) {
        try {
            if (this.state.searchText && leadingItem.Product.toLowerCase().includes(this.state.searchText) || !this.state.searchText)
                return (<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />)
            else
                return (<View></View>)
        } catch (error) {
            // console.log(error)
            return (<View></View>)
        }
    }
    _sectionHeader(Category: any, Id: any) {
        if (this.state.searchText) {
            return (<View></View>)
        } else {
            return (<Text style={styles.header} onPress={() => this._scrollTo(this.state.cartData.findIndex((x: any) => x.Id == Id), 0)}>{Category}</Text>)
        }
    }
    _updateSearch(text: string) {
        this.setState({ categoryFilter: text.toLowerCase() })
    }
    _searchProduct(text: string) {
        // var filtered_data = product.filter(x => x.Product.toLowerCase().includes(text.toLowerCase()))
        // if (filtered_data.length) {
        //     var catindex = this.state.cartData.findIndex((x: any) => x.Id == filtered_data[0].CategoryId)
        //     var prodindex = this.state.cartData[catindex].data.findIndex((x: any) => x.Id == filtered_data[0].Id)
        //     this._scrollTo(catindex, prodindex + 1)
        // }
    }
    _catFilter(catname: string) {
        if (this.state.categoryFilter == '') return true
        if (catname.toLowerCase().includes(this.state.categoryFilter)) return true
        else return false
    }
    _scrollTo(cat_index: number, prod_index: number) {
        // console.log(cat_index, prod_index)
        this.sectionList.scrollToLocation(
            {
                sectionIndex: cat_index,
                itemIndex: prod_index
            }
        )
        this.setState({ isVisible: false })
    }
    _scrollToIndexFailed(error: any) {
        // console.log(error)
        // const offset = error.averageItemLength * error.index;
        // this.sectionList.scrollToLocation({
        //     sectionIndex: 0,
        //     itemIndex: 0
        // });
    }
    _addItem(product: any, type: string) {
        var payload = this.state.payload
        if (type == 'minus') {
            this.state.cartData.filter((x: any) => x.Id == product.CategoryId)[0].data.filter((x: any) => x.Id == product.Id)[0].Quantity--
            payload.Items.filter(x => x.ProductKey == oHelper.productkeygenerator(product))[0].Quantity--
        } else if (type == 'plus') {
            this.state.cartData.filter((x: any) => x.Id == product.CategoryId)[0].data.filter((x: any) => x.Id == product.Id)[0].Quantity++
            payload.Items.filter(x => x.ProductKey == oHelper.productkeygenerator(product))[0].Quantity++
        } else {
            this.state.cartData.filter((x: any) => x.Id == product.CategoryId)[0].data.filter((x: any) => x.Id == product.Id)[0].Quantity = 1
            if (payload.Items.some(x => x.ProductKey == oHelper.productkeygenerator(product)))
                payload.Items.filter(x => x.ProductKey == oHelper.productkeygenerator(product))[0].Quantity++
            else
                payload.Items.push(oHelper.orderItem(product, 1))
        }
        this.setState({ cartData: this.state.cartData, payload: payload, trigger: !this.state.trigger })
        this.state.payload.Items.forEach(it => {
            // console.log(it.Product, it.Quantity, oHelper.orderItem(product, 1).Quantity)
        })
    }
    _addFromCart(product: OrderItem, qty: number) {

        var { payload } = this.state
        // if (type == 'minus') {
        //     this.state.cartData.filter((x: any) => x.Id == product.CategoryId)[0].data.filter((x: any) => x.Id == product.ProductId)[0].Quantity--
        //     payload.Items.filter(x => x.ProductKey == product.ProductKey)[0].Quantity--
        // } else if (type == 'plus') {
        //     this.state.cartData.filter((x: any) => x.Id == product.CategoryId)[0].data.filter((x: any) => x.Id == product.ProductId)[0].Quantity++
        //     payload.Items.filter(x => x.ProductKey == product.ProductKey)[0].Quantity++
        // } else if (type == 'remove') {
        this.state.cartData.filter((x: any) => x.Id == product.CategoryId)[0].data.filter((x: any) => x.Id == product.ProductId)[0].Quantity = qty
        payload.Items.filter(x => x.ProductKey == product.ProductKey)[0].Quantity = qty
        // }
        this.setState({ cartData: this.state.cartData, payload: payload, trigger: !this.state.trigger })
    }
    _advancedOrderVal() {
        var val = true
        const { OrderTypeId, CustomerDetails, DeliveryDateTime } = this.state.payload
        console.log(CustomerDetails?.PhoneNo, DeliveryDateTime)
        if ([2, 3, 4].includes(this.state.payload.OrderTypeId)) {
            if (!CustomerDetails?.PhoneNo) val = false
            if (!DeliveryDateTime) val = false
        }
        return val
    }
    _saveOrder(socket: Socket) {
        if (this._advancedOrderVal()) {
            console.log(this.state.payload.OrderTypeId, this.state.payload.InvoiceNo)
            if ([2, 3, 4].includes(this.state.payload.OrderTypeId) && this.state.payload.InvoiceNo.includes('/'))
                socket.emit('order:update', this.state.payload)
            else
                socket.emit('order:create', this.state.payload)
            this.props.navigation.goBack(null);
        } else {
            this.setState({ modalVisible: true })
        }
    }
    _setCustomerDetails(key: string, val: any) {
        var cDetails: any = this.state.payload.CustomerDetails || {}
        cDetails[key] = val
        this.state.payload.CustomerDetails = cDetails
        this.setState({ payload: this.state.payload })
    }

    setDeliveryDate(event: any, selectedDate: any) {
        console.log(event, selectedDate)
        if (this.state.pickerOptions.mode == 'date' && event.type == 'set') {
            this.state.payload.DeliveryDateTime = moment(selectedDate).format("YYYY-MM-DD") + this.state.payload.DeliveryDateTime
            this.setState({ payload: this.state.payload, pickerOptions: { show: true, mode: 'time' } })
        } else if (this.state.pickerOptions.mode == 'time' && event.type == 'set') {
            this.state.payload.DeliveryDateTime = this.state.payload.DeliveryDateTime + ' ' + moment(selectedDate).format("hh:mm")
            this.setState({ payload: this.state.payload, pickerOptions: { show: false, mode: '' } })
        }
        console.log(this.state.payload.DeliveryDateTime)
    }
    _onLongPress(product: any) {
        console.log("longPress")
        Vibration.vibrate(70)
        this._addFromCart(product, 0)
    }
    _clearOrder(socket: Socket) {
        const { payload } = this.state
        payload.Items = []
        socket.emit('order:clear', payload)
        this.props.navigation.goBack(null);
    }
    render() {
        const { list, categories, modalVisible } = this.state
        const screenHeight = Dimensions.get('window').height;
        const screenWidth = Dimensions.get('window').width;
        const { socket, connect } = this.context
        return (
            <SafeAreaView style={styles.container}>
                <View style={[{ flexDirection: 'row' }]}>
                    <TouchableOpacity onPress={() => this._clearOrder(socket)} style={[styles.link, { flex: 1, paddingHorizontal: 10, alignSelf: 'center' }]}>
                        <Text style={styles.linkText}>Clear Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[{ flex: 1 }]}
                        disabled={this.state.payload.Items.filter(x => x.Quantity > 0).length == 0}
                        onPress={() => this.setState({ isVisible: true })}
                    >
                        <AntDesign size={30} name="shoppingcart" color="#7e808c" style={[{ marginRight: 10, padding: 10, alignSelf: 'flex-end' }]} />
                        {this.state.payload.Items.filter(x => x.Quantity > 0).length > 0 && <Badge
                            status="error"
                            containerStyle={{ position: 'absolute', top: 5, right: 15 }}
                            value={this.state.payload.Items.filter(x => x.Quantity > 0).length}
                        />}
                    </TouchableOpacity>
                </View>
                <SearchBar
                    placeholder="Type Here..."
                    platform="android"
                    onChangeText={(text) => this.setState({ searchText: text.toLowerCase() })}
                />
                <SectionList
                    ref={(sectionList) => { this.sectionList = sectionList }}
                    style={[{ maxHeight: '80%' }]}
                    sections={this.state.cartData}
                    stickySectionHeadersEnabled={true}
                    ItemSeparatorComponent={this._itemSeparator}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item, index }) => <CartItem product={item} searchText={this.state.searchText} addItem={this._addItem} screenWidth={screenWidth} screenHeight={screenHeight} trigger={this.state.trigger} />}
                    onScrollToIndexFailed={this._scrollToIndexFailed}
                    // SectionSeparatorComponent={({highlighted, }) => this._sectionSeparator(trailing)}
                    renderSectionHeader={({ section: { Category, Id } }) => this._sectionHeader(Category, Id)}
                />
                <Button
                    style={[{ height: 150 }]}
                    // containerStyle={[{ height: 150 }]}
                    disabled={this.state.payload?.Items.filter(x => x.Quantity > 0).length == 0}
                    title="Save Order"
                    onPress={() => { this._saveOrder(socket) }} />
                {/* <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        // Alert.alert("Modal has been closed.");
                        // setModalVisible(!modalVisible);
                    }}
                    style={[{justifyContent: 'center'}]}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>
                        <Button
                            title="close"
                            onPressIn={() => {
                                this.setState({ modalVisible: false })
                            }} />
                    </View>
                </Modal> */}
                {/* CATEGORY BS */}
                <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                    modalProps={{
                        visible: this.state.isVisible,
                        animationType: 'slide',
                        // hardwareAccelerated: true,
                    }}>
                    <View style={[{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20, justifyContent: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[{ fontSize: 20, flex: 1 }]}>Cart Items</Text>
                        <TouchableOpacity style={[{ alignSelf: 'flex-end', padding: 5 }]} onPress={() => this.setState({ isVisible: false })}>
                            <EvilIcons size={30} name="close" color="black" style={[{ alignSelf: 'flex-end' }]} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} lightColor="lightgrey" darkColor="rgba(255,255,255,0.1)" />
                    <ScrollView style={[{ maxHeight: screenHeight * 0.65, minHeight: screenHeight * 0.65, backgroundColor: 'white' }]}>
                        <Text style={[{ fontSize: 15, fontStyle: 'italic', color: 'red' }]}>LongPress an item to remove from cart</Text>
                        {this.state.payload.Items.filter(x => x.Quantity > 0).map((l: any, i: number) => (
                            <ListItem key={i} onLongPress={() => this._onLongPress(l)}>
                                <ListItem.Content>
                                    <ListItem.Title>{l.showname}</ListItem.Title>
                                    <ListItem.Subtitle>₹ {l.Price} x {l.Quantity} {l.ComplementryQty > 0 ? '+' + l.ComplementryQty : null}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Content right>
                                    {/* <TouchableOpacity
                                        style={[{ flex: 1, paddingVertical: 10, paddingLeft: 3 }]}
                                        onPress={() => this._addFromCart(l, 0)}>
                                        <AntDesign size={20} name="delete" color="red" style={[{ marginRight: 10 }]} />
                                    </TouchableOpacity> */}
                                    <View
                                        style={[{ borderWidth: 1, borderColor: '#dadde2', backgroundColor: 'white', elevation: 5, alignSelf: 'center', width: screenWidth * 0.25, borderRadius: 5, flexDirection: 'row' }]}>
                                        <TouchableOpacity
                                            disabled={l.Quantity <= 1}
                                            style={[{ flex: 1, paddingVertical: 10, paddingLeft: 3 }]}
                                            onPress={() => this._addFromCart(l, l.Quantity - 1)}>
                                            <AntDesign size={20} name="minus" color="#d5d5d6" style={[{ marginRight: 10, alignSelf: 'center' }]} />
                                        </TouchableOpacity>
                                        <Text style={[{ alignSelf: 'center', position: 'absolute', fontSize: 15, left: '40%' }]}>{l.Quantity}</Text>
                                        <TouchableOpacity
                                            style={[{ flex: 1, paddingVertical: 10 }]}
                                            onPress={() => this._addFromCart(l, l.Quantity + 1)}>
                                            <AntDesign size={20} name="plus" color="green" style={[{ marginRight: 10, alignSelf: 'center' }]} />
                                        </TouchableOpacity>
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </ScrollView>
                    <Button
                        style={[{ position: 'absolute', bottom: 0 }]}
                        containerStyle={[{ height: 50 }]}
                        disabled={this.state.payload?.Items.filter(x => x.Quantity > 0).length == 0}
                        title="Save Order"
                        onPress={() => { this._saveOrder(socket) }} />
                </BottomSheet>
                {/* CATEGORY BS */}
                <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                    modalProps={{
                        visible: this.state.modalVisible,
                        animationType: 'slide',
                        // hardwareAccelerated: true,
                    }}>
                    <View style={[{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20, justifyContent: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[{ fontSize: 20, flex: 1 }]}>Order Details</Text>
                        <TouchableOpacity style={[{ alignSelf: 'flex-end' }]} onPress={() => this.setState({ modalVisible: false })}>
                            <EvilIcons size={30} name="close" color="black" style={[{ alignSelf: 'flex-end' }]} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} lightColor="lightgrey" darkColor="rgba(255,255,255,0.1)" />
                    <ScrollView style={[{ maxHeight: screenHeight * 0.65, minHeight: screenHeight * 0.65, backgroundColor: 'white' }]}>
                        <View style={[styles.detailRowView]}>
                            <Text style={[{ alignSelf: 'center', flex: 1 }]}>Phone No</Text>
                            <TextInput
                                placeholder="Enter PhoneNo"
                                keyboardType="phone-pad"
                                value={this.state.payload.CustomerDetails?.PhoneNo}
                                onChangeText={((text) => this._setCustomerDetails("PhoneNo", text))}
                                style={[{ margin: 10, padding: 5, flex: 3, borderWidth: 1 }]}
                                autoFocus={true}
                            />
                        </View>
                        <View style={[styles.detailRowView]}>
                            <Text style={[{ alignSelf: 'center', flex: 1 }]}>Name</Text>
                            <TextInput
                                placeholder="Enter Name"
                                keyboardType="default"
                                value={this.state.payload.CustomerDetails?.Name}
                                onChangeText={((text) => this._setCustomerDetails("Name", text))}
                                style={[{ margin: 10, padding: 5, flex: 3, borderWidth: 1 }]}
                            />
                        </View>
                        <View style={[styles.detailRowView]}>
                            <Text style={[{ alignSelf: 'center', flex: 1 }]}>Address</Text>
                            <TextInput
                                placeholder="Enter Address"
                                keyboardType="default"
                                value={this.state.payload.CustomerDetails?.Address}
                                onChangeText={((text) => this._setCustomerDetails("Address", text))}
                                style={[{ margin: 10, padding: 5, flex: 3, borderWidth: 1 }]}
                                multiline={true}
                            />
                        </View>
                        <View style={[styles.detailRowView]}>
                            <Text style={[{ alignSelf: 'center', flex: 1 }]}>DeliveryTime</Text>
                            <Text style={[{ alignSelf: 'center', flex: 2 }]}>{moment(this.state.payload.DeliveryDateTime).format('MMMM Do YYYY, h:mm a')}</Text>
                            <TouchableOpacity onPress={() => this.setState({ pickerOptions: { show: true, mode: 'date' } })} style={[{ flex: 1 }]}>
                                <AntDesign size={20} name="calendar" color="#d5d5d6" />
                            </TouchableOpacity>
                            {/* <TextInput
                                placeholder="Enter Address"
                                keyboardType="default"
                                style={[{ margin: 10, padding: 5, flex: 3, borderWidth: 1 }]}
                                multiline={true}
                            /> */}
                        </View>

                    </ScrollView>
                    <Button
                        style={[{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }]}
                        disabled={this.state.payload?.Items.filter(x => x.Quantity > 0).length == 0}
                        title="Save Order"
                        onPressIn={() => {
                            this._saveOrder(socket)
                            // socket.emit('order:create', this.state.payload)
                            // this.props.navigation.goBack(null);
                        }}
                    />
                </BottomSheet>
                {this.state.pickerOptions.show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(this.state.payload.DeliveryDateTime || new Date().getTime())}
                        mode={this.state.pickerOptions.mode}
                        is24Hour={true}
                        display="default"
                        onChange={this.setDeliveryDate}
                    />
                )}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    // title: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    // },
    separator: {
        // marginVertical: 30,
        height: 1,
        width: '100%',
        alignSelf: 'center'
    },
    item: {
        // backgroundColor: "#f9c2ff",
        padding: 10,
        marginVertical: 8,
        flexDirection: 'row'
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: "white",
        borderTopWidth: 10,
        borderTopColor: '#f2f2f2'
    },
    title: {
        fontSize: 24
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        opacity: 0
    },
    modalView: {
        // margin: 20,
        // backgroundColor: "white",
        bottom: 0,
        borderRadius: 1,
        padding: 35,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    detailRowView: {
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        // fontSize: 14,
        color: '#2e78b7',
    },
});

export default Cart