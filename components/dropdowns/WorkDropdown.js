import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { ip } from "../../Barangays";

const url = `${ip}api_skillLink/api/viewSkill.php`;

const WorkDropdown = ({ value, onValueChange }) => {



  const [skills, setSkills] = useState([]);

  useEffect(() => {

    const loadSkills = async () => {
      const response = await axios.get(url);
      setSkills(response.data);
    }

    loadSkills();
  }, []);

  const [isFocus, setIsFocus] = useState(false);


  return (
    <View style={styles.container}>

      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#E1ECC8" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={skills}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        activeColor="#FBFCF8"
        dropdownPosition="bottom"
        itemContainerStyle={{
          backgroundColor: "#707070",
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: "#FBFCF8",
        }}
        containerStyle={{ backgroundColor: "#707070", height: 500 }}
        placeholder={!isFocus ? "Select Service" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onValueChange(item);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default WorkDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#707070",
    width: 300,
    height: 65,
    borderRadius: 25,
    elevation: 3,
  },
  dropdown: {
    height: 65,
    borderRadius: 25,
    paddingHorizontal: 8,
    borderColor: '#FBFCF8',
    borderWidth: 2
  },

  dropdown: {
    height: 65,
    borderRadius: 25,
    paddingHorizontal: 8,
    borderColor: '#FBFCF8',
    borderWidth: 2
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#FBFCF8",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FBFCF8",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: "#1C2120",
    borderRadius: 20,
  },
});
