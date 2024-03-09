import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import NavBar from "../../components/user-components/NavBar";
import UserNotifications from "../../components/user-components/UserNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ip } from "../../Barangays";
import axios from "axios";
import {registerNNPushToken, 
  getNotificationInbox, 
  registerIndieID, 
  registerFollowMasterID, 
  getFollowMaster} from 'native-notify';

const Notification = ({ worker }) => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("");

  const [inboxes, setInboxes] = useState([]);
  const is_seen = 1;

  
  const [totalMessageCount, setTotalMessageCount] = useState(0)
  const [newMessageCount, setNewMessageCount] = useState(0);


  const [notificationCount, setNotificationCount] = useState(0);


  const handleNotification = async (userId, userType) => {
    const getURL = `${ip}api_skillLink/api/getAllNotification.php?id=${userId}&user_type=${userType}`;
    try {
      const response = await axios.get(getURL);
      if (response && response.data) {
        const { numberOfNotification, notifications } = response.data;
  
        // You can use numberOfNotification if needed
  
        // Reverse the order of notifications if required
        const newNotifications = notifications.reverse();
        setNotificationCount(numberOfNotification);
        setNotifications(newNotifications);
  
        // Calculate the count of unread notifications if needed
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error fetching worker data:", error);
    }
  };
  
  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ip}api_skillLink/api/getAllConversation.php?id=${userId}`);
        if (Array.isArray(response.data)) {
          setInboxes(response.data.reverse());
  
          // Calculate total message count for the user
          const totalMessages = response.data.reduce((total, inbox) => total + inbox.total, 0);
          setTotalMessageCount(totalMessages);
  
          // Calculate new message count for the user
          const newMessages = response.data.reduce((total, inbox) => total + (inbox.total > 0 ? 1 : 0), 0);
          setNewMessageCount(newMessages);
        } else {
          console.error('Invalid data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching inboxes:', error.message);
      }
    };
  
    fetchData();
    
    const getWorkerId = async () => {
      try {
        const userSessionJSON = await AsyncStorage.getItem("usersession");
        const userData = JSON.parse(userSessionJSON);
        const usertype = userData.user_type;
        const id = userData.id;
        setUserId(id);
        setUserType(usertype);
      //  console.log("User ID: ", id);
       // console.log("USER TYPE: ", usertype);
      
      } catch (error) {
        console.error("Error getting worker ID:", error);
      }
    };

    getWorkerId();

    const notifyNotif = registerIndieID(userId, 14918, 'tNVXoI0KJjP1KsBmR0cxzb');
    console.log('NATIVE NOTIFY: ', notifyNotif)

    // Fetch data initially
    if (userId && userType) {
      handleNotification(userId, userType);
    }

    // Set up an interval for auto-refreshing
    const refreshInterval = setInterval(() => {
      if (userId && userType) {
        handleNotification(userId, userType);
      }
    }, 10000); // Refresh every 60 seconds

    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [userId, userType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.notificationContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {notifications.map((notification, index) => (
            <UserNotifications key={index} notification={notification} />
          ))}
        </ScrollView>
      </View>
      <NavBar notificationCount={notificationCount} totalMessageCount={totalMessageCount} newMessageCount={newMessageCount}/>
    </View>
  );
};

export default Notification;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    alignItems: "center",
    paddingTop: 80,
  },
  titleContainer: {
    flex: 0.8,
    top: 50,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#FBFCF8",
  },
  notificationContainer: {
    padding: 6,
    width: "90%",
    height: "80%",
    backgroundColor: "#707070",
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: {width: 0,height: 0},
    elevation: 5,
  },

});
