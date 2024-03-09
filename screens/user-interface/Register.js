import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { formStyle } from "../../components/user-components/FormStyle";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from "axios";
import { ip } from "../../Barangays";


const Register = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user_type = 3;


  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  let hasError = false;

  // PASSWORD 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
  const [isConfirmPasswordInputFocused, setIsConfirmPasswordInputFocused] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');


  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
};

const handlePasswordInputFocus = () => {
  setIsPasswordInputFocused(true);
};

const handlePasswordInputBlur = () => {
  setIsPasswordInputFocused(false);
};

const toggleShowConfirmPassword = () => { 
  setShowConfirmPassword(!showConfirmPassword); 
};

const handleConfirmPasswordInputFocus = () => {
  setIsConfirmPasswordInputFocused(true);
};

const handleConfirmPasswordInputBlur = () => {
  setIsConfirmPasswordInputFocused(false);
};


const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
};

const handleSignup = async () => {
  const url = `${ip}api_skillLink/api/checkEmailExist.php?email=${email}`
  
  // checkIfEmailIsExisting();
  setEmailError('');
  setPasswordError('');
  setConfirmPasswordError('');

  try {
    const resp = await axios.get(url)
    if (resp.data.success == false) {
      setEmailError('Email is already existed');
      hasError = true
    } else {
      console.log('true')
      hasError = false
    }
    
  } catch (error) {
  }

  if (email === '') {
    setEmailError("Email is required");
    hasError = true;
  } else if (!validateEmail(email)) {
    setEmailError("Invalid email format");
    hasError = true;
  }

  if (password === '') {
    setPasswordError("Password is required");
    hasError = true;
  }

  if (confirmPassword === '') {
    setConfirmPasswordError("Confirm password is required");
    hasError = true;
  }

  if (password !== confirmPassword) {
    setConfirmPasswordError("Passwords do not match");
    hasError = true;
  }

  if (!hasError) {
    navigation.navigate('SetupProfile', { email, password, user_type });
    console.log(email);
    console.log(password);
    console.log(user_type);
  }
};


  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login", { name: "Login" })}
        style={{
          position: "absolute",
          top: 25,
          alignSelf: "flex-start",
          padding: 10,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#C49102" />
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <View>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              alignSelf: "center",
              top: 20,
              color: "#FBFCF8",
            }}
          >
            Create a New Account
          </Text>
        </View>

        <View>
          <Text style={styles.emailErrorText}>{emailError}</Text>
          <Text style={formStyle.formText2}>Email</Text>
          <TextInput style={formStyle.input2}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}> 
          <Text style={styles.passwordErrorText}>{passwordError}</Text>
          <Text style={formStyle.formText3}>Password</Text>
          <TextInput
            style={formStyle.input3}
            value={password}
            secureTextEntry={!showPassword}
            onFocus={handlePasswordInputFocus}
            onBlur={handlePasswordInputBlur}
            onChangeText={setPassword}
            
          />
           {isPasswordInputFocused && (
          <MaterialCommunityIcons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#aaa"
                    style={styles.icon} 
                    onPress={() => {
                      toggleShowPassword()
                      toggleShowConfirmPassword()
                    }} 
                /> 
                )}
          <View style={styles.confirmPasswordContainer}> 
          <Text style={styles.confirmPasswordErrorText}>{confirmPasswordError}</Text>
          <Text style={formStyle.formText3}>Confirm Password</Text>
          <TextInput
            style={formStyle.input3}
            value={confirmPassword}
            secureTextEntry={!showPassword}
            onFocus={handleConfirmPasswordInputFocus}
            onBlur={handleConfirmPasswordInputBlur}
            onChangeText={setConfirmPassword}
          />

          {isConfirmPasswordInputFocused && (
          <MaterialCommunityIcons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#aaa"
                    style={styles.icon} 
                    onPress={() => {
                      toggleShowPassword()
                      toggleShowConfirmPassword()
                    }} 
                /> 
                )}
            </View>
          </View>
        </View>

        <View style={{ top: 10 }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              borderRadius: 20,
              elevation: 3,
              backgroundColor: "#C49102",
              width: 120,
              alignSelf: "center",
            }}
            onPress={handleSignup}

          >
            <Text
              style={{ fontWeight: "bold", fontSize: 22, color: "#1C2120" }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ top: 30 }}>
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
            }}
          >
            Join as a WORKER
          </Text>
        </View>
        {/* <View>
          <Text style={{ alignSelf: "center", top: 75, color: "#1A5D1A" }}>
            {" "}
            OR{" "}
          </Text>
        </View> */}
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
    elevation: 3,
  },
  icon: {
    position: 'absolute',
    right: 50,
    top: 70
}, 
passwordContainer: {
  justifyContent: 'center',
},
confirmPasswordContainer: {
  bottom: 17,
  justifyContent: 'center',
},

emailErrorText: {
  color: 'red',
  top: 120,
  right: 40,
  alignSelf: 'flex-end'
},
passwordErrorText: {
  color: 'red',
  top: 100,
  right: 40,
  alignSelf: 'flex-end'
},

confirmPasswordErrorText: {
  color: 'red',
  top: 100,
  right: 40,
  alignSelf: 'flex-end'
},

});


export default Register;
