import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView, Dimensions } from 'react-native'
import { Container, Header, Icon, Item, Input, Text, VStack, Heading, Center, } from "native-base";
import { Ionicons, MaterialIcons, SmallCloseIcon } from "@expo/vector-icons";
import ProductList from './ProductList'
import SearchedProduct from "./SearchedProduct";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
const data = require('../../assets/data/products.json')
const productCategories = require('../../assets/data/categories.json')

var { width, height } = Dimensions.get("window");

const ProductContainer = () => {
    const [products, setProducts] = useState([])
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [focus, setFocus] = useState();
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState([]);
    const [initialState, setInitialState] = useState([])
    const [productsCtg, setProductsCtg] = useState([])
    useEffect(() => {
        setProducts(data);
        setProductsFiltered(data);
        setFocus(false);
        setCategories(productCategories)
        setActive(-1)
        setInitialState(data);
        return () => {
            setProducts([])
            setProductsFiltered([]);
            setFocus();
            setCategories([])
            setActive()
            setInitialState([])
            setProductsCtg([])
        }
    }, [])

    const searchProduct = (text) => {
        console.log(text)
        setProductsFiltered(
            products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const openList = () => {
        setFocus(true);
    }

    const onBlur = () => {
        setFocus(false);
    }

    const changeCtg = (ctg) => {
        {
            ctg === "all"
                ? [setProductsCtg(initialState), setActive(true)]
                : [
                    setProductsCtg(
                        products.filter((i) => i.category.$oid === ctg),
                        setActive(true)
                    ),
                ];
        }
    };
    console.log(productsFiltered)

    return (

        <Center>
            <VStack w="100%" space={5} alignSelf="center">
                

                <Input
                    onFocus={openList}
                    onChangeText={(text) => searchProduct(text)}
                    placeholder="Search"
                    variant="filled"
                    width="100%"
                    borderRadius="10"
                    py="1"
                    px="2"
                    InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}
                    InputRightElement={focus === true ? <Icon ml="2" size="4" color="gray.400" as={<Ionicons name="close" size="12" color="black" />} /> : null}
                />
            </VStack>
            {focus === true ? (
                <SearchedProduct
                    productsFiltered={productsFiltered}
                />
            ) : (

                <ScrollView>
                    <View>
                    <Banner />
                    </View>
                    <View >
                        <CategoryFilter
                            categories={categories}
                            categoryFilter={changeCtg}
                            productsCtg={productsCtg}
                            active={active}
                            setActive={setActive}
                        />
                    </View>
                    {productsCtg.length > 0 ? (
                        <View style={styles.listContainer}>
                            {productsCtg.map((item) => {
                                return (
                                    <ProductList
                                        // navigation={props.navigation}
                                        key={item._id.$oid}
                                        item={item}
                                    />
                                )
                            })}
                        </View>
                    ) : (
                        <View style={[styles.center, { height: height / 2 }]}>
                            <Text>No products found</Text>
                        </View>
                    )}

                </ScrollView>)}

            {/* <View>

                    <View style={styles.listContainer} >
                        <FlatList
                            //    horizontal
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            numColumns={2}
                            data={products}
                            // renderItem={({item}) => <Text>{item.brand}</Text>}
                            renderItem={({ item }) => <ProductList key={item.id} item={item} />}
                            keyExtractor={item => item.name}
                        />
                    </View>
                </View> */}
        </Center>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProductContainer;