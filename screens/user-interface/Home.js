import React, { useState, useRef, useEffect } from "react";
import { TouchableOpacity, Text, View, PanResponder, StyleSheet, LogBox } from "react-native";
import NavBar from "../../components/user-components/NavBar";
import EditProfileBarangayDropdown from "../../components/dropdowns/EditProfileBarangayDropdown";
import WorkDropdown from "../../components/dropdowns/WorkDropdown";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import axios from "axios";
import { ip } from "../../Barangays";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
// import {unregisterIndieDevice, registerIndieID} from 'native-notify';



const Home = ({ navigation }) => {
  const [barangay, setBarangay] = useState({});
  const [skill, setSkill] = useState({});
  const [userId, setUserId] = useState('');
  const [totalMessageCount, setTotalMessageCount] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userType, setUserType] = useState("");

  LogBox.ignoreLogs(['Error fetching inboxes:']);


  useEffect(() => {
    const getWorkerId = async () => {
      try {
        const userSessionJSON = await AsyncStorage.getItem("usersession");
        const userData = JSON.parse(userSessionJSON);
        const usertype = userData.user_type;
        const id = userData.id;
        setUserId(id);
        setUserType(usertype);
      } catch (error) {
        console.error("Error getting worker ID:", error);
      }
    };

    getWorkerId();

    const fetchData = async () => {
      try {
        const response = await axios.get(`${ip}api_skillLink/api/getAllConversation.php?id=${userId}`);
        if (response.data) {
          // Calculate total message count for the user
          const totalMessages = response.data.reduce((total, inbox) =>  total + inbox.total, 0);
          setTotalMessageCount(totalMessages);

          // Calculate new message count for the user
          const newMessages = response.data.reduce((total, inbox) => total + (inbox.total > 0 ? 1 : 0), 0);
          setNewMessageCount(newMessages);
        } else {
          console.error('Invalid data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching inboxes:', error);
      }
    };

    fetchData();

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

    // Fetch data initially
    if (userId && userType) {
      handleNotification(userId, userType);
    }

    // Set up an interval for auto-refreshing
    const refreshInterval = setInterval(() => {
      if (userId && userType) {
        fetchData();
        handleNotification(userId, userType);
      }
    }, 1000); // Refresh every 60 seconds

    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [userId, userType]);
  


  const handleBarangayValueChange = (valueBarangay) => {
    setBarangay(valueBarangay);
  };

  const handleSkillValueChange = (valueSkill) => {
    setSkill(valueSkill);
  };


  const initHome = async () => {
    const value = await AsyncStorage.getItem('usersession');
    const user = JSON.parse(value)
  }

  initHome()

  // registerIndieID(userId, 14918, 'tNVXoI0KJjP1KsBmR0cxzb');


  const handleSearchWorker = async () => {
    navigation.navigate("SearchResult", {
      selectedSkill: skill,      // Pass the selected skill
      selectedBarangay: barangay // Pass the selected barangay
    })
    console.log('SKILL:', skill)
    console.log('BARANGAY:', barangay)
  }

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


  const swipeToRight = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dx > 10,
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        toggleModal();
      }
    },
  });
     
  const handleLogOut = async () => {
    await AsyncStorage.removeItem("usersession");
    // unregisterIndieDevice(userId, 14918, 'tNVXoI0KJjP1KsBmR0cxzb');
    navigation.navigate("Login", { name: "Login" });
    
  };
  

  

  return (
    
    <View style={styles.container} 
    ref={modalRef}
          {...swipeToRight.panHandlers} >
            
             {/* Star Icon */}
    <TouchableOpacity
      style={{ position: 'absolute', top: 30, alignSelf: 'flex-end', margin: 10, right: 5 }}
      onPress={() => navigation.navigate('FollowedWorkers')}
    >
      <FontAwesome name={'star-o'} size={30} color="#C49102" />
    </TouchableOpacity>

      {/* MODAL DRAWER */}
      {/* Drawer Icon */}
       <TouchableOpacity
          style={{position: 'absolute', top: 30, alignSelf: 'flex-start', margin: 5}}
          onPress={toggleModal}
        ><AntDesign name="bars" size={40} color="#C49102" /></TouchableOpacity>

        

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
          borderTopRightRadius: 20}}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{  padding: 10, backgroundColor: '#1C2120', margin: 5, borderRadius: 10 }}
        onPress={() => {
          navigation.navigate('Settings')
          toggleModal()
        }}
      ><Text style={{alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#FBFCF8'}}>Settings</Text></TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{  padding: 10, backgroundColor: '#1C2120', margin: 5, borderRadius: 10 }}
        onPress={() => {
          navigation.navigate('AboutUs')
          toggleModal()
        }}
      ><Text style={{alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#FBFCF8'}}>About Us</Text></TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{  padding: 10, backgroundColor: '#1C2120', margin: 5, borderRadius: 10  }}
        onPress={() => {
          handleLogOut()
          toggleModal()
        }}
      ><Text style={{alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#FBFCF8'}}>Logout</Text></TouchableOpacity>
    </View>
        </Modal>



      <View style={styles.titleContainer}>
        <Text style={styles.title}>SkillLink</Text>
        <View style={styles.searchContainer}>
          <View>
            <View style={{ zIndex: 1 }}>
              <Text
                style={{
                  color: "#FBFCF8",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Available Service
              </Text>
              <View>
                <WorkDropdown value={skill} onValueChange={handleSkillValueChange} />
              </View>
            </View>

            <View style={{ bottom: 55 }}>
              <Text
                style={{
                  top: 80,
                  color: "#FBFCF8",
                  fontWeight: "bold",
                  fontSize: 18,
                  margin: 2
                }}
              >
                Barangay
              </Text>
              <View style={{ top: 80 }}>
                <EditProfileBarangayDropdown value={barangay} onValueChange={handleBarangayValueChange} />
              </View>
            </View>
            <View style={{ zIndex: -1, top: 70 }}>
              <TouchableOpacity
                onPress={handleSearchWorker}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  borderRadius: 20,
                  elevation: 3,
                  backgroundColor: skill.value && barangay.value ? "#C49102" : "#C49102",
                  width: 100,
                  alignSelf: "center",
                }}
                disabled={!skill.value || !barangay.value} // Disable the button when either skill or barangay is not selected
              >
                <Text
                  style={{ color: "#1C2120", fontWeight: "bold", fontSize: 22 }}
                >
                  Find
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </View>
      

      <NavBar notificationCount={notificationCount} totalMessageCount={totalMessageCount} newMessageCount={newMessageCount} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    bottom: 100,
    alignItems: "center",
  },
  searchContainer: {
    top: 100,
  },

  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#C49102",
  },
});
