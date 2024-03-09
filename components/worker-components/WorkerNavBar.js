import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {  
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,} from "@expo/vector-icons";
import axios from "axios";
import { ip } from "../../Barangays";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Badge } from 'react-native-elements'


const WorkerNavBar = ({notificationCount, newMessageCount}) => {
  const navigation = useNavigation();
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState();
  const is_seen = 1;  


  const notificationOnPress = async () => {
    try {
      const resp = await axios.put(`${ip}api_skillLink/api/UpdateIsSeen.php`, {id: userId, is_seen: is_seen})
      navigation.navigate("NotificationWorkerUI", { name: "NotificationWorkerUI" })
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    const getUserData = async () => {
      try {
        const userSessionJSON = await AsyncStorage.getItem("usersession");
        if (userSessionJSON) {
          const userData = JSON.parse(userSessionJSON);
          const id = userData.id;
          setUserId(id);
          setUserType(userData.user_type);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    getUserData();
  }, []);

  // const handleUserIconPress = () => {
  //   if (userType === 2) {
  //     navigation.navigate("ProfileWorkerUI", { name: "ProfileWorkerUI" });
  //   } else {
  //     navigation.navigate("Home");
  //   }
  // };

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity  onPress={() =>
          navigation.navigate("ProfileWorkerUI", { name: "ProfileWorkerUI" })
        }>
        <FontAwesome name="user" size={40} style={styles.icons} />
      </TouchableOpacity>
      <TouchableOpacity
          onPress={() =>
            navigation.navigate("WorkerMessage", { name: "WorkerMessage" })
          }
        >
          {newMessageCount > 0 && (
            <Badge
              value={newMessageCount}
              status="error"
              containerStyle={{
                position: "absolute",
                alignSelf: "flex-end",
                zIndex: 1,
              }}
            />
          )}
          <Image 
            source={require('../../assets/message.png')}
            style={{width: 40, height: 40}}
          />
        </TouchableOpacity>
        <TouchableOpacity
            onPress={notificationOnPress}
          style={styles.badgeContainer} // Add the badgeContainer style
        >
           {notificationCount > 0 && (
          <Badge value={notificationCount} status="error" containerStyle={{position:'absolute', alignSelf: "flex-end", zIndex: 1}}/>
          )}
          <Ionicons
            name="notifications"
            size={40}
            style={styles.icons}
            onPress={notificationOnPress}
          />
        </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("StatusWorkerUI", { name: "StatusWorkerUI" })
        }
      >
        <MaterialCommunityIcons name="list-status" size={40} style={styles.icons} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icons: {
    color: "#1C2120",
  },
  navContainer: {
    flex: 1,
    backgroundColor: "#C49102",
    width: "100%",
    height: 70,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  badgeContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default WorkerNavBar;
