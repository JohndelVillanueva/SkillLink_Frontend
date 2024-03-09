import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ip } from '../../Barangays';
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserRequest = ({navigation, route}) => {
  const [work_details, setWorkDetails] = useState(''); 
  const [user_id, setUserId] = useState('');
  const { worker } = route.params;
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const request_status = 'o';
  const is_seen = 0;
  const notification_type = 'job_request'




  const default_notif = "wants to hire you! Go to Status and click to see their request."
  const details = `${default_notif}`

  

  useEffect(() => {
    const getID = async () => {
      try {
        const value = await AsyncStorage.getItem('usersession');
        if (value) {
          const userData = JSON.parse(value);
          setUserId(userData.id);
          setFirstname(userData.firstname);
          setLastname(userData.lastname);
          console.log('firstname:', worker.first_name)
          console.log('lastname:', worker.last_name)
          console.log('userID: ', userData.id); 
          console.log('workerID: ', worker.worker_id);
        }
      } catch (error) {
        console.log(error)
      }
    };

    getID();
  }, []);

  const handleSend = async() => {
    const postMessageURL = `${ip}api_skillLink/api/postNewInbox.php`
    try {
      const response = await axios.post(postMessageURL, {
        message: work_details,
        receiver_id: worker.worker_id,
        sender_id: user_id
      })
      console.log(response.data)
    } catch (error) {
      
    }
  };

  const handleRequest = async () => {
    const reqURL = `${ip}api_skillLink/api/postJobReqAndNotif.php`;
    const data = {
      user_id: user_id,
      worker_id: worker.worker_id, // Access worker_id property
      work_details: work_details,
      request_status: request_status,
      details: details,
      is_seen: is_seen,
      notification_type: notification_type
    };
    try {
      const resp = await axios.post(reqURL, data);
      console.log(resp.data);
      
      navigation.navigate("UserMessage", {
        worker: worker, // Pass worker_id as a parameter
      })
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const postNotification = async () => {
    try {
      const notifyResponse = await axios.post(`https://app.nativenotify.com/api/notification`, {
        appId: 16982,
        appToken: "DsiJB0lueDaLRyhbtZd1y9",
        title: "Job Request",
        body: "Someone wants to hire you",
      }, {
        timeout: 60000, // Adjust the timeout value (in milliseconds) as needed
      });
      console.log('NOTIFY RESPONSE: ', notifyResponse.data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#F7FFE5",
          margin: 10,
        }}
      >
        What do you need?
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("WorkersProfile", {worker})
        }
        style={{
          position: "absolute",
          top: 25,
          alignSelf: "flex-start",
          padding: 10,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#C49102" />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.messageContainer}>
          <TextInput
            multiline={true}
            maxLength={600}
            placeholder="Type your message..."
            keyboardAppearance="dark"
            value={work_details}
            onChangeText={setWorkDetails}
          />
        </View>
      </TouchableWithoutFeedback>

      <View>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            handleRequest();
            handleSend();
            postNotification();
          }}
        >
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default UserRequest;
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    width: "80%",
    height: 300,
    backgroundColor: "#FBFCF8",
    textAlignVertical: "top",
    padding: 20,
    marginBottom: 150,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#C49102",
  },
  sendButton: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#C49102",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    elevation: 3,
    bottom: 100,
  },
  sendBtnText: {
    fontWeight: "bold",
    color: "#1C2120",
    fontSize: 22,
  },
});
