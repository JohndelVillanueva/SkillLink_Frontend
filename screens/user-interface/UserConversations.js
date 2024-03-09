import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import axios from 'axios'
import {ip} from '../../Barangays'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';


const UserConversations = ({ route, navigation}) => {
 // const { conversationId, workerName } = route.params; // Assuming you pass the conversationId and workerName as route parameters
  const { worker, inbox, inboxFirstName, inboxLastName, inboxWorkerId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // const [sendMessage, setSendMessage] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [userId, setUserId] = useState('')
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [inboxID, setInboxID] = useState('');
  const [currentInboxID, setCurrentInboxID] = useState('');

  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacterCount = 500;


  useEffect(() => {
    const getInfo = async () => {
      try {
        const userSessionJson = await AsyncStorage.getItem('usersession')
        const userData = JSON.parse(userSessionJson)
        const id = userData.id;
        setUserId(id)
        // setFirstname(worker.first_name)
        // setLastname(worker.last_name)
      } catch (error) {
        
      }
    }
    
    getInfo();
    fetchEmployerMessages();

  }, []);


  useEffect(() => {
    const getAllInboxID = async () => {
      try {
        const response = await axios.get(`${ip}api_skillLink/api/getAllConversation.php?id=${userId}`);
        const allInboxData = response.data;
        setInboxID(allInboxData);
        // Assuming you want to select the first inbox by default
        setCurrentInboxID(allInboxData.inbox_id);
        setFirstname(inboxFirstName)
        setLastname(inboxLastName)
        setWorkerId(inboxWorkerId)
      } catch (error) {
        console.log(error);
      }
    };
    
    getAllInboxID();
  }, [userId]);

 
  const fetchEmployerMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${ip}api_skillLink/api/getInboxID.php?inbox_id=${inbox}`);
      // Now allMessages is an array of arrays containing messages for each inbox
      setMessages(response.data); // flatten the array if needed
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    fetchEmployerMessages();
  }, [inbox]);
  

  const handleSend = async () => {
    const postMessageURL = `${ip}api_skillLink/api/postMessage.php`;
    try {
      const response = await axios.post(postMessageURL, {
        message: newMessage,
        inbox_id: inbox,
        sender_id: userId,
        receiver_id: workerId
      });
      // You might want to refresh the messages after sending a new one
      setNewMessage(''); // Clear the input field
      Keyboard.dismiss();

      setTimeout(() => {
        fetchEmployerMessages(); // Call the function to fetch messages
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const scrollViewRef = useRef();

  return (
    <View style={styles.container}>
        <TouchableOpacity
            onPress={() =>
              navigation.navigate("UserMessage")
            }
            style={{
              position: "absolute",
              top: 25,
              alignSelf: "flex-start",
              padding: 10,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FBFCF8" />
          </TouchableOpacity>
          <View style={styles.profileContainer}></View>
      <Text style={styles.title}>{firstname} {lastname}</Text>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingVertical: 10,  alignItems: 'center' }}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
{messages.map((message) => (
  <View key={message.id} style={message.sender_id === userId ? styles.userMessage : styles.workerMessage}>
    <Text style={styles.messageText}>{message.message}</Text>
  </View>
))}


</ScrollView>
<View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={(text) => {
            setNewMessage(text);
            setCharacterCount(text.length);
          }}
          maxLength={maxCharacterCount}
        />
        <Text style={{ color: '#FBFCF8', marginRight: 10 }}>
          {characterCount}/{maxCharacterCount}
        </Text>
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: newMessage ? '#3498db' : '#A9A9A9' }]}
          onPress={handleSend}
          disabled={!newMessage} // Disable the button when newMessage is empty
        >
          <Text style={{ color: '#FFFFFF' }}>Send</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FBFCF8',
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
    width: '90%',
    backgroundColor: '#707070',
    borderRadius: 20,
    marginVertical: 10,
  },
  userMessage: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    maxWidth: '80%',
    marginVertical: 5,
    alignSelf: 'flex-end',
    marginHorizontal: 5,
    padding: 10,
  },
  workerMessage: {
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    maxWidth: '80%',
    marginVertical: 5,
    alignSelf: 'flex-start',
    marginHorizontal: 5,
    padding: 10,
  },
  messageText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 50
  },
  sendButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 10,
  },
});

export default UserConversations;
