import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert  } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Barangays, { ip } from "../../Barangays";

const getSkillUrl = `${ip}api_skillLink/api/viewSkill.php`;


const SkillCheckBox = ({ navigation, route }) => {
  const [skills, setSkills] = useState([]);
  const [workerID, setWorkerID] = useState(null); // Initialize workerID as null
  const { email, password, user_type, firstname, lastname, contact, age, barangay } = route.params;
  // const [id, setId] = useState('');


  // useEffect(() => {
  //   // Function to get the worker ID from AsyncStorage
  //   const getWorkerId = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('workerreg');
  //       const user = JSON.parse(value);
  //       setWorkerID(user.id); // Set the worker ID from AsyncStorage
  //     } catch (error) {
  //       console.error('Error fetching worker ID from AsyncStorage:', error);
  //     }
  //   };

  //   getWorkerId(); // Call the function to get the worker ID

  //   fetchData(); // Fetch skills after getting the worker ID
  // }, []); // Make sure to pass an empty dependency array to useEffect// Make sure to pass an empty dependency array to useEffect

  useEffect(() =>{
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(getSkillUrl);
      const data = response.data.map((item) => ({
        ...item,
        checked: false, // Add a checked property to each skill
      }));

      setSkills(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedSkills = skills.map((skill, i) => ({
      ...skill,
      checked: i === index ? !skill.checked : false, // Toggle the clicked skill and clear others
    }));
    setSkills(updatedSkills);
  };

  const handleSave = async () => {
    const selectedSkill = skills.find((skill) => skill.checked);
  
    try {
      if (selectedSkill) {
        navigation.navigate('SecondarySkillCheckBox', {
          email,
          password,
          user_type,
          firstname,
          lastname,
          contact,
          age,
          barangay,
          primarySkill: {
            skill_id: selectedSkill.value,
            skill_status: 1,
          },
        });
      } else {
        Alert.alert('Alert', 'Please select a skill before proceeding.');
      }
    } catch (error) {
      console.error('Error navigating to SecondarySkillCheckBox:', error);
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <View style={styles.setupProfileContainer}>
        <Text style={styles.heading}>Choose your PRIMARY skill</Text>
        {skills.map((skill, index) => (
          <TouchableOpacity
            key={skill.id}
            style={styles.itemContainer}
            onPress={() => handleCheckboxChange(index)}
          >
            <Text style={styles.label}>{skill.label}</Text>
            <View
              style={[
                styles.checkbox,
                skill.checked && styles.checked,
              ]}
            >
              {skill.checked && (
                <Text style={{ color: '#F7FFE5' }}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SkillCheckBox;

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
  heading: {
    fontSize: 40,
    color: "#FBFCF8",
    fontWeight: "bold",
    marginTop: 18,
    textAlign: 'center'
  },
  saveButton: {
    backgroundColor: "#C49102",
    width: 70,
    height: 40,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  saveText: {
    fontSize: 22,
    color: "#1C2120",
    fontWeight: 'bold'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2.5,
    borderColor: '#1C2120',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 70,
    backgroundColor: '#FBFCF8',
  },
  checked: {
    backgroundColor: '#C49102',
  },
  label: {
    flex: 1,
    marginLeft: 10,
    fontSize: 20,
    color: '#FBFCF8',
    fontWeight: 'bold',
    marginLeft: 70,
  },
});

