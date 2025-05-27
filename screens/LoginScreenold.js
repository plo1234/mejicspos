import React, { createContext } from 'react';
import {Alert, View,StyleSheet } from 'react-native';
import { Card,TextInput,Button } from 'react-native-paper';
import { loginstyle } from '../design/LoginStyle';
import { useNavigation } from '@react-navigation/native';
import MejaScreen from './MejaScreen';
import HomeScreen from './HomeScreen';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import HistoryScreen from '../home/history';




export const LoginScreen=({navigation}) =>{

    userRegister = () =>{
        fetch(global.remotehosting+'/authjson.php', {
        //    fetch('http:///192.168.1.6/pratamapp/authjson.php', {
            method: 'post',
            headers:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                userid: userEmail,
                pwd: userPassword
            })
            
        })
        .then((response) => response.json())
        .then((responseJson) => {
   
         //alert(responseJson);   
          // If server response message same as Data Matched
         if(responseJson.includes('|'))
          {
            //alert(responseJson);
            var result=responseJson.split('|');
            
            //alert(result[2]);
            //const Context =createContext();
              
              global.userid=userEmail;
              global.department=result[0];
              global.username=result[1];
              alert('sukses');
              setAuth(true);
              /*navigation.navigate('Meja',
              {
                  
              });*/
              
          }
          else{
   
            Alert.alert(responseJson);
          }
   
        }).catch((error) => {
          console.error(error);
        });
   
        
    }
    const[userEmail,setEmail]=React.useState(null);
    const[userPassword,setPwd]=React.useState(null);
    const[auth,setAuth]=React.useState(false);
    //var mycode=[];
    if(auth==false){
        //
        return 
            <View style={loginstyle.content}>
            
            <View style={loginstyle.view}>
            <Card>
            
                <Card.Title title="EnberoPOS" titleStyle={loginstyle.cardTitle}></Card.Title>
                <Card.Content>
                    <TextInput label="Email" keyboardType="email-address" 
                     onChangeText={ setEmail}>
                     </TextInput>
                    <TextInput label="Password" secureTextEntry={true} 
                    onChangeText= { setPwd}>
                    </TextInput>

                    <Button uppercase={false} style={loginstyle.cardButton}>Forgot Email/Passsword</Button>
                    <Button onPress={userRegister} mode="contained" style={loginstyle.cardButton}>Login</Button>
                    <Button
                        title="Register"
                        onPress={() => navigation.navigate('Register')}
                    >Registrasi</Button>
                </Card.Content>
            </Card>
            </View>
            </View>
        
    }
    else{
        
        return 
            <HomeScreen></HomeScreen>
        
    }
    return (
        <HomeScreen></HomeScreen>
        
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})