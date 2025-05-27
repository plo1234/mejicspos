import React,{Component} from 'react';
import { StyleSheet,Text,View,TouchableOpacity,Alert,ScrollView,Image,ActivityIndicator } from 'react-native';
import { HeaderComponent } from '../component/headercomponent';
import { Dimensions,NativeModules } from 'react-native';
import {Badge} from 'react-native-paper';
import { Button } from 'react-native-paper';
import MejaScreen from './MejaScreen';
import { RadioButton} from 'react-native-paper';
import moment from 'moment';

export default class MenuScreen extends Component{
    constructor(props) {super(props);
        this.state = {
            mid:'',
            isloading:false,
            menu:[],
            order:[],
            colorId:0,
            clrId:-1,
            itemcart:[],
            submitorder:false,
            orderid:'',
            checked:false,
            kas:[],
            nama:'',
            alamat:'',
            kota:'',
            tel:'',
        };
        
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
      extractKas=()=>{
        
        var temp=[];
        fetch(global.remotehosting+'/extractkas.php', {
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
          
        if(responseJson.includes('|'))
        {
          //alert(responseJson);
          var result=responseJson.split('|');
          for(let i=0;i<result.length;i++){
            temp.push(result[i]);
          }
          
          this.setState({kas:temp});
          
        }
        else{
          
        }
       
       
 
      }).catch((error) => {
        console.error(error);
      });

      }
      bayar=(meja,total)=>{
        //alert(meja+','+total);
        this.setState({isloading:true});
        fetch(global.remotehosting+'/bayar.php', {
          method: 'post',
          headers:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
          },
          body:JSON.stringify({
              meja:meja,
              orderid:global.orderid,
              kas:this.state.kas[this.state.colorId],
              total:total,
          })
          
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //MejaScreen.extractMeja();
            //global.reload=true;
            //alert('after simpan global reload:'+global.reload);
            //this.setState({submitorder:true})
            //this.setState({itemcart:[]})
            //alert(responseJson);
            //RNXPrinter.initialize();
            //let printerList=await RNXPrinter.getDeviceList();
            //await RNXPrinter.selectDevice(printerList[0].address);
            //RNXPrinter.pickPrinter();
            //loaderHandler.hideLoader();
            this.setState({isloading:false});
            global.reload=true;
            this.props.navigation.navigate('Meja',{msg:'hello'});
          
        }).catch((error) => {
          console.error(error);
        });
      }
      componentDidMount(){
        this.extractKas();
        this.extractProfile();
      };
      render(){
        const{route}=this.props;
        const{order}=route.params==null?'':route.params;
        const{mid}=route.params==null?'':route.params;
        var myLoop=[];
        var total=0;
        for(let i=0;i<order.length;i++){
            var obj=order[i];
            total+=parseFloat(obj.harga);
            myLoop.push(
              <View style={styles.cartLine}>
              <Text style={styles.lineLeft}>{obj.qty} x {obj.namabrng}</Text>
              <Text style={styles.lineRight}>{this.currencyFormat(''+obj.harga)}</Text>
              </View>
            )
        }
        //load kas
        var kasarr=[];
        if(!this.state.isloading){
        for(let i=0;i<this.state.kas.length-1;i++){

          kasarr.push(
            <TouchableOpacity style={this.state.colorId===i?styles.surfaceActive:styles.surface}
              onPress={()=>{
                this.setState({colorId:i})
              }}
            >
            <Text style={{marginTop:this.state.kas[i].length>5?0:5,marginLeft:0,fontSize:10}}>{this.state.kas[i]}</Text>
            </TouchableOpacity>
          )
        }
      }

        //var orderid=order.length>0?order[0].id:Date.now();
        var ctrlbutton=[];
        if(this.state.itemcart.length>0){
          
          ctrlbutton.push(
            <View style={{flexDirection:"row",
                  marginTop:0,
                  justifyContent:"space-evenly",
            alignItems:"center"}}>
              {/*<TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.batal()}}>
                <Button>BATAL</Button>
          </TouchableOpacity>              */}
              <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.bayar(mid,total)}}>
                <Button>SELESAI</Button>
              </TouchableOpacity>
            
            </View>
          )
        }
        else{
          if(this.state.isloading){
            
            ctrlbutton.push(
              
              <View style={{flexDirection:"row",
              marginTop:0,
              height:40,
              justifyContent:"space-evenly",
              alignItems:"center"}}>
                <ActivityIndicator color={"#000"} />
                {/*<TouchableOpacity style={[styles.buttonStyle,{width:200}]}>
                  <Button>WAIT.........</Button>
                </TouchableOpacity>*/}

              </View>
            )
          }
          else{
              ctrlbutton.push(
              <View style={{flexDirection:"row",
              marginTop:0,
              height:40,
              justifyContent:"space-evenly",
              alignItems:"center"}}>
                {/*<TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.hapus()}}>
                  <Button>HAPUS</Button>
              </TouchableOpacity>*/}
              
                <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.bayar(mid,total)}}>
                  <Button>PRINT</Button>
                </TouchableOpacity>

              </View>
            )
          }
        }
        return(
          
            <View>
            
              <HeaderComponent src='Meja' r={this.props.navigation} title={mid}/>
              <View style={styles.cartLineTotal1}>
                  <Text style={styles.lineRight}>{this.state.nama}</Text>
                  <Text>{this.state.alamat}</Text>
                  <Text>{this.state.kota} Tel: {this.state.tel}</Text>
                  
              </View>
              <View style={styles.cartLineTotal}>
                  <Text style={styles.lineLeft1}>{moment(moment().valueOf(),'x').format('DD/MM/YYYY HH:mm:ss')}</Text>
                  <Text style={styles.lineRight1}>Kasir: {global.userid}</Text>
              </View>
              <ScrollView style={{height:100}}>
                {myLoop}
              </ScrollView>
              <View style={styles.cartLineTotal}>
                  <Text style={[styles.lineLeft,styles.lineTotal]}>TOTAL</Text>
                  <Text style={styles.lineRight}>{this.currencyFormat(''+total)}</Text>
              </View>
              <View style={{flexDirection:"row",
                  marginTop:0,marginBottom:30,
                  justifyContent:"space-evenly",
                  alignItems:"center"}}>
                  {kasarr}
              </View>
              {ctrlbutton}
              </View>
        )
      }
    }
    const styles = StyleSheet.create({
        header:{
          backgroundColor: "#00BFFF",
          height:30,
        },
        
        cartLine: { 
          flexDirection: 'row',
          
        },
        cartLineTotal: { 
          flexDirection: 'row',
          borderTopColor: '#dddddd',
          borderTopWidth: 1,
          marginTop:10,
          marginBottom:10,
          height:40,
          //marginLeft:10,
        },
        cartLineTotal1: { 
          flexDirection: 'column',
          borderTopColor: '#dddddd',
          borderTopWidth: 2,
          marginTop:0,
          marginBottom:10,
          height:60,
          alignItems:"center",
          
          //marginLeft:10,
        },
        lineTotal: {
          fontWeight: 'bold',
          marginLeft:10,    
        },
        lineLeft: {
          fontSize: 15, 
          //fontWeight: 'bold',
          marginLeft:10,    
          width:260,
          lineHeight: 20, 
          color:'#333333' ,
          //marginLeft:10
        },
        lineRight: { 
          flex: 1,
          fontSize: 15, 
          fontWeight: 'bold',
          lineHeight: 20, 
          color:'#333333', 
          textAlign:'right',
          marginRight:10,
        },
        lineLeft1: {
          fontSize: 15, 
          width:160,
          lineHeight: 20, 
          color:'#333333' ,
          marginLeft:10
        },
        lineRight1: { 
          flex: 1,
          fontSize: 15, 
          //fontWeight: 'bold',
          lineHeight: 20, 
          color:'#333333', 
          textAlign:'right',
          marginRight:10,
        },
        itemsList: {
          backgroundColor: '#eeeeee',
        },
        itemsListContainer: {
          backgroundColor: '#eeeeee',
          paddingVertical: 8,
          marginHorizontal: 8,
        },
        surfaceActive: {
          marginTop:0,
          marginLeft:3,
          padding: 0,
          height: 30,
          width: 40,
          backgroundColor:"pink",
          borderRadius: 3,
          borderWidth: 1,
          alignItems:'center',
          borderColor: 'red'
        },
        surface: {
          marginTop:0,
          marginLeft:3,
          padding: 0,
          height: 30,
          width: 40,
          alignItems:'center',
          backgroundColor:"white",
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#fff'
        },
        card: {
          backgroundColor: 'white',
          borderRadius: 10,
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowColor: 'black',
          shadowOffset: {
            height: 0,
            width: 0,
          },
          elevation: 1,
          marginVertical: 5,
        },
        infoContainer: {
          padding: 16,
        },
        description:{
          fontSize:16,
          color: "#696969",
          marginTop:0,
          textAlign: 'center'
        },
        status: {
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 2,
          
        },
        buttonStyle:{
          backgroundColor:"#6fdf32",
          borderRadius: 10,
          
          borderWidth: 1,
          borderColor: '#fff',
          width:100,
          height:40,
          //textAlign:"center",
        },
        dropdown: {
          backgroundColor: 'white',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.5,
          marginTop: 20,
      },
      shadow: {
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    icon: {
      marginRight: 5,
      width: 18,
      height: 18,
  },
  switch: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 250,
    marginLeft: 160,
    width: 50,
    height: 70,
  }
    
      });