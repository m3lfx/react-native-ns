import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView } from "react-native";
import { Box, HStack, Container, H1, Center, Heading, Button } from 'native-base'
import Toast from 'react-native-toast-message';
import * as actions from '../../Redux/Actions/cartActions';
import { useSelector, useDispatch } from 'react-redux'
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
const SingleProduct = (props) => {
    const [item, setItem] = useState(props.route.params.item);
    
    const [availability, setAvailability] = useState(null)
    const [availabilityText, setAvailabilityText] = useState("")
    const dispatch = useDispatch()
    useEffect(() => {
        if (item.countInStock == 0) {
            setAvailability(<TrafficLight unavailable></TrafficLight>);
            setAvailabilityText("Unvailable")
        } else if (item.countInStock <= 5) {
            setAvailability(<TrafficLight limited></TrafficLight>);
            setAvailabilityText("Limited Stock")
        } else {
            setAvailability(<TrafficLight available></TrafficLight>);
            setAvailabilityText("Available")
        }

        return () => {
            setAvailability(null);
            setAvailabilityText("");
        }
    }, [])
    return (

        <Center flexGrow={1}>
            <ScrollView style={{ marginBottom: 80, padding: 5 }}>
                <View>
                    <Image
                        source={{
                            uri: item.image ? item.image : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                        }}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>

                <View style={styles.contentContainer}>
                    <Heading style={styles.contentHeader} size='xl'>{item.name}</Heading>
                    <Text style={styles.contentText}>{item.brand}</Text>
                </View>
                <View style={styles.availabilityContainer}>
                    <View style={styles.availability}>
                        <Text style={{ marginRight: 10 }}>
                            Availability: {availabilityText}
                        </Text>
                        {availability}
                    </View>
                    <Text>{item.description}</Text>
                </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <HStack space={3} justifyContent="center">
                    <Text style={styles.price}>${item.price}</Text>
                    <EasyButton
                        primary
                        medium >

                        <Text style={{ color: "white" }}> Add</Text>
                    </EasyButton>
                </HStack>
                {/* <HStack alignSelf="right">
                    <Button size="sm" >Add</Button>
                </HStack> */}

                {/* <Right>
                   <EasyButton 
                   primary
                   medium
                   onPress={() => {props.addItemToCart(item.id),
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: `${item.name} added to Cart`,
                            text2: "Go to your cart to complete order"
                        })
                }}
                   >
                       <Text style={{ color: 'white'}}>Add</Text>
                   </EasyButton>
                   <Button>Add</Button>
                </Right>  */}
            </View>
        </Center >
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%',
        // 
    },
    imageContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 0
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentHeader: {
        fontWeight: 'bold',
        marginBottom: 20
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white'
    },
    price: {
        fontSize: 24,
        margin: 20,
        color: 'red'
    },
    availabilityContainer: {
        marginBottom: 20,
        alignItems: "center"
    },
    availability: {
        flexDirection: 'row',
        marginBottom: 10,
    }
})

export default SingleProduct