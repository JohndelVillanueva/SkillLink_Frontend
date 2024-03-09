import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Followed = ({ followedWorkers }) => {
  return (
    <View>
        <View style={styles.workerItem}>
          <Text style={{ color: '#FBFCF8' }}>Juan Dela Cruz</Text>
          {/* Add more information about the followed worker if needed */}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    alignSelf: 'center',
    color: '#FBFCF8',
  },
  workerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Followed;
