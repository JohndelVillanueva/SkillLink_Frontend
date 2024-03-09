import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Barangays from "../../Barangays";

const SetupWorkerProfileBarangayDropdown = () => {
  const [value, setValue] = useState(null);
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
        data={Barangays}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        activeColor="#F7FFE5"
        dropdownPosition="top"
        itemContainerStyle={{
          backgroundColor: "#F7FFE5",
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: "#1A5D1A",
        }}
        containerStyle={{
          backgroundColor: "#C4D7B2",
          borderWidth: 2,
          borderColor: "#F7FFE5",
          height: 500
        }}
        placeholder={!isFocus ? "Select Barangay" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default SetupWorkerProfileBarangayDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7FFE5",
    width: 250,
    height: 45,
    borderRadius: 25,
  },
  dropdown: {
    height: 45,
    borderWidth: 1,
    borderColor: "#1A5D1A",
    borderRadius: 25,
    paddingHorizontal: 8,
  },

  label: {
    position: "absolute",
    backgroundColor: "#F7FFE5",
    color: "#1A5D1A",
    left: 22,
    top: 3,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#1A5D1A",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "bold",
    top: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: "#F7FFE5",
    borderRadius: 20,
  },
});
