import React, { createContext } from 'react';
import {Alert, View,StyleSheet,BackHandler } from 'react-native';
import { Card,TextInput,Button } from 'react-native-paper';
import { loginstyle } from '../design/LoginStyle';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import MejaScreen from './MejaScreen';
import HomeScreen from './HomeScreen';
import { DefaultTheme } from "react-native-paper";
import { theme } from '../design/AppStyle';
export const RegisterScreen=(props) =>{
    //const navigation = useNavigation();
    const[name,setName]=React.useState(null);
    const[uid,setUid]=React.useState(null);
    const[pwd,setPwd]=React.useState(null);
    const[pwd2,setPwd2]=React.useState(null);
    const[tel,setTel]=React.useState(null);
    const [hidePass, setHidePass] = React.useState(true);
    const [hidePass1, setHidePass1] = React.useState(true);

    submitForm = () =>{
        //const{name,uid,pwd,pwd2}=this.state;

        if(pwd!==pwd2){
            alert('Password tidak sama');
        }
        else if(pwd.length<8){
            alert("Minimal password 8 karakter");
        }
        else{
            this.userRegister();
        }
    }
    userRegister = () =>{
        fetch(global.remotehosting+'/useregis.php', {
        
            method: 'post',
            headers:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                nama: name,
                uid: uid,
                pwd: pwd,
                notel: tel,
                
                version:"1.1",
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
                //alert('sukses');
                //setAuth(true);
                //return <AuthScreen></AuthScreen>
                /*navigation.navigate('Meja',
                {
                    
                });*/
              
          }
          else{
            
            if(responseJson.includes('http')){
                Alert.alert('Update version',
                    'The new version is available now, download anyway?',
                    [
                        {
                        text:'Yes',
                        onPress:()=>{
                            //Linking.openURL(responseJson);         
                        
                            BackHandler.exitApp();
                            WebBrowser.openBrowserAsync(responseJson);   
                            
                        
                        },
                        },
                        {
                        text:'No',
                        },
                    ]
                    )
                
            }
            else{
                Alert.alert(responseJson);
            }
          }
   
        }).catch((error) => {
          console.error(error);
        });
   
        
    }

    

    

    return (
        <View style={loginstyle.content}>
            
            <View style={loginstyle.view}>
            <Card>
            
                <Card.Title title="Registration" titleStyle={loginstyle.cardTitle}></Card.Title>
                <Card.Content>
                    <TextInput label="Name"
                     onChangeText={ setName}>
                     </TextInput>
                     <TextInput label="User-ID"
                     onChangeText={ setUid}>
                     </TextInput>
                     <TextInput label="Password" secureTextEntry={hidePass?true:false} right={<TextInput.Icon name="eye-off-outline" color={registerStyle.icon.color} onPress={()=>setHidePass(!hidePass)}/>}
                    onChangeText= { setPwd}>
                     </TextInput>
                    <TextInput label="Confirm Password" secureTextEntry={hidePass1?true:false} right={<TextInput.Icon name="eye-off-outline" color={registerStyle.icon.color} onPress={()=>setHidePass1(!hidePass1)}/>}
                    onChangeText= { setPwd2}>
                    </TextInput>
                    <TextInput label="Phone number" keyboardType='phone-pad'
                    onChangeText= { setTel}>
                    </TextInput>
                     
                    <Button onPress={submitForm} mode="contained" style={loginstyle.cardButton}>Register</Button>
                    <Button
                        title="Cancel"
                        onPress={() => props.cbfunct(false)}//</Card.Content>navigation.navigate('Login')}
                    >Cancel</Button>
                </Card.Content>
            </Card>
            </View>
            </View>
    );
}

const registerStyle=StyleSheet.create({
    content:{
        padding:15,
        paddingTop:0
    },
    icon:{
        color:theme.colors.primary
    },
    button:{
        margin:15,
        marginLeft:0,
        marginRight:0
    }
})
