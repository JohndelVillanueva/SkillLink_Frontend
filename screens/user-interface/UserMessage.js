import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LogBox } from 'react-native';
import {ip} from '../../Barangays'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../../components/user-components/NavBar'; // Assuming you have a NavBar component
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Badge } from 'react-native-elements'


const UserMessage = ({navigation}) => {
  const [inboxes, setInboxes] = useState([]);
  const [userId, setUserId] = useState('')
  const is_seen = 1;

  
  const [totalMessageCount, setTotalMessageCount] = useState(0)
  const [newMessageCount, setNewMessageCount] = useState(0);

  //NOTIFICATION COUNT
  const [notificationCount, setNotificationCount] = useState(0);
  const [userType, setUserType] = useState("");





  useEffect(() => {
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

    const fetchData = async () => {
      try {
        const response = await axios.get(`${ip}api_skillLink/api/getAllConversation.php?id=${userId}`);
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
        handleNotification(userId, userType);
      }
    }, 1000); // Refresh every 60 seconds

    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [userId, userType, notificationCount, totalMessageCount, newMessageCount]);


  // useEffect(() => {
  //   const getInfo = async () => {
  //     try {
  //       const userSessionJson = await AsyncStorage.getItem('usersession')
  //       const userData = JSON.parse(userSessionJson)
  //       const id = userData.id;
  //       setUserId(id)
  //     } catch (error) {
        
  //     }
  //   }
    
  //   getInfo();

    
  // }, [userId, userType, notificationCount]);

  LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
  LogBox.ignoreLogs(['JSON Parse error: Unexpected token: <']);
  LogBox.ignoreLogs(['Invalid data format:']);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Message</Text>
      <View style={styles.inboxContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {inboxes.map((inbox) => (
            <TouchableOpacity
              key={inbox.id}
              onPress={() => {
                navigation.navigate('UserConversations', {  
                  inbox: inbox.inbox_id,
                  inboxFirstName: inbox.first_name,
                  inboxLastName: inbox.last_name,
                  inboxWorkerId: inbox.user_id
                })
                const updateSpecificInboxMessages = async () => {
                            try {
                              const resp = await axios.put(`${ip}api_skillLink/api/updateSpecificInbox.php`, {
                                user_id: userId,
                                is_seen: is_seen,
                                reference_id: inbox.inbox_id,
                              });
                              console.log(`Inbox with ID ${inbox.inbox_id} updated successfully`);
                            } catch (error) {
                              console.error("Error updating inbox messages:", error);
                            }
                          };
                          updateSpecificInboxMessages();
              }
            }
              style={styles.inboxItem}
            >
              <Text style={styles.inboxText}>{inbox.first_name} {inbox.last_name}</Text>
              {inbox.total > 0 && (
                      <Badge
                        value={inbox.total}
                        status="error"
                        containerStyle={{ position: 'absolute', alignSelf: 'flex-end', right: 3, top: 5 }}
                      />
                    )}
              <Ionicons name="mail-outline" size={20} color="#FBFCF8" style={{ alignSelf: 'flex-end' }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <NavBar notificationCount={notificationCount} totalMessageCount={totalMessageCount} newMessageCount={newMessageCount}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2120',
    alignItems: 'center',
    paddingTop: 80,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#FBFCF8',
  },
  inboxContainer: {
    padding: 10,
    width: '90%',
    height: '80%',
    backgroundColor: '#707070',
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  inboxItem: {
    width: 300,
    borderWidth: 1, 
    borderColor: '#FBFCF8',
    borderRadius: 5,
    padding: 3,
    marginBottom: 10,
    backgroundColor: '#1C2120',
    elevation: 5
  },
  inboxText: {
    fontSize: 18, 
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserMessage;
