import { AntDesign } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import images from '../assets/images'

interface Props {
    product: any;
    addItem: any;
    screenWidth: number;
    screenHeight: number;
    trigger: boolean
}

const cartItem: FC<Props> = ({ product, addItem, screenWidth, screenHeight, trigger }) => {
    // console.log(searchText)
    // const { style, product, searchText, ...otherProps } = props;
    const ptImages: any = {
        "1": images.veg,
        "2": images.non_veg,
        "3": images.egg,
        "4": images.none
    }

    // if (_filter(product.Product))
    return (
        <View style={styles.item}>
            <View style={[{ flex: 3 }]}>
                <Image
                    style={[{ width: 15, height: 15, marginBottom: 3 }]}
                    source={ptImages[product.ProductTypeId.toString()]}
                />
                <Text style={[{ fontWeight: 'bold', flex: 10, paddingBottom: 5 }]}>{product.Product}</Text>
                <Text style={[{ fontWeight: '100', flex: 1 }]}>₹ {product.Price}</Text>
            </View>
            <View style={[{ flex: 1, justifyContent: 'center' }]}>
                {(!product.Quantity)
                    ?
                    <TouchableOpacity
                        style={[{ borderWidth: 1, borderColor: '#dadde2', backgroundColor: 'white', elevation: 5, alignSelf: 'center', width: screenWidth * 0.25, paddingHorizontal: 5, paddingVertical: 10, borderRadius: 5 }]}
                        onPress={() => addItem(product, 'null')}
                    >
                        <Text style={[{ fontSize: 15, fontWeight: 'bold', color: 'green', alignSelf: 'center' }]}>ADD</Text>
                    </TouchableOpacity>
                    : <View
                        style={[{ borderWidth: 1, borderColor: '#dadde2', backgroundColor: 'white', elevation: 5, alignSelf: 'center', width: screenWidth * 0.25, borderRadius: 5, flexDirection: 'row' }]}>
                        <TouchableOpacity
                            style={[{ flex: 1, paddingVertical: 10, paddingLeft: 3 }]}
                            onPress={() => addItem(product, 'minus')}>
                            <AntDesign size={20} name="minus" color="#d5d5d6" style={[{ marginRight: 10, alignSelf: 'center' }]} />
                        </TouchableOpacity>
                        <Text style={[{ alignSelf: 'center', position: 'absolute', fontSize: 15, left: '40%' }]}>{product.Quantity}</Text>
                        <TouchableOpacity
                            style={[{ flex: 1, paddingVertical: 10 }]}
                            onPress={() => addItem(product, 'plus')}>
                            <AntDesign size={20} name="plus" color="green" style={[{ marginRight: 10, alignSelf: 'center' }]} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    )
    // else
    //     return (<View></View>)

}

function areEqual(prevProps: Props, nextProps: Props) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
    // console.log("prevProps", "nextProps")
    if (nextProps !== prevProps) {
        return true
    } else {
        return false
    }
}
const styles = StyleSheet.create({
    item: {
        padding: 10,
        marginVertical: 8,
        flexDirection: 'row'
    }
});

export const CartItem = React.memo(cartItem);
