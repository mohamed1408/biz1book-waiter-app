import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, SafeAreaView, ScrollView, SectionList, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { BottomSheet, Button, ListItem, SearchBar } from "react-native-elements";

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Order } from '../types';
import { category, product, orders } from '../sampledata.json'
import { AntDesign, EvilIcons, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { color } from 'react-native-elements/dist/helpers';
import images from '../assets/images'

interface IProps {

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
}

class Cart extends React.Component<IProps, IState> {
    sectionList: any
    constructor(props: IProps) {
        super(props);

        this._updateSearch = this._updateSearch.bind(this)
        this._searchProduct = this._searchProduct.bind(this)
        this._addItem = this._addItem.bind(this)
        this._scrollTo = this._scrollTo.bind(this)

        this.state = {
            categories: [],
            products: [],
            cartData: [],
            isVisible: false,
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
            }
        }
    }

    componentDidMount = async () => {
        var categories: any = category.filter(x => x.ParentId != 0)
        console.log(categories.length, category.length)
        categories.forEach((cat: any) => {
            cat.Parent = category.filter(x => x.Id == cat.ParentId)[0].Category
            cat.data = product.filter(x => x.CategoryId == cat.Id)
            console.log(cat.Parent, '>', cat.Category, cat.data.length)
        })
        this.setState({ categories: category, products: product, cartData: categories, screenHeight: Dimensions.get('window').height, screenWidth: Dimensions.get('window').width })
    }
    _productList(product: any, index: number) {
        return (
            <View style={styles.item}>
                <View style={[{ flex: 3 }]}>
                    <Image
                        style={[{ width: 20, height: 20, marginBottom: 1 }]}
                        source={this.state.ptImages[product.ProductTypeId.toString()]}
                    />
                    <Text style={[{ fontWeight: 'bold', flex: 10, paddingBottom: 5 }]}>{product.Product}</Text>
                    <Text style={[{ fontWeight: '100', flex: 1 }]}>₹ {product.Price} ({product.ProductTypeId})</Text>
                </View>
                <View style={[{ flex: 1, justifyContent: 'center' }]}>
                    {(!product.Quantity)
                        ? <View
                            style={[{ borderWidth: 1, borderColor: '#dadde2', backgroundColor: 'white', elevation: 5, alignSelf: 'center', width: this.state.screenWidth * 0.25, paddingHorizontal: 5, paddingVertical: 10, borderRadius: 5 }]}>
                            <TouchableOpacity
                                style={[{ alignSelf: 'center' }]}
                                onPress={() => this._addItem(product.CategoryId, product.Id, 'null')}
                            >
                                <Text style={[{ fontSize: 15, fontWeight: 'bold', color: 'green' }]}>ADD</Text>
                            </TouchableOpacity>
                        </View>
                        : <View
                            style={[{ borderWidth: 1, borderColor: '#dadde2', backgroundColor: 'white', elevation: 5, alignSelf: 'center', width: this.state.screenWidth * 0.25, borderRadius: 5, flexDirection: 'row' }]}>
                            <TouchableOpacity
                                style={[{ flex: 1, paddingVertical: 10, paddingLeft: 3 }]}
                                onPress={() => this._addItem(product.CategoryId, product.Id, 'minus')}>
                                <AntDesign size={20} name="minus" color="#d5d5d6" style={[{ marginRight: 10 }]} />
                            </TouchableOpacity>
                            <Text style={[{ alignSelf: 'center', flex: 1, fontSize: 15 }]}>{product.Quantity}</Text>
                            <TouchableOpacity
                                style={[{ flex: 1, paddingVertical: 10 }]}
                                onPress={() => this._addItem(product.CategoryId, product.Id, 'plus')}>
                                <AntDesign size={20} name="plus" color="green" style={[{ marginRight: 10 }]} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        )
    }
    _itemSeparator(leadingItem: any, section: any) {
        return (<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />)
    }
    _updateSearch(text: string) {
        this.setState({ categoryFilter: text.toLowerCase() })
    }
    _searchProduct(text: string) {
        var filtered_data = product.filter(x => x.Product.toLowerCase().includes(text.toLowerCase()))
        if (filtered_data.length) {
            var catindex = this.state.cartData.findIndex((x: any) => x.Id == filtered_data[0].CategoryId)
            var prodindex = this.state.cartData[catindex].data.findIndex((x: any) => x.Id == filtered_data[0].Id)
            this._scrollTo(catindex, prodindex + 1)
        }
    }
    _catFilter(catname: string) {
        if (this.state.categoryFilter == '') return true
        if (catname.toLowerCase().includes(this.state.categoryFilter)) return true
        else return false
    }
    _scrollTo(cat_index: number, prod_index: number) {
        console.log(cat_index, prod_index)
        this.sectionList.scrollToLocation(
            {
                sectionIndex: cat_index,
                itemIndex: prod_index
            }
        )
        this.setState({ isVisible: false })
    }
    _scrollToIndexFailed(error: any) {
        console.log(error)
        // const offset = error.averageItemLength * error.index;
        // this.sectionList.scrollToLocation({
        //     sectionIndex: 0,
        //     itemIndex: 0
        // });
    }
    _addItem(categoryid: number, productid: number, type: string) {
        if (type == 'minus') {
            this.state.cartData.filter((x: any) => x.Id == categoryid)[0].data.filter((x: any) => x.Id == productid)[0].Quantity--
        } else if (type == 'plus') {
            this.state.cartData.filter((x: any) => x.Id == categoryid)[0].data.filter((x: any) => x.Id == productid)[0].Quantity++
        } else {
            this.state.cartData.filter((x: any) => x.Id == categoryid)[0].data.filter((x: any) => x.Id == productid)[0].Quantity = 1
        }
        this.setState({ cartData: this.state.cartData })
    }
    render() {
        const { list, categories } = this.state
        const screenHeight = Dimensions.get('window').height;
        const screenWidth = Dimensions.get('window').width;
        return (
            <SafeAreaView style={styles.container}>
                {/* <Button
                    title="Solid Button"
                    onPress={() => this.setState({ isVisible: true })}
                /> */}
                <View>
                    <TouchableOpacity
                        // style={[{ flex: 1, paddingVertical: 10 }]}
                        onPress={() => this.setState({ isVisible: true })}
                    >
                        <MaterialCommunityIcons size={30} name="filter-menu-outline" color="#7e808c" style={[{ marginRight: 10, padding: 10, alignSelf: 'flex-end' }]} />
                    </TouchableOpacity>
                    <SearchBar
                        placeholder="Type Here..."
                        platform="android"
                        onChangeText={this._searchProduct}
                    />
                </View>
                <SectionList
                    ref={(sectionList) => { this.sectionList = sectionList }}
                    sections={this.state.cartData}
                    stickySectionHeadersEnabled={true}
                    ItemSeparatorComponent={this._itemSeparator}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item, index }) => this._productList(item, index)}
                    onScrollToIndexFailed={this._scrollToIndexFailed}
                    renderSectionHeader={({ section: { Category, Parent, Id } }) => (
                        <Text style={styles.header} onPress={() => this._scrollTo(this.state.cartData.findIndex((x: any) => x.Id == Id), 0)}>{Parent} {' > '} {Category}</Text>
                    )}
                />
                <BottomSheet
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                    modalProps={{
                        visible: this.state.isVisible,
                        animationType: 'slide',
                        hardwareAccelerated: true,
                    }}>
                    <View style={[{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20, justifyContent: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[{ fontSize: 20, flex: 1 }]}>Select Category</Text>
                        <TouchableOpacity style={[{ alignSelf: 'flex-end' }]} onPress={() => this.setState({ isVisible: false })}>
                            <EvilIcons size={30} name="close" color="black" style={[{ alignSelf: 'flex-end' }]} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} lightColor="lightgrey" darkColor="rgba(255,255,255,0.1)" />
                    <SearchBar
                        placeholder="Type Here..."
                        platform="android"
                        onChangeText={this._updateSearch}
                    />
                    <ScrollView style={[{ maxHeight: screenHeight * 0.65, minHeight: screenHeight * 0.65, backgroundColor: 'white' }]}>
                        {this.state.categories.filter((x: any) => this._catFilter(x.Category) && x.ParentId > 0).map((l: { containerStyle: any; onPress: any; titleStyle: any; title: any; Category: any; }, i: number) => (
                            <ListItem key={i} containerStyle={l.containerStyle} onPress={() => this._scrollTo(i, 0)}>
                                <ListItem.Content>
                                    <ListItem.Title style={l.titleStyle}>{l.Category}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </ScrollView>
                </BottomSheet>
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
        // fontSize: 32,
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: "#dce1e7"
    },
    title: {
        fontSize: 24
    }
});

export default Cart