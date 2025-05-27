import React, {Component,useEffect, useState, useRoute, useContext} from 'react';
import {
  Text, 
  Image, 
  View, 
  ScrollView, 
  SafeAreaView, 
  //Button, 
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  } from 'react-native';
import { Button } from 'react-native-paper';

import { HeaderComponent } from '../component/headercomponent';
import {Badge} from 'react-native-paper';
import moment from 'moment';
import UserContext from '../component/AppContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  MenuContext,
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import MenuSettingChat from './MenuSettingChat';
export default class ChatScreen extends Component {
  static contextType = UserContext;
  constructor(props) {super(props);
    this.state = {
        chatlist:[],
        msg:{},
        isloading:true,
        keyboardOffset:0,
        clrIdRec:-1,
        clrIdSnd:-1,
        scrollToEnd:true,
        qty:0,
        start:'',
        cost:0,
        timer:0,
    };
    this._keyboardDidHide=this._keyboardDidHide.bind(this);
    this._keyboardDidShow=this._keyboardDidShow.bind(this);
  }
  setMsg=(value)=>{
    this.setState({msg:value});
    
  }
  clearChat=()=>{
      fetch(global.remotehosting+'/clearchat.php', {
        method: 'post',
        headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body:JSON.stringify({
            pid: pid,
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        //alert(responseJson);
        this.setState({chatlist:[]});
        global.sessionid='';

    }).catch((error) => {
      console.error(error);
    });
  }
  endChat=()=>{
    fetch(global.remotehosting+'/endchat.php', {
      method: 'post',
      headers:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
      },
      body:JSON.stringify({
          pid: pid,
          
      })
      
  })
  .then((response) => response.json())
  .then((responseJson) => {
      alert(responseJson);
      global.sessionid='';
  }).catch((error) => {
    console.error(error);
  });
    
  }
  extractChat(pid){
    console.log('extractChat'+global.remotehosting+",pid:"+global.userid);
    this.setState({isloading:true});
    var chattemp=[];
    //global.sessionid='';
    fetch(global.remotehosting+'/extractchat.php', {
        method: 'post',
        headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body:JSON.stringify({
            pid: global.userid,
            
        })
        
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        if(responseJson.includes('|')){
          var result=responseJson.split('|');
          var ctr=0;
          while(ctr<result.length){
              var obj={
                  sessionid:result[ctr++],
                  sendmsg:result[ctr++],
                  dt_send:result[ctr++],
                  recmsg:result[ctr++],
                  dt_rec:result[ctr++],
                  jumlah:result[ctr++],
                  status_send:result[ctr++],
                  status_rec:result[ctr++],
                  paid:result[ctr++],
                  act_status_send:result[ctr++],
                  act_status_rec:result[ctr++],
              };
              //if(obj.status==='Open'){
                  global.sessionid=obj.sessionid;
              //}
              chattemp.push(obj); 
            }
          }
          this.setState({chatlist:chattemp});
          this.setState({isloading:false});      
          const x = this.context;
          x.setName(0);
          console.log('user:'+x.name+','+global.sessionid);
          if(this.state.chatlist.length===0){
            this.setState({clrIdRec:-1});
            this.setState({clrIdSnd:-1});
          }
    }).catch((error) => {
      console.error(error);
    });
    
  }
  currencyFormat(num) {
    num=''+num;
    //alert(num);
    if(num!==''){
      return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
    else{
      return '0';
    }
  }
  extractCost(pid){
    console.log('extractCost'+global.remotehosting+",pid:"+pid);
    this.setState({isloading:true});
    fetch(global.remotehosting+'/extractcost.php', {
        method: 'post',
        headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body:JSON.stringify({
            pid: pid,
            
        })
        
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        if(responseJson.includes('|')){

          var result=responseJson.split('|');
          if(result.length===3){
            var qty=result[0];
            var start=result[1];
            var cost=result[2];
            this.setState({qty:qty});      
            this.setState({start:start});      
            this.setState({cost:cost});      
            this.setState({isloading:false});      
          }
          //const x = this.context;
          //x.setName(0);
          //console.log('user:'+x.name+','+global.sessionid);
        }
      

    }).catch((error) => {
      console.error(error);
    });
    
  }

  hapus(){
    console.log('hapus'+this.state.clrIdRec+","+this.state.clrIdSnd+','+global.sessionid);
    this.setState({isloading:true});
    var chattemp=[];
    fetch(global.remotehosting+'/hapuschat.php', {
      method: 'post',
      headers:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
      },
      body:JSON.stringify({
          sessionid:global.sessionid,
          pid: pid,
          clrIdRec:this.state.clrIdRec,
          clrIdSnd:this.state.clrIdSnd,

      })
      
  })
  .then((response) => response.json())
  .then((responseJson) => {
    
    if(responseJson.includes('|')){

      var result=responseJson.split('|');
      var ctr=0;
      while(ctr<result.length){
          var obj={
              sessionid:result[ctr++],
              sendmsg:result[ctr++],
              dt_send:result[ctr++],
              recmsg:result[ctr++],
              dt_rec:result[ctr++],
              jumlah:result[ctr++],
              status_send:result[ctr++],
              status_rec:result[ctr++],
              paid:result[ctr++],
              act_status_send:result[ctr++],
              act_status_rec:result[ctr++],
          };
          chattemp.push(obj);
          
        }

      }
      this.setState({clrIdRec:-1});
      this.setState({clrIdSnd:-1});
      this.setState({chatlist:chattemp});
      this.setState({isloading:false});      
      
    }).catch((error) => {
      console.error(error);
    });
  }
  sendMsg(){
    console.log(this.state.msg);
    if(this.state.msg.length>0){
    //alert('extractChat'+global.remotehosting);
    this.setState({isloading:true});
    var chattemp=[];
    
    fetch(global.remotehosting+'/sendchat.php', {
        method: 'post',
        headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body:JSON.stringify({
            sessionid:global.sessionid,
            pid: global.userid,
            msg:this.state.msg,
        })
        
    })
    .then((response) => response.json())
    .then((responseJson) => {
        //alert(responseJson);
        if(responseJson.includes('|')){

          var result=responseJson.split('|');
          var ctr=0;
          while(ctr<result.length){
              var obj={
                  sessionid:result[ctr++],
                  sendmsg:result[ctr++],
                  dt_send:result[ctr++],
                  recmsg:result[ctr++],
                  dt_rec:result[ctr++],
                  jumlah:result[ctr++],
                  status_send:result[ctr++],
                  status_rec:result[ctr++],
                  paid:result[ctr++],
                  act_status_send:result[ctr++],
                  act_status_rec:result[ctr++],
              };
              chattemp.push(obj);
              
            }

          }     
          this.setState({chatlist:chattemp});
          this.setState({isloading:false});      
          //this._keyboardDidHide();
          Keyboard.dismiss();

    }).catch((error) => {
      console.error(error);
    });
  }
  }
  componentDidMount(){
    console.log('componentDidMount');
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
    );
    this.updateChat();
    //this.extractCost(global.pid);
    //this.extractChat(global.pid);
    
    this._keyboardDidHide();
    this.interval = setInterval(() => this.updateChat(),12000);
    
  }
  updateChat(){
    //this.extractCost(global.pid);
    this.extractChat(global.pid);
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  
    clearInterval(this.interval);
  }

  _keyboardDidShow() {
    this.setState({
        keyboardOffset: 115,
    })
  }

  _keyboardDidHide() {
    this.setState({
        keyboardOffset: 440,
    })
  }
  render(){
    console.log('renderchat:'+global.pid+','+global.reload+','+this.state.clrIdRec+','+this.state.clrIdSnd);
    //if(global.reload==true){
    //  global.reload=false;
    //  this.extractCost(global.pid);
    //  this.extractChat(global.pid);
    //}
    
    var mychat=[];
    //if(!this.state.isloading){
    
    const{chatlist}=this.state;
    console.log('in render chatlist length'+chatlist.length);
    for(let i=0;i<chatlist.length;i++){
        var chat=chatlist[i];
        var senddate=chat.dt_send===''?'':moment(chat.dt_send,"x").format("HH:mm");
        var recdate=chat.dt_rec===''?'':moment(chat.dt_rec,"x").format("HH:mm");
        var act_status_send=chat.act_status_send;
        if((act_status_send==='del_send')||(act_status_send==='del_rec_send')){
          mychat.push(
            <TouchableOpacity style={styles.chatcard}
            
            >
            <View style={styles.chatLine}>
            <Text style={styles.chatLeft}></Text>    
            <View>
              <Text style={styles.chatRightBlur}>You deleted this message</Text>
              <Text style={styles.chatRight1}>{senddate}</Text>
            </View>
            </View>    
            </TouchableOpacity>      
          )  
        }
        else{
          mychat.push(
              <TouchableOpacity style={styles.chatcard}
              onPress={()=>{
                var j=this.state.clrIdRec;
                console.log('j is:'+j+',i is:'+i);
                if(j===i){
                    j=-1;
                }
                else{
                    j=i;
                }
                console.log('j is:'+j);
                this.setState({clrIdRec:j});
              }}
              >
              <View style={styles.chatLine}>
                  <Text style={styles.chatLeft}></Text>    
                  <View>
                    <Text style={this.state.clrIdRec===i?styles.chatRightHL:styles.chatRight}>{chat.sendmsg}</Text>
                    <Text style={styles.chatRight1}>{senddate}</Text>
                  </View>
              </View>
              </TouchableOpacity>
            );
        }
        if(chat.recmsg!==''){
          //hapus message dari dokter
          if((act_status_send==='del_rec')||(act_status_send==='del_rec_send')){
            mychat.push(
              <TouchableOpacity style={styles.chatcard}>
              <View>
                <View>  
                <Text style={styles.chatrecRightBlur}>This message was deleted</Text>
                <Text style={styles.chatrecRight1}>{recdate}</Text>
                </View>      
              </View>
              </TouchableOpacity>    
              )
          }
          else{
            mychat.push(
              <TouchableOpacity style={styles.chatcard}
              onPress={()=>{
                var j=this.state.clrIdSnd;
                console.log('j is:'+j+',i is:'+i);
                if(j===i){
                    j=-1;
                }
                else{
                    j=i;
                }
                console.log('j is:'+j);
                this.setState({clrIdSnd:j});
            }}
              >
              <View>
                <View>  
                <Text style={this.state.clrIdSnd===i?styles.chatrecRightHL:styles.chatrecRight}>{chat.recmsg}</Text>
                
                {/*<Text style={styles.chatrecRight}>{chat.recmsg}</Text>*/}
                <Text style={styles.chatrecRight1}>{recdate}</Text>
                </View>      
              </View>
              </TouchableOpacity>    
              
              )
          }
        }
    }
    //}
    //else{
    //    mychat.push(<Text>Wait.....</Text>)
    //}
    var inputbtn=[];
    if((this.state.clrIdRec===-1)&&(this.state.clrIdSnd===-1)){
        inputbtn.push(
          <TextInput
                  onChangeText={(text)=>this.setMsg(text)}
                  placeholder="Masukkan pertanyaan"
                  style={[styles.searchBar,{width:"80%"}]}
                  ref={input => { this.textInput = input }}
                  onSubmitEditing={Keyboard.dismiss}
            >

            </TextInput>
                
        )
        inputbtn.push(
          <TouchableOpacity style={[styles.buttonSmallStyle,{width:"20%"}]} onPress={() => {this.sendMsg();this.textInput.clear()}}>
            <Text>KIRIM</Text>
          </TouchableOpacity>
        )
    }
    else{
      inputbtn.push(
        <Button icon="delete" onPress={()=>{this.hapus()}}>
          Hapus
        </Button>
      )
    }
    return (
      <MenuProvider>
        <MenuSettingChat clearchat={this.clearChat} endchat={this.endChat}></MenuSettingChat>
      {/*<View>*/}
        
      <HeaderComponent src='Meja' sbsrc='Setting' r={this.props.navigation} subtitle={global.sessionid}
        title='Chat dengan CS mu'/>
        
      {/*<View style={styles.cartLineTotal}>
        <Text style={[styles.lineLeft,styles.lineTotal]}>Start: {this.state.start===''?'':moment(this.state.start,'x').format('HH:mm:ss')}</Text>
        <Text style={styles.lineRight}>Total: {this.state.qty}</Text>
      </View>

      <View style={styles.cartLineTotal}>
        <Text style={[styles.lineLeft,styles.lineTotal]}>TOTAL</Text>
        <Text style={styles.lineRight}>{this.currencyFormat(this.state.cost)}</Text>
        </View>*/}


      <ScrollView style={{height:this.state.keyboardOffset,backgroundColor:'#f5ecc6'}}
        ref={ref => scrollView = ref}
          onContentSizeChange={() => this.state.scrollToEnd?scrollView.scrollToEnd({ animated: true }):''}
        >
        {mychat}
      </ScrollView>  

      <View style={{flexDirection:"row",
                    marginTop:0,
                    justifyContent:"space-evenly",
                alignItems:"center"}}>
                {/*<TextInput
                  onChangeText={(text)=>this.setMsg(text)}
                  placeholder="Masukkan pertanyaan"
                  style={[styles.searchBar,{width:"80%"}]}
                  ref={input => { this.textInput = input }}
                  onSubmitEditing={Keyboard.dismiss}
                ></TextInput>
                <TouchableOpacity style={[styles.buttonSmallStyle,{width:"20%"}]} onPress={() => {this.sendMsg();this.textInput.clear()}}>
                  <Text>KIRIM</Text>
                </TouchableOpacity>*/}
                {/*<Button icon="delete">
                Hapus
              </Button>*/}
                {inputbtn}
              </View>      
       {/*</View>*/}
       </MenuProvider>
        
    );
      }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  buttonStyle:{
    backgroundColor:"#6fdf32",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    width:100,
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    //marginRight:30,
    //textAlign:"center",
  },

  buttonSmallStyle:{
    //borderColor:"#6fdf32",
    borderRadius: 10,
    
    borderWidth: 1,
    borderColor: 'red',
    color:'red',
    //width: '50%',
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',

  },
  searchBar: {
    fontSize: 18,
    //marginTop: 10,
    //width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginVertical: 20,
    //width:"50%",
    
    
  },
  chatcard: {
    backgroundColor: '#f5ecc6',
    //borderRadius: 16,
    //shadowOpacity: 0.2,
    //shadowRadius: 4,
    //shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    //elevation: 1,
    marginVertical: 2,
    //width:"50%",
    
    
  },
  chatreccard: {
    backgroundColor: 'white',
    //borderRadius: 16,
    //shadowOpacity: 0.2,
    //shadowRadius: 4,
    //shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    //elevation: 1,
    marginVertical: 5,
    //width:"50%",
    
    
  },
  chatLine: { 
    flexDirection: 'row',
    //borderTopColor: '#dddddd',
    //borderTopWidth: 1,
    marginTop:0,
    marginBottom:0,
    //height:35,
    //marginLeft:10,
  },
  chatrecLine: { 
    flexDirection: 'row',
    //borderTopColor: '#dddddd',
    //borderTopWidth: 1,
    marginTop:0,
    marginBottom:0,
    backgroundColor:'#f5ecc6',
    //height:135,
    //marginLeft:10,
  },
  chatLeft: {
    //flex:1,
    //flexGrow:1,
    flex: 1,
    flexDirection:"row",
    fontSize: 15, 
    width:"50%",
    //textAlign:"right",
    //lineHeight: 20, 
    //color:'#333333' ,
    marginLeft:10,
    backgroundColor:"#f5ecc6",
    borderWidth:0,
  },
  chatrecLeft: {
    flex:1,
    flexGrow:1,
    fontSize: 15, 
    width:"50%",
    //lineHeight: 20, 
    //color:'#333333' ,
    marginLeft:10,
    backgroundColor:"white",
    borderWidth:0,
  },
  chatRight: { 
    flex: 1,
    flexDirection:"column",
    fontSize: 16, 
    color:'#333333', 
    textAlign:'left',
    marginRight:10,
    backgroundColor:"#deffaa",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    //width:"50%",
  },
  chatRightBlur: { 
    flex: 1,
    flexDirection:"column",
    fontSize: 16, 
    color:'#989797', 
    textAlign:'left',
    fontStyle:"italic",
    marginRight:10,
    backgroundColor:"#deffaa",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    //width:"50%",
  },
  chatrecRight: { 
    flex: 1,
    flexDirection:"column",
    fontSize: 16, 
    color:'#333333', 
    textAlign:'left',
    marginRight:10,
    backgroundColor:"white",
    borderTopRightRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    width:"50%",
  },
  chatrecRightBlur: { 
    flex: 1,
    flexDirection:"column",
    fontSize: 16, 
    color:'#989797', 
    textAlign:'left',
    marginRight:10,
    fontStyle:"italic",
    backgroundColor:"white",
    borderTopRightRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    width:"50%",
  },
  chatrecRightHL: { 
    flex: 1,
    flexDirection:"column",
    fontSize: 16, 
    color:'#333333', 
    textAlign:'left',
    marginRight:10,
    backgroundColor:"#ffefeb",
    borderTopRightRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    width:"50%",
  },
  chatRightHL: { 
    flex: 1,
    flexDirection:"column",
    fontSize: 16, 
    color:'#333333', 
    textAlign:'left',
    marginRight:10,
    backgroundColor:"#ffefeb",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    //width:"50%",
  },
  chatRight1: { 
    //flex: 1,
    //flexDirection:"column",
    fontSize: 10, 
    //fontWeight: 'bold',
    color:'#333333', 
    textAlign:'center',
    marginRight:0,
    //width:"50%",
    //backgroundColor:"#fefbe8",
    backgroundColor:"#deffaa",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
  },
  chatrecRight1: { 
    //flex: 1,
    //flexDirection:"column",
    fontSize: 10, 
    //fontWeight: 'bold',
    color:'#333333', 
    textAlign:'center',
    marginRight:0,
    width:"50%",
    //backgroundColor:"#fefbe8",
    backgroundColor:"white",
    borderBottomRightRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
  },
  card1: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginVertical: 20,
    width:"100%",
    height:60,
    marginTop:0,
  },
  image: {
    height: 300,
    width: "100%",
    resizeMode:"stretch",
  },
  infoContainer: {
    padding: 10,
    
  },
  infoContainer1: {
    paddingLeft:5,
    paddingRight:0,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end', // if you want to fill rows left to right

  },
  infoContainer2: {
    padding:10,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',//flex-start,flex-end,center,space-between,space-around,space-evenly
    alignItems: 'flex-end' // if you want to fill rows left to right
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  keluhan: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#787878',
    marginBottom: 16,
  },
  cartLine: { 
    flexDirection: 'row',
    
  },
  
  cartLineTotal: { 
    flexDirection: 'row',
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    marginTop:0,
    marginBottom:0,
    height:25,
    //marginLeft:10,
  },

  lineTotal: {
    fontWeight: 'bold',
    marginLeft:10,    
  },
  lineLeft: {
    fontSize: 15, 
    width:260,
    lineHeight: 20, 
    color:'#333333' ,
    marginLeft:10
  },
  lineRight: { 
    flex: 1,
    fontSize: 15, 
    fontWeight: 'bold',
    color:'#333333', 
    textAlign:'right',
    marginRight:10,
  },
  
  inputTextWrapper: {
    marginBottom: 8,
    flexDirection:"row",
    
  },
  textInput: {
    height: 30,
    width:"90%",
    borderColor: "#000000",
    borderBottomWidth: 1,
    //paddingRight: 10,
    flex:1,
    fontSize: 14, 
  },
  textInputArea: {
    height: 80,
    width:"50%",
    borderColor: "#000000",
    borderBottomWidth: 1,
    textAlignVertical:"top",
    marginTop:0,
    marginLeft:0,
    
  },
  textItem: {
    width: '60%', // is 50% of container width
    //backgroundColor:"yellow",
    marginBottom:-10,

  },
  textItem3: {
    width: '60%', // is 50% of container width
    //backgroundColor:"yellow",
    marginBottom:-10,

  },
  textItem1: {
    width: '40%', // is 50% of container width
    textAlign:"center",
    marginRight:0,
    marginTop:0,
    //backgroundColor:"green",
  },
  textItem4: {
    width: '40%', // is 50% of container width
    textAlign:"right",
    marginRight:0,
    marginTop:0,
    //backgroundColor:"green",
  },
  textItem2: {
    width: '30%', // is 50% of container width
    textAlign:"center",
    //textAlign:"right",
    //backgroundColor:"green",
  },
  status_wait: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 0,
    color:'black',
    width:60,
    height:20,
    backgroundColor:'yellow',
    
  },
  status_in: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 0,
    color:'black',
    width:60,
    height:20,
    backgroundColor:'lightgreen',
    marginTop:-10,
  },
  status_fin: {
    fontSize: 14,
    fontWeight:"bold",
    marginBottom: 0,
    //color:'red',
    width:120,
    height:30,
    borderColor:1,
    backgroundColor:'red',
  },
  
});
