import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import BarangayDropdown from "../../components/dropdowns/BarangayDropdown";
import axios from "axios";
import Barangays, { ip } from "../../Barangays";
import AsyncStorage from "@react-native-async-storage/async-storage";




const url = `${ip}api_skillLink/api/postSignUpWorker.php`

const SetupWorkerProfile = ({ navigation, route }) => {
  const [id, setId] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [age, setAge] = useState("");
  const [barangay, setBarangay] = useState("");
  const {email, password, user_type} = route.params;

  const handleValueChange = (value) => {
    setBarangay(value);
  };

  const handleSetup = async () => {
    // Implement your signup logic here
    if (firstname !== '' && lastname !== '' && contact !== '' && age !== '' && barangay !== '') {
      try {
        navigation.navigate('SkillCheckBox', {
          email, 
          password, 
          user_type,
          firstname,
          lastname,
          contact,
          age,
          barangay
        })
        // const resp = await axios.post(url, { id, email, password, user_type, firstname, lastname, contact, age, barangay });
        // console.log('WORKER REGISTERED: ', resp.data);
        // const userData = resp.data; // Assuming userData is the received user data
       
        // const workerRegData = {
        //   id: userData.id,
        //   email: userData.email,
        //   first_name: userData.firstname,
        // };
        //   try {
        //   await AsyncStorage.setItem('workerreg', JSON.stringify(workerRegData));
        //     const value = await AsyncStorage.getItem('workerreg');
        //     navigation.navigate('SkillCheckBox', { id });
        // }
        // catch (error) {
        //   console.log(error.response);
        // }
      }
      catch (error) {
        console.log(error.response);
      }
      
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

  // const workerID = async () => {
  //   try {
  //     const workerRegData = await AsyncStorage.getItem("workerreg");
  //     if (workerRegData) {
  //       const userData = JSON.parse(workerRegData);
  //       setId(userData.id);
  //       // console.log('ASYNC ID: ', userData.id)
  //     }
  //   } catch (error) {
  //     console.error("Error retrieving user data:", error);
  //   }
  // };

  // useEffect(() => {
  //   workerID();
  // }, []);



  return (

    <View style={styles.container}>
      <View style={styles.setupProfileContainer}>
        <Text style={{ fontSize: 40, color: "#FBFCF8", fontWeight: "bold", top: 10 }}>
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
            keyboardType="phone-pad"
          />
          <Text style={styles.formText}>Age </Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
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

export default SetupWorkerProfile;

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
    height: 630,
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
    top: 100,
    elevation: 3,
  },
  saveText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#1C2120",
  },
});
