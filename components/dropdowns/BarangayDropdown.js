import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { ip } from "../../Barangays";

const BarangayDropdown = ({ value, onValueChange }) => {

  const url = `${ip}api_skillLink/api/viewBarangay.php`

  const [barangays, setBarangays] = useState([])

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

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "#1A5D1A" }]}>
          Barangay
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#E1ECC8" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        dropdownPosition="top"
        data={barangays}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        activeColor="#FBFCF8"
        itemContainerStyle={{
          backgroundColor: "#FBFCF8",
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: "#1C2120",
        }}
        containerStyle={{ backgroundColor: "#707070", borderWidth: 2, height: 500 }}
        placeholder={!isFocus ? "Select Barangay" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onValueChange(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default BarangayDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#707070",
    width: 250,
    height: 45,
    borderRadius: 25,
  },
  dropdown: {
    height: 45,
    borderWidth: 1,
    borderColor: "#FBFCF8",
    borderRadius: 25,
    paddingHorizontal: 8,
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


