import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import BarangayDropdown from "../../components/dropdowns/BarangayDropdown";
import axios from "axios";
import Barangays, { ip } from "../../Barangays";
import AsyncStorage from "@react-native-async-storage/async-storage";



const url = `${ip}api_skillLink/api/postSignUpUser.php`

const SetupProfile = ({ navigation, route }) => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [barangay, setBarangay] = useState("");
  const {email, password, user_type} = route.params;


  const handleValueChange = (value) => {
    setBarangay(value);
  };

  const handleSetup = async () => {
    // Implement your signup logic here
    if (firstname !== '' && lastname !== '' && contact !== '' && barangay !== '') {
      try {
        const resp = await axios.post(url, { email, password, user_type, firstname, lastname, contact, barangay });
        console.log('REGISTERED: ', resp.data);
      } catch (error) {
        console.log(error.response);
      }
      Alert.alert('Registered', 'You can now login your account.')
      navigation.navigate('Login');
    }
    else {
      Alert.alert(
        "Empty Fields",
        "Please fill out everything!",
        [
          {
            text: "OK",
          },
        ]
      )
    }
  };

  // const userID = async () => {
  //   try {
  //     const userRegData = await AsyncStorage.getItem("userreg");
  //     if (userRegData) {
  //       const userData = JSON.parse(userRegData);
  //       setId(userData.id);
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving user data:", error);
  //   }
  // };

  // useEffect(() => {
  //   userID();
  // }, []);



  return (
    <View style={styles.container}>
      <View style={styles.setupProfileContainer}>
        <Text style={{ fontSize: 40, color: "#FBFCF8", fontWeight: "bold" }}>
          Setup your Profile
        </Text>

        <View>
          <Text style={styles.formText}> First Name </Text>
          <TextInput
            style={styles.input}
            value={firstname}
            onChangeText={setFirstName}
          />
          <Text style={styles.formText}>Last Name </Text>
          <TextInput
            style={styles.input}
            value={lastname}
            onChangeText={setLastName}
          />
          <Text style={styles.formText}>Contact Number </Text>
          <TextInput
            style={styles.input}
            value={contact}
            onChangeText={setContact}
            keyboardType="number-pad"
          />
          <Text style={styles.formText}> Barangay </Text>
          <View style={{ top: 65 }}>
            <BarangayDropdown onValueChange={handleValueChange} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSetup}
        >
          <Text style={styles.saveText}> Save </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default SetupProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    justifyContent: "center",
    alignItems: "center",
  },
  setupProfileContainer: {
    backgroundColor: "#707070",
    width: "90%",
    height: 550,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  formText: {
    fontSize: 20,
    fontWeight: "bold",
    top: 60,
    color: "#FBFCF8",
    textAlign: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    padding: 10,
    backgroundColor: "#FBFCF8",
    alignSelf: "center",
    top: 50,
    borderRadius: 15,
  },
  saveButton: {
    backgroundColor: "#C49102",
    width: 70,
    height: 40,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    top: 90,
  },
  saveText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#1C2120",
  },
});
