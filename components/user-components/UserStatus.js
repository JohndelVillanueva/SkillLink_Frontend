import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableNativeFeedback,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { ip } from "../../Barangays";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';
import Stars from 'react-native-stars';
import StarRating from 'react-native-star-rating-widget';
import { useNavigation } from '@react-navigation/native';

const UserStatus = ({ status, route }) => {

  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);

  const { first_name, last_name, request_status, request_date, jr_id, worker_id, employer_id } = status;
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [skill, setSkill] = useState('');

  const [isFollowing, setIsFollowing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [userId, setUserId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [userType, setUserType] = useState('');


  const is_seen = 0
  const detailsWhenFinished = `said that your job is now done! Go to status to see their ratings.`;

  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  
  // Toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleRatingModal = () => {
    setUserRating(0);
    setRatingModalVisible(!isRatingModalVisible);
  };



 
  useEffect(() => {
    const getWorkerId = async () => {
      try {
        const userSessionJSON = await AsyncStorage.getItem('usersession');
        const userData = JSON.parse(userSessionJSON);
        const usertype = userData.user_type;
        const userid = userData.id;
        setUserId(userid); // Set userId state with the user's ID
        setWorkerId(worker_id);
        // console.log('USER ID: ', userid);
        // console.log('WORKER ID: ', worker_id);
        getContact(worker_id)
      } catch (error) {
        console.error("Error getting worker ID:", error);
      }
    };

    getWorkerId();

    const checkFollowStatus = async () => {
      try {
        // Retrieve follow status from AsyncStorage
        const followStatus = await AsyncStorage.getItem(`followStatus_${worker_id}`);
        if (followStatus) {
          setIsFollowing(JSON.parse(followStatus));
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();

  }, [worker_id]);

  const toggleFollow = async () => {
    try {
      // Add logic to send a request to the server to follow/unfollow the worker
      const response = await axios.post(`${ip}api_skillLink/api/addFavoriteWorker.php`, {
        follower_id: userId,
        favorite_id: workerId
      })
      // Update the follow status in the state
      setIsFollowing(!isFollowing);

      // Disable the button temporarily
      setIsButtonDisabled(true);
  

    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const getContact = async (workerId) =>{
    const getContactURL = `${ip}api_skillLink/api/getInformation.php?id=${workerId}`;
    try {
      const response = await axios.get(getContactURL);
      setContact(response.data.phone_number)
      setEmail(response.data.email)
      setProfileImage(response.data.profile_image);
      const skillsArray = response.data.skills || [];
      const skillNames = skillsArray.map(skill => skill.skill_name).join(', '); // Join skill names with a comma
    
    setSkill(skillNames);
    
    // console.log('INFORMATION: ', response.data)
    } catch (error) {
      console.log(error)
    }
    
  }


  const updateStatus = async (newStatus, newDetails) => {
    const updateStatusURL = `${ip}api_skillLink/api/postEmployerNotif.php?jobRequestID=${jr_id}`;
    const response = await axios.put(updateStatusURL, { request_status: newStatus, employer_id: worker_id, details: newDetails, is_seen });
   // console.log('RESPONSE: ', response.data);
  };

  

  const buttonStyles = {
    o: styles.pendingButton, // Ongoing
    a: styles.acceptedButton, // Accepted
    d: styles.declinedButton, // Declined
    f: styles.finishedButton, // Finished
  };

  const renderStatusText = () => {
    if (request_status === 'o') {
      return 'Pending';
    } else if (request_status === 'a') {
      return 'Ongoing';
    } else if (request_status === 'd') {
      return 'Declined';
    } else if (request_status === 'f') {
      return 'Finished';
    } else {
      return request_status;
    }
  };
  
  const handleFinish = () => {
    if (request_status === 'd' || request_status === 'o' || hasRated) {
      return;
    }

    // Check if the user has already rated the worker
    if (hasRated) {
      // Display a message or alert indicating that the user has already rated
      return;
    }

    const newDetails = ` ${firstname} ${lastname}${detailsWhenFinished} `; // Concatenate 'Accept' to the existing details
    const newStatus = 'f';

    // Display an alert to confirm if the job is finished
    Alert.alert(
      "Confirm Finish Job",
      "Is the job finished?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            updateStatus(newStatus, newDetails);
            setHasRated(true);
          },
        },
      ]
    );
  };
  
  
  const submitRating = async () => {
    if (userRating === 0) {
      // Display an error message or alert indicating that the user should select a rating
      Alert.alert("Error", "Please select a rating before submitting.");
      return;
    }
  
    try {
      // Send the user's rating to the server
      const response = await axios.post(`${ip}api_skillLink/api/postRating.php`, {
        jr_id: jr_id,
        reviewer_id: userId,
        user_id: workerId,
        rate: userRating,
      });
     // console.log(response.data)
  
      toggleRatingModal(); // Close the rating modal
      //console.log(userRating);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        {request_status ? (
          <View style={styles.notifs}>
            <Text style={{ fontSize: 18, fontWeight: "bold", top: 5, marginLeft: 5 }}>
              {first_name} {last_name}
            </Text>
            {request_status === 'f' && (
              <Text style={{ fontSize: 12, color: 'black', padding: 3 }}>
                Click the finished button to rate the worker's service
              </Text>
            )}
             {['a'].includes(request_status) && (
              <Text style={{ fontSize: 12, color: 'black', padding: 3 }}>
                {request_status === 'a' ? 'Go to messages to talk about what you need with the worker' : 'Click the "finished" button to rate the worker\'s service'}
              </Text>
            )}
             {['a'].includes(request_status) && (
              <Text style={{ fontSize: 12, color: 'black', padding: 3, top: 25, alignSelf: 'center' }}>
                {request_status === 'a' ? 'Click the \'Ongoing\' button if the job is done' : 'Click the "finished" button to rate the worker\'s service'}
              </Text>
            )}
            <TouchableOpacity style={{ padding: 3, alignSelf: 'center' }}  onPress={() => {
              if (request_status === 'f') {
                toggleRatingModal();
                return;
              }
              handleFinish();
              
            }}>
              <Text style={buttonStyles[request_status]}>{renderStatusText()}</Text>
              
            </TouchableOpacity>
           
            <Text style={{ fontSize: 12, alignSelf: "flex-end", position: 'absolute', marginTop: 10, right: 5 }}>
              {request_date}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>


    


      {/* RATINGS */}
      <Modal
                animationType="slide"
                transparent={true}
                visible={isRatingModalVisible}
                onRequestClose={toggleRatingModal}
            >
                <View style={styles.modalContainer}>
                    <View style={{padding: 10, }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#FBFCF8', alignSelf: 'center', padding: 10 }}>Ratings</Text>
                        <View style={{backgroundColor: 'white', borderRadius: 5, borderWidth: 1, borderColor: '#1C2120', padding: 5,}}> 
                          <View style={{alignItems:'center'}}>
                          <Stars
                            half={true}
                            default={userRating} // Set the initial rating value
                            update={(val)=>setUserRating(val)} // Update the userRating state when the user selects a rating
                            spacing={10}
                            starSize={40}
                            count={5}
                            fullStar={<FontAwesome name="star" size={24} color="#1C2120" />}
                            emptyStar={<FontAwesome name="star-o" size={24} color="#1C2120" />}
                            halfStar={<FontAwesome name="star-half" size={24} color="#1C2120" />}
                          />
                          </View>
                        </View>
                        <TouchableOpacity style={{backgroundColor: '#1C2120', margin: 5, width: '30%', alignSelf: 'center', borderRadius: 10}} onPress={submitRating}>
                            <Text style={{ fontSize: 16, color: '#FBFCF8', fontWeight: 'bold', marginTop: 10, alignSelf: 'center', bottom: 5 }}>Submit</Text>
                          </TouchableOpacity>
                        <TouchableNativeFeedback onPress={toggleRatingModal}>
                        <Ionicons name="chevron-back" size={24} color="#FBFCF8" style={{position: 'absolute', bottom: 150}}/>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </Modal>
    
      {request_status === 'a' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={{ padding: 10, }}>
              <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#1C2120', alignSelf: 'center', padding: 10 }}>Worker's Profile</Text>
              <Image
                source={{ uri: `${ip}api_skillLink/uploads/${profileImage}`}}
                style={{width: 100, height: 100, borderRadius: 100, alignSelf: 'center', borderWidth: 1, borderColor: '#1C2120'}}
              />
               <Text style={styles.contactInfo}><Text style={{ fontWeight: 'bold' }}>Skill:</Text> {skill} </Text>
              <Text style={styles.contactInfo}><Text style={{ fontWeight: 'bold' }}>Name:</Text> {first_name} {last_name}</Text>
              <Text style={styles.contactInfo}><Text style={{ fontWeight: 'bold' }}>Mobile Number:</Text> {contact}</Text>
              <Text style={styles.contactInfo}><Text style={{ fontWeight: 'bold' }}>Email:</Text> {email}</Text>
              <View style={{flexDirection: 'row', alignSelf: 'center', gap: 20}}> 
                        <TouchableOpacity onPress={toggleFollow} disabled={isButtonDisabled} style={{ marginBottom: 20, alignSelf: 'center' }}>
                        <Text style={styles.followButton}>
                      {isFollowing ? 'Favorite' : 'Add to your Favorite Workers'}
                    </Text>
                        </TouchableOpacity>
          </View>
              <TouchableNativeFeedback onPress={toggleModal}>
                <Ionicons name="chevron-back" size={24} color="#1C2120" style={{ position: 'absolute', bottom: 210 }} />
              </TouchableNativeFeedback>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default UserStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  notifs: {
    width: 300,
    height: 90,
    backgroundColor: "#FBFCF8",
    borderRadius: 20,
    margin: 3,
    padding: 3,
  },
  modalContainer: {
    backgroundColor: "#C49102",
    width: "85%",
    alignSelf: "center",
    padding: 10,
    height: "40%",
    margin: 50,
    justifyContent: "center",
    borderRadius: 20,
    borderColor: '#1C2120',
    borderWidth: 2
},
contactInfo: {
  color: '#1C2120',
  fontSize: 20
},
pendingButton: {
  alignSelf: 'flex-start',
  backgroundColor: "#FFFFF0",
  padding: 2,
  borderWidth: 1,
  borderRadius: 5,
  borderColor: 'black',
  fontWeight: 'bold',
  paddingLeft: 10,
  paddingRight: 10,
  top: 30,
  zIndex: 1
},
acceptedButton: {
  alignSelf: 'flex-start',
  backgroundColor: "#50C878",
  color: 'white',
  padding: 2,
  borderWidth: 1,
  borderRadius: 5,
  borderColor: 'black',
  fontWeight: 'bold',
  paddingLeft: 10,
  paddingRight: 10,
  bottom: 20,
  zIndex: 1
},
declinedButton: {
  alignSelf: 'flex-start',
  backgroundColor: "#880808",
  color: 'white',
  padding: 2,
  borderWidth: 1,
  borderRadius: 5,
  borderColor: 'black',
  fontWeight: 'bold',
  paddingLeft: 10,
  paddingRight: 10,
  top: 30,
  zIndex: 1
},
finishedButton: {
  alignSelf: 'flex-start',
  backgroundColor: "#7393B3",
  color: 'white',
  padding: 2,
  borderWidth: 1,
  borderRadius: 5,
  borderColor: 'black',
  fontWeight: 'bold',
  paddingLeft: 10,
  paddingRight: 10,
  top: 10,
  zIndex: 1
},
followButton: {
  backgroundColor: "#1C2120",
  color: "#FBFCF8",
  padding: 2,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: "black",
  fontWeight: "bold",
  paddingLeft: 10,
  paddingRight: 10,
  top: 10,
},
  closeButtonContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  closeButtonText: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
  },
  messageButton: {
    backgroundColor: "#1C2120",
    color: "#FBFCF8",
    padding: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    fontWeight: "bold",
    paddingLeft: 10,
    paddingRight: 10,
    top: 10,
  },
  
});
