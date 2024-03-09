import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from 'react-native-elements';

const UserInbox = ({ inboxes, onPressInbox, navigation, totalMessageCount }) => {

  console.log(totalMessageCount)
  return (
    <View style={styles.container}>
      {inboxes.map((inbox) => (
        <TouchableOpacity
          key={inbox.id}
          onPress={() => onPressInbox(inbox.id, navigation)}
          style={styles.inboxItem}
        >
          <Text style={styles.inboxText}>{inbox.username}</Text>
          {/* Display Badge with totalMessageCount */}
          {totalMessageCount > 0 && (
            <Badge
              value={totalMessageCount}
              status="error" // You can customize the Badge status/color
              containerStyle={styles.badgeContainer}
            />
          )}
          <Ionicons name="mail-outline" size={20} color="#FBFCF8" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inboxItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#1C2120',
    width: 300,
    alignSelf: 'center',
  },
  inboxText: {
    fontSize: 16,
    color: '#FBFCF8',
  },
  badgeContainer: {
    marginLeft: 5, // Adjust the margin as needed
  },
});

export default UserInbox;
