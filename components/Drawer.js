import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import Modal from "react-native-modal";


const Drawer = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isAboutUsModalVisible, setIsAboutUsModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleSettingUsModal = () => {
    setIsSettingModalVisible(!isSettingModalVisible);
  };

  const toggleAboutUsModal = () => {
    setIsAboutUsModalVisible(!isAboutUsModalVisible);
  };



  return (
    <Modal isVisible={isModalVisible}> 
        <View style={{flex: 1, backgroundColor: '#F7FFE5', }}>
      <TouchableOpacity
        style={{backgroundColor: 'white', borderTopWidth:1, borderBottomWidth:1, borderColor: '#1A5D1A', marginTop: 20, padding: 10 }}
        onPress={toggleSettingUsModal}
      ><Text style={{alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#1A5D1A'}}>Settings</Text></TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: 'white', borderBottomWidth:1, borderColor: '#1A5D1A', padding: 10 }}
        onPress={toggleAboutUsModal}
      ><Text style={{alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#1A5D1A'}}>About Us</Text></TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: 'white', borderBottomWidth:1, borderColor: '#1A5D1A', padding: 10 }}
        // onPress={handleLogOut}
      ><Text style={{alignSelf: 'center', fontSize: 25, fontWeight: 'bold', color: '#1A5D1A'}}>Logout</Text></TouchableOpacity>
    </View>

    <Modal isVisible={isSettingModalVisible}>
      <View style={{ flex: 1, backgroundColor: '#F7FFE5' }}>
        {/* Buttons for "Settings," "About Us," and "Logout" */}
      </View>
    </Modal>

    <Modal isVisible={isAboutUsModalVisible}>
      <View style={{ flex: 1, backgroundColor: '#F7FFE5' }}>
        {/* Buttons for "Settings," "About Us," and "Logout" */}
      </View>
    </Modal>

        </Modal>

        
  );
};

export default Drawer;

const styles = StyleSheet.create({});
