import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import React, { useState, useEffect } from 'react';

import Login from '../screens/user-interface/Login';
import Register from "../screens/user-interface/Register";
import SetupWorkerProfile from '../screens/worker-interface/SetupWorkerProfile';
import WorkerRegistration from "../screens/worker-interface/WorkerRegistration";
import SetupProfile from '../screens/user-interface/SetupProfile';
import SkillCheckBox from '../screens/worker-interface/SkillCheckBox';


const Stack = createStackNavigator();

export const AuthStack = () => {

    return (

        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            }}
        >

            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen
                name="WorkerRegistration"
                component={WorkerRegistration}
            />
            <Stack.Screen name="SetupProfile" component={SetupProfile} />
            <Stack.Screen
                name="SetupWorkerProfile"
                component={SetupWorkerProfile}
            />
            <Stack.Screen
                name="SkillCheckBox"
                component={SkillCheckBox}
            />

        </Stack.Navigator>

    );
}

export default AuthStack;
