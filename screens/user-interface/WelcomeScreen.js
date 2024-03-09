import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = () => {
  const [user, setUser] = useState('')

  const getUser = async () => {
    try {
      const userSessionJSON = await AsyncStorage.getItem("usersession");
      if (userSessionJSON) {
        const userData = JSON.parse(userSessionJSON);
        setUser(userData.firstname);
        console.log('user-name:', userData.firstname)
      }

    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);



  return (
    <View style={styles.container}>

      <ImageBackground
        style={styles.img}
        resizeMode="contain"
        source={require('../../assets/WelcomeScreen.jpeg')}>

        <View>
          <Text style={styles.userName}>{user}</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}> Continue </Text>
        </TouchableOpacity>

      </ImageBackground>


    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A0C49D'
  },

  img: {
    height: '100%',
    width: '100%',
    marginBottom: 100,
  },
  userName: {
    alignSelf: 'center',
    fontSize: 35,
    marginTop: 160,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    alignSelf: 'center',
    marginTop: 450,
    backgroundColor: '#F7FFE5',
    borderRadius: 10,
    padding: 5
  },

  buttonText: {
    fontSize: 25,
    color: '#1A5D1A',
  }
}
)