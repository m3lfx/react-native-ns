import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { Container } from "native-base"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

import AsyncStorage from '@react-native-async-storage/async-storage'

import axios from "axios"
import baseURL from "../../assets/common/baseUrl"

import AuthGlobal from "../../Context/Store/AuthGlobal"
import { logoutUser } from "../../Context/Actions/Auth.actions"


const UserProfile = (props) => {
    const context = useContext(AuthGlobal)
    const [userProfile, setUserProfile] = useState('')
    const [orders, setOrders] = useState([])
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            if (
                context.stateUser.isAuthenticated === false ||
                context.stateUser.isAuthenticated === null
            ) {
                navigation.navigate("Login")
            }

            AsyncStorage.getItem("jwt")
                .then((res) => {
                    axios
                        .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => setUserProfile(user.data))
                })
                .catch((error) => console.log(error))
            axios
                .get(`${baseURL}orders`)
                .then((response) => {
                    console.log("Response", response.data)
                    // const data = x.data;

                    const userOrders = response.data.filter(
                        (order) => {
                            console.log("order", order.user.id)
                            //  console.log(order.user._id, context.stateUser.user.userId )
                            order.user.id === context.stateUser.user.userId
                        }
                    );
                    // const userOrders = data

                    setOrders(userOrders);
                })
                .catch((error) => console.log(error))

            return () => {
                setUserProfile();
                setOrders();
            }

        }, [context.stateUser.isAuthenticated]))
    console.log("orders", orders)
    return (
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                <Text style={{ fontSize: 30 }}>
                    {userProfile ? userProfile.name : ""}
                </Text>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ margin: 10 }}>
                        Email: {userProfile ? userProfile.email : ""}
                    </Text>
                    <Text style={{ margin: 10 }}>
                        Phone: {userProfile ? userProfile.phone : ""}
                    </Text>
                </View>
                <View style={{ marginTop: 80 }}>
                    <Button title={"Sign Out"} onPress={() => [
                        AsyncStorage.removeItem("jwt"),
                        logoutUser(context.dispatch)
                    ]} />
                </View>
                <View style={styles.order}>
                    <Text style={{ fontSize: 20 }}>My Orders</Text>
                    <View>
                        {orders ? (
                            orders.map((order) => {
                                console.log(order)
                                // return <OrderCard key={order.id} item={order} />;
                            })
                        ) : (
                            <View style={styles.order}>
                                <Text>You have no orders</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </Container>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    subContainer: {
        alignItems: "center",
        marginTop: 60
    },
    order: {
        marginTop: 20,
        alignItems: "center",
        marginBottom: 60
    }
})

export default UserProfile;