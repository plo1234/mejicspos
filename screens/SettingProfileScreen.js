import React, { Component } from 'react';
import { Button, Keyboard, Platform, StyleSheet, Text, TextInput, View,Picker, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
//import { Dropdown } from 'react-native-material-dropdown';//big problem!!!
//import ModalDropdown from 'react-native-modal-dropdown';
import { LogBox } from 'react-native';
import { MaskedTextInput} from "react-native-mask-text";

import { HeaderComponent } from '../component/headercomponent';
export default class SettingMenuScreen extends Component {

  namaInputRef = React.createRef();
  alamatInputRef = React.createRef();
  kotaInputRef = React.createRef();
  telInputRef = React.createRef();
  
  constructor(props) {
    super(props);
    this.state = {
        nama: '',
        alamat: '',
        kota:'',
        tel:'',
        baru:false,
        showNamaError: false,
        showAlamatError: false,
        showKotaError: false,
        showTelError: false,
  
    };
    this.submitPressed = this.submitPressed.bind(this);
    this.submitPressed = this.submitPressed.bind(this);
    
  }
  extractProfile=()=>{
      //alert('extractProfile');
    fetch(global.remotehosting+'/extractprofile.php', {
    method: 'post',
    headers:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    body:JSON.stringify({
        //cat:cat
    })
        
    })
    .then((response) => response.json())
    .then((responseJson) => {
        
        if(responseJson.includes('|'))
        {
        
        var result=responseJson.split('|');
        var ctr=0;
        if(ctr<result.length){
            
            nama=result[ctr++];
            address=result[ctr++];
            city=result[ctr++];
            tel=result[ctr++];
            
            this.setState({nama:nama});
            this.setState({alamat:address});
            this.setState({kota:city});
            this.setState({tel:tel});
        }
        
        else{
            alert(responseJson);
        }
    }
    else{
        alert(responseJson);
    }
    }).catch((error) => {
        console.error(error);
    });
  }
  
  inputs = () => {
    return [
      this.alamatInputRef,
      this.namaInputRef,
      
    ];
  };

  editNextInput = () => {
    console.log("editNextInput");
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
    
    this.buatProfile();
    Keyboard.dismiss();
  }
  
  baru=()=> {
      //alert('baru');
    if(this.state.baru===false){
      
        //this.setState({nama:''});   
        //this.setState({alamat:''});   
        //this.setState({kota:''});   
        //this.setState({tel:''});   
        
    }
    else{
        this.extractProfile();
    }
    this.setState({baru:!this.state.baru});
  }
  buatProfile=()=> {
    fetch(global.remotehosting+'/buatprofile.php', {
          method: 'post',
          headers:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
          },
          body:JSON.stringify({
              company: this.state.nama,
              address: this.state.alamat,
              city: this.state.kota,
              tel: this.state.tel,
              
          })
          
      })
      .then((response) => response.json())
      .then((responseJson) => {
          alert(responseJson); 
          //this.extractMenu();
          //this.setState({baru:false});
      }).catch((error) => {
        console.error(error);
      });


  };
  hapusProfile=()=> {
    fetch(global.remotehosting+'/hapusprofile.php', {
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
          this.extractProfile();
          this.setState({nama:''});
          this.setState({alamat:''});
          this.setState({kota:''});
          this.setState({tel:''});
          
      }).catch((error) => {
        console.error(error);
      });


  };
  
  setNama=(value)=>{
    
    this.setState({nama:value});
    
  }

  setAlamat=(value)=>{
    this.setState({alamat:value});
  }
  setKota=(value)=>{
    
    this.setState({kota:value});    
  }

  setTel=(value)=>{
    this.setState({tel:value});    
  }
  componentDidMount() {
    console.log('componentDidAmount');
    this.extractProfile();
    
  }
  render() {
    
    const { nama,alamat,kota,tel,baru} = this.state;
    

    var namacmp=[];
    var alamatcmp=[];
    var kotacmp=[];
    var telcmp=[];
    var ctrBtn=[];

    if((baru)&&(this.state.nama!=='')&&(this.state.alamat!=='')){
      ctrBtn.push(
        <Button title="Simpan" onPress={this.submitPressed} />
      )  
    }
    else if((!baru)&&(this.state.nama!=='')&&(this.state.alamat!=='')){
      ctrBtn.push(
        <Button title="Hapus" onPress={this.hapusMenu} />
      )
    }
    else{
      ctrBtn.push(
        //<Button title="Edit" onPress={this.submitPressed} styles={{width:0}} />
      )
    }
    
    
    namacmp.push(
        <View style={styles.inputTextWrapper}>
        
        <Text style={styles.lineLeft1}>Nama Bisnis</Text>      
            <TextInput
            placeholder="Nama Bisnis"
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setNama(text)}
            ref={this.namaInputRef}
            value={nama}            
            />
        </View>
    )
    alamatcmp.push(<View style={styles.inputTextWrapper}>
    
    <Text style={styles.lineLeft1}>Alamat</Text>
    <TextInput
        placeholder="Alamat"
        style={styles.textInput}
        returnKeyType="next"
        onSubmitEditing={this.editNextInput}
        onFocus={this.onInputFocus}
        onChangeText={(text)=>this.setAlamat(text)}
        ref={this.namaInputRef}
        value={alamat}
        
    />
    </View>)
    kotacmp.push(<View style={styles.inputTextWrapper}>
    
        <Text style={styles.lineLeft1}>Kota</Text>
        <TextInput
            placeholder="Kota"
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setKota(text)}
            ref={this.namaInputRef}
            value={kota}
            
        />
        </View>)
        
    telcmp.push(<View style={styles.inputTextWrapper}>

        <Text style={styles.lineLeft1}>Telefon</Text>
        <TextInput
            placeholder="Telefon"
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setTel(text)}
            ref={this.namaInputRef}
            value={tel}
            
        />
        </View>)
    
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
                <Text style={styles.header}>Setting Profile</Text>
                {namacmp}
                {alamatcmp}
                {kotacmp}
                {telcmp}
                <View style={{flexDirection:"row",
                    marginTop:60,
                    justifyContent:"space-around",
                    alignItems:"center"}}>
                
                  <Button title={baru?"Batal":"Baru"} onPress={()=>{this.baru()}}/>
                  {ctrBtn}
                  
                  <Button title="Kembali" onPress={()=>{this.props.hidemenu()}}/>
                  
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
      marginBottom: 8,
      flexDirection:"row",
    },
    lineLeft: {
      fontSize: 16, 
      width:"40%",
      lineHeight: 40, 
      color:'#333333' ,
      marginLeft:0,
      marginTop:0,
      flex:0,
      //backgroundColor:"red",
    },
    lineLeft1: {
      fontSize: 16, 
      width:"40%",
      lineHeight: 40, 
      color:'#333333' ,
      marginLeft:0,
      marginTop:0,
      flex:0,
      //backgroundColor:"red",
    },
    textInput: {
      height: 40,
      borderColor: "#000000",
      borderBottomWidth: 1,
      paddingRight: 0,
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
      margin: 0,
      //borderWidth: 1,
      borderRadius: 4,
      marginTop:0,
      marginLeft:0,
      borderBottomWidth:1,
      flex:1,
    },
  });