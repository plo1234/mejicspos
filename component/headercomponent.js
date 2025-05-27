import React from 'react';
import { Appbar } from 'react-native-paper';
import { View,StyleSheet,StatusBar,Platform } from 'react-native';
import {Constants} from 'react-native-paper';
export const HeaderComponent=(props)=>{
    //alert('in header'+props.title+','+props.src);
    return(

        <Appbar.Header style={styles.container}>
            {/*<Appbar.Action
            icon="mail"
            onPress={() => console.log('Pressed archive')}
            />*/}
            
            <Appbar.BackAction onPress={()=>{props.r.navigate(props.src,{msg:'hello'})}}/>
            {/*<Appbar.BackAction onPress={()=>{alert('hello')}}/>*/}
            <Appbar.Content title={props.title} style={{fontSize:12}}/>
            {/*<Appbar.Content title={props.title} style={{fontSize:12}}/>*/}
            {/*<Appbar.Content title="Title" subtitle="Subtitle" />*/}
        </Appbar.Header>
        
        
    )
        
    
}
const styles = StyleSheet.create({
    container: {
        //position: 'absolute',
        //flex: 1,
        justifyContent: 'center',
        //paddingTop:-40,
        //paddingBottom:0,
        //left: 0,
        //right: 0,
        bottom: 20,
        //top:10,
        height:30,

        //backgroundColor: '#00BFFF'
        backgroundColor:'transparent',  
      /*flex: 1,
      justifyContent: 'center',
      paddingTop:-30,
      //backgroundColor: '#00BFFF',
      backgroundColor:'transparent',
      padding: 1,
      height:20,
      borderWidth:0,
      paddingBottom:30,*/
    },
  });