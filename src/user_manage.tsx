import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const UserManageScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Management (Coming Soon)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default UserManageScreen;
