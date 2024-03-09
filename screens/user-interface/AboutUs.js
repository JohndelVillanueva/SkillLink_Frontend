import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from '@react-native-async-storage/async-storage';

const AboutUs = ({ navigation }) => {

  const backButton = async () => {
    try {
      const userSessionJSON = await AsyncStorage.getItem('usersession');
      const userData = JSON.parse(userSessionJSON);
      const userType = userData.user_type;
      if (userType === 2) {
        navigation.navigate('ProfileWorkerUI');
      } else if (userType === 3) {
        navigation.navigate('Home');
      } else {
        console.error();
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      

      <ScrollView
        contentContainerStyle={styles.scrollViewContent} // Added contentContainerStyle
      >
        <TouchableOpacity
        onPress={backButton}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color="#C49102" />
      </TouchableOpacity>

            <Text  style={{ fontWeight: 'bold', fontSize: 22, color: '#1C2120', marginBottom: 5}}>
            About SkillLink
        </Text>
        <Text  style={{  fontSize: 16, color: '#FBFCF8'}}>
        Welcome to SkillLink, where we are dedicated to closing the skills gap and building a brighter future for Mexico Pampanga. Our mission is to connect skilled workers with potential employers through a user-friendly platform, fostering economic vibrancy in the community.
        </Text>
        <Text  style={{ fontWeight: 'bold', fontSize: 18, color: '#1C2120', marginVertical: 5}}>
        Our Vision
        </Text>
        <Text  style={{ fontSize: 16, color: '#FBFCF8'}}>
        At SkillLink, we envision a world where skills and opportunities collide, creating a powerful force for positive change. We believe in empowering communities, creating jobs, and driving sustainable development.
        </Text>
        <Text  style={{ fontWeight: 'bold', fontSize: 18, color: '#1C2120', marginVertical: 5}}>
        What Sets Us Apart
        </Text>
        <Text  style={{ fontSize: 16, color: '#FBFCF8'}}>
        Our commitment to simplicity sets us apart. SkillLink offers a straightforward interface that effortlessly connects people with diverse skill sets to a myriad of work possibilities. We understand the importance of creating an accessible and inclusive platform that benefits both job seekers and employers.
        </Text>
        <Text  style={{ fontWeight: 'bold', fontSize: 18, color: '#1C2120', marginVertical: 5}}>
        Community Empowerment
        </Text>
        <Text  style={{fontSize: 16, color: '#FBFCF8'}}>
        SkillLink is more than just a platform; it's a catalyst for change. By bridging the gap between skilled workers and employers, we contribute to the economic vibrancy of neighborhoods. Join us on our journey to empower communities, elevate lives, and build a stronger, more prosperous Mexico Pampanga.
        </Text>
        <Text  style={{ fontWeight: 'bold', fontSize: 18, color: '#1C2120', marginVertical: 5}}>
        Our Call to Action
        </Text>
        <Text  style={{ fontSize: 16, color: '#FBFCF8'}}>
        We invite you to be a part of our mission. Join SkillLink, and together, let's shape a future where skills and opportunities converge to create a stronger, more prosperous community. Your skills are the key to unlocking new possibilities, and SkillLink is here to guide you on your path to success.
        </Text>
        <Text  style={{ fontWeight: 'bold', fontSize: 12, color: '#FBFCF8', marginVertical: 20, alignSelf: 'center', textAlign: 'center'}}>
        SkillLink - Connecting Skills, Creating Opportunities, Building Futures.
        </Text>
        <Text  style={{ fontWeight: 'bold', fontSize: 12, color: '#FBFCF8', marginVertical: 10, alignSelf: 'center'}}>
        SkillLink - All Right Reserved 2023
        </Text>



      {/* <Text numberOfLines={10} style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: '#FBFCF8'}}>
      SkillLink is committed to bridging the skills gap between skilled workers and potential employers. Our simple interface connects people with different skill sets and work possibilities, fostering economic vibrancy in the neighborhood.
</Text>
<Text numberOfLines={10} style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: '#FBFCF8'}}>
Join us in our goal to empower communities, create jobs, and promote development. SkillLink is the key to a brighter future, where skills and opportunity collide to build a stronger, more prosperous Mexico Pampanga.
</Text> */}
 </ScrollView>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
  },
  scrollViewContent: {
    backgroundColor: '#707070',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    paddingTop: 50, // Adjusted paddingTop for the content to start below the header

  },
  backButton: {
    position: "absolute",
    padding: 15,
    zIndex: 1
  },
});