import React, { Component } from 'react';
import { Button, Keyboard, Platform, StyleSheet, Text, TextInput, View,Picker, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
//import { Dropdown } from 'react-native-material-dropdown';//big problem!!!
//import ModalDropdown from 'react-native-modal-dropdown';
import { LogBox } from 'react-native';
import { MaskedTextInput} from "react-native-mask-text";

import { HeaderComponent } from '../component/headercomponent';
export default class SettingMejaScreen extends Component {

  nomorInputRef = React.createRef();
  namaInputRef = React.createRef();
  
  constructor(props) {
    super(props);
    this.state = {
        nomor: '',
        nama: '',
        meja:[],
        mejafound:[],
        baru:false,
        showNomorError: false,
        showNamaError: false,
        
    };
    this.submitPressed = this.submitPressed.bind(this);
    this.hapusMeja = this.hapusMeja.bind(this);
  }
  extractMeja=()=>{
    var temp=[];
    fetch(global.remotehosting+'/extractmejadb.php', {
        method: 'post',
        headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body:JSON.stringify({
            
        })
        
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //alert(responseJson);
      var result=responseJson.split('|');
      var ctr=0;
      while (ctr<result.length){
            var obj={
                nomor: result[ctr++],
                nama: result[ctr++],
                
            };
            temp.push(obj);      
      }
      this.setState({meja:temp});
      this.setState({isloading:false});
      
      

     }).catch((error) => {
       console.error(error);
     });
  }
  
  inputs = () => {
    return [
      this.nomorInputRef,
      this.namaInputRef,
      
    ];
  };

  editNextInput = () => {
    console.log("editNextInput")
    const activeIndex = this.getActiveInputIndex();
    if (activeIndex === -1) {
        return;
    }

    const nextIndex = activeIndex + 1;
    if (nextIndex < this.inputs().length && this.inputs()[nextIndex].current != null) {
        this.setFocus(this.inputs()[nextIndex], true);
    } else {
        this.finishEditing();
    }
  }

  onInputFocus = () => {
    this.setState({
        activeIndex: this.getActiveInputIndex(),

    });
  }

  onChangeInputHandler = (name, value) => {
    this.setState({
        [name]: value,
        
    });
  }

  getActiveInputIndex = () => {
    const activeIndex = this.inputs().findIndex((input) => {
        if (input.current == null) {
            return false;
        }
        //console.log("input: ", input);
        return input.current.isFocused();
    });
    //console.log("activeIndex: ", activeIndex);
    return activeIndex;
  }

  finishEditing = () => {
    const activeIndex = this.getActiveInputIndex();
    if (activeIndex === -1) {
        return;
    }
    this.setFocus(this.inputs()[activeIndex], false);
  }

  setFocus(textInputRef, shouldFocus) {
    if (shouldFocus) {
        setTimeout(() => {
            textInputRef.current.focus();
        }, 100);
    } else {
        textInputRef.current.blur();
    }
  }
  submitPressed() {
    console.log("submitPressed this.state: ", this.state.qty);
    this.setState({
        //showQtyError: this.state.qty==='',
        showNomorError: this.state.nomor==='',
        showNamaError: this.state.harga==='',
    });
    var error=this.state.nomor===''||this.state.nama==='';
    if(!error){
        //alert('simpan');
        this.buatMeja();
    }
    //alert(this.state.showPidError+','+this.state.pid);
    Keyboard.dismiss();
  }
  getNomorMeja=()=>{
    var x=0;
    const {meja}=this.state;
    for(let i=0;i<meja.length;i++){
      var s=meja[i];
      var mynomor=Number(s.nomor);
      if(mynomor>x){
        x=mynomor;
      }
    }
    return x+1;
  }
  baru=()=> {
    if(this.state.baru===false){
        var x=this.getNomorMeja();
        //alert("baru:"+x);
        var trailing=x<10?'000':x<100?'00':x<1000?'0':'';
        var xyz=trailing+x;
        this.setState({nomor:xyz});   
        this.setState({nama:''});   
        //alert(this.state.nomor);
    }
    //this.setState({nomor:'hello'});   
    //this.setState({nama:'hello'});   
    this.setState({baru:!this.state.baru});
  }
  buatMeja=()=> {
    fetch(global.remotehosting+'/buatmeja.php', {
          method: 'post',
          headers:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
          },
          body:JSON.stringify({
              nomor: this.state.nomor,
              nama: this.state.nama,
              
          })
          
      })
      .then((response) => response.json())
      .then((responseJson) => {
          alert(responseJson); 
          this.extractMeja();
          this.setState({baru:false});
      }).catch((error) => {
        console.error(error);
      });


  };
  hapusMeja=()=> {
    fetch(global.remotehosting+'/hapusmeja.php', {
          method: 'post',
          headers:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
          },
          body:JSON.stringify({
              nomor: this.state.nomor,
              
              
          })
          
      })
      .then((response) => response.json())
      .then((responseJson) => {
          alert(responseJson); 
          this.extractMeja();
          this.setState({nomor:''});
          this.setState({nama:''});
          //this.setState({baru:true});
      }).catch((error) => {
        console.error(error);
      });


  };
  
  setNomor=(value)=>{
    //alert('setNomor'+value);
    const {meja}=this.state;
    for(let i=0;i<meja.length;i++){
      var s=meja[i];
      if(s.nomor===value){
        this.setState({nama:s.nama});    
        break;
      }
    }
    this.setState({nomor:value});
    
  }

  setNama=(value)=>{
    //alert('setNama'+value);
    const {meja}=this.state;
    for(let i=0;i<meja.length;i++){
      var s=meja[i];
      if(s.nama===value){
        this.setState({nomor:s.nomor});    
        break;
      }
    }
    this.setState({nama:value});
  }
  componentDidMount() {
    console.log('componentDidAmount');
    this.extractMeja();
    
  }
  render() {
    
    const { nomor,nama,baru} = this.state;
    const{meja}=this.state;
    //alert('render:'+nomor);
    var tempno=[];
    var tempnama=[];

    for(let i=0;i<meja.length;i++){
          var s=meja[i];
          tempno.push(
            
            <Picker.Item label={s.nomor} value={s.nomor} />
            
          )
    }
    for(let i=0;i<meja.length;i++){
      var s=meja[i];
      tempnama.push(
        
        <Picker.Item label={s.nama} value={s.nama} />
        
      )
    }
    var nomorcmp=[];
    var namacmp=[];
    var ctrBtn=[];
    if((baru)&&(this.state.nomor!=='')&&(this.state.nama!=='')){
      ctrBtn.push(
        <Button title="Simpan" onPress={this.submitPressed} />
      )  
    }
    else if((!baru)&&(this.state.nomor!=='')&&(this.state.nama!=='')){
      ctrBtn.push(
        <Button title="Hapus" onPress={this.hapusMeja} />
      )
    }
    else{
      ctrBtn.push(
        //<Button title="Edit" onPress={this.submitPressed} styles={{width:0}} />
      )
    }
    
    if(baru){
      nomorcmp.push(
        <View style={styles.inputTextWrapper}>
              {/*<Text style={(nomor==='' || nomor===undefined)?styles.placehldr:styles.hide}>Nomor:</Text>
              <MaskedTextInput
              mask="9999"
              onChangeText={(text, rawText) => {
                  this.setNomor(text);
              }}
              style={styles.input}
              ref={this.nomorInputRef}
              keyboardType="numeric"
              value={nomor}
            />*/}
            <TextInput
            placeholder="Nomor"
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            //onChangeText={(text)=>this.setNomor(text)}
            ref={this.nomorInputRef}
            value={nomor}
            
        />
          </View>
      )
      namacmp.push(<View style={styles.inputTextWrapper}>
        <TextInput
            placeholder="Nama Meja"
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setNama(text)}
            ref={this.namaInputRef}
            value={nama}
            
        />
        </View>)
    }
    else{
      nomorcmp.push(
        <Picker
                selectedValue={nomor}
                style={ [styles.input,{marginLeft:-10}]}
                
                onValueChange={(itemValue, itemIndex) => this.setNomor(itemValue)}
                >
                <Picker.Item label="Nomor" value="Nomor" styles={{color:'red'}}/>
                {tempno}
                
              </Picker>
        
      )
      namacmp.push(
        <Picker
          selectedValue={nama}
          style={ [styles.input,{marginLeft:-10}]}
          
          onValueChange={(itemValue, itemIndex) => this.setNama(itemValue)}
          >
          <Picker.Item label="Nama" value="Nama" />
          {tempnama}
          
        </Picker>
      )
    }
    return (
        <KeyboardAwareScrollView
          style={styles.container}
          contentOffset={{ x: 0, y: 24 }}
          ref={this._scrollViewRef}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: 24 }}
          contentInsetAdjustmentBehavior="always"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          enableOnAndroid={true}
          extraHeight={32}
          extraScrollHeight={Platform.OS == "android" ? 32 : 0}
          enableResetScrollToCoords={false}
          onKeyboardDidShow={this._keyboardDidShowHandler}
        >
            <View style={styles.container}>
                <Text style={styles.header}>Setting Meja</Text>
                {nomorcmp}
                {namacmp}
                
                
                <View style={{flexDirection:"row",
                    marginTop:60,
                    justifyContent:"space-around",
                    alignItems:"center"}}>
                
                  <Button title={baru?"Batal":"Baru"} onPress={()=>{this.baru()}}/>
                  {ctrBtn}
                  
                  <Button title="Kembali" onPress={()=>{this.props.hidemeja()}}/>
                  
                </View>

            </View>
        </KeyboardAwareScrollView>
      );
  
                  }
                }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingBottom: 100,
    },
    header: {
      fontSize: 26,
      padding: 4,
      margin: 0,
      textAlign: "center",
    },
    inputTextWrapper: {
      marginBottom: 24,
    },
    textInput: {
      height: 40,
      borderColor: "#000000",
      borderBottomWidth: 1,
      paddingRight: 30,
    },
    errorText: {
      color: 'red',
      fontSize: 10,
    },
    placehldr: {
        color: '#b2b2b2',
        fontSize: 14,
      },
      showMaskText: {
        color: '#b2b2b2',
        fontSize: 14,
        height:10,
      },
      highlight: {
        color: 'black',
        fontSize: 14,
      },
      hide: {
        color: 'white',
        fontSize: 14,
        //height:0,
        //width:0,
      },  
    btnContainer: {
      backgroundColor: "white",
      marginTop:36,
    },
    input: {
      height: 40,
      margin: 12,
      //borderWidth: 1,
      borderRadius: 4,
      marginTop:0,
      marginLeft:-5,
      borderBottomWidth:1,
    },
  });