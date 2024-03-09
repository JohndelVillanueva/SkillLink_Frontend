import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ImageComponent,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { editProfileForms } from "../../components/user-components/EditProfileForms";
import BarangayDropdown from "../../components/dropdowns/BarangayDropdown";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ip } from "../../Barangays";
import { useFocusEffect } from '@react-navigation/native';



const EditProfile = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [barangay, setBarangay] = useState('');

  const [galleryPermission, setGalleryPermission] = useState(null)
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null)

  const [showActivityIndicator, setShowActivityIndicator] = useState(true);


  const handleValueChange = value => {
    setBarangay(value);
  };

  const [isUploadModalVisible, setUploadModalVisible] = useState(false);

  const toggleUploadModal = () => {
    setUploadModalVisible(!isUploadModalVisible);
};


  const handleUpdateProfile = async () => {
    const url = `${ip}api_skillLink/api/verifyUser.php`;
    if (firstname !== '' && lastname !== '' && contact !== '' && age !== '' && barangay !== '') {
      const updatedData = {
        id: userId, // Use userId from the component's state
        firstname: firstname,
        lastname: lastname,
        contact: contact,
        age: age,
        barangay: barangay,
        email: email
      };

      try {
        const response = await axios.put(url, updatedData);
        if (response.status === 200) {
          console.log('Profile updated successfully:', response.data);

          // Update AsyncStorage data with the new user data
          await AsyncStorage.setItem("usersession", JSON.stringify(updatedData));

          // Update the state with the new data
          setFirstname(updatedData.firstname);
          setLastname(updatedData.lastname);
          setContact(updatedData.contact);
          setAge(updatedData.age);
          setBarangay(updatedData.barangay);
          setEmail(updatedData.email);

          console.log(updatedData)
          navigation.navigate('Profile')
        } else {
          console.log('Update failed with status:', response.status);
        }
      } catch (error) {
        console.log('Error updating data:', error.response);
      }
    } else {
      Alert.alert('Empty Fields', 'Please fill out everything!', [{ text: 'OK' }]);
    }
  };




  const getProfileData = async () => {
    try {
      const userSessionJSON = await AsyncStorage.getItem("usersession");
      if (userSessionJSON) {
        const userData = JSON.parse(userSessionJSON);
        setUserId(userData.id)
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setBarangay(userData.barangay);
        setAge(userData.age);
        setContact(userData.contact);

        setEmail(userData.email);

        console.log('user-id:', userData.id)
      }

    } catch (error) {
      console.error("Error retrieving user data:", error);

    }
  };

  const hideActivityIndicator = () => {
    setTimeout(() => {
      setShowActivityIndicator(false);
    }, 500); // Hide the activity indicator after 2 seconds
  };


  useFocusEffect(
    React.useCallback(() => {
      getProfileData();
      hideActivityIndicator();
    }, [])
  );


  //UPLOAD IMAGE

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






  return (
    <View style={styles.container}>
      {showActivityIndicator ? (
        <ActivityIndicator
          animating={showActivityIndicator}
          size="large"
          color="white"
          style={{ position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          justifyContent: 'center',
          alignItems: 'center' }}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => { navigation.navigate("Profile", { name: "Profile" }) }}
            style={{
              position: "absolute",
              top: 25,
              alignSelf: "flex-start",
              padding: 10,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FBFCF8" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit Profile</Text>
          </View>

          <View style={styles.editProfileContainer}>
            <View style={styles.imageContainer}>
              {image ? (
                <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => {
                  toggleUploadModal(),
                  pickImage()
                }}>
                  <Image
                    source={{ uri: `${ip}api_skillLink/uploads/${profileImage}` }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                onPress={() => {
                  toggleUploadModal(),
                  pickImage()
                }}
                activeOpacity={0.8} 
                style={{borderWidth: 3, 
                  borderRadius: 100, 
                  margin: 5, 
}} >
                    <View style={{position: 'absolute'}}>
                      <Image 
                      source={require('../../assets/upload.png')} 
                      style={{position: 'relative', width: 150, height: 150, margin: 23}}/>
                    </View>
                  <Image
                    source={{ uri: `${ip}api_skillLink/uploads/${profileImage}` }}
                    style={{
                      width: 195,
                      height: 195,
                      alignSelf: "center",
                      borderRadius: 100,
                      borderColor: '#FBFCF8',
                      borderWidth: 1
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

            <View style={styles.formContainer}>
              <Text style={{fontSize: 20,
              fontWeight: "bold",
              alignSelf: "flex-start",
              left: 20,
              color: "#FBFCF8",
              top: 40,
              }}>First Name</Text>
              <TextInput style={{
                height: 35,
                width: 220,
                margin: 12,
                paddingLeft: 15,
                backgroundColor: "#FBFCF8",
                alignSelf: "center",
                bottom: 10,
                top: 30,
                borderRadius: 15,
              }} keyboardType="default" value={firstname} placeholder={firstname} onChangeText={setFirstname} />

              <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                alignSelf: "flex-start",
                left: 20,
                bottom: 20,
                color: "#FBFCF8",
                top: 20,
              }}>Last Name</Text>
              <TextInput style={{
                height: 35,
                width: 220,
                margin: 12,
                paddingLeft: 15,
                backgroundColor: "#FBFCF8",
                alignSelf: "center",
                bottom: 30,
                borderRadius: 15,
                top: 10,
              }} keyboardType="default" value={lastname} onChangeText={setLastname} />

              <Text style={{
                 fontSize: 20,
                 fontWeight: "bold",
                 alignSelf: "flex-start",
                 left: 20,
                 color: "#FBFCF8",
              }}>Contact Number</Text>
              <TextInput style={{
                 height: 35,
                 width: 220,
                 margin: 12,
                 paddingLeft: 15,
                 backgroundColor: "#FBFCF8",
                 alignSelf: "center",
                 bottom: 10,
                 borderRadius: 15,
              }} keyboardType="phone-pad" value={contact} onChangeText={setContact} />

              <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                alignSelf: "flex-start",
                left: 20,
                bottom: 20,
                color: "#FBFCF8",
              }}> Age </Text>
              <TextInput style={{
                height: 35,
                width: 220,
                margin: 12,
                paddingLeft: 15,
                backgroundColor: "#FBFCF8",
                alignSelf: "center",
                bottom: 30,
                borderRadius: 15,
              }} keyboardType="number-pad" value={age} onChangeText={setAge} />
              <Text style={{
                 fontSize: 20,
                 fontWeight: "bold",
                 alignSelf: "flex-start",
                 left: 20,
                 bottom: 40,
                 color: "#FBFCF8",
              }}>Email</Text>
              <TextInput
                style={{
                  height: 35,
                  width: 220,
                  margin: 12,
                  paddingLeft: 15,
                  backgroundColor: "#FBFCF8",
                  alignSelf: "center",
                  bottom: 50,
                  borderRadius: 15,
                }}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                alignSelf: "flex-start",
                left: 20,
                bottom: 60,
                color: "#FBFCF8",
              }}>Barangay</Text>
              <View style={{ bottom: 55 }}>
                <BarangayDropdown onValueChange={handleValueChange} />
              </View>


            </View>
            <View >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                  borderRadius: 20,
                  backgroundColor: "#C49102",
                  width: 75,
                  elevation: 3,
                  bottom: 65,
                  alignSelf: "center",
                }}
                onPress={handleUpdateProfile}
              >
                <Text
                  style={{ color: "#1C2120", fontWeight: "bold", fontSize: 20 }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    top: 10,
    padding: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#FBFCF8",
  },
  editProfileContainer: {
    padding: 10,
    alignItems: "center",
    width: 300,
    height: 675,
    marginBottom: 10,
    backgroundColor: "#707070",
    borderRadius: 20,
    borderColor: "#F7FFE5",
    borderStyle: "dashed",
  },
  imageContainer: {
    backgroundColor: "#1C2120",
    width: "75%",
    height: 200,
    borderRadius: 10,
    justifyContent: "center",
  },
  formContainer: {
    bottom: 20,
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
    borderColor: '#707070',
    borderWidth: 5,
    marginBottom: '100%'
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
  padding: 10,
  marginTop: 20,
},
saveText: {
  fontSize: 18,
  color: "#FBFCF8",
  fontWeight: 'bold'
},

});
