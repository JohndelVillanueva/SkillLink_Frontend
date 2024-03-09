import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { ip } from "../../Barangays";
import React, {useState, useEffect} from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formStyle } from "../../components/user-components/FormStyle";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import ImageLazyLoading from "react-native-image-lazy-loading";
import FastImage from "react-native-fast-image";

const SecondStep = (props) => {
  const navigation = useNavigation();
  const userData = props.route.params.userData;
  const [userID, setUserID] = useState('');

  const [galleryPermission, setGalleryPermission] = useState(null)
  const [validID, setValidID] = useState(null);
  const [idPicture, setIdPicture] = useState(null)

  const [certifications, setCertifications] = useState([]);
  const [certificationsPictures, setCertificationsPictures] = useState([]);

  const [imageLoadings, setImageLoadings] = useState([]);

  function onLoading(index, value) {
    const updatedLoadings = [...imageLoadings];
    updatedLoadings[index] = value;
    setImageLoadings(updatedLoadings);
  }

  useFocusEffect(
    React.useCallback(() => {
      getUserProfile();
    }, [])
  );

  const getUserProfile = async () => {
    try {
      const userSessionJSON = await AsyncStorage.getItem("usersession");
      console.log("Stored data:", userSessionJSON);
  
      if (userSessionJSON) {
        const userData = JSON.parse(userSessionJSON);
        console.log("Parsed userData:", userData);
        setUserID(userData.id);
        console.log('ID:', userData.id);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };
  


  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);


  const picValidId = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
  
    if (!result.canceled) {
      // Extract the filename from the image URI
      const imageUri = result.assets[0].uri;
      const filename = imageUri.split('/').pop();
      const filenameOfImage = imageUri;

      // console.log('Image Filename:', filenameOfImage);
      setValidID([...validID, filename]);//FOR JPEG FILENAME ONLY
      setIdPicture([...idPicture, filenameOfImage]);//FOR THE IMAGE DIRECTORY
    }
  };


  
  const pickCerts = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
  
    if (!result.canceled) {
      const imageUris = result.assets.map(asset => asset.uri);
      console.log('IMAGE NAME:', imageUris);
  
      // Check if the selected images are JPEG or PNG and not HEIC
      const invalidFormats = imageUris.filter(uri => !/\.(jpeg|jpg|png)$/i.test(uri) || uri.toLowerCase().endsWith('.heic'));
      if (invalidFormats.length > 0) {
        Alert.alert("Invalid Format", "Only JPEG or PNG formats are allowed.");
        return;
      }
  
      if (certificationsPictures.length + imageUris.length <= 6) {
        setCertificationsPictures([...certificationsPictures, ...imageUris]);
      } else {
        Alert.alert("Limit Exceeded", "You can only select a maximum of 6 images.");
      }
    }
  };
  
  function splitArrayIntoRows(array, itemsPerRow = 3) {
    const result = [];
    for (let i = 0; i < array.length; i += itemsPerRow) {
      result.push(array.slice(i, i + itemsPerRow));
    }
    return result;
  }

  const handleRemoveLastImage = () => {
    if (certificationsPictures.length > 0) {
      // Create a copy of the certificationsPictures and certifications arrays
      const updatedCertificationsPictures = [...certificationsPictures];
      const updatedCertifications = [...certifications];

      // Remove the last image URI and filename
      updatedCertificationsPictures.pop();
      updatedCertifications.pop();

      // Update the state with the new arrays
      setCertificationsPictures(updatedCertificationsPictures); 
      setCertifications(updatedCertifications); 
    }
  };

  const handleSaveCertificates = async () => {
    const imageURL = `${ip}api_skillLink/api/postIDandCertification.php`;
  
    if (certificationsPictures) {
      const uploadPromises = certificationsPictures.map(async (certificate) => {
        const base64 = await FileSystem.readAsStringAsync(certificate, { encoding: 'base64' });
        const imageBase64 = "data:image/jpg;base64," + base64
        const data = {
          profile_image: imageBase64,
          user_id: userID,
        };
       
        
        try {
          const response = await axios.post(imageURL, data);
          // Can't display the default image or uploaded image
          if (response.status === 200) {
            console.log('Image uploaded successfully:', response.data);
          } else {
            console.log('Image upload failed with status:', response.status);
            Alert.alert('Error', 'Failed to save the image.');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to save the image. ' + error.message);
        }
      });
  
      try {
        await Promise.all(uploadPromises);
        console.log('All images uploaded successfully.');
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    } else {
      Alert.alert('No Image', 'Please upload an image before saving.');
    }
  };
  
  
  useEffect(() => {
    const displayProfileImage = async () => {
      const getURL = `${ip}api_skillLink/api/getInformation.php?id=${userID}`;
      try {
        const resp = await axios.get(getURL);
        setIdPicture(resp.data.profile_image);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    }
  
    displayProfileImage();
  }, [userID]);
  

  const removeImage = (index) => {
    const updatedImages = [...certificationsPictures];
    updatedImages.splice(index, 1);
    setCertificationsPictures(updatedImages);
  };



  return (
    <View style={styles.container}>
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
        <Ionicons name="chevron-back" size={24} color="#F7FFE5" />
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              alignSelf: "center",
              top: 20,
              color: "#FBFCF8",
            }}
          >
            Proofs
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 13,
              alignSelf: "center",
              textAlign: 'center',
              bottom: 20,
              color: "#FBFCF8",
              top: 20,
              width: 200,
            }}
          >
            Upload your pictures of valid IDs, NC Certificates, and etc
          </Text>
          <View
        style={{
          width: 280,
          height: 280,
          top: 30,
          backgroundColor: "#FBFCF8",
          alignSelf: "center",
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
         <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic">
        {certificationsPictures.map((uri, index) => (
          <View key={index}>
            <View style={styles.imageContainer}>
              {imageLoadings[index] && (
                <View style={{ justifyContent: 'center', alignSelf: 'center', alignContent: 'center', borderWidth: 1, zIndex: 0, width: '100%', height: 100, position: 'absolute', marginTop: 20, }}>
                  <ActivityIndicator color='red' />
                </View>
              )}
              <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
              <ImageLazyLoading
                source={{ uri }}
                style={styles.image}
                fadeDuration={1000}
                resizeMode="cover"
                onLoadStart={() => onLoading(index, true)}
                onLoadEnd={() => onLoading(index, false)}
              />
            </View>
          </View>
        ))}
      </ScrollView>
        <TouchableOpacity onPress={pickCerts} style={styles.addButton}>
          <Image
            source={require("../../assets/add.png")}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>
          <View style={{ top: 50 }}>
          <Text style={{alignSelf: 'center', bottom: 10, fontWeight: 'bold', color: '#FBFCF8', fontSize: 12}}>
            Maximum of 6 images
          </Text>
          <Text style={{alignSelf: 'center', bottom: 10, fontWeight: 'bold', color: '#FBFCF8', fontSize: 10}}>
            (jpeg/png are only allowed image formats)
          </Text>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
                borderRadius: 20,
                elevation: 3,
                backgroundColor: "#C49102",
                width: 80,
                alignSelf: "center",
              }}
              onPress={() => {
                handleSaveCertificates(); // Call the function to send data to the database
                Alert.alert(
                  "",
                  "Wait for 1 to 3 business days while we assess your application.",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        navigation.navigate("ProfileWorkerUI", {
                          name: "ProfileWorkerUI",
                        }),
                    },
                  ]
                );
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "#1C2120" }}>Verify</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2120",
    justifyContent: "center",
    alignItems: "center",
  },

  registerContainer: {
    backgroundColor: "#707070",
    borderRadius: 20,
    width: 340,
    height: 600,
    top: 10,
    marginTop: 40,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
    zIndex: 0
  },
  imageContainer: {
    marginRight: 10, // Adjust the margin as needed
  },
  addButton: {
    marginBottom: 10, 
    alignItems: "center",
  },
});

export default SecondStep;
