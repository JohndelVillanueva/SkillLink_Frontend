import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ListResult from "../../components/user-components/ListResult";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { ip } from "../../Barangays";


const SearchResult = ({ route }) => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);

  const { selectedSkill, selectedBarangay } = route.params;
  const [workers, setWorkers] = useState([]);


  useEffect(() => {
    const handleSearchWorker = async () => {
      setTimeout(() => {
        setShowActivityIndicator(false); // Hide the ActivityIndicator after 2 seconds
      }, 350);

      console.log('SKILL:', selectedSkill)
      console.log('BARANGAY:', selectedBarangay)
      const getURL = `${ip}api_skillLink/api/viewWorker.php?skill_id=${selectedSkill.value}&barangay_id=${selectedBarangay.value}`
      try {
        const response = await axios.get(getURL);
        console.log('response: ', response.data);
        setWorkers(response.data);
        setIsLoading(false); // Set loading to false after the data is fetched
      } catch (error) {
        console.error("Error fetching worker data:", error);
        setIsLoading(false); // Set loading to false in case of an error
      }
    };
    handleSearchWorker()

  }, []);


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      }}
      automaticallyAdjustContentInsets={true}
      scrollEnabled={true}
    >
      {showActivityIndicator ? (
        <ActivityIndicator size="large" color="#1A5D1A" style={styles.activityIndicator} />
      ) : (
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{
              position: "relative",
              alignSelf: "flex-start",
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#C49102" />
          </TouchableOpacity>
          <Text style={styles.titleWorkStyle}>{selectedSkill.label}</Text>
          <Text style={styles.titleBarangayStyle}>{selectedBarangay.label}</Text>
          {workers.length === 0 ? (
            <View style={styles.listContainer}>
            <Text style={styles.noWorkersMessage}>No workers available in this area</Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {workers.map((worker, index) => (
                <ListResult key={index} worker={worker} />
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default SearchResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50
  },
  titleWorkStyle: {
    fontSize: 40,
    color: "#FBFCF8",
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: 'center'
  },
  titleBarangayStyle: {
    fontSize: 20,
    color: "#FBFCF8",
    fontWeight: "bold",
    alignSelf: "center",
  },
  listContainer: {
    width: 300,
    backgroundColor: "transparent",
    flexDirection: "column",
    gap: 20,
    alignItems: 'center'
  },
  workerList: {
    backgroundColor: "#2E3239",
    borderWidth: 2,
    borderColor: "#A2B2EE",
    width: "100%",
    flexDirection: "column",
    height: 120,
  },
  workerImage: {
    width: 90,
    height: 90,
    top: 12,
  },
  workerInfoContainer: {
    marginLeft: 100,
    bottom: 65,
    flexDirection: "row",
    gap: 5,
  },
  workerInfo: {
    color: "#A2B2EE",
  },
  stars: {
    width: 10,
    height: 10,
    top: 5,
    left: 8,
  },
  activityIndicator: {
    flex: 1,
    marginTop: '100%',
    alignItems: "center",
    padding: 30
  },
  noWorkersMessage: {
    fontSize: 18,
    color: "#FBFCF8",
    marginTop: 50,
  },
});