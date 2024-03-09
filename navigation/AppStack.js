import Notification from "../screens/user-interface/Notification";
import Home from "../screens/user-interface/Home";
import Profile from "../screens/user-interface/Profile";
import Status from "../screens/user-interface/Status";
import EditProfile from "../screens/user-interface/EditProfile";
import SearchResult from "../screens/user-interface/SearchResult";
import WorkersProfile from "../screens/user-interface/WorkersProfile";
import UserRequest from "../screens/user-interface/UserRequest";
import Ratings from "../screens/user-interface/Ratings";
import WelcomeScreen from "../screens/user-interface/WelcomeScreen";
import EditWorkersProfileUI from "../screens/worker-interface/EditWorkersProfileUI";
import ProfileWorkerUI from "../screens/worker-interface/ProfileWorkerUI";
import NotificationWorkerUI from "../screens/worker-interface/NotificationWorkerUI";
import StatusWorkerUI from "../screens/worker-interface/StatusWorkerUI";
import FirstStep from "../screens/verification-interface/FirstStep";
import SetupWorkerProfile from "../screens/worker-interface/SetupWorkerProfile";
import SecondStep from "../screens/verification-interface/SecondStep";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export const AppStack = () => {
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const getUserType = async () => {
            try {
                const userSessionJSON = await AsyncStorage.getItem("usersession");
                if (userSessionJSON) {
                    const userData = JSON.parse(userSessionJSON);
                    setUserType(userData.user_type);
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        };

        getUserType();
    }, []);



    return (

        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            }}
        >

            {userType === 2 ? (
                <Stack.Screen name="ProfileWorkerUI" component={ProfileWorkerUI} />
            ) : (
                <Stack.Screen name="Home" component={Home} />
            )}
            <Stack.Screen name="SearchResult" component={SearchResult} />
            <Stack.Screen name="WorkersProfile" component={WorkersProfile} />
            <Stack.Screen name="UserRequest" component={UserRequest} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="Status" component={Status} />
            <Stack.Screen
                name="EditWorkersProfileUI"
                component={EditWorkersProfileUI}
            />
            <Stack.Screen
                name="NotificationWorkerUI"
                component={NotificationWorkerUI}
            />
            <Stack.Screen name="StatusWorkerUI" component={StatusWorkerUI} />
            <Stack.Screen
                name="SetupWorkerProfile"
                component={SetupWorkerProfile}
            />
            <Stack.Screen name="Ratings" component={Ratings} />
            <Stack.Screen name="FirstStep" component={FirstStep} />
            <Stack.Screen name="SecondStep" component={SecondStep} />
        </Stack.Navigator>
    )
}

export default AppStack


