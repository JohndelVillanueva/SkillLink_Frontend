import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Alert,
  ActivityIndicator,
  LogBox,
  Switch
} from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import BarangayDropdown from "../../components/dropdowns/BarangayDropdown";
import AvailabilityDropdown from "../../components/dropdowns/AvailabilityDropdown";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ip } from "../../Barangays";
import { useFocusEffect } from '@react-navigation/native';
import Stars from "react-native-stars";
import { FontAwesome } from "@expo/vector-icons";




const Item = ({ title }) => (
  <View>
    <Text style={styles.items}>{title}</Text>
  </View>
);

const EditWorkersProfileUI = ({ navigation }) => {

  //const [bioData, setBioData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [secondarySkillsData, setSecondarySkillsData] = useState([]);
  
  

  const [isLoading, setIsLoading] = useState(true);

  const [userId, setUserId] = useState('');
  const [worker_id, setWorker_id] = useState('')

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [barangay, setBarangay] = useState('');
  const [email, setEmail] = useState("");

  const [galleryPermission, setGalleryPermission] = useState(null)
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState('')


  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [secondarySkill, setSecondarySkills] = useState("");

  const [rating, setRating] = useState("");

  const [proof, setProof] = useState("");

  const [isAvailable, setIsAvailable] = useState(false); // Maintain a boolean state
  const [availabilityLabel, setAvailabilityLabel] = useState('Not Available'); // Maintain a label state
  
  const handleAvailabilityChange = (value) => {
    setIsAvailable(value); // Update the boolean state
    setAvailabilityLabel(value ? 'Available' : 'Not Available'); // Update the label state
  };
  

  // UPLOAD IMAGE


  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log('IMAGE:', image);

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      const imageUri = result.assets[0].uri;

      // Read the image file
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });

      const imageBase64 = "data:image/jpg;base64," + base64
      setImage(imageBase64);
      // 'base64Image' now contains the base64-encoded image string
      // let image = "data:image/jpg;base64," + base64;
      console.log('Base64 Image:', imageBase64.substring(0, 10));

    }

  };

  const handleSaveImage = async () => {
    const imageURL = `${ip}api_skillLink/api/imageVerification.php`;
    if (image) {
      const data = {
        profile_image: image,
        id: userId
      }

      try {
        const response = await axios.put(imageURL, data);
        //cant display the default image or uploaded image
        if (response.status === 200) {
          console.log('Image uploaded successfully:', response.data);
          console.log('FileName:', response.data.file_name)
          setProfileImage(response.data.file_name)
          console.log('ProfileImage: ', profileImage)
          toggleUploadModal();
        } else {
          console.log('Image upload failed with status:', response.status);
          Alert.alert('Error', 'Failed to save the image.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to save the image. ' + error.message);
      }
    } else {
      Alert.alert('No Image', 'Please upload an image before saving.');
    }
  };

  useEffect(() => {
    const displayProfileImage = async () => {
      const getURL = `${ip}api_skillLink/api/getInformation.php?id=${userId}`;
      try {
        const resp = await axios.get(getURL);
        setProfileImage(resp.data.profile_image);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    }

    displayProfileImage();
  }, [userId]);








  //PROFILE DATA

  // const [bioDataLoaded, setBioDataLoaded] = useState(false);

  const handleValueChange = value => {
    setBarangay(value);
  };


  const handleUpdateProfile = async () => {
    const url = `${ip}api_skillLink/api/verifyUser.php`;
  
    if (firstname !== '' && lastname !== '' && contact !== '' && age !== '') {
      if (barangay !== null) { // Check if barangay is not null
        const updatedData = {
          id: userId,
          firstname: firstname,
          lastname: lastname,
          contact: contact,
          age: age,
          barangay: barangay,
          is_available: isAvailable,
        };
  
        try {
          const response = await axios.put(url, updatedData);
          if (response.status === 200) {
            console.log('Profile updated successfully:', response.data);
            await AsyncStorage.setItem("usersession", JSON.stringify(updatedData));
  
            setFirstname(updatedData.firstname);
            setLastname(updatedData.lastname);
            setContact(updatedData.contact);
            setAge(updatedData.age);
            setBarangay(updatedData.barangay);
            toggleEditProfileModal();
            console.log('BARANGAY: ', barangay);
            console.log('AVAILABILITY: ', availabilityLabel);
          } else {
            console.log('Update failed with status:', response.status);
          }
        } catch (error) {
          console.log('Error updating data:', error.response);
        }
      } else {
        Alert.alert('Empty Fields', 'Please select a valid barangay!', [{ text: 'OK' }]);
      }
    } else {
      Alert.alert('Empty Fields', 'Please fill out everything!', [{ text: 'OK' }]);
    }
  };
  
  



  useFocusEffect(
    React.useCallback(() => {
      const getProfileData = async () => {
        try {
          const userSessionJSON = await AsyncStorage.getItem("usersession");
          const userData = JSON.parse(userSessionJSON);

          if (userData) {
            const response = await axios.get(`${ip}api_skillLink/api/getInformation.php?id=${userData.id}`);

            // Verify that response.data contains the expected fields
            if (response.data) {
              setUserId(userData.id);
              setFirstname(response.data.first_name);
              setLastname(response.data.last_name);

              // Set the barangay to the name if not null; otherwise, keep the current value
              setBarangay(response.data.brgy_name);

              setAge(response.data.age);
              setContact(response.data.phone_number);
              setEmail(response.data.email);
              setIsAvailable(response.data.is_available)
              setRating(response.data.ratings)

              getExpData(userData.id);
              getSkillsData(userData.id);

              // const bioResponse = await getBioData(userData.id);
              // setBioData(bioResponse.bios.bio);
              // setBioDataLoaded(true);


              getBioData(userData.id);

              setIsLoading(false);

              LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
            }
          } else {
            // Handle the case where userSessionJSON is not available
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
          setIsLoading(false);
        }
      };

      getProfileData(); // Call your profile data retrieval function here.
    }, [])
  );




  useEffect(() => {
    // Add a setTimeout to delay hiding the loading indicator
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // Adjust the duration (in milliseconds) as needed

    // Clear the timer if the component unmounts before the timeout
    return () => clearTimeout(timer);
  }, []);




  //BIO DATA


  const bioURL = ip + 'api_skillLink/api/updateWorkerBio.php'
  const updatedBio = {
    id: userId,
    bio: bio
  };

  const handleBio = async () => {
    try {
      const response = await axios.put(bioURL, updatedBio); // Use the correct URL (bioURL) for updating the bio
      console.log("Update response:", response.data);
      setBio(response.data.bio);
      toggleEditBioModal();
    } catch (error) {
      console.error("Update error:", error);
    }
  };



  const getBioData = async (userId) => {
    const getBioURL = `${ip}api_skillLink/api/getInformation.php?id=${userId}`
    try {
      const response = await axios.get(getBioURL);
      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data);
        setBio(response.data.bio);
      } else {
        console.log('Update failed with status:', response.status);
      }
    } catch (error) {
      console.log('Error updating data:', error.response);
    }
  }






  //EXPERIENCE DATA



  const expURL = ip + 'api_skillLink/api/insertExperience.php'
  const updatedExperienceData = {
    worker_id: userId,
    title: experience
  };

  const handleExp = async () => {
    try {
      const response = await axios.post(expURL, updatedExperienceData);
      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data);
        //navigation.navigate('Profile', { /* data you want to pass */ });
        setExperienceData(item => [...item, { id: userId, title: experience }]);
        toggleEditExperienceModal()
      } else {
        console.log('Update failed with status:', response.status);
      }
    } catch (error) {
      if (error.response) {
        console.log('handleExp - Server error:', error.response);
      } else {
        console.log('handleExp - Network error or other issue:', error.message);
      }
    }
  };



  const getExpData = async (userId) => {
    const getExpURL = `${ip}api_skillLink/api/getInformation.php?id=${userId}`
    try {
      const response = await axios.get(getExpURL);
      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data);
        setExperienceData(response.data.experiences);
      } else {
        console.log('Update failed with status:', response.status);
      }
    } catch (error) {
      console.log('Error updating data:', error.response);
    }
  }

  // useEffect(() => {
  //   getExpData();
  // }, []);


  // const expId = id;

  const handleDeleteExperience = async (id) => {
    const deleteExpURL = `${ip}api_skillLink/api/deleteData.php?id=${id}`;
    console.log(id)
    console.log('url', deleteExpURL)
    try {
      // Make an API request to delete the experience using its ID
      const response = await axios.delete(deleteExpURL);

      if (response.status === 200) {
        console.log('Experience deleted successfully:', response.data);
        // Filter the experienceData to remove the deleted experience
        setExperienceData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
      } else {
        console.log('Failed to delete experience with status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };







  //SKILLS DATA



  // const updatedSkillsData = {
  //   worker_id: userId,
  //   skill_id: skills
  // };

  const getSkillsData = async (userId) => {
    const getSkillURL = `${ip}api_skillLink/api/getInformation.php?id=${userId}`
    try {
      const response = await axios.get(getSkillURL);
      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data);
        setSkillsData(response.data.skill_id);
        setSecondarySkillsData(response.data.secondary_skill_id)
        setSkills(response.data.skills[0].skill_name)
        setSecondarySkills(response.data.skills[0].secondary_skill_name)
      } else {
        console.log('Update failed with status:', response.status);
      }
    } catch (error) {
      console.log('Error updating data:', error.response);
    }
  }



  const handleSkills = async () => {
    try {
      const response = await axios.post(skillURL, updatedSkillsData);
      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data);
        //navigation.navigate('Profile', { /* data you want to pass */ });
        setSkillsData(item => [...item, { id: userId, skill_id: skills }]);
        toggleEditSkillsModal()
      } else {
        console.log('Update failed with status:', response.status);
      }
    } catch (error) {
      if (error.response) {
        console.log('handleExp - Server error:', error.response);
      } else {
        console.log('handleExp - Network error or other issue:', error.message);
      }
    }
  };











  //PROOFS DATA



  const handleProof = async () => {
    try {
      const response = await axios.put(url, { proof });
      console.log("Update response:", response.data);
      navigation.navigate("EditWorkersProfileUI", {
        name: "EditWorkersProfileUI",
      });
      toggleEEditProofModal();
      // Handle success
    } catch (error) {
      console.error("Update error:", error);
      // Handle error
    }
  };



  //MODALS



  const [isEditProfileModalVisible, setEditProfileModalVisible] =
    useState(false);

  const toggleEditProfileModal = () => {
    setEditProfileModalVisible(!isEditProfileModalVisible);
  };

  const [isEditBioModalVisible, setEditBioModalVisible] = useState(false);

  const toggleEditBioModal = () => {
    setEditBioModalVisible(!isEditBioModalVisible);
  };

  const [isEditPExperienceModalVisible, setEditPExperienceModalVisible] =
    useState(false);

  const toggleEditExperienceModal = () => {
    // setExperienceData(item => [...item, { id: 10, title: 'sdaasdasda' }]);
    // experienceData.push({
    //   id: 10,
    //   title: 'sdaasdasda'
    // })
    setEditPExperienceModalVisible(!isEditPExperienceModalVisible);
  };

  const [isEditSkillsModalVisible, setEditSkillsModalVisible] = useState(false);

  const toggleEditSkillsModal = () => {


    setEditSkillsModalVisible(!isEditSkillsModalVisible);
  };

  const [isEditProofModalVisible, setEditProofModalVisible] = useState(false);

  const toggleEEditProofModal = () => {
    setEditProofModalVisible(!isEditProofModalVisible);
  };


  const [isUploadModalVisible, setUploadModalVisible] = useState(false);

  const toggleUploadModal = () => {
    setUploadModalVisible(!isUploadModalVisible);
};





  return (
    <View showsVerticalScrollIndicator={false} style={styles.container}>
      {isLoading ? (
        // Render the loading indicator
        <ActivityIndicator size="large" color="#1A5D1A" />
      ) : (
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}

        >

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProfileWorkerUI", { name: "ProfileWorkerUI" })
            }
            style={{
              position: "absolute",
              top: 25,
              alignSelf: "flex-start",
              padding: 10,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FBFCF8" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
         
            <View>
              <View>
                {image ? (
                  <TouchableOpacity 
                  onPress={() => {
                    toggleUploadModal(),
                    pickImage()
                  }} activeOpacity={0.8}>
                    <Image
                      source={{uri: `${ip}api_skillLink/uploads/${profileImage}`}}
                      style={styles.profileImage}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                  style={{borderWidth: 2, 
                  borderRadius: 100, 
                  marginLeft: '20%', 
                  marginRight: '20%', 
                  borderColor: ''}} 
                  onPress={() => {
                    toggleUploadModal(),
                    pickImage()
                  }}
                  activeOpacity={0.8}
                  >
                    
                    <View style={{position: 'absolute'}}>
                      <Image 
                      source={require('../../assets/upload.png')} 
                      style={{position: 'relative', width: 150, height: 150, margin: 23, zIndex: -1}}/>
                    </View>
                    <Image
                      source={{ uri: `${ip}api_skillLink/uploads/${profileImage}` }}
                      style={{
                        width: 198,
                        height: 198,
                        alignSelf: "center",
                        borderRadius: 100,
                        borderRadius: 100,
                        borderColor: '#FBFCF8',
                        borderWidth: 2
                      }}
                    />
                  </TouchableOpacity>
                )}
                <Modal
                animationType="slide"
                visible={isUploadModalVisible}
                onRequestClose={toggleUploadModal}
                >
                  <View style={styles.uploadModalContainer}>
                  <TouchableOpacity
            onPress={toggleUploadModal}
            style={{
              position: "absolute",
              top: 25,
              alignSelf: "flex-start",
              padding: 10,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FBFCF8" />
          </TouchableOpacity>
                  <Image
                      source={{ uri: image }}
                      style={styles.profileImage}
                    />
                    
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveImage}>
                  <Text style={styles.saveText}>Upload</Text>
                </TouchableOpacity>
                  </View>
                </Modal>
              </View>

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
                }}> {firstname + ' ' + lastname} </Text>
                <Text style={styles.profileInfo}>{isAvailable ? 'Available' : 'Not Available'}</Text>
                <Stars
                default={rating}
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
                <TouchableOpacity onPress={toggleEditProfileModal}>
                  <Image
                    source={require("../../assets/pencil.png")}
                    style={styles.addIcon}
                  />



                  {/* EDIT PROFILE MODAL */}



                  <View>
                    <Modal
                      isVisible={isEditProfileModalVisible}
                      style={styles.modalContainer}
                      animationIn={"fadeInRightBig"}
                      animationInTiming={500}
                      animationOut={"fadeOutLeftBig"}
                      animationOutTiming={500}
                    >
                      <View>
                        <View style={styles.setupProfileContainer}>
                          <TouchableOpacity
                            onPress={toggleEditProfileModal}
                            style={{
                              position: "absolute",
                              alignSelf: "flex-start",
                              padding: 5,
                            }}
                          >
                            <Ionicons
                              name="chevron-back"
                              size={24}
                              color="#FBFCF8"
                            />
                          </TouchableOpacity>

                          <Text
                            style={{
                              fontSize: 40,
                              color: "#FBFCF8",
                              fontWeight: "bold",
                              marginTop: 20
                            }}
                          >
                            Edit your Profile
                          </Text>

                          <View>
                            <Text style={styles.formText}>First Name </Text>
                            <TextInput
                              style={styles.input}
                              value={firstname}
                              onChangeText={setFirstname}
                              autoCapitalize="characters"
                            />
                            <Text style={styles.formText}>Last Name </Text>
                            <TextInput
                              style={styles.input}
                              value={lastname}
                              onChangeText={setLastname}
                            />
                            <Text style={styles.formText}>Contact Number</Text>
                            <TextInput
                              style={styles.input}
                              value={contact}
                              onChangeText={setContact}
                              keyboardType="number-pad"
                            />
                            <Text style={styles.formText}> Age </Text>
                            <TextInput
                              style={styles.input}
                              keyboardType="number-pad"
                              value={age}
                              onChangeText={setAge} />
                            <Text style={styles.formText}> Barangay </Text>
                            <View style={{ zIndex: 1, top: 10 }}>
                              <BarangayDropdown
                                selectedValue={barangay}
                                onValueChange={handleValueChange}
                              />
                            </View>
                            <Text style={[styles.formText, { top: 20 }]}>
                              Availability
                            </Text>
                            <View style={{ bottom: 40 }}>
                            <Switch
                              trackColor={{ false: '#707070', true: '#C49102' }}
                              thumbColor={isAvailable ? '#f5dd4b' : '#f4f3f4'}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={handleAvailabilityChange}
                              value={isAvailable}
                              style={{ position: 'absolute', alignSelf: 'center', marginTop: 50 }}
                              />
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.saveButtonModal}
                            onPress={handleUpdateProfile}
                          >
                            <Text style={styles.saveText}> Save </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </TouchableOpacity>
              </View>
            </View>




            <View style={styles.bioContainer}>
              <Text style={{ fontWeight: "bold", color: "black", margin: 10, fontSize: 20 }}>
                Tell us who you are
              </Text>
              <Text
                style={{ color: "black", margin: 10, width: 250, fontSize: 16 }}
                numberOfLines={5}
              >
                {bio}
              </Text>
              <TouchableOpacity onPress={toggleEditBioModal}>
                <Image
                  source={require("../../assets/pencil.png")}
                  style={styles.addIcon}
                />



                {/* EDIT BIO MODAL */}



                <View>
                  <Modal
                    isVisible={isEditBioModalVisible}
                    style={styles.modalContainer}
                    animationIn={"fadeInRightBig"}
                    animationInTiming={500}
                    animationOut={"fadeOutLeftBig"}
                    animationOutTiming={500}
                  >
                    <View
                      style={{
                        backgroundColor: "#1C2120",
                        width: 330,
                        height: 600,
                        borderRadius: 15,
                        borderColor: "#C49102",
                        borderWidth: 2,
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TouchableOpacity
                        onPress={toggleEditBioModal}
                        style={{
                          position: "absolute",
                          alignSelf: "flex-start",
                          padding: 5,
                        }}
                      >
                        <Ionicons name="chevron-back" size={24} color="#C49102" />
                      </TouchableOpacity>

                      <Text
                        style={{
                          marginTop: 50,
                          fontSize: 35,
                          color: "#FBFCF8",
                          fontWeight: "bold",
                          top: 20,
                          padding: 5,
                        }}
                      >
                        Tell us who you are
                      </Text>

                      <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}
                      >
                        <View style={styles.messageContainer}>
                          <TextInput
                            multiline={true}
                            maxLength={255}
                            placeholder="Type your message..."
                            keyboardAppearance="dark"
                            onChangeText={setBio}
                            value={bio}
                          />
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleBio}
                      >
                        <Text style={styles.saveText}> Save </Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.experienceContainer}>
              <Text style={{ fontWeight: "bold", color: "black", margin: 10, fontSize: 20 }}>
                Your Experiences
              </Text>
              <TouchableOpacity onPress={toggleEditExperienceModal}>
                <Image
                  source={require("../../assets/add.png")}
                  style={styles.addIcon}
                />



                {/* EDIT EXPERIENCE MODAL */}



                <View>
                  <Modal
                    isVisible={isEditPExperienceModalVisible}
                    style={styles.modalContainer}
                    animationIn={"fadeInRightBig"}
                    animationInTiming={500}
                    animationOut={"fadeOutLeftBig"}
                    animationOutTiming={500}
                  >
                    <View
                      style={{
                        backgroundColor: "#1C2120",
                        width: 330,
                        height: 600,
                        borderRadius: 15,
                        borderColor: "#C49102",
                        borderWidth: 2,
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TouchableOpacity
                        onPress={toggleEditExperienceModal}
                        style={{
                          position: "absolute",
                          alignSelf: "flex-start",
                          padding: 5,
                        }}
                      >
                        <Ionicons name="chevron-back" size={24} color="#C49102" />
                      </TouchableOpacity>

                      <Text
                        style={{
                          fontSize: 40,
                          color: "#FBFCF8",
                          marginTop: 50,
                          fontWeight: "bold",
                        }}
                      >
                        Experiences
                      </Text>

                      <View style={styles.messageContainer}>
                        <TextInput
                          multiline={true}
                          maxLength={300}
                          placeholder="Add your experiences"
                          keyboardAppearance="dark"
                          onChangeText={setExperience}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleExp}
                      >
                        <Text style={styles.saveText}> Save </Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              </TouchableOpacity>
              <View style={styles.experienceContent}>
                <FlatList
                  data={experienceData}
                  renderItem={({ item }) => <View><Item title={item.title} />
                    <MaterialIcons name="delete"
                      size={24} color="#C49102"
                      style={{ position: "relative", alignSelf: "flex-end", padding: 5, }}
                      onPress={() => handleDeleteExperience(item.id)}
                    />
                  </View>
                  }
                  keyExtractor={(item) => item.id}

                />
              </View>
            </View>
            <View style={styles.skillContainer}>
              <Text style={{ fontWeight: "bold", color: "black", margin: 10, fontSize: 20 }}>
                Your Skills
              </Text>
              {/* <TouchableOpacity onPress={toggleEditSkillsModal}>
                <Image
                  source={require("../../assets/add.png")}
                  style={styles.addIcon}
                />
 */}


                {/* EDIT SKILLS MODAL */}




                {/* <View>
                  <Modal
                    isVisible={isEditSkillsModalVisible}
                    style={styles.modalContainer}
                    animationIn={"fadeInRightBig"}
                    animationInTiming={500}
                    animationOut={"fadeOutLeftBig"}
                    animationOutTiming={500}
                  >
                    <View
                      style={{
                        backgroundColor: "#E1ECC8",
                        width: 330,
                        height: 600,
                        borderRadius: 15,
                        borderColor: "#1A5D1A",
                        borderWidth: 2,
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TouchableOpacity
                        onPress={toggleEditSkillsModal}
                        style={{
                          position: "absolute",
                          alignSelf: "flex-start",
                          padding: 5,
                        }}
                      >
                        <Ionicons name="chevron-back" size={24} color="#1A5D1A" />
                      </TouchableOpacity>

                      <Text
                        style={{
                          fontSize: 40,
                          color: "#1A5D1A",
                          fontWeight: "bold",
                        }}
                      >
                        Skills
                      </Text>

                      <View style={styles.messageContainer}>
                        <TextInput
                          multiline={true}
                          maxLength={300}
                          placeholder="Add your experiences"
                          keyboardAppearance="dark"
                          onChangeText={setSkills}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSkills}
                      >
                        <Text style={styles.saveText}> Save </Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              </TouchableOpacity> */}

              <View style={styles.skillContent}>

                {/* <FlatList
                  data={skillsData}
                  renderItem={({ item }) => <View><Item title={item.name} />
                    <MaterialIcons name="delete"
                      size={24} color="#C49102"
                      style={{ position: "relative", alignSelf: "flex-end", padding: 5 }}
                    // onPress={() => handleDeleteExperience(item.id)}
                    />
                  </View>
                  }
                  keyExtractor={(item) => item.id}
                /> */}
                <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 16}}>Primary: {skills}</Text>
                <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 16}}>Secondary: {secondarySkill}</Text>

              </View>
            </View>



            {/* <View style={styles.proofContainer}>
              <Text style={{ fontWeight: "bold", color: "black", margin: 10, fontSize: 20 }}>
               Your Proofs
              </Text>
              <TouchableOpacity onPress={toggleEEditProofModal}>
                <Image
                  source={require("../../assets/add.png")}
                  style={styles.addIcon}
                /> */}




                {/* EDIT PROOFS MODAL */}




                {/* <View>
                  <Modal
                    isVisible={isEditProofModalVisible}
                    style={styles.modalContainer}
                    animationIn={"fadeInRightBig"}
                    animationInTiming={500}
                    animationOut={"fadeOutLeftBig"}
                    animationOutTiming={500}
                  >
                    <View
                      style={{
                        backgroundColor: "#1C2120",
                        width: 330,
                        height: 600,
                        borderRadius: 15,
                        borderColor: "#C49102",
                        borderWidth: 2,
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TouchableOpacity
                        onPress={toggleEEditProofModal}
                        style={{
                          position: "absolute",
                          alignSelf: "flex-start",
                          padding: 5,
                        }}
                      >
                        <Ionicons name="chevron-back" size={24} color="#C49102" />
                      </TouchableOpacity>

                      <Text
                        style={{
                          fontSize: 40,
                          marginTop: 50,
                          color: "#FBFCF8",
                          fontWeight: "bold",
                        }}
                      >
                        Proofs
                      </Text>

                      <View style={styles.messageContainer}>
                        <TextInput
                          multiline={true}
                          maxLength={300}
                          placeholder="Add your experiences"
                          keyboardAppearance="dark"
                          onChangeText={setProof}
                          value={proof}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleProof}
                      >
                        <Text style={styles.saveText}> Save </Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              </TouchableOpacity>

              <View style={styles.proofContent}></View>
            </View> */}


          </View>
        </ScrollView>
      )}
    </View>
  );
};





export default EditWorkersProfileUI;





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
    padding: 5,
    margin: 75,

  },
  profile: {
    width: 300,
    height: 190,
    alignSelf: "center",
    marginTop: 10,
  },
  profileInfoContainer: {
    backgroundColor: '#FBFCF8',
    margin: 10,
    borderRadius: 5,
    padding: 10,
  },
  profileInfo: {
    color: "black",
    alignSelf: "center",
    fontWeight: "bold",
  },
  bioContainer: {
    backgroundColor: '#FBFCF8',
    margin: 10,
    padding: 5,
    borderRadius: 5,
  },
  messageContainer: {
    width: "80%",
    height: 250,
    backgroundColor: "#FBFCF8",
    textAlignVertical: "top",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  experienceContainer: {
    margin: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FBFCF8'
  },
  experienceContent: {
    margin: 10,
  },
  skillContainer: {
    margin: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FBFCF8'
  },

  skillContent: {
    margin: 10,
  },
  proofContainer: {
    margin: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FBFCF8'
  },
  proofContent: {
    margin: 10,
  },
  profileInfoSkill: {
    color: "black",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileInfoSecondarySkill: {
    color: "black",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileInfoName: {
    color: "black",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  hireButton: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#A0C49D",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  items: {
    borderWidth: 0.5,
    color: "black",
    margin: 1,
  },
  addIcon: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 3,
    width: 25,
    height: 25,
    margin: 10,
    bottom: 3,
  },
  uploadIcon: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 20,
    width: 25,
    height: 25,
    bottom: 3,
  },
  saveBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#A0C49D",
    width: 120,
    alignSelf: "center",
  },
  saveBtnText: {
    color: "#F7FFE5",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    padding: 10,
    marginBottom: 80,
    borderRadius: 20,
  },
  setupProfileContainer: {
    backgroundColor: "#1C2120",
    width: 330,
    height: 650,
    borderRadius: 15,
    borderColor: "#C49102",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  formText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FBFCF8",
    textAlign: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    padding: 10,
    backgroundColor: "#FBFCF8",
    alignSelf: "center",
    borderRadius: 15,
  },
  saveButton: {
    backgroundColor: "#C49102",
    width: 75,
    height: 40,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    elevation: 3,
    marginTop: 20,
  },
  saveButtonModal: {
    backgroundColor: "#C49102",
    width: 70,
    height: 40,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 600,
    elevation: 3,
    zIndex: -1,
  },
  saveText: {
    fontSize: 20,
    color: "#1C2120",
    fontWeight: 'bold'
  },
  profileImage: {
    width: 190,
    height: 190,
    alignSelf: "center",
    borderRadius: 100,
    borderColor: '#C49102',
    borderWidth: 3
  },
  uploadModalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1C2120",
    padding: 50,
    borderRadius: 20,
    borderColor: '#C49102',
    borderWidth: 3,
    marginBottom: '100%'
},

});