import { ScrollView, StyleSheet, Text, View, LogBox } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import WorkerNavBar from "../../components/worker-components/WorkerNavBar";
import WorkerStatus from "../../components/worker-components/WorkerStatus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ip } from "../../Barangays";
import axios from "axios";

const StatusWorkerUI = () => {
  const navigation = useNavigation();
  const [statuses, setStatuses] = useState([]);
  const [jobReqID, setJobReqID] = useState("");
  const [workerId, setWorkerId] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [userType, setUserType] = useState("");
  const [inboxes, setInboxes] = useState([]);
  
  const [totalMessageCount, setTotalMessageCount] = useState(0)
  const [newMessageCount, setNewMessageCount] = useState(0);

  const [notificationCount, setNotificationCount] = useState(0);

  LogBox.ignoreLogs(['Error fetching inboxes']);


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

    // Fetch data initially
    if (workerId) {
      handleNotification(workerId, userType);
    }

    // Set up an interval for auto-refreshing
    const refreshInterval = setInterval(() => {
      if (workerId) {
        handleNotification(workerId, userType);
      }
    }, 10000); // Refresh every 60 seconds

    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [workerId, userType]);

  const handleStatus = async (workerId) => {
    const getURL = `${ip}api_skillLink/api/getWorkerJobRequests.php?id=${workerId}`;
    try {
      const response = await axios.get(getURL);
      setStatuses(response.data.reverse());
      setJobReqID(response.data.jr_id);
    //  console.log(response.data);
    } catch (error) {
      console.error("Error fetching worker data:", error);
    }
  };


  useEffect(() => {
    getWorkerId();

    // Fetch data initially
    if (workerId) {
      handleStatus(workerId);
    }

    // Set up an interval for auto-refreshing
    const refreshInterval = setInterval(() => {
      if (workerId) {
        handleStatus(workerId);
      }
    }, 10000); // Refresh every 60 seconds

    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [workerId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status</Text>
      <View style={styles.statusContainer}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {statuses.map((status, index) => (
            <WorkerStatus key={index} status={status} />
          ))}
        </ScrollView>
      </View>
        <WorkerNavBar notificationCount={notificationCount} totalMessageCount={totalMessageCount} newMessageCount={newMessageCount} />
    </View>
  );
};

export default StatusWorkerUI;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#707070",
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
  statusContainer: {
    padding: 6,
    width: "90%",
    height: "80%",
    backgroundColor: "#1C2120",
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: {width: 0,height: 0},
    elevation: 5,
  },
});
