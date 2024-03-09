import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, PanResponder, LogBox } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import WorkerNavBar from "../../components/worker-components/WorkerNavBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { ip } from "../../Barangays";
import axios from "axios";
import Modal from "react-native-modal";
import { AntDesign } from '@expo/vector-icons';


const ProfileWorkerUI = ({ navigation }) => {
  const [id, setId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [barangay, setBarangay] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [isAvailable, setIsAvailable] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [workerId, setWorkerId] = useState("");
  const [userType, setUserType] = useState("");

  const [inboxes, setInboxes] = useState([]);
  
  const [totalMessageCount, setTotalMessageCount] = useState(0)
  const [newMessageCount, setNewMessageCount] = useState(0);

  const [notificationCount, setNotificationCount] = useState(0);
  
  LogBox.ignoreLogs(['Error fetching inboxes:']);


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
        const newNotifications = notifications;
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
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get(`${ip}api_skillLink/api/getAllConversation.php?id=${workerId}`);
    //     if (response.data) {
    //       setInboxes(response.data.reverse());
    //       const totalMessages = response.data.reduce((total, inbox) => total + inbox.total, 0);
    //       setTotalMessageCount(totalMessages);
    //       const newMessages = response.data.reduce((total, inbox) => total + (inbox.total > 0 ? 1 : 0), 0);
    //       setNewMessageCount(newMessages);
    //     } else {
    //       console.error('Invalid data format:', response.data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching inboxes:', error);
    //   }
    // };

    // fetchData();

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

    getWorkerId();

    if (workerId) {
      handleNotification(workerId, userType);
    }

    const refreshInterval = setInterval(() => {
      if (workerId) {
        handleNotification(workerId, userType);
      }
    }, 1000); // Refresh every 10 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, [workerId, userType]);



  const getUserProfile = async () => {
    try {
      const userSessionJSON = await AsyncStorage.getItem("usersession");
      if (userSessionJSON) {
        const userData = JSON.parse(userSessionJSON);
        setId(userData.id);
        getProfileData(userData.id);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  const getProfileData = async (userId) => {
    const getDataUrl = `${ip}api_skillLink/api/getInformation.php?id=${userId}`;
    try {
      const response = await axios.get(getDataUrl);
      const userData = response.data;
      setFirstname(userData.first_name);
      setLastname(userData.last_name);
      setBarangay(userData.brgy_name);
      setContact(userData.phone_number);
      setEmail(userData.email);
      setProfileImage(userData.profile_image);
      setIsAvailable(userData.is_available);
      setIsVerified(userData.is_verified);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();

    const refreshInterval = setInterval(() => {
      getUserProfile();
    }, 1000); // Refresh every 10 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, [])

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const modalRef = useRef(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dx > 10,
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < 50) {
        toggleModal();
      }
    },
  });

  const handleLogOut = async () => {
    await AsyncStorage.removeItem("usersession");
    navigation.navigate("Login", { name: "Login" });
  };

  const swipeToRight = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dx > 10,
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        toggleModal();
      }
    },
  });

  return (
    <View style={styles.container} ref={modalRef} {...swipeToRight.panHandlers}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 30, alignSelf: 'flex-start', margin: 5 }}
        onPress={toggleModal}
      >
        <AntDesign name="bars" size={40} color="#C49102" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        transparent={true}
        backdropOpacity={0}
        animationIn={"fadeInLeftBig"}
        animationInTiming={500}
        animationOut={"fadeOutLeftBig"}
        animationOutTiming={500}
        onBackdropPress={toggleModal}
        ref={modalRef}
        {...panResponder.panHandlers}
      >
        <View style={{
          flex: 1,
          backgroundColor: '#EDEADE',
          right: 20,
          marginRight: 50,
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20
        }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ padding: 10, backgroundColor: '#1C2120', margin: 5, borderRadius: 10 }}
            onPress={() => {
              navigation.navigate('Settings')
              toggleModal()
            }}
          >
            <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#FBFCF8' }}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ padding: 10, backgroundColor: '#1C2120', margin: 5, borderRadius: 10 }}
            onPress={() => {
              navigation.navigate('AboutUs')
              toggleModal()
            }}
          >
            <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#FBFCF8' }}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ padding: 10, backgroundColor: '#1C2120', margin: 5, borderRadius: 10 }}
            onPress={() => {
              handleLogOut()
              toggleModal()
            }}
          >
            <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#FBFCF8' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Text style={styles.title}>Profile</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1A5D1A" style={styles.loadingIndicator} />
      ) : (
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
          {isVerified ? (
            <Text style={styles.verifiedText}>Verified</Text>
          ) : (
            <TouchableOpacity
              style={styles.verifyBTN}
              onPress={() =>
                navigation.navigate("SecondStep", {
                  name: "SecondStep",
                })
              }
            >
            <Text style={styles.verifyBTNText}>Verify Now</Text>
            </TouchableOpacity>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{firstname} {lastname}</Text>
            <Text style={styles.profileInfoText}>{barangay}</Text>
            <Text style={styles.profileInfoAvailability}>{isAvailable ? 'Available' : 'Not Available'}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditWorkersProfileUI", {
                name: "EditWorkersProfileUI",
              })
            }
          >
            <Image
              source={require("../../assets/edit.png")}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
      )}
      <WorkerNavBar notificationCount={notificationCount}/>
        {/* <WorkerNavBar notificationCount={notificationCount} totalMessageCount={totalMessageCount} newMessageCount={newMessageCount} /> */}
    </View>
  );
};

export default ProfileWorkerUI;

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
  profileContainer: {
    marginTop: 20,
    width: "80%",
    backgroundColor: "#707070",
    borderRadius: 10,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  profileImage: {
    width: 200,
    height: 200,
    margin: 20,
    alignSelf: "center",
    borderRadius: 100,
  },
  verifiedText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#0F0",
    alignSelf: "center",
  },
  verifyBTN: {
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#C49102",
    width: 90,
    alignSelf: "center",
    margin: 10,
  },
  verifyBTNText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1C2120",
  },
  loadingIndicator: {
    marginTop: 50,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileInfoText: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#FBFCF8",
  },
  profileInfoAvailability: {
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
    marginRight: 5,
    bottom: 10,
  },
});
