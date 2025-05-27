import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { LoginScreen } from "./screens/LoginScreen";

export default function App() {
  global.remotehosting = "http://8.215.43.98/ojiel";
  return (
    <PaperProvider><LoginScreen /></PaperProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
