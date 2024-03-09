import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/user-components/NavBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ip } from "../../Barangays";
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [barangay, setBarangay] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [inboxes, setInboxes] = useState([]);
  const is_seen = 1;

  
  const [totalMessageCount, setTotalMessageCount] = useState(0)
  const [newMessageCount, setNewMessageCount] = useState(0);

  //NOTIFICATION COUNT
  const [notificationCount, setNotificationCount] = useState(0);
  const [userType, setUserType] = useState("");


const handleNotification = async (userId, userType) => {
  const getURL = `${ip}api_skillLink/api/getAllNotification.php?id=${userId}&user_type=${userType}`;
  try {
    const response = await axios.get(getURL);
    if (response && response.data) {
      const { numberOfNotification } = response.data;
      setNotificationCount(numberOfNotification);
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
    // Fetch data initially 
    if (userId && userType) {
      handleNotification(userId, userType);
    }

    // Set up an interval for auto-refreshing
    const refreshInterval = setInterval(() => {
      if (userId && userType) {
        handleNotification(userId, userType);
      }
    }, 1000); // Refresh every 60 seconds

    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [userId, userType]);


  const getUserProfile = async () => {
    try {
      const userSessionJSON = await AsyncStorage.getItem("usersession");
      if (userSessionJSON) {
        const userData = JSON.parse(userSessionJSON);
        const userDataResult = await getProfileData(userData.id);
        setUserId(userData.id);
        if (userDataResult) {
          setFirstname(userDataResult.first_name);
          setLastname(userDataResult.last_name);
          setBarangay(userDataResult.brgy_name);
          setContact(userDataResult.phone_number);
          setEmail(userDataResult.email);
          setProfileImage(userDataResult.profile_image);
        }
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  const getProfileData = async (userId) => {
    try {
      const getDataUrl = `${ip}api_skillLink/api/getInformation.php?id=${userId}`;
      const response = await axios.get(getDataUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  };

  useEffect(() => {
    getUserProfile();

    // Set up an interval for auto-refreshing
    const refreshInterval = setInterval(() => {
      getUserProfile();
    }, 1000); // Refresh every 60 seconds

    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      {firstname ? ( // Checking if firstname is available to determine if data is loaded
        <>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.profileContainer}>
            {profileImage ? (
              <Image
                source={{ uri: `${ip}api_skillLink/uploads/${profileImage}` }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require('../../assets/profile.png')}
                style={styles.profileImage}
              />
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{firstname} {lastname}</Text>
              <Text style={styles.profileInfoText}>{email}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditProfile", {
                  name: "EditProfile",
                })
              }
            >
              <Image
                source={require("../../assets/edit.png")}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              zIndex: -1,
              top: 130,
              alignSelf: "flex-start",
              marginLeft: 10,
            }}
          ></View>
              <NavBar notificationCount={notificationCount} totalMessageCount={totalMessageCount} newMessageCount={newMessageCount}/>
        </>
      ) : (
        <ActivityIndicator size="large" color="#1A5D1A" style={{ marginTop: '75%', alignSelf: 'center' }} />
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    alignItems: "center",
    paddingTop: 80,
  },
  titleContainer: {
    flex: 1,
    top: 50,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#FBFCF8",
  },
  profileContainer: {
    marginTop: 30,
    width: "80%",
    padding: 10,
    backgroundColor: "#707070",
    borderRadius: 10,
    overflow: 'hidden',
    shadowOffset: {width: 0, height: 0},
    elevation: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    margin: 20,
    alignSelf: "center",
    borderRadius: 100,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileInfoText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FBFCF8",
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#FBFCF8",
  },
  editIcon: {
    width: 20,
    height: 20,
    alignSelf: "flex-end",
  },
});
