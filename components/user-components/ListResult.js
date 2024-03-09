import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ip } from "../../Barangays";
import { FontAwesome } from "@expo/vector-icons";
import Stars from "react-native-stars";

const ListResult = ({ worker }) => {
  const navigation = useNavigation();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const getWorkerAvailability = async () => {
      const getURL = `${ip}api_skillLink/api/getInformation.php?id=${worker.worker_id}`;
      const resp = await axios.get(getURL);
      setIsAvailable(resp.data.is_available);
      setIsVerified(resp.data.is_verified);
    };

    getWorkerAvailability();

    // Set up an interval for auto-refreshing
    const refreshInterval = setInterval(() => {
      getWorkerAvailability();
    }, 1000); // Refresh every 60 seconds

    // Clear the interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const {
    first_name,
    last_name,
    brgy_name,
    age,
    reviews,
    profile_image,
    worker_id,
    average_rating,
  } = worker;

  return (
    isAvailable !== "not available" && isAvailable !== 0 ? (
    <TouchableNativeFeedback
      onPress={() => {
        navigation.navigate("WorkersProfile", { worker });
      }}
    >
      <View style={styles.workerList}>
        <Image
          source={{ uri: `${ip}api_skillLink/uploads/${profile_image}` }}
          style={styles.workerImage}
        />
        <Text style={styles.availability}>
          {isAvailable ? "Available" : "Not Available"}
        </Text>
        {isVerified === 1 && (
          <Text style={styles.verifiedText}>Verified Worker</Text>
        )}
        <View style={styles.workerInfoContainer}>
          <Text style={styles.workerInfo}>Name: </Text>
          <Text style={[styles.workerInfo, { marginLeft: 19 }]}>
            {first_name}
          </Text>
        </View>
        <View style={styles.workerInfoContainer}>
          <Text style={styles.workerInfo}>Barangay: </Text>
          <Text style={styles.workerInfo}>{brgy_name}</Text>
        </View>
        <View style={styles.workerInfoContainer}>
          <Text style={styles.workerInfo}>Age: </Text>
          <Text style={[styles.workerInfo, { marginLeft: 31 }]}>{age}</Text>
        </View>
        <View style={styles.workerInfoContainer}>
          <Text style={styles.workerInfo}>Reviews: </Text>
          <View style={{ top: 5 }}>
            <Stars
              default={average_rating}
              spacing={5}
              count={5}
              starSize={14}
              fullStar={
                <FontAwesome name="star" size={14} color="#F4C430" />
              }
              emptyStar={
                <FontAwesome name="star-o" size={14} color="#F4C430" />
              }
              halfStar={
                <FontAwesome name="star-half" size={14} color="#F4C430" />
              }
              disabled={true}
            />
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
      ) : (
        <View style={styles.workerList}>
        <Image source={{ uri: `${ip}api_skillLink/uploads/${profile_image}` }} style={styles.workerImage} />
        <Text style={styles.availability}>
          {isAvailable ? "Available" : "Not Available"}
        </Text>
        <View style={styles.workerInfoContainer}>
          <Text style={styles.workerInfo}>Pangalan: </Text>
          <Text style={styles.workerInfo}>{first_name} {last_name}</Text>
        </View>
        <View style={styles.workerInfoContainer}>
          <Text style={styles.workerInfo}>Barangay: </Text>
          <Text style={styles.workerInfo}>{brgy_name}</Text>
        </View>
        <View style={styles.workerInfoContainer}>
          <Text style={styles.workerInfo}>Age: </Text>
          <Text style={[styles.workerInfo, { marginLeft: 31 }]}>{age}</Text>
        </View>
        <View style={styles.workerInfoContainer}>
          <Text style={styles.workerInfo}>Reviews: </Text>
          <View style={{top: 5,}}> 
            <Stars
              default={average_rating}
              spacing={5}
              count={5}
              starSize={14}
              fullStar={<FontAwesome name="star" size={14} color="#F4C430" />}
              emptyStar={<FontAwesome name="star-o" size={14} color="#F4C430" />}
              halfStar={<FontAwesome name="star-half" size={14} color="#F4C430" />}
              disabled={true} />
              </View>
        </View>
      </View>
      )
  );
};

export default ListResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E3239",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 0.8,
  },
  titleWorkStyle: {
    fontSize: 40,
    color: "#F7FFE5",
    fontWeight: "bold",
    alignSelf: "center",
  },
  titleBarangayStyle: {
    fontSize: 20,
    color: "#A2B2EE",
    fontWeight: "bold",
    alignSelf: "center",
  },
  listContainer: {
    top: 70,
    width: 300,
    height: 700,
    backgroundColor: "transparent",
    flexDirection: "column",
    gap: 20,
  },
  workerList: {
    backgroundColor: "#707070",
    flexDirection: "column",
    width: 350,
    height: 125,
    alignSelf: "center",
    top: 10,
    elevation: 3,
    borderRadius: 15,
  },
  workerImage: {
    width: 90,
    height: 90,
    top: 15,
    borderRadius: 100,
    margin: 5,
    borderWidth: 2,
    borderColor: "#C49102",
  },
  workerInfoContainer: {
    marginLeft: 130,
    bottom: 100,
    flexDirection: "row",
    gap: 5,
  },
  workerInfo: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  availability: {
    alignSelf: "flex-end",
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 18,
    color: "#FBFCF8",
  },
  verifiedText: {
    position: "absolute",
    left: 5,
    top: 5,
    backgroundColor: "#C49102",
    color: "white",
    padding: 5,
    borderRadius: 5,
    fontWeight: "bold",
  },
});