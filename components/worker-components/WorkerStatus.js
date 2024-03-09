import { StyleSheet, Text, View, Modal, TouchableNativeFeedback, TouchableOpacity, TextInput, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ip } from '../../Barangays';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import Stars from 'react-native-stars';

const WorkerStatus = ({status}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false); 
  const [message, setMessage] = useState("");

  const { first_name, last_name, work_details, request_status, request_date, jr_id, employer_id, worker_id, rate } = status;
  const detailsWhenAccepted = ` your request! Go to Status and click it to see the worker's contact.`;
  const detailsWhenDeclined = ` your request! Click this notification to see the worker's message.`;
  const is_seen = 0
  const notification_type = 'job_request'

  // console.log('rate: ', rate)

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleRatingModal = () => {
    setRatingModalVisible(!isRatingModalVisible);
  };

  const toggleMessageModal = () => {
    setMessage(""); // Clear the message input field when opening the message modal
    setMessageModalVisible(!messageModalVisible);
  };

  const updateStatus = async (newStatus, newDetails) => {
    const updateStatusURL = `${ip}api_skillLink/api/postEmployerNotif.php?jobRequestID=${jr_id}`;
    const response = await axios.post(updateStatusURL, { request_status: newStatus, employer_id, details: newDetails, message: message, is_seen, notification_type: notification_type });
    // console.log('RESPONSE: ', response.data);
  };

  const postNotification = async () => {
    try {
      const notifyResponse = await axios.post(`https://app.nativenotify.com/api/notification`, {
        appId: 16982,
        appToken: "DsiJB0lueDaLRyhbtZd1y9",
        title: "Job Status",
        body: "Check your status for update",
      }, {
        timeout: 60000, // Adjust the timeout value (in milliseconds) as needed
      });
      console.log('NOTIFY RESPONSE: ', notifyResponse.data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  

  const confirmDeleteStatus = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // Implement your logic to delete data from the database here using Axios or any other method
              // For example:
              const deleteStatusURL = `${ip}api_skillLink/api/deleteJobRequest.php?id=${jr_id}`;
              const response = await axios.delete(deleteStatusURL);
              // Handle the response as needed
              // After successful deletion, you can close the modal or perform other actions.
            } catch (error) {
              console.error('Error deleting status:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const buttonStyles = {
    o: styles.ongoingButton, // Ongoing
    a: styles.acceptedButton, // Accepted
    d: styles.declinedButton, // Declined
    f: styles.finishedButton, // Finished
  };

  const handleAccept = () => {
    if (request_status === 'a') {
      return;
    }
    const newDetails = ` accept${detailsWhenAccepted} `; // Concatenate 'Accept' to the existing details
    updateStatus('a', newDetails);
    postNotification();
    toggleModal();
  };
  

  
  const handleDecline = () => {
    if (request_status === 'd') {
      return;
    }
    
    const newDetails = ` decline${detailsWhenDeclined}`; // Concatenate 'Declined' to the existing details
    updateStatus('d', newDetails);
    // sendMessage();
    postNotification()
    toggleMessageModal();
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

  const sendMessage = async () => {
    // Send the message to the user or employer
    const sendMessageURL =  `${ip}api_skillLink/api/postEmployerNotif.php?jobRequestID=${jr_id}`;
    const data = {
      message: message,
    };
    try {
      const resp = await axios.post(sendMessageURL, data);
      console.log(resp.data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
    {request_status ? ( // Check if request_status has a value
      <View style={styles.status}>
        <Text style={{ fontSize: 12, alignSelf: 'flex-start' }}>{request_date}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{first_name} {last_name}</Text>
        <Text style={{ fontSize: 14, textDecorationLine: 'underline' }}>Click to view the request</Text>

        <TouchableOpacity
          style={{ left: 210, padding: 3, width: 70 }}
          onPress={request_status === 'f' ? toggleRatingModal : undefined}
        >
          <Text style={buttonStyles[request_status]}>{renderStatusText()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={confirmDeleteStatus}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: 10,
            }}
          >
            <FontAwesome name="trash" size={24} color="#1C2120" />
          </TouchableOpacity>
        

        {request_status === 'f' ? (
          <Text style={{ fontSize: 11, color: 'black' }}>Press the "Finished" button to view user ratings.</Text>
        ) : null}
      </View>
    ) : null}
  </TouchableOpacity>

  {/* MESSAGE MODAL */}
<Modal
  animationType="slide"
  transparent={true}
  visible={messageModalVisible}
  onRequestClose={toggleMessageModal}
>
  <View style={styles.modalContainer}>
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#FBFCF8', alignSelf: 'center', padding: 10 }}>Send Message</Text>
      <TextInput
        style={styles.messageInput} // Leave the style as is
        placeholder="Type your message here"
        onChangeText={text => setMessage(text)}
        value={message}
        multiline={true}
        maxLength={600}
      />
      <TouchableOpacity
        style={styles.sendMessageButton}
        onPress={handleDecline}
      >
        <Text style={{ color: '#1C2120', fontWeight: 'bold', fontSize: 16, alignSelf: 'center', }}>Send</Text>
      </TouchableOpacity>
      <TouchableNativeFeedback onPress={toggleMessageModal}>
        <Ionicons name="chevron-back" size={24} color="#C49102" style={{ position: 'absolute', bottom: 350, marginLeft: 10, }} />
      </TouchableNativeFeedback>
    </View>
  </View>
</Modal>

      {/* RATINGS */}
      <Modal
                animationType="slide"
                transparent={true}
                visible={isRatingModalVisible}
                onRequestClose={toggleRatingModal}
            >
                <View style={styles.modalContainer}>
                    <View style={{padding: 10, }}>
                        {/* Content of the modal goes here */}
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#FBFCF8', alignSelf: 'center', padding: 10 }}>{first_name}{last_name}'s Ratings</Text>
                        {/* Display the worker's contact information here */}
                        {/* For example: */}
                        <View style={{backgroundColor: 'white', borderRadius: 5, borderWidth: 1, borderColor: '#1A5D1A', padding: 5,}}> 
                        <Stars
                            default={parseFloat(rate)}
                            spacing={8}
                            count={5}
                            starSize={40}
                            half={true}
                            disabled={true}
                            fullStar={<FontAwesome name="star" size={24} color="black" />}
                            halfStar={<FontAwesome name="star-half" size={24} color="black" />}
                            emptyStar={<FontAwesome name="star-o" size={24} color="black" />}
                            />
                            <Text style={{alignSelf: 'center'}}> {rate}/5</Text>
                        </View>
                        <TouchableNativeFeedback onPress={toggleRatingModal}>
                        <Ionicons name="chevron-back" size={24} color="#1A5D1A" style={{position: 'absolute', bottom: 240, marginLeft: 7}}/>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </Modal>

      {/* USER REQUEST */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={toggleModal}
>
  <View style={styles.modalContainer}>
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#FBFCF8', alignSelf: 'center', padding: 10, margin: 10, textAlign: 'center'}}>{first_name} {last_name}'s Request</Text>
      <View style={{ backgroundColor: 'white', borderRadius: 5, borderWidth: 2, borderColor: '#C49102', padding: 5 }}>
        <Text style={styles.message} numberOfLines={10}>{work_details}</Text>
      </View>
      {request_status !== 'f' && request_status !== 'a' && request_status !== 'd' ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 5, marginTop: 20 }}>
          <TouchableOpacity style={styles.acceptButton} 
          onPress={handleAccept}
          ><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Accept</Text></TouchableOpacity>
          <TouchableOpacity style={styles.declineButton}
            onPress={() => {
              toggleMessageModal();
              toggleModal();
            }}
          ><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Decline</Text></TouchableOpacity>
        </View>
      ) : null}
      <TouchableNativeFeedback onPress={toggleModal}>
        <Ionicons name="chevron-back" size={24} color="#C49102" style={{ position: 'absolute', bottom: 260, marginLeft: 10 }} />
      </TouchableNativeFeedback>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default WorkerStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  status: {
    width: 300,
    backgroundColor: "#FBFCF8",
    borderRadius: 20,
    margin: 3,
    padding: 10,
    alignContent: "center",
  },
  ongoingButton: {
    alignSelf: 'center',
    backgroundColor: "#FFFFF0",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    fontWeight: 'bold',
  },
  acceptedButton: {
    alignSelf: 'center',
    backgroundColor: "#50C878",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    fontWeight: 'bold',
    color: 'white'
  },
  declinedButton: {
    alignSelf: 'center',
    backgroundColor: "#880808",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    fontWeight: 'bold',
    color: 'white'
  },
  finishedButton: {
    alignSelf: 'center',
    backgroundColor: "#7393B3",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    fontWeight: 'bold',
    color: 'white',
    zIndex: 1
  },
  modalContainer: {
    backgroundColor: "#1C2120",
    width: "85%",
    alignSelf: "center",
    padding: 10,
    height: "65%",
    margin: 50,
    justifyContent: "center",
    borderRadius: 20,
    borderColor: '#707070',
    borderWidth: 2
},
message: {
    color: '#1C2120',
    fontSize: 15
},
acceptButton: {
    backgroundColor: '#50C878',
    padding: 5,
    borderRadius: 5
},
declineButton: {
    backgroundColor: '#D33333',
    padding: 5,
    borderRadius: 5
},
messageInput: {
  borderColor: '#C49102',
  borderWidth: 2,
  borderRadius: 5,
  backgroundColor: '#FBFCF8',
  width: "100%",
  height: 200, // Increase the height
  padding: 5, // Increase the padding
  textAlignVertical: "top",
},
sendMessageButton: {
  backgroundColor: '#C49102',
  padding: 5,
  margin: 5,
  width: '20%',
  alignSelf: 'center',
  borderRadius: 10,
},

});


