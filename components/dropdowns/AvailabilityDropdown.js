import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const AvailabilityDropdown = ({ value, onValueChange }) => {
  const [availability, setAvailability] = useState(false);
  const [valueAvailability, setValueAvailability] = useState(null);
  const [itemsAvailability, setItemsAvailability] = useState([
    { label: "Available", value: "1" },
    { label: "Not Available", value: "2" },
  ]);

  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "#1A5D1A" }]}>
          Availability
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={{ zIndex: 1000, top: 100 }}>
      {renderLabel()}
      <DropDownPicker
        open={availability}
        value={valueAvailability}
        items={itemsAvailability}
        setOpen={setAvailability}
        setValue={setValueAvailability}
        setItems={setItemsAvailability}
        placeholder="Availability"
        dropDownDirection="BOTTOM"
        style={{
          width: 220,
          height: 30,
          alignSelf: "center",
          backgroundColor: "#F7FFE5",
          borderColor: "transparent",
          borderRadius: 25,
          bottom: 30,
          borderWidth: 1,
          borderColor: "#1A5D1A",
        }}
        itemContainerStyle={{
          backgroundColor: "#F7FFE5",
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: "#1A5D1A",
        }}
        labelStyle={{
          fontWeight: "bold",
          color: "#1A5D1A",
        }}
        textStyle={{
          fontSize: 15,
          color: "#1A5D1A",
        }}
        dropDownContainerStyle={{
          backgroundColor: "#F7FFE5",
          borderWidth: 2,
          borderColor: "#1A5D1A",
          width: 260,
          padding: 5,
          alignSelf: "center",
          top: 10,
        }}
        onChange={(item) => {
          onValueChange(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default AvailabilityDropdown;

const styles = StyleSheet.create({});
