import React, { createContext } from "react";
import { Alert, View, StyleSheet, BackHandler } from "react-native";
import { Card, TextInput, Button } from "react-native-paper";
import { loginstyle } from "../design/LoginStyle";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
//import MejaScreen from "./MejaScreen";
import HomeScreen from "./HomeScreen";
import { RegisterScreen } from "./RegisterScreen";
import { UserProvider } from "../component/AppContext";
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import LaporanScreen from './LaporanScreen';
export const LoginScreen = ({ navigation }) => {
  userRegister = () => {
    //alert('userRegister');
    alert("authjson" + global.remotehosting + "/authjson.php"+','+userEmail+','+userPassword);
    fetch(global.remotehosting + "/authjson.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: userEmail,
        pwd: userPassword,
        version: "1.1",
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        alert("response"+responseJson);
        // If server response message same as Data Matched
        if (typeof responseJson === "string" && responseJson.includes("|")) {
          
          const [name, department] = responseJson.split("|");
          //var result = responseText.split("|");

          //alert(result[2]);
          //const Context =createContext();

          global.userid = userEmail;
          global.department = department;//result[1];
          global.username = name;//result[0];
          alert("authjson" + global.remotehosting);
          //alert('sukses');
          setAuth(true);
          //return <AuthScreen></AuthScreen>
          /*navigation.navigate('Meja',
                    {

                    });*/
        } else {
          if (responseJson.includes("http")) {
            Alert.alert(
              "Update version",
              "The new version is available now, download anyway?",
              [
                {
                  text: "Yes",
                  onPress: () => {
                    //Linking.openURL(responseJson);

                    BackHandler.exitApp();
                    WebBrowser.openBrowserAsync(responseJson);
                  },
                },
                {
                  text: "No",
                },
              ]
            );
          } else {
            Alert.alert(responseJson);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [userEmail, setEmail] = React.useState(null);
  const [userPassword, setPwd] = React.useState(null);
  const [auth, setAuth] = React.useState(false);
  const [reg, setReg] = React.useState(false);
  var mycode = [];
  if (auth == false && reg == false) {
    mycode.push(
      <View style={loginstyle.content}>
        <View style={loginstyle.view}>
          <Card>
            <Card.Title
              title="EnberoRetail"
              titleStyle={loginstyle.cardTitle}
            ></Card.Title>
            <Card.Content>
              <TextInput
                label="User-ID"
                keyboardType="email-address"
                onChangeText={setEmail}
              ></TextInput>
              <TextInput
                label="Password"
                secureTextEntry={true}
                onChangeText={setPwd}
              ></TextInput>

              <Button uppercase={false} style={loginstyle.cardButton}>
                Forgot Email/Passsword
              </Button>
              <Button
                onPress={userRegister}
                mode="contained"
                style={loginstyle.cardButton}
              >
                Login
              </Button>
              <Button title="Register" onPress={() => setReg(true)}>
                Registrasi
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  } else if (auth == false && reg == true) {
    mycode.push(<RegisterScreen cbfunct={setReg}></RegisterScreen>);
  } else {
    mycode.push(
      <UserProvider>
        <HomeScreen></HomeScreen>
      </UserProvider>
    );
  }
  return <NavigationContainer>{mycode}</NavigationContainer>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
