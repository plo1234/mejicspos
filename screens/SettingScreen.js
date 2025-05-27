import React, { Component } from 'react';
//import React, { BackHandler } from 'react-native';
import { Text, View, StyleSheet, TouchableOpacity,SafeAreaView,BackHandler } from 'react-native';
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuScreen from './MenuScreen';
export default class MenuSetting extends Component {
  constructor(props) {super(props);
    
    };
  eksekusi=(val)=>{
    //alert(val);
    if(val==='setmeja'){
      
      this.props.showmeja();
    }


    else if(val==='setmenu'){
      this.props.showmenu();
    }
    else if(val==='setprofile'){
      this.props.showprofile();
    }
    else if(val==='logout'){
      this.props.logout();
      //return true;
      //((posresto) self. getApplicationContext()). kill();
      //BackHandler.exitApp();
    }
      
  }
  render() {
    
    console.log('MSC-->render():'+this.props.r);
    return (
      
      <View style={styles.cartLineTotal}>
      
  
        <Menu onSelect={value => this.eksekusi(value)}>

          <MenuTrigger  >
          
          <MaterialCommunityIcons style={styles.headerText} name="menu" size={24} color="black" />
          </MenuTrigger  >

          <MenuOptions optionsContainerStyle=
   {{paddingLeft:0,height:150,width:160,marginTop:-80}}>
            <MenuOption value={"setmeja"}>
              <Text style={styles.menuContent}>Pengaturan Meja</Text>
            </MenuOption>
            <MenuOption value={"setmenu"}>
              <Text style={styles.menuContent}>Pengaturan Menu</Text>
            </MenuOption>
            <MenuOption value={"setprofile"}>
              <Text style={styles.menuContent}>Profil</Text>
            </MenuOption>
            <MenuOption value={"logout"}>
              <Text style={styles.menuContent}>Logout</Text>
            </MenuOption>
            
            
          </MenuOptions>

    </Menu>

      
        </View>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: '#ecf0f1',
  },
  cartLineTotal: { 
    //flex:1,
    //flexDirection: 'column',
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    paddingTop: 0,
    paddingBottom:0,
    marginTop:0,
    marginLeft:330,
    marginBottom:0,
    height:30,
    justifyContent: 'flex-start',//flex-start,flex-end,center,space-between,space-around,space-evenly
    //backgroundColor:'blue',
    //width:20,
    //marginLeft:10,
  },
  headerText: {
    fontSize: 25,
    margin: 0,

    //fontWeight: "bold",
    //backgroundColor:"yellow",
    textAlign:'right',
  },
  menuContent: {
    color: "#000",
    //fontWeight: "bold",
    paddingTop: 0,

    marginTop:0,
    marginLeft:20,
    fontSize: 14,
    //width:200,
    //backgroundColor:"green",
  }
});