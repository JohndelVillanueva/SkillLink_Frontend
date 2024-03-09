import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack"
import Notification from "../screens/user-interface/Notification";
import Home from "../screens/user-interface/Home";
import Profile from "../screens/user-interface/Profile";
import UserMessage from "../screens/user-interface/UserMessage"
import Status from "../screens/user-interface/Status";
import EditProfile from "../screens/user-interface/EditProfile";
import SearchResult from "../screens/user-interface/SearchResult";
import WorkersProfile from "../screens/user-interface/WorkersProfile";
import UserRequest from "../screens/user-interface/UserRequest";
import FollowedWorkers from "../screens/user-interface/FollowedWorkers";
import Ratings from "../screens/user-interface/Ratings";
import WelcomeScreen from "../screens/user-interface/WelcomeScreen";
import EditWorkersProfileUI from "../screens/worker-interface/EditWorkersProfileUI";
import ProfileWorkerUI from "../screens/worker-interface/ProfileWorkerUI";
import WorkerMessage from "../screens/worker-interface/WorkerMessage";
import NotificationWorkerUI from "../screens/worker-interface/NotificationWorkerUI";
import StatusWorkerUI from "../screens/worker-interface/StatusWorkerUI";
import FirstStep from "../screens/verification-interface/FirstStep";
import SecondStep from "../screens/verification-interface/SecondStep";
import AboutUs from "../screens/user-interface/AboutUs";
import Settings from "../screens/user-interface/Settings";
import UserConversations from "../screens/user-interface/UserConversations";
import WorkerConversations from "../screens/worker-interface/WorkerConversations";
import UserStatus from "../components/user-components/UserStatus";

import Login from '../screens/user-interface/Login';
import Register from "../screens/user-interface/Register";
import SetupWorkerProfile from '../screens/worker-interface/SetupWorkerProfile';
import WorkerRegistration from "../screens/worker-interface/WorkerRegistration";
import SetupProfile from '../screens/user-interface/SetupProfile';
import SkillCheckBox from '../screens/worker-interface/SkillCheckBox';
import SecondarySkillCheckBox from "../screens/worker-interface/SecondarySkillCheckBox";

const AppNavigation = () => {

const [isLoading, setIsLoading] = useState(true);
const [userType, setUserType] = useState(null);

const Stack = createStackNavigator();


  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("usersession");
      if (token) {
        const userData = JSON.parse(token);
        setUserType(userData.user_type);
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    // Render a loading indicator while checking for the token
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A0C49D" />
      </View>
    );
  }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
                }}
            >

              
                <Stack.Screen name="Login" component={Login} />


                < Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="SearchResult" component={SearchResult} />
                <Stack.Screen name="WorkersProfile" component={WorkersProfile} />
                <Stack.Screen name="UserRequest" component={UserRequest} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="FollowedWorkers" component={FollowedWorkers} />
                <Stack.Screen name="UserMessage" component={UserMessage} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="Status" component={Status} />
                <Stack.Screen name="UserStatus" component={UserStatus} />




                <Stack.Screen name="ProfileWorkerUI" component={ProfileWorkerUI} />
                <Stack.Screen name="WorkerMessage" component={WorkerMessage} />
                <Stack.Screen
                    name="EditWorkersProfileUI"
                    component={EditWorkersProfileUI}
                />
                <Stack.Screen
                    name="NotificationWorkerUI"
                    component={NotificationWorkerUI}
                />
                <Stack.Screen name="StatusWorkerUI" component={StatusWorkerUI} />
                <Stack.Screen name="Ratings" component={Ratings} />
                <Stack.Screen name="FirstStep" component={FirstStep} />
                <Stack.Screen name="SecondStep" component={SecondStep} />
                <Stack.Screen name="WorkerConversations" component={WorkerConversations} />
                <Stack.Screen name="UserConversations" component={UserConversations} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="AboutUs" component={AboutUs} />


                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="SetupProfile" component={SetupProfile} />
                <Stack.Screen
                    name="WorkerRegistration"
                    component={WorkerRegistration}
                />
                <Stack.Screen
                    name="SetupWorkerProfile"
                    component={SetupWorkerProfile}
                />
                <Stack.Screen
                    name="SkillCheckBox"
                    component={SkillCheckBox}
                />
                <Stack.Screen
                    name="SecondarySkillCheckBox"
                    component={SecondarySkillCheckBox}
                />
                        
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
