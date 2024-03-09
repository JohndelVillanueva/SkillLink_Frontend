// WHEN TRYING TO REOPEN THE APP WHILE THERE'S A LOGIN TOKEN, THE APP PROCEEDS TO LOGIN SCREEN INSTEAD OF HOME SCREEN
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ip } from "../../Barangays";
import { registerIndieID, getNotificationInbox } from 'native-notify';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
  const [ userId, setUserId] = useState('')

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   const getNotif = async () => {
  //     try {
  //       console.log("Fetching notifications...");
  //       let notifications = await getNotificationInbox(14918, 'tNVXoI0KJjP1KsBmR0cxzb');
  //       console.log("notifications: ", notifications);
  //       setData(notifications);
  //     } catch (error) {
  //       console.error("Error in push notification handling:", error);
  //     }
  //   };
  
  //   getNotif(); // Invoke the async function inside useEffect
  
  // }, []); // Empty dependency array means it runs once on mount
  


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordInputFocus = () => {
    setIsPasswordInputFocused(true);
  };

  const handlePasswordInputBlur = () => {
    setIsPasswordInputFocused(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (email === "") {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      hasError = true;
    }

    if (password === "") {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (!hasError) {
      const url = `${ip}api_skillLink/api/login.php`;
      try {
        const resp = await axios.post(url, { email, password });

        // Log the response data to see if it contains all the required fields
        console.log("Response Data:", resp.data);

        const userData = resp.data; // Assuming userData is the received user data

        const userSessionData = {
          id: userData.id,
          firstname: userData.first_name,
          lastname: userData.last_name,
          contact: userData.phone_number,
          age: userData.age,
          user_type: userData.user_type,
          barangay: userData.brgy_name,
          availability: userData.is_available,
          email: userData.email,
          password: userData.password,
          profile_image: userData.profile_image,
          rate: userData.rate,
          token: userData.token,
        };

        await AsyncStorage.setItem("usersession", JSON.stringify(userSessionData));

        // Check the user_type and navigate accordingly
        if (userData.user_type === 2) {
          // User is of type 2, navigate to the ProfileWorkerUI screen
          navigation.navigate("ProfileWorkerUI", { name: "ProfileWorkerUI" });
        } else if (userData.user_type === 3) {
          // Handle navigation for other user types (e.g., navigate to Home screen)
          navigation.navigate("Home", { name: "Home" });
        } else {
          setEmailError("Credentials didn't match!");
          setPasswordError("Credentials didn't match!");
        }

        const value = await AsyncStorage.getItem("usersession");
        const getValue = JSON.parse(value)
        console.log("usersession", value);
        setUserId(getValue.id)
      } catch (error) {
        console.log(error.response);
      }
    }
  };

// registerNNPushToken(16980, 'kkslSBPlq4SkoEsaV0lhjF');

  useEffect(() => {
    // Check for the existence of the token in AsyncStorage
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("usersession");
      if (token) {
        // Token exists, parse the user_type
        const userData = JSON.parse(token);
        if (userData.user_type === 2) {
          // User is of type 2, navigate to ProfileWorkerUI
          navigation.navigate("ProfileWorkerUI", { name: "ProfileWorkerUI" });
        } else {
          // Navigate to Home for other user types
          navigation.navigate("Home", { name: "Home" });
        }
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SkillLink</Text>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.emailErrorText}>{emailError}</Text>
        <View>
          <Text
            style={{
              fontSize: 35,
              fontWeight: "bold",
              alignSelf: "center",
              top: 20,
              color: "#FBFCF8",
            }}
          >
            Login
          </Text>
        </View>

        <View >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              alignSelf: "flex-start",
              left: 50,
              top: 60,
              color: "#FBFCF8",
            }}
          >
            Email
          </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <Text style={styles.passwordErrorText}>{passwordError}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                alignSelf: "flex-start",
                left: 50,
                top: 60,
                color: "#FBFCF8",
              }}
            >
              Password
            </Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={handlePasswordInputFocus}
              onBlur={handlePasswordInputBlur}
            />

            {isPasswordInputFocused && (
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={toggleShowPassword}
              />
            )}
          </View>
        </View>

        <View style={{ top: 40 }}>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
          >
            <Text style={{ color: "#C49102", fontWeight: "bold", fontSize: 22 }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ top: 110 }}>
          <Text
            onPress={() =>
              navigation.navigate("Register", { name: "Register" })
            }
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              textDecorationLine: "underline",
              color: "#FBFCF8",
              bottom: 30,
            }}
          >
            Create a New Account
          </Text>
        </View>

        <View style={{ top: 140 }}>
          <Text
            onPress={() =>
              navigation.navigate("WorkerRegistration", {
                name: "WorkerRegistration",
              })
            }
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              textDecorationLine: "underline",
              color: "#FBFCF8",
              bottom: 40,
            }}
          >
            Join as a WORKER
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    justifyContent: "center",
    alignItems: "center",
  },

  titleContainer: {
    flex: 0.8,
    top: 10,
  },

  title: {
    fontSize: 50,
    color: "#C49102",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#FBFCF8",
    alignSelf: "center",
    top: 50,
    borderRadius: 15,
    borderColor: "#1A5D1A",
    zIndex: 1, //REMOVE THIS LATER
  },
  loginContainer: {
    backgroundColor: "#707070",
    borderRadius: 20,
    width: 300,
    height: 458,
    position: "absolute",
    borderStyle: "dashed",
    elevation: 10,
  },

  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 5,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#1C2120",
    width: 90,
    alignSelf: "center",
    top: 20,
    shadowOffset: 10,
    elevation: 10,
  },

  icon: {
    position: 'absolute',
    right: 55,
    top: 110,
    zIndex: 1
}, 

passwordContainer: {
  justifyContent: 'center',
  bottom: 20,
},

emailErrorText: {
  color: 'red',
  top: 185,
  right: 50,
  alignSelf: 'flex-end'
},
passwordErrorText: {
  color: 'red',
  top: 145,
  right: 50,
  alignSelf: 'flex-end',
},
});

export default Login;
