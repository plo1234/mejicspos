import React, { Component } from 'react';
import { Button, Keyboard, Platform, StyleSheet, Text, TextInput, View,Picker, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
//import { Dropdown } from 'react-native-material-dropdown';//big problem!!!
//import ModalDropdown from 'react-native-modal-dropdown';
import { LogBox } from 'react-native';
import { MaskedTextInput} from "react-native-mask-text";
import moment from 'moment';
import { HeaderComponent } from '../component/headercomponent';
export default class ActivationScreen extends Component {

  bankInputRef = React.createRef();
  namaInputRef = React.createRef();
  accnoInputRef = React.createRef();
  monthsInputRef = React.createRef();
  expiredInputRef = React.createRef();
  
  constructor(props) {
    super(props);
    this.state = {
        bank: '',
        nama: '',
        accno:'',
        lisensi:[],
        note:'',
        period:'Month',
        expired:'',
        total:0,
        showAccnoError: false,
        showNamaError: false,
        
        
    };
    this.submitPressed = this.submitPressed.bind(this);
    
    
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
  extractLisensi=()=>{
    var temp=[];
    fetch(global.remotehosting+'/extracthargalisensi.php', {
    method: 'post',
    headers:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    body:JSON.stringify({
        //bank:nama,
        
    })
        
    })
    .then((response) => response.json())
    .then((responseJson) => {
        //alert(responseJson);
        if(responseJson.includes('|'))
        {
            var result=responseJson.split('|');
            var ctr=0;
            while(ctr<result.length){
                var obj={
                  bank:result[ctr++],
                  price1m:result[ctr++],
                  price3m:result[ctr++],
                  price6m:result[ctr++],
                  priceyr:result[ctr++],
                  priceunlimited:result[ctr++],
                  note:result[ctr++],
                };
                
                temp.push(obj);
            }
            //alert(temp.length);
            this.setState({lisensi:temp});
        
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
      this.accnoInputRef,
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
    //console.log("submitPressed this.state: ", this.state.qty);
    this.setState({
        //showQtyError: this.state.qty==='',
        showAccnoError: this.state.accno==='',
        showNamaError: this.state.nama==='',
        showBankError: this.state.bank==='',
        
    });
    var error=this.state.accno===''||this.state.nama===''||isNaN(this.state.accno)||this.state.bank==='';
    if(!error){
        this.buatAktifasi();
    }
    else{
      alert('Data tidak lengkap');
    }
    Keyboard.dismiss();
  }
  
  buatAktifasi=()=> {
    alert('buataktifasi');
    fetch(global.remotehosting+'/buataktifasi.php', {
          method: 'post',
          headers:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
          },
          body:JSON.stringify({
              uid:global.userid,
              bank: this.state.bank,
              nama: this.state.nama,
              accno: this.state.accno,
              period: this.state.period,
              //expired: this.state.expired,
              total: this.state.total,
              
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
  
  clearAllFields=()=>{
    this.setState({total:0});
    this.setState({expired:''});
  }
  setBank=(value)=>{
    var today=new Date();
    this.clearAllFields();
    //alert('setBank:'+value);
    const {lisensi}=this.state;
    //alert(lisensi.length);
    for(let i=0;i<lisensi.length;i++){
      var str=lisensi[i];
      //alert(str.bank+','+str.price1m+","+value);
      if(str.bank===value){
          //alert(this.state.period+','+str.price1m);
          if(this.state.period==='Month'){
            var harga=str.price1m;
            var td=moment(today).add(1,"M").format("DD/MM/YYYY");
            this.setState({expired:td});
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
          else if(this.state.period==='3 Months'){
            var harga=str.price3m;
            var td=moment(today).add(3,"M").format("DD/MM/YYYY");
            this.setState({expired:td});
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
          else if(this.state.period==='6 Months'){
            var harga=str.price6m;
            var td=moment(today).add(6,"M").format("DD/MM/YYYY");
            this.setState({expired:td});
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
          else if(this.state.period==='1 Year'){
            var harga=str.priceyr;
            var td=moment(today).add(1,"Y").format("DD/MM/YYYY");
            this.setState({expired:td});
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
          else if(this.state.period==='Unlimited'){
            var harga=str.priceunlimited;
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
      }
    }
    this.setState({bank:value});
    
    //this.calculatePeriod();
  }
  setAccno=(value)=>{
    this.setState({accno:value});
  }
  setNama=(value)=>{
    this.setState({nama:value});
  }
  setPeriod=(value)=>{
    var today=new Date();
    this.clearAllFields();
    //alert('setPeriod:'+value);
    const {lisensi,bank}=this.state;
    //alert(lisensi.length);
    for(let i=0;i<lisensi.length;i++){
      var str=lisensi[i];
    
      //alert(str.bank+','+str.price1m+","+value+","+bank);
      if(str.bank===bank){
          if(value==='Month'){
            var harga=str.price1m;
            var td=moment(today).add(1,"M").format("DD/MM/YYYY");
            this.setState({expired:td});
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
          else if(value==='3 Months'){
            var harga=str.price3m;
            var td=moment(today).add(3,"M").format("DD/MM/YYYY");
            this.setState({expired:td});
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
          else if(value==='6 Months'){
            var td=moment(today).add(6,"M").format("DD/MM/YYYY");
            this.setState({expired:td});
            var harga=str.price6m;
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
          else if(value==='1 Year'){
            var td=moment(today).add(1,"Y").format("DD/MM/YYYY");
            this.setState({expired:td});
            var harga=str.priceyr;
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
          else if(value==='Unlimited'){
            var harga=str.priceunlimited;
            this.setState({total:harga});
            if(harga>0){
              this.setState({note:str.note+" "+this.currencyFormat(harga)});
            }
          }
      }
    }
    this.setState({period:value});
  }
  
  componentDidMount() {
    console.log('componentDidAmount');
    this.extractLisensi();
    
  }
  render() {
    
    const { bank,accno,nama,period,expired,total,note,lisensi} = this.state;
    
    //alert('render:'+nomor);
    var tempbank=[];
    for(let i=0;i<lisensi.length;i++){
        var str=lisensi[i];
        if(str.bank!==''){
        tempbank.push(
          <Picker.Item label={str.bank} value={str.bank} />  
        )
        }
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
                <Text style={styles.header}>Aktifasi</Text>
                <View style={styles.inputTextWrapper}>
                <Text style={styles.lineLeft1}>Bank</Text>
                <Picker
                    selectedValue={bank}
                    style={ [styles.input,{marginLeft:-10}]}
                    onValueChange={(itemValue, itemIndex) => this.setBank(itemValue)}
                    >
                    <Picker.Item label="" value="" styles={{color:'red'}}/>
                    {tempbank}
                    
                </Picker>
                </View>



                <View style={styles.inputTextWrapper}>
                <Text style={styles.lineLeft1}>Nama</Text>
                <TextInput
                    placeholder=""
                    style={styles.textInput}
                    returnKeyType="next"
                    onSubmitEditing={this.editNextInput}
                    onFocus={this.onInputFocus}
                    onChangeText={(text)=>this.setNama(text)}
                    ref={this.namaInputRef}
                    value={nama}/>
                </View>
                <View style={styles.inputTextWrapper}>
        
                <Text style={styles.lineLeft1}>No. Rekening</Text>
                <TextInput
                    placeholder=""
                    style={styles.textInput}
                    returnKeyType="next"
                    onSubmitEditing={this.editNextInput}
                    onFocus={this.onInputFocus}
                    onChangeText={(text)=>this.setAccno(text)}
                    ref={this.namaInputRef}
                    value={accno}
                    keyboardType="numeric"
                />
                </View>
                <View style={styles.inputTextWrapper}>
                <Text style={styles.lineLeft1}>Period</Text>
                <Picker
                    selectedValue={period}
                    style={ [styles.input,{marginLeft:-10}]}
                    onValueChange={(itemValue, itemIndex) => this.setPeriod(itemValue)}
                    >
                    <Picker.Item label="Month" value="Month" styles={{color:'red'}}/>
                    <Picker.Item label="3 Months" value="3 Months" styles={{color:'red'}}/>
                    <Picker.Item label="6 Months" value="6 Months" styles={{color:'red'}}/>
                    <Picker.Item label="1 Year" value="1 Year" styles={{color:'red'}}/>
                    <Picker.Item label="Unlimited" value="Unlimited" styles={{color:'red'}}/>
                </Picker>
                </View>

                <View style={styles.inputTextWrapper}>
                <Text style={styles.lineLeft1}>Expired</Text>
                <TextInput
                    placeholder=""
                    style={styles.textInput}
                    returnKeyType="next"
                    onSubmitEditing={this.editNextInput}
                    onFocus={this.onInputFocus}
                    
                    ref={this.namaInputRef}
                    value={expired}
                    //keyboardType="numeric"
                />
                </View>
                <View style={styles.inputTextWrapper}>
                <Text style={styles.lineLeft1}>Total</Text>
                <TextInput
                    placeholder=""
                    style={styles.textInput}
                    returnKeyType="next"
                    onSubmitEditing={this.editNextInput}
                    onFocus={this.onInputFocus}
                    
                    ref={this.namaInputRef}
                    value={this.currencyFormat(total)}
                    //keyboardType="numeric"
                />
                </View>
                <View style={styles.inputTextWrapper}>
                <Text style={[styles.lineLeft2,{color:'red'}]}>{note}</Text>
                </View>
                <View style={{flexDirection:"row",
                    marginTop:60,
                    justifyContent:"space-around",
                    alignItems:"center"}}>
                
                  <Button title="Bayar" onPress={()=>{this.submitPressed()}}/>
                  
                  
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
    lineLeft2: {
      fontSize: 16, 
      width:"100%",
      lineHeight: 20, 
      color:'#333333' ,
      marginLeft:0,
      marginTop:0,
      flex:0,
      color:"red",
    },
    textInput: {
      height: 40,
      width:"80%",
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