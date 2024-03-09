import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  LogBox,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formStyle } from "../../components/user-components/FormStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';



const FirstStep = (props) => {

  
  const navigation = useNavigation();
  const [id, setId] = useState(null);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date()); // Initialize with the current date
  const [birthPlace, setBirthPlace] = useState("");
  const [address, setAddress] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  useEffect(() => {
    // Retrieve the user ID from AsyncStorage when the component mounts
    const fetchUserId = async () => {
      try {
        const userSessionJSON = await AsyncStorage.getItem("usersession");
        if (userSessionJSON) {
          const userData = JSON.parse(userSessionJSON);
          setId(userData.id)
          setFirstName(userData.firstname)
          setLastName(userData.lastname)
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    fetchUserId(); // Call the function to fetch the user ID
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Fix time zone offset issue by setting the time zone offset to zero
      selectedDate = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()));
      setBirthDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const navigateToNextScreen = () => {
    if (firstname.trim() === "" || lastname.trim() === "" || birthPlace.trim() === "" || address.trim() === "") {
      // Display an alert if any of the fields are empty
      Alert.alert("Please fill out all fields", "All fields are required to proceed.");
    } else {
      // Create an object with the data you want to pass, including the user ID
      const userData = {
        id,
        firstname,
        lastname,
        birthDate,
        birthPlace,
        address,
      };

      // Navigate to the next screen and pass the data as route params
      navigation.navigate("SecondStep", { userData });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProfileWorkerUI", { name: "ProfileWorkerUI" })
        }
        style={{
          position: "absolute",
          top: 25,
          alignSelf: "flex-start",
          padding: 10,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#F7FFE5" />
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              alignSelf: "center",
              top: 20,
              color: "#FBFCF8",
            }}
          >
            Step 1: Information
          </Text>
        </View>

        <View>
          <Text style={formStyle.formText2}>First Name</Text>
          <TextInput
            style={formStyle.input2}
            keyboardType="default"
            value={firstname}
            onChangeText={(text) => setFirstName(text)}
          />
          <Text style={formStyle.formText3}>Last Name</Text>
          <TextInput
            style={formStyle.input3}
            keyboardType="default"
            value={lastname}
            onChangeText={(text) => setLastName(text)}
          />
          <Text style={formStyle.formText4}>Date of Birth</Text>
          <TouchableOpacity onPress={showDatePickerModal} 
          style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {birthDate.toDateString()}
            </Text>
          </TouchableOpacity>
          <View style={{marginVertical: 20, right: 50}}> 
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date(2024, 10, 20)}
              dateFormat=""

            />
          )}
          </View>
          <Text style={formStyle.formText5}>Place of Birth</Text>
          <TextInput
            style={formStyle.input5}
            keyboardType="default"
            value={birthPlace}
            onChangeText={(text) => setBirthPlace(text)}
          />
          <Text style={formStyle.formText6}>Address</Text>
          <TextInput
            style={formStyle.input6}
            keyboardType="default"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
        </View>

        <View style={{ bottom: 40 }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              borderRadius: 20,
              elevation: 3,
              backgroundColor: "#C49102",
              width: 90,
              alignSelf: "center",
            }}
            onPress={navigateToNextScreen}
          >
            <Text style={{ fontWeight: "bold", fontSize: 22, color: "#1C2120" }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    justifyContent: "center",
    alignItems: "center",
  },
  registerContainer: {
    backgroundColor: "#707070",
    borderRadius: 20,
    width: 300,
    height: 500,
    top: 10,
    marginTop: 40,
  },
  dateContainer: {
    top: 10,
    alignSelf: 'center', 
    backgroundColor: '#FBFCF8', 
    height: 35,
    width: 220,
    borderRadius: 20,
  },
  dateText: {
    alignSelf: 'center', 
    fontWeight: 'bold', 
    color: '#1C2120', 
    top: 5, 
    fontSize: 18
  }
});

export default FirstStep;
