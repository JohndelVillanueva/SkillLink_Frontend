import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import Barangays, { ip } from "../../Barangays";


const EditProfileBarangayDropdown = ({ value, onValueChange }) => {

  const url = `${ip}api_skillLink/api/viewBarangay.php`;

  const [barangays, setBarangays] = useState([]);

  useEffect(() => {
    // async function getKind() {
    //    const { data } = await ForceApi.post(/GetKindPensionController.php)
    //    setpPensionKind(data.pension);
    // }

    const loadBarangays = async () => {
      const response = await axios.get(url);
      // navigate.to('/homescreen')
      setBarangays(response.data)
    }

    loadBarangays();
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
        data={barangays}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        activeColor="#FBFCF8"
        dropdownPosition="top"
        itemContainerStyle={{
          backgroundColor: "#FBFCF8",
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: "#1C2120",
        }}
        containerStyle={{
          backgroundColor: "#707070",
          borderWidth: 2,
          height: 500
        }}
        placeholder={!isFocus ? "Select Barangay" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onValueChange(item);
          // console.log('ITEM:', item)
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default EditProfileBarangayDropdown;

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
  label: {
    position: "absolute",
    backgroundColor: "#1C2120",
    color: "#C49102",
    left: 22,
    top: 3,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
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
