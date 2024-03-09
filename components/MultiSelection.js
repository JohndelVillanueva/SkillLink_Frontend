import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import axios from "axios";


const url = 'http://192.168.0.102/api_skillLink/api/viewSkill.php';

const MultiSelection = () => {


  const [skills, setSkills] = useState([]);

  useEffect(() => {

    const loadSkills = async () => {
      const response = await axios.get(url);
      console.log('skills:', response.data);
      setSkills(response.data)
    }

    loadSkills();
  }, []);

  function pickSkills(selectedSkills) {
    // const index = skills.findIndex((Skills) => Skills === selectedSkills);

    if (skills.includes(selectedSkills)) {
      setSkills(skills.filter((Skills) => Skills !== selectedSkills));
      return;
    }

    setSkills((Skills) => Skills.concat(selectedSkills));
  }
  return (
    <View style={styles.container}>
      <View style={styles.options}>
        {skills.map((option) => (
          <View key={option.value} style={styles.skills}>
            <TouchableOpacity
              style={styles.checkBox}
              onPress={() => pickSkills(option.value)}
            >
              {skills.includes(option.value) && (
                <Feather
                  name="check"
                  size={20}
                  color="#1A5D1A"
                  style={styles.check}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.skillOption}> {option.label} </Text>
          </View>
        ))}
      </View>
    </View>
  );


};

export default MultiSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  skills: {
    flexDirection: "row",
    marginVertical: 7,
  },
  options: {
    alignSelf: "flex-start",
  },
  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#1A5D1A",
    borderRadius: 7,
    marginRight: 5,
  },
  skillOption: {
    textTransform: "capitalize",
    fontSize: 16,
    color: "#1A5D1A",
    fontWeight: "bold",
  },
  check: {
    alignSelf: "center",
  },
});