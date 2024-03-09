import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableNativeFeedback,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { ip } from '../../Barangays'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkerNotifications = ({workerNotification}) => {

   const {details, created_at, first_name, last_name, work_details} = workerNotification;
    
    return (
        <View>
                <View>
                    <View style={styles.notifs}>
                    <Ionicons 
                        name="notifications" 
                        size={14} 
                        color="black"
                        style={{
                            right: 5,
                            alignSelf: 'flex-end'
                        }}
                        />
                            <Text style={{ fontSize: 16 }}>
                <Text style={{ fontWeight: 'bold' }}>{first_name} {last_name}</Text> {details}
              </Text>
                        <Text style={{ fontSize: 12, alignSelf: 'flex-end', marginTop: 5 }}>
                        {created_at}
                        </Text>
                        
                    </View>
                </View>

        </View>
    );
};

export default WorkerNotifications;

const styles = StyleSheet.create({
    notifs: {
        width: 310,
        backgroundColor: "#FBFCF8",
        borderRadius: 20,
        margin: 4,
        padding: 10,
        alignContent: 'center'
    },
    modalContainer: {
        backgroundColor: "#FBFCF8",
        width: "85%",
        alignSelf: "center",
        padding: 10,
        height: "auto",
        margin: 50,
        justifyContent: "center",
        borderRadius: 20,
        borderColor: '#1C2120',
        borderWidth: 2
    },
    message: {
        color: '#1C2120',
        fontSize: 15
    },
    acceptButton: {
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5
    },
    declineButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5
    }
});
