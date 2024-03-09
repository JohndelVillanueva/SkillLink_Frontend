import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image  } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ip } from '../../Barangays';

const FollowedWorkers = ({ navigation, route, status }) => {
  const [followedWorkers, setFollowedWorkers] = useState([]);
  const [userID, setUserID] = useState('')
  const [userType, setUserType] = useState('')
  const [id, setID] = useState('')

  const backButton = async () => {
    try {
      const userSessionJSON = await AsyncStorage.getItem('usersession')
      const userData = JSON.parse(userSessionJSON);
      const userType = userData.user_type
      if (userType === 2){
        navigation.navigate('ProfileWorkerUI')
      } else if (userType === 3){
        navigation.navigate('Home')
      } else {
        console.error()
      }
    
    } catch (error) {
      console.log(error)
    }
  }
  

  useEffect(() => {
    const getWorkerId = async () => {
      try {
        const userSessionJSON = await AsyncStorage.getItem('usersession');
        const userData = JSON.parse(userSessionJSON);
        const userid = userData.id;
        const usertype = userData.user_type
        setUserID(userid); // Set userId state with the user's ID
        setUserType(usertype)
        console.log('USER ID: ', userid)
        console.log('USERTYPE: ', usertype)
      } catch (error) {
        console.error("Error getting worker ID:", error);
      }
    };

    getWorkerId();

    const fetchFollowedWorkers = async () => {
      try {
        const response = await axios.get(`${ip}api_skillLink/api/displayFavoriteWorker.php?id=${userID}&user_type=${userType}`);
        setFollowedWorkers(response.data);
        setID(response.data)
        console.log('RESPONSE: ', response.data);
      } catch (error) {
        console.error('Error fetching followed workers:', error);
      }
    };

    fetchFollowedWorkers();
  }, [userID]);

  const handleUnfollow = async (id) => {
    try {
  
      // Send a request to the server to unfollow the worker
      const response = await axios.delete(`${ip}api_skillLink/api/removeFavoriteWorker.php?id=${id}`);
      console.log('DELETED ID:', id);
  
      // Remove the unfollowed worker from the state
      setFollowedWorkers((prevWorkers) => prevWorkers.filter((worker) => worker.id !== id));
    } catch (error) {
      console.error("Error unfollowing worker:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={backButton}
        style={{
          position: "absolute",
          top: 25,
          alignSelf: "flex-start",
          padding: 10,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#C49102" />
      </TouchableOpacity>
      <Text style={styles.title}>Favorite Workers</Text>
      {followedWorkers.map((worker, index) => (
  <View key={index} style={styles.workerItem}>
    <TouchableOpacity>
      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 25, top: 50, marginLeft: 50 }}>
        {worker.first_name + ' ' + worker.last_name}
      </Text>
      <Image
        source={{ uri: `${ip}api_skillLink/uploads/${worker.profile_image}` }}
        style={{ width: 65, height: 65, borderRadius: 100, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#1C2120' }}
      />
    </TouchableOpacity>
  <TouchableOpacity style={{width: '25%', borderRadius: 10, alignSelf: 'flex-end', backgroundColor: '#D33333'}} onPress={() => handleUnfollow(worker.id)}>
  <Text style={{ color: '#1C2120', alignSelf: 'center', fontSize: 18,  }}>
    Remove
  </Text>
</TouchableOpacity>


  </View>
))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1C2120',  
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    alignSelf: 'center',
    color: '#FBFCF8',
    marginBottom: 20
    
  },
  workerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default FollowedWorkers;
