import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import Axios
import { ip } from '../../Barangays';

const Settings = ({ navigation }) => {
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [userId, setUserId] = useState('');

  const getPasswordURL = `${ip}api_skillLink/api/getInformation.php?id=${userId}`;
  const updatePasswordURL = `${ip}api_skillLink/api/updatePassword.php`;

  const toggleChangePasswordModal = () => {
    setChangePasswordModalVisible(!isChangePasswordModalVisible);
  };

  useEffect(() => {
    // Fetch user ID from AsyncStorage when the component mounts
    const fetchUserId = async () => {
      try {
        const userSessionJSON = await AsyncStorage.getItem('usersession');
        const userData = JSON.parse(userSessionJSON);
        setUserId(userData.id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserId();
  }, []);

  const checkCurrentPassword = async () => {
    try {
      const response = await axios.get(getPasswordURL);
      console.log('API Response:', response.data); // Log the entire response
      return response.data.password;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  
  const handleChangePassword = async () => {
    const storedPassword = await checkCurrentPassword();
    console.log(storedPassword);

    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
        Alert.alert('Please fill out all fields', 'All password fields are required.');
        return;
      }

      if (storedPassword === null) {
          Alert.alert('Error', 'An error occurred while fetching the current password. Please try again.');
          return;
        }

        if (currentPassword !== storedPassword) {
            Alert.alert('Incorrect current password', 'Please enter the correct current password.');
            return;
          }

        if (newPassword !== confirmNewPassword) {
          Alert.alert('Password mismatch', 'New password and confirmation must match.');
          return;
        }

          // Make a PUT request to update the password in the database
          const updateResponse = await axios.put(updatePasswordURL, {
            id: userId,
            password: newPassword,
          });
          console.log(updateResponse.data)


          toggleChangePasswordModal();
          Alert.alert('Password Updated', 'Your password has been successfully updated.');

  };

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={backButton}
        style={{
          position: 'absolute',
          top: 25,
          alignSelf: 'flex-start',
          padding: 10,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#FBFCF8" />
      </TouchableOpacity>
      <Text style={styles.titletStyle}>Settings</Text>
      <View style={styles.settingContainer}>
        <TouchableOpacity style={{backgroundColor: 'white', margin: 5, borderRadius: 10, elevation: 5 }} onPress={toggleChangePasswordModal}>
          <Text style={styles.textSetting}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isChangePasswordModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={text => setCurrentPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={text => setConfirmNewPassword(text)}
          />
          <TouchableOpacity style={styles.buttons} onPress={handleChangePassword}>
            <Text style={styles.buttontext}>Change Password </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={toggleChangePasswordModal}>
            <Text style={styles.buttontext}>Cancel </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2120',
  },
  titletStyle: {
    fontSize: 45,
    color: '#FBFCF8',
    fontWeight: 'bold',
    bottom: 50,
  },
  settingContainer: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
    marginTop: -30,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
    backgroundColor: '#C49102',
  },
  textSetting: {
    fontSize: 20,
    color: '#1C2120',
    fontWeight: 'bold',
    padding: 20,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2120',
  },
  modalTitle: {
    fontSize: 30,
    color: '#FBFCF8',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  input: {
    width: '80%',
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FBFCF8'
  },
  buttons: {
    backgroundColor: '#C49102',
    width: '50%',
    padding: 10,
    borderRadius: 10,
    margin: 3
  },
  buttontext: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1C2120'
  }
});
