import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  LogBox
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { ip } from "../../Barangays";
import axios from "axios";
import { FontAwesome } from '@expo/vector-icons';
import Stars from 'react-native-stars';



const Item = ({ title }) => (
  <View>
    <Text style={styles.items}>{title}</Text>
  </View>
);

const WorkersProfile = ({ navigation, route }) => {
  const { worker } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);

  const [bioData, setBioData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);

  const [skillsData, setSkillsData] = useState([]);
  const [secondarySkillsData, setSecondarySkillsData] = useState([]);


  const [userId, setUserId] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  // const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [barangay, setBarangay] = useState('');
  // const [email, setEmail] = useState("");


  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null)


  const [bio, setBio] = useState("");

  const [experience, setExperience] = useState("");

  const [skills, setSkills] = useState("");
  const [secondarySkill, setSecondarySkills] = useState("");

  const [proof, setProof] = useState("");



  const [ratings, setRatings] = useState('');
  const [availability, setAvailability] = useState('');








  useEffect(() => {
    const getWorkerInformation = async () => {

      setTimeout(() => {
        setShowActivityIndicator(false); // Hide the ActivityIndicator after 2 seconds
      }, 500);

      try {
        const response = await axios.get(`${ip}api_skillLink/api/getInformation.php?id=${worker.worker_id}`);
        console.log('response:', response.data)
        // Verify that response.data contains the expected fields
        if (response.data) {
          setUserId(response.data.id);
          setSkills(response.data.skills[0].skill_name)
          setSecondarySkills(response.data.skills[0].secondary_skill_name)

          setFirstname(response.data.first_name);
          setLastname(response.data.last_name);

          // Set the barangay to the name if not null; otherwise, keep the current value
          setBarangay(response.data.brgy_name);

          setAge(response.data.age);
          // setContact(response.data.phone_number);
          // setEmail(response.data.email);

          setExperienceData(response.data.experiences)
          setSkillsData(response.data.skills.skill_id)
          setSecondarySkillsData(response.data.secondary_skill_id)
          setProfileImage(response.data.profile_image);
          setBio(response.data.bio)

          // const bioResponse = await getBioData(userData.id);
          // setBioData(bioResponse.bios.bio);
          // setBioDataLoaded(true);

          setIsLoading(false);
          LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        } else {
          // Handle the case where userSessionJSON is not available
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setIsLoading(false);
      }
    };

    getWorkerInformation();
  }, []);



  return (
    <View style={styles.container}>
      {showActivityIndicator ? ( // Display the ActivityIndicator for 2 seconds
        <ActivityIndicator size="large" color="#1A5D1A" style={styles.activityIndicator} />
      ) : (
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Home", { selectedSkill: worker.skill_id, selectedBarangay: worker.brgys_id })
            }
            style={{
              position: "absolute",
              top: 25,
              alignSelf: "flex-start",
              padding: 10,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#F7FFE5" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <View>
              <Image
                source={{ uri: `${ip}api_skillLink/uploads/${profileImage}` }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfoContainer}>
              <Text style={{ color: "#C49102",
                    alignSelf: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                }}>  Primary Skill</Text>
                <Text style={styles.profileInfoSkill}>{skills}</Text>
                <Text style={{ color: "#C49102",
                    alignSelf: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                }}>  Secondary Skill</Text>
                <Text style={styles.profileInfoSecondarySkill}>{secondarySkill}</Text>
                <Text style={{ color: "#C49102",
                    alignSelf: "center",
                    fontWeight: "bold",
                    fontSize: 20,
                }}>{firstname} {lastname} </Text>
                <Text style={styles.profileInfoText}> {age} yrs. old </Text>
                <Text style={styles.profileInfoText}>{barangay} </Text>
                {/* <Text style={styles.profileInfoText}>{contact} </Text>
                <Text style={styles.profileInfoText}>{email}</Text> */}
                {/* insert stars for ratings */}
                <Text style={styles.profileInfoText}>Available</Text>
                <Stars
              default={worker.average_rating}
              spacing={5}
              count={5}
              starSize={14}
              fullStar={<FontAwesome name="star" size={14} color="#F4C430" />}
              emptyStar={<FontAwesome name="star-o" size={14} color="#F4C430" />}
              halfStar={<FontAwesome name="star-half" size={14} color="#F4C430" />}
              disabled={true} />
              </View>
            </View>
            <View style={styles.bioContainer}>
              <Text style={{ fontWeight: "bold", color: "#1C2120", margin: 10, fontSize: 20 }}>
                Worker's Bio
              </Text>
              <Text
                style={{ color: "#1C2120", margin: 10, width: 250, fontSize: 16, fontWeight: "bold" }}
                numberOfLines={5}
              >
                {bio}
              </Text>
            </View>
            <View style={styles.experienceContainer}>
              <Text style={{ fontWeight: "bold", color: "#1C2120", margin: 10, fontSize: 20 }}>
                Experiences
              </Text>
              <View style={styles.experienceContent}>
                <FlatList
                  data={experienceData}
                  renderItem={({ item }) => <Item title={item.title} />}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </View>
            <View style={styles.skillContainer}>
              <Text style={{ fontWeight: "bold", color: "#1C2120", margin: 10, fontSize: 20 }}>
                Skills
              </Text>
              <View style={styles.skillContent}>
                {/* <FlatList
                  data={skillsData}
                  renderItem={({ item }) => <Item title={item.name} />}
                  keyExtractor={(item) => item.id}
                /> */}
                 <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 16}}>{skills}</Text>
                 <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 16}}>{secondarySkill}</Text>

              </View>
            </View>
            
            {/* <View style={styles.proofContainer}>
              <Text style={{ fontWeight: "bold", color: "#1C2120", margin: 10, fontSize: 20 }}>
                Proofs
              </Text>
              <View style={styles.proofContent}></View>
            </View> */}

            <TouchableOpacity
              style={styles.hireButton}
              onPress={() =>
                navigation.navigate("UserRequest", {
                  worker: worker, // Pass worker_id as a parameter
                })
              }
            >
              <Text style={{ color: "#1C2120", fontWeight: "bold", fontSize: 22 }}>
                Hire Me!
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default WorkersProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#707070",
    justifyContent: "center",
  },
  profileContainer: {
    backgroundColor: "#1C2120",
    borderRadius: 20,
    width: "95%",
    paddingBottom: "50%",
    top: 100,
  },
  profileImage: {
    width: 200,
    height: 200,
    margin: 20,
    alignSelf: "center",
    borderRadius: 100,
    borderRadius: 100,
    borderColor: '#FBFCF8',
    borderWidth: 2
  },
  profileInfoContainer: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FBFCF8',
  },
  profileInfoSkill: {
    color: "#1C2120",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileInfoSecondarySkill: {
    color: "#1C2120",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileInfoText: {
    color: "#1C2120",
    alignSelf: "center",
    fontWeight: "bold",
  },
  bioContainer: {
    margin: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FBFCF8'
  },
  experienceContainer: {
    margin: 10,
    height: 150,
    borderRadius: 5,
    backgroundColor: '#FBFCF8'
  },
  experienceContent: {
    margin: 10,
  },
  skillContainer: {
    margin: 10,
    height: 100,
    borderRadius: 5,
    backgroundColor: '#FBFCF8'
  },

  skillContent: {
    margin: 10,
  },
  proofContainer: {
    margin: 10,
    height: 150,
    borderRadius: 5,
    backgroundColor: '#FBFCF8'
  },
  proofContent: {
    margin: 10,
  },
  hireButton: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#C49102",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    elevation: 3,
  },
  items: {
    borderWidth: 0.5,
    color: "black",
    margin: 2,
    padding: 3,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});
