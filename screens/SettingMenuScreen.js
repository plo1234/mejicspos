import React, { Component } from 'react';
import { Button, Keyboard, Platform, StyleSheet, TouchableOpacity,Text, TextInput, View,Picker, Alert,Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
//import { Dropdown } from 'react-native-material-dropdown';//big problem!!!
//import ModalDropdown from 'react-native-modal-dropdown';
import { LogBox } from 'react-native';
import { MaskedTextInput} from "react-native-mask-text";
import { HeaderComponent } from '../component/headercomponent';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
export default class SettingMenuScreen extends Component {

  nomorInputRef = React.createRef();
  namaInputRef = React.createRef();
  katInputRef = React.createRef();
  satuanInputRef = React.createRef();
  hargaInputRef = React.createRef();
  
  constructor(props) {
    super(props);
    this.state = {
        nomor: '',
        nama: '',
        kat:'',
        satuan:'',
        harga:'',
        desc:'',
        editcat:false,
        editsatuan:false,
        menu:[],
        cat:[],
        sat:[],
        baru:false,
        image:null,
        showNomorError: false,
        showNamaError: false,
        showKatError: false,
        showSatuanError: false,
        showHargaError: false,
        
    };
    this.submitPressed = this.submitPressed.bind(this);
    this.hapusMenu = this.hapusMenu.bind(this);
  }
  checkForCameraRollPermission=async()=>{
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Please grant camera roll permissions inside your system's settings");
    }else{
      console.log('Media Permissions are granted')
    }
  
  }
  uploadImg=async()=>{
    let _image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });
      if ((!_image.cancelled)&&(this.state.nomor!=='')) {
        //alert('setImage:'+_image.uri+'?time:'+new Date());
        this.setState({image:_image.uri});
        let localUri = _image.uri;
        let filename = localUri.split('/').pop();
      
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        //alert('uploadImage->localUri:'+localUri+',filename:'+filename+',type:'+type);
        let formData = new FormData();
        formData.append('photo', { uri: localUri, name: this.state.nomor+'.png', type });
      
        return await fetch(global.remotehosting+'/uploadandroid.php', {
          method: 'POST',
          body: formData,
          header: {
            'content-type': 'multipart/form-data',
          },
        });
      }
      
  }
  extractMenu=()=>{
    var temp=[];
    var tempcat=[];    
    var tempsat=[];    
    fetch(global.remotehosting+'/extractmenudb.php', {
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
        while(ctr<result.length){
            
            var obj={
                kodebrng:result[ctr++],
                namabrng:result[ctr++],
                harga:result[ctr++],
                satuan:result[ctr++],
                category:result[ctr++],
                desc:result[ctr++],
                //qty:1

            };
            temp.push(obj);
            var found=false;
            for(let i=0;i<tempcat.length;i++){
                var c=tempcat[i];
                if(c===obj.category){
                    found=true;
                }
            }
            if(!found){
                tempcat.push(obj.category);
            }

            //load satuan
            var found=false;
            for(let i=0;i<tempsat.length;i++){
                var c=tempsat[i];
                if(c===obj.satuan){
                    found=true;
                }
            }
            if(!found){
                tempsat.push(obj.satuan);
            }
        }
        this.setState({menu:temp});
        this.setState({cat:tempcat});
        this.setState({sat:tempsat});
        //this.setState({colorId: id});
        
        //global.menu=temp;
        //this.props.navigation.navigate('Menu',{order:temp,mid:m});
        
        }
        else{
        //this.props.navigation.navigate('Menu',{order:temp,mid:m,total:total});
        alert(responseJson);
        }
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
        showNomorError: this.state.nomor==='',
        showNamaError: this.state.nama==='',
        showHargaError: this.state.harga==='',
        showKatError: this.state.kat==='',
        showSatuanError: this.state.satuan==='',
    });
    var error=this.state.nomor===''||this.state.nama===''||this.state.kat==='';
    if(!error){
        //alert('simpan');
        this.buatMenu();
    }
    //alert(this.state.showPidError+','+this.state.pid);
    Keyboard.dismiss();
  }
  getNomorMenu=()=>{
    var x=0;
    const {menu}=this.state;
    for(let i=0;i<menu.length;i++){
      var str=menu[i];
      var mynomor=Number(str.kodebrng);
      if(mynomor>x){
        x=mynomor;
      }
    }
    return x+1;
  }
  baru=()=> {
    if(this.state.baru===false){
      if(this.state.nomor===''){
        var x=this.getNomorMenu();
        var trailing=x<10?'000':x<100?'00':x<1000?'0':'';
        var xyz=trailing+x;
        this.setState({nomor:xyz});   
        this.setState({nama:''});   
        this.setState({harga:''});   
        this.setState({desc:''});
      }
      else{
        
      }
        //alert(this.state.nomor);
    }
    //this.setState({nomor:'hello'});   
    //this.setState({nama:'hello'});   
    this.setState({baru:!this.state.baru});
  }
  buatMenu=()=> {
    fetch(global.remotehosting+'/buatmenu.php', {
          method: 'post',
          headers:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
          },
          body:JSON.stringify({
              nomor: this.state.nomor,
              nama: this.state.nama,
              category: this.state.kat,
              satuan: this.state.satuan,
              harga: this.state.harga,
              desc: this.state.desc,
              
          })
          
      })
      .then((response) => response.json())
      .then((responseJson) => {
          alert(responseJson); 
          this.extractMenu();
          this.setState({baru:false});
      }).catch((error) => {
        console.error(error);
      });


  };
  hapusMenu=()=> {
    fetch(global.remotehosting+'/hapusmenu.php', {
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
          this.extractMenu();
          this.setState({nomor:''});
          this.setState({nama:''});
          this.setState({desc:''});
          //this.setState({baru:true});
      }).catch((error) => {
        console.error(error);
      });


  };
  
  setNomor=(value)=>{
    //alert('setNomor'+value);
    const {menu}=this.state;
    for(let i=0;i<menu.length;i++){
      var str=menu[i];
      if(str.kodebrng===value){
        this.setState({nama:str.namabrng});   
        this.setState({kat:str.category});     
        this.setState({satuan:str.satuan});    
        this.setState({harga:str.harga});    
        this.setState({desc:str.desc});    
        var url=global.remotehosting+'/photos/'+value+'.png?val='+new Date();
        this.setState({image:url});    
        break;
      }
    }
    if(value===''){
      this.setState({nama:''});   
        this.setState({kat:''});     
        this.setState({satuan:''});    
        this.setState({harga:''});    
        this.setState({desc:''});    
    }
    this.setState({nomor:value});
    
  }

  setNama=(value)=>{
    //alert('setNama'+value);
    const {menu}=this.state;
    for(let i=0;i<menu.length;i++){
      var str=menu[i];
      if(str.namabrng===value){
        this.setState({nomor:str.kodebrng});    
        this.setState({kat:str.category});    
        this.setState({satuan:str.satuan});    
        this.setState({harga:str.harga});    
        this.setState({desc:str.desc});    
        var url=global.remotehosting+'/photos/'+str.kodebrng+'.png';
        this.setState({image:url});    
        break;
      }
    }
    this.setState({nama:value});
  }
  setCategory=(value)=>{
    //alert('setCategory'+value);
    const {menu}=this.state;
    var cat=value;
    for(let i=0;i<menu.length;i++){
      var str=menu[i];
      if(str.category===value){
        cat=str.category;
        break;
      }
    }  
    this.setState({kat:cat});    
  }
  setSatuan=(value)=>{
    //alert('setSatuan'+value);
    const {menu}=this.state;
    var sat=value;
    for(let i=0;i<menu.length;i++){
      var str=menu[i];
      if(str.satuan===value){
        sat=str.satuan;
        break;
      }
    }  
    this.setState({satuan:sat});    
  }
  setHarga=(value)=>{
    //alert('setHarga'+value);
    
    this.setState({harga:value});    
  }
  setDesc=(value)=>{
    //alert('setHarga'+value);
    
    this.setState({desc:value});    
  }
  componentDidMount() {
    console.log('componentDidAmount');
    //this.checkForCameraRollPermission();
    this.extractMenu();
    
  }
  render() {
    
    const { nomor,nama,baru,kat,satuan,harga,image,desc} = this.state;
    const{menu,cat,sat}=this.state;
    //alert('render:'+nomor);
    var tempno=[];
    var tempnama=[];
    var tempcat=[];
    var tempsat=[];
    for(let i=0;i<menu.length;i++){
        var str=menu[i];
        tempno.push(
          <Picker.Item label={str.kodebrng} value={str.kodebrng} />  
        )
    }
    for(let i=0;i<menu.length;i++){
        var str=menu[i];
        tempnama.push(
        <Picker.Item label={str.namabrng} value={str.namabrng} />
        )
    }
    for(let i=0;i<cat.length;i++){
        var str=cat[i];
        tempcat.push(
        <Picker.Item label={str} value={str} />
        )
    }
    for(let i=0;i<sat.length;i++){
      var str=sat[i];
      tempsat.push(
      <Picker.Item label={str} value={str} />
      )
    }

    var nomorcmp=[];
    var namacmp=[];
    var catcmp=[];
    var satuancmp=[];
    var ctrBtn=[];
    var hargacmp=[];
    var imagecmp=[];
    var ketcmp=[];

    if((baru)&&(this.state.nomor!=='')&&(this.state.nama!=='')){
      ctrBtn.push(
        <Button title="Simpan" onPress={this.submitPressed} />
      )  
    }
    else if((!baru)&&(this.state.nomor!=='')&&(this.state.nama!=='')){
      ctrBtn.push(
        <Button title="Hapus" onPress={this.hapusMenu} />
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
        
        <Text style={styles.lineLeft1}>Kode Menu</Text>      
            <TextInput
            placeholder="Kode Menu"
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setNomor(text)}
            ref={this.nomorInputRef}
            value={nomor}            
            />
        </View>
      )
      namacmp.push(<View style={styles.inputTextWrapper}>
        
        <Text style={styles.lineLeft1}>Menu</Text>
        <TextInput
            placeholder="Nama Menu"
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setNama(text)}
            ref={this.namaInputRef}
            value={nama}
            
        />
        </View>)
      catcmp.push(
        <View style={styles.inputTextWrapper}>
        <Text style={styles.lineLeft1}>Kategori</Text>
        <Picker
            selectedValue={kat}
            style={ [styles.input,{marginLeft:-10}]}
            onValueChange={(itemValue, itemIndex) => this.setCategory(itemValue)}
            >
            <Picker.Item label="" value="" styles={{color:'red'}}/>
            {tempcat}
        </Picker>
        </View>
      )
      satuancmp.push(
        <View style={styles.inputTextWrapper}>
        <Text style={styles.lineLeft1}>Satuan</Text>
        <Picker
            selectedValue={satuan}
            style={ [styles.input,{marginLeft:-10}]}
            onValueChange={(itemValue, itemIndex) => this.setSatuan(itemValue)}
            >
            <Picker.Item label="" value="" styles={{color:'red'}}/>
            {tempsat}
        </Picker>
        </View>
      )
      hargacmp.push(<View style={styles.inputTextWrapper}>
        
        <Text style={styles.lineLeft1}>Harga</Text>
        <TextInput
            placeholder=""
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setHarga(text)}
            ref={this.namaInputRef}
            value={harga}
            keyboardType="numeric"
        />
        </View>
      )
      ketcmp.push(
        <View style={styles.inputTextWrapper}>
        
        <Text style={styles.lineLeft1}>Keterangan</Text>      
            <TextInput
            placeholder=""
            style={styles.textInputArea}
            multiline={true}
            numberOfLines={4}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setDesc(text)}
            ref={this.nomorInputRef}
            value={desc}            
            />
        </View>
      )  
    }
    else{
      nomorcmp.push(
        <View style={styles.inputTextWrapper}>
        <Text style={styles.lineLeft}>Kode Menu</Text>
        <Picker
            selectedValue={nomor}
            style={ [styles.input,{marginLeft:-10}]}
            onValueChange={(itemValue, itemIndex) => this.setNomor(itemValue)}
            >
            <Picker.Item label="" value="" styles={{color:'red'}}/>
            {tempno}
        </Picker>
        </View>
      )
      namacmp.push(
        <View style={styles.inputTextWrapper}>
        <Text style={styles.lineLeft}>Menu</Text>
        <Picker
          selectedValue={nama}
          style={ [styles.input,{marginLeft:-10}]}
          
          onValueChange={(itemValue, itemIndex) => this.setNama(itemValue)}
          >
          <Picker.Item label="" value="" />
          {tempnama}
          
        </Picker>
        </View>
      )
      catcmp.push(
        <View style={styles.inputTextWrapper}>
        <Text style={styles.lineLeft}>Kategori</Text>
        <Picker
            selectedValue={kat}
            style={ [styles.input,{marginLeft:-10}]}
            onValueChange={(itemValue, itemIndex) => this.setCategory(itemValue)}
            >
            <Picker.Item label="" value="" styles={{color:'red'}}/>
            {tempcat}
        </Picker>
        </View>
      )
      satuancmp.push(
        <View style={styles.inputTextWrapper}>
        <Text style={styles.lineLeft}>Satuan</Text>
        <Picker
            selectedValue={satuan}
            style={ [styles.input,{marginLeft:-10}]}
            onValueChange={(itemValue, itemIndex) => this.setSatuan(itemValue)}
            >
            <Picker.Item label="" value="" styles={{color:'red'}}/>
            {tempsat}
        </Picker>
        </View>
      )
      hargacmp.push(<View style={styles.inputTextWrapper}>
        
        <Text style={styles.lineLeft1}>Harga</Text>
        <TextInput
            placeholder=""
            style={styles.textInput}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setHarga(text)}
            ref={this.namaInputRef}
            value={harga}
            keyboardType="numeric"
        />
        </View>
      )
      ketcmp.push(
        <View style={styles.inputTextWrapper}>
        
        <Text style={styles.lineLeft1}>Keterangan</Text>      
            <TextInput
            placeholder=""
            style={styles.textInputArea}
            multiline={true}
            numberOfLines={4}
            returnKeyType="next"
            onSubmitEditing={this.editNextInput}
            onFocus={this.onInputFocus}
            onChangeText={(text)=>this.setDesc(text)}
            ref={this.nomorInputRef}
            value={desc}            
            />
        </View>
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
                <Text style={styles.header}>Setting Menu</Text>
                {nomorcmp}
                {catcmp}
                {namacmp}
                {satuancmp}
                {hargacmp}
                {ketcmp}
                <Text style={styles.lineLeft}>Foto</Text>
                <View style={styles.uploadcontainer}>
        
                
                {
                    image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                }
                    
                    <View style={styles.uploadBtnContainer}>
                        {/*<TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >*/}
                        <TouchableOpacity onPress={this.uploadImg} style={styles.uploadBtn} >
                            <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                            <AntDesign name="camera" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

            
                {/*<UploadImage></UploadImage>*/}
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
      padding: 5,
      paddingBottom: 10,
    },
    uploadcontainer:{
      //elevation:2,
      //flex:1,
      height:150,
      width:150, 
      backgroundColor:'#efefef',
      position:'relative',
      //borderRadius:999,
      overflow:'hidden',
      marginLeft:80,
      marginTop:-20,
  },
    uploadBtnContainer:{
      opacity:0.7,
      position:'absolute',
      right:0,
      bottom:0,
      backgroundColor:'lightgrey',
      width:'100%',
      height:'20%',
  },
  uploadBtn:{
      display:'flex',
      alignItems:"center",
      justifyContent:'center'
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
      width:"40%",
      lineHeight: 120, 
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
    textInputArea: {
      height: 80,
      width:"90%",
      borderColor: "#000000",
      borderBottomWidth: 1,
      textAlignVertical:"top",
      marginTop:10,
      flex:1,
      //justifyContent:"flex-end",//flex-start,flex-end,center,space-between,space-around,space-evenly
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