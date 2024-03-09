import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const UserRequest = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Ratings </Text>
      <View style={styles.ratingContainer}></View>
      <View>
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => navigation.navigate("Status", { name: "Status" })}
        >
          <Text style={styles.rateBtnText}>Rate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A0C49D",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#F7FFE5",
    margin: 20,
  },
  ratingContainer: {
    width: "80%",
    height: 300,
    backgroundColor: "#F7FFE5",
    textAlignVertical: "top",
    padding: 20,
    marginBottom: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1A5D1A",
  },
  rateButton: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E1ECC8",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    elevation: 3,
    bottom: 100,
  },
  rateBtnText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#A0C49D",
  },
});
