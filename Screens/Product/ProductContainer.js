import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native"
import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView, Dimensions } from 'react-native'
import { Container, Header, Icon, Item, Input, Text, VStack, Heading, Center, } from "native-base";
import { Ionicons, MaterialIcons, SmallCloseIcon } from "@expo/vector-icons";
import ProductList from './ProductList'
import SearchedProduct from "./SearchedProduct";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import baseURL from "../../assets/common/baseUrl"
import axios from 'axios'

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
    const [loading, setLoading] = useState(true)
    // useEffect(() => {
    //     setFocus(false);
    //     setActive(-1)
    //     axios
    //         .get(`${baseURL}products`)
    //         .then((res) => {
    //             console.log(res.data)
    //             setProducts(res.data);
    //             setProductsFiltered(res.data);
    //             setProductsCtg(res.data);
    //             setInitialState(res.data);
    //             // setLoading(false)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })

    //     axios
    //         .get(`${baseURL}categories`)
    //         .then((res) => {
    //             setCategories(res.data)
    //         })
    //         .catch((error) => {
    //             console.log('Api call error')
    //         })

    //     return () => {
    //         setProducts([]);
    //         setProductsFiltered([]);
    //         setFocus();
    //         setCategories([]);
    //         setActive();
    //         setInitialState();
    //         setProductsCtg()
    //         // setLoading()
    //     };

    // }, [])

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
                        products.filter((i) => i.category !== null && i.category._id === ctg),
                        setActive(true)
                    ),
                ];
        }
    };

    useFocusEffect((
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);

                // Products
                axios
                    .get(`${baseURL}products`)
                    .then((res) => {
                        setProducts(res.data);
                        setProductsFiltered(res.data);
                        setProductsCtg(res.data);
                        setInitialState(res.data);
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log('Api call error')
                    })

                // Categories
                axios
                    .get(`${baseURL}categories`)
                    .then((res) => {
                        setCategories(res.data)
                    })
                    .catch((error) => {
                        console.log('Api call error')
                    })

                return () => {
                    setProducts([]);
                    setProductsFiltered([]);
                    setFocus();
                    setCategories([]);
                    setActive();
                    setInitialState();
                };
            },
            [],
        )
    ))
    console.log(productsFiltered)

    return (
        <>
            {loading === false ? (
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
                </Center>) : (<Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
                    <ActivityIndicator size="large" color="red" />
                </Container>)}
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    listContainer: {
        //   height: "100%",
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
});


export default ProductContainer;

// [{ "name": "Electronics" },
// { "name": "Beauty" },
// {
//     "name": "Computers"
// }, {
//     "name": "Home"
// }, {
//     "name": "Garden"
// }, {
//     "name": "Games"
// }]