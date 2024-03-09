import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WorkerNavBar from "../../components/worker-components/WorkerNavBar";
import WorkerNotifications from "../../components/worker-components/WorkerNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ip } from "../../Barangays";
import axios from "axios";

const NotificationWorkerUI = () => {
  const [notifications, setNotifications] = useState([]);
  const [workerId, setWorkerId] = useState("");
  const [userType, setUserType] = useState("");

  const [inboxes, setInboxes] = useState([]);
  
  const [totalMessageCount, setTotalMessageCount] = useState(0)
  const [newMessageCount, setNewMessageCount] = useState(0);

  const [notificationCount, setNotificationCount] = useState(0);


  const handleNotification = async (workerId, userType) => {
    const getNotifURL = `${ip}api_skillLink/api/getAllNotification.php?id=${workerId}&user_type=${userType}`;
    const getJobReqURL = `${ip}api_skillLink/api/getWorkerJobRequests.php?id=${workerId}`;
    try {
      const response = await axios.get(getNotifURL);
      const resp = await axios.get(getJobReqURL);
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

  const getWorkerId = async () => {
    try {
      const userSessionJSON = await AsyncStorage.getItem("usersession");
      const userData = JSON.parse(userSessionJSON);
      const usertype = userData.user_type;
      const id = userData.id;
      setWorkerId(id);
      setUserType(usertype);
      // console.log("Worker ID: ", id);
      // console.log("USER TYPE: ", usertype);
    } catch (error) {
      console.error("Error getting worker ID:", error);
    }
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get(`${ip}api_skillLink/api/getAllConversation.php?id=${workerId}`);
        // console.log( response.data + "yobad")
        if (response.data) {
          setInboxes(response.data.reverse());
  
          // Calculate total message count for the user
          const totalMessages = response.data.reduce((total, inbox) =>  total + inbox.total, 0);
          setTotalMessageCount(totalMessages);
  
          // // Calculate new message count for the userx
          const newMessages = response.data.reduce((total, inbox) => total + (inbox.total > 0 ? 1 : 0), 0);
          setNewMessageCount(newMessages);
        } else {
          console.error('Invalid data format asddsa:', response.data);
        }
      } catch (error) {
        console.error('Error fetching inboxes:', error);
      }
    };
  
    fetchData();

    getWorkerId();
  
    // Fetch data initially only if workerId is available
    if (workerId && userType) {
      handleNotification(workerId, userType);
    }
  
    // Set up an interval for auto-refreshing
    const refreshInterval = setInterval(() => {
      if (workerId && userType) {
        handleNotification(workerId, userType);
      }
    }, 10000); // Refresh every 60 seconds
  
    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [workerId, userType]);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.notificationContainer}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {notifications.map((workerNotification, index) => (
            <WorkerNotifications key={index} workerNotification={workerNotification} />
          ))}
        </ScrollView>
      </View>
      <WorkerNavBar notificationCount={notificationCount} totalMessageCount={totalMessageCount} newMessageCount={newMessageCount} />
    </View>
  );
};

export default NotificationWorkerUI;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    paddingTop: 80,
    alignItems: "center",
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
  notifs: {
    width: "100%",
    height: 70,
    backgroundColor: "#C4D7B2",
    borderRadius: 20,
  },
});
