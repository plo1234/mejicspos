import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,SafeAreaView } from 'react-native';
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatScreen from './ChatScreen';
export default class MenuSettingChat extends Component {
  constructor(props) {super(props);
    
    };
  eksekusi=(val)=>{
    if(val==='clearChat')
      this.props.clearchat();
    else if(val==='endChat')
      this.props.endchat();
      //alert(val);
      //ChatScreen.clearChat();
  }
  render() {
    //const{route}=this.props;
    //const{r}=route.params==null?'':route.params;

    console.log('MSC-->render():'+this.props.r);
    return (
      
      <View style={styles.cartLineTotal}>
      
  
        <Menu onSelect={value => this.eksekusi(value)}>

          <MenuTrigger  >
          
          <MaterialCommunityIcons style={styles.headerText} name="menu" size={24} color="black" />
          </MenuTrigger  >

          <MenuOptions optionsContainerStyle=
   {{paddingLeft:0,height:240,width:160,marginTop:-80}}>
            <MenuOption value={"clearChat"}>
              <Text style={styles.menuContent}>Clear Chat</Text>
            </MenuOption>
            <MenuOption value={"Block"}>
              <Text style={styles.menuContent}>Block</Text>
            </MenuOption>
            <MenuOption value={"Export"}>
              <Text style={styles.menuContent}>Export</Text>
            </MenuOption>
            <MenuOption value={"Broadcast"}>
              <Text style={styles.menuContent}>Broadcast</Text>
            </MenuOption>
            <MenuOption value={"Linkmsg"}>
              <Text style={styles.menuContent}>Link Message</Text>
            </MenuOption>
            <MenuOption value={"Linkdev"}>
              <Text style={styles.menuContent}>Linked Device</Text>
            </MenuOption>
            <MenuOption value={"Autoforward"}>
              <Text style={styles.menuContent}>Auto Forward</Text>
            </MenuOption>
            <MenuOption value={"endChat"}>
              <Text style={styles.menuContent}>End Chat</Text>
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