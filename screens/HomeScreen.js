import React,{useContext,useState,useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MejaScreen from './MejaScreen';
import MenuScreen from './MenuScreen';
import { StyleSheet } from 'react-native';
import PaymentScreen from './PaymentScreen';
//import { LoginScreen } from './LoginScreen';
import UserContext from '../component/AppContext';
import MenuSettingChat from './MenuSettingChat';
import ChatScreen from './ChatScreen';
import LaporanScreen from './LaporanScreen';
//import MyCalendar from './MyCalendar';
const Tab=createBottomTabNavigator();


function HomeScreen(props) {
  const val = useContext(UserContext);

  /*useEffect(() => {
    const intvl = setInterval(() => {
      fetch(global.remotehosting+'/extractnotifdoc.php', {
        method: 'post',
        headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body:JSON.stringify({
          pid:global.userid,
        })
        
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('result:'+responseJson);
        if(responseJson!==''){
          val.setName(responseJson);
          console.log('colorValue1:'+val.name);
        }
        else{
          val.setName(0);
          console.log('colorValue2:'+val.name);
        }

    }).catch((error) => {
      console.error(error);
    });
    }, 10000);
    return () => clearInterval(intvl);
  }, []);*/


    return (
        
        <Tab.Navigator 
          initialRouteName="Meja"
          screenOptions={
            tabBarActiveTintColor= "#e91e63"
          }
          
        >
        
        <Tab.Screen name="Meja" component={MejaScreen} 
            options={{
              tabBarLabel:'Meja',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="table" color={color} size={size} />
              ),}}
        />
        <Tab.Screen name="Menu" component={MenuScreen} 
            options={{
              tabBarLabel:'Menu',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="food" color={color} size={size} />
              ),}}
        />
        <Tab.Screen name="Payment" component={PaymentScreen} 
            options={{
              tabBarLabel:'Payment',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-check" color={color} size={size} />
              ),}}
        />
        <Tab.Screen name="Laporan" component={LaporanScreen} 
            options={{
              tabBarLabel:'Laporan',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-check" color={color} size={size} />
              ),}}
        />
        <Tab.Screen name="Chat" component={ChatScreen} 
            options={{
              tabBarLabel:'Chat',
              tabBarBadge:val.name==0?null:val.name,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chat" color={color} size={size} />
              ),}}
        />
        <Tab.Screen name="datepicker" component={MyCalendar}
          options={{
            tabBarLabel:'',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={0} />
            ),
            //tabBarIcon:false

        }}
        />  
        </Tab.Navigator>
    
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
export default HomeScreen;