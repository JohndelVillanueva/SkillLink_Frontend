import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableNativeFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";

const UserNotifications = ( {notification, status}) => {
    const navigation = useNavigation();
    const [messageModalVisible, setMessageModalVisible] = useState(false); 
  
    const toggleMessageModal = () => {
      setMessageModalVisible(!messageModalVisible);
    };
  

    const { first_name, last_name, details, created_at, message } = notification;

    return (
      <View>
        {message ? (
          <TouchableOpacity onPress={toggleMessageModal}>
            <View style={styles.notifs}>
              <Ionicons
                name="notifications"
                size={14}
                color="black"
                style={{
                  right: 5,
                  alignSelf: 'flex-end'
                }}
              />
              <Text style={{ fontSize: 14 }}>
                <Text style={{ fontWeight: 'bold' }}>{first_name} {last_name}</Text>{details}
              </Text>
              <Text style={{ fontSize: 12, alignSelf: 'flex-end', marginTop: 5 }}>
                {created_at}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.notifs}>
            <Ionicons
              name="notifications"
              size={14}
              color="black"
              style={{
                right: 5,
                alignSelf: 'flex-end'
              }}
            />
            <Text style={{ fontSize: 14 }}>
              <Text style={{ fontWeight: 'bold' }}>{first_name} {last_name}</Text>{details}
            </Text>
            <Text style={{ fontSize: 12, alignSelf: 'flex-end', marginTop: 5 }}>
              {created_at}
            </Text>
          </View>
        )}
  
        {/* MESSAGE MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={messageModalVisible}
          onRequestClose={toggleMessageModal}
        >
          <View style={styles.modalContainer}>
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#1C2120', alignSelf: 'center', padding: 10, margin: 10, textAlign: 'center' }}>{first_name}{last_name}'s Message</Text>
              <Text
                style={styles.messageInput} // Leave the style as is
              >{message}</Text>
              <TouchableNativeFeedback onPress={toggleMessageModal}>
                <Ionicons name="chevron-back" size={24} color="#1C2120" style={{ position: 'absolute', bottom: 130, marginLeft: 10, }} />
              </TouchableNativeFeedback>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

export default UserNotifications;

const styles = StyleSheet.create({
    notifs: {
        width: 310,
        backgroundColor: "#FBFCF8",
        borderRadius: 20,
        margin: 4,
        padding: 10,
        alignContent: 'center'
    },
    contactInfo: {
        color: '#1A5D1A',
        fontSize: 20
    },
    modalContainer: {
        backgroundColor: "#FBFCF8",
        width: "85%",
        alignSelf: "center",
        padding: 10,
        height: "35%",
        margin: 50,
        justifyContent: "center",
        borderRadius: 20,
        borderColor: '#1C2120',
        borderWidth: 2
    },
    messageInput: {
        borderWidth: 1,
        padding: 5,
        borderColor: '#1C2120',
        fontWeight: "bold",
    }
});
