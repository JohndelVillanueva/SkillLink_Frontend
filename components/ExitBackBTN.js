import { View, Text, BackHandler } from 'react-native'
import React, { useEffect } from 'react'

const ExitBackBTN = () => {
    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp;
            // // Show an alert to inform the user that going back is disabled
            // Alert.alert(
            //     'Alert',
            //     'Going back is disabled in this screen.',
            //     [
            //         {
            //             text: 'OK',
            //             onPress: () => {
            //                 // You can customize this logic based on your requirements
            //                 // For example, you can navigate to a different screen or perform other actions.
            //             },
            //         },
            //     ]
            // );

            // // Prevent the default behavior of the back button
            return true;
        };

        // Add event listener for hardware back button press
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Clean up the event listener when the component is unmounted
        return () => backHandler.remove();
    }, []);
}

export default ExitBackBTN