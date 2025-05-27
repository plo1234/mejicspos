import React, { Component,useState } from 'react';
import moment, { now } from 'moment';
//import { StyleSheet,Text,View,TouchableOpacity,Alert,ScrollView,Image } from 'react-native';
//import { Alert } from 'react-native';
import { Button, Card,Chip,Paragraph,Title } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Table,TableWrapper,Row,Rows,Col,Cols,Cell } from 'react-native-table-component';
import 'moment/locale/id'
import {
  StyleSheet,
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  Touchable,
  ScrollView
} from 'react-native';

import { HeaderComponent } from '../component/headercomponent';
import MyCalendar from './MyCalendar';


export default class LaporanScreen extends Component {
      
    constructor(props) {super(props);
      //this.extractJadwal=this.extractJadwal.bind(this);
      
      this.state = {
      //currentDate: new Date(),
      //markedDate: moment(new Date()).format("LLLL"),
      colorId:0,
      //clrId:-1,
      startdate:'',
      enddate:'',
      //timetable:[],
      headergrp:[],
      bodygrp:[],
      footergrp:[],  
      showFromDate:false,
      showToDate:false,
      };
      
    }
    hideFromCal=()=>{
      //alert('hideFromCal');
      this.setState({showFromDate:false});
      this.setState({showToDate:false});
    }
    hideToCal=()=>{
      //alert('hideToCal');
      this.setState({showToDate:false});
      this.setState({showFromDate:false});

    }
    setFromDate=(d)=>{
      //alert('setFromDate:'+d);
      d=moment(d).valueOf();
      if(d>this.state.enddate){
        this.setState({enddate:d});
      }
      this.setState({startdate:d});
      this.setState({showFromDate:false});

    }
    setToDate=(d)=>{
      //alert('setToDate:'+d);
      d=moment(d).valueOf();
      if(d<this.state.startdate){
        this.setState({startdate:d});
      }
      this.setState({enddate:d});
      this.setState({showToDate:false});
    }
    //currentDate="2021-08-08";
    changeCat = (id) => {  
      this.setState({colorId: id});
      this.extractLaporan();
    };
    
    setTimeTbl=(cid) => {
      //alert('test'+cid+','+this.state.id);
      this.setState({clrId: cid});

      //alert(this.state.clrId+','+this.state.colorId);
    };
    extractTotalTrx=()=> {
        //alert('extractTotalTrx:'+this.state.startdate+','+this.state.enddate);
          fetch('http:///149.129.250.239/restotester82619982/extracttrxsummary.php', {
            method: 'post',
            headers:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                startdate: this.state.startdate,
                enddate:this.state.enddate,
            })
            
        })
        .then((response) => response.json())
        .then((responseJson) => {
            
          // If server response message same as Data Matched
        //console.log(responseJson);
        if(responseJson.includes('~'))
          {
            var header='';
            var body='';
            var footer='';

            var result=responseJson.split('~');
            var ctr=0;
            while(ctr<result.length){
              header=result[ctr++];
              body=result[ctr++];
              footer=result[ctr++];
              break;
              //body=result[1];
              //footer=result[2];
            }
            console.log('header---->'+header+',body---->'+body+',footer---->'+footer);
            var headerarr=header.split('|');
            var headergrp=[];
            var ctr=0;
            while(ctr<headerarr.length){
              headergrp.push(headerarr[ctr++]);
            }
            this.setState({headergrp:headergrp});
            //parse body
            var bodyarr=body.split('|');
            var bodygrp=[];
            
            var ctr=0;
            while(ctr<bodyarr.length){
              var row=[];
              for(let i=0;i<headergrp.length;i++){
                var b=bodyarr[ctr++];
                row.push(b);
              }
              bodygrp.push(row);
            }
            this.setState({bodygrp:bodygrp});
            
          }

        }).catch((error) => {
          console.error(error);
        });
    }
    
    
    extractLaporan=()=>{
      //alert('extractLaporan'+this.state.colorId);
      if(this.state.colorId===0){
        this.extractTotalTrx();
      }
    }
    componentDidMount(){
      var currdate=moment().valueOf();
      var nextmonth=moment().add(1,"M").valueOf();
      this.setState({startdate:currdate});
      this.setState({enddate:nextmonth});

      //this.setState(totdate:{moment(new Date()).add(1,"M")});
      
    };
    render() {

      const { route } = this.props;
      const {m1} = route.params==null?'':route.params;

      var td1=moment(this.state.startdate,"x").format("DD-MM-YYYY");
      var td2=moment(this.state.enddate,"x").format("DD-MM-YYYY");
      //var today = this.state.currentDate;
      //var td=moment(today).add(this.state.colorId,"d").format("YYYY-MM-DD");
      
      //var day = moment(today).format("dddd");
      //var date = moment(today).format("DD MMMM");
      //var dd=date.substring(0,6);
      var mypage=[];
      var myLoop=[];
      var mycat=[];
      var mytitle=[];
      //var myheader=[];
      //var mybody=[];
      //var records=this.state.bodygrp.length/this.state.headergrp.length;
      if(this.state.colorId===0){
        mytitle.push(
          <Text>TOTAL TRANSAKSI</Text>
        )
        /*for(let i=0;i<this.state.headergrp.length;i++){
          var obj=this.state.headergrp[i];
           myheader.push(
            <TouchableOpacity style={styles.headersurface}>
            <Text>{obj}</Text>
            </TouchableOpacity>
           )
        }
        var offset=0;
        for(let i=0;i<records;i++){
          var obj=this.state.bodygrp[offset];
          mybody.push(
            <Text>{obj}</Text>
          )
          offset+=this.state.headergrp.length;
        }*/
        /*var records=this.state.bodygrp.length/
        for(let i=0;i<this.state.bodygrp.length;i++){
          var obj=this.state.bodygrp[i];
           mybody.push(
            <TouchableOpacity style={styles.headersurface}>
            <Text>{obj}</Text>

            </TouchableOpacity>
           )
        }*/
      }
      else if(this.state.colorId==1){
        mypage.push(
          <Text>PENJUALAN</Text>
        )
      }
      myLoop.push(
        <TouchableOpacity style={this.state.colorId===0?styles.surface1:styles.surface1}
            onPress={()=>{
              //this.props.navigation.navigate('datepicker',{cbfunct:this.setFromDate("")});
              this.setState({showFromDate:true});
            }}
            >
            <Text>DARI</Text>
            <Text>{td1}</Text>
            </TouchableOpacity>
      )
      myLoop.push(
        <TouchableOpacity style={this.state.colorId===1?styles.surface1:styles.surface1}
            onPress={()=>{
              //this.props.navigation.navigate('datepicker',{cbfunct:this.setFromDate("")});
              this.setState({showToDate:true});
            }}
        >
        <Text>S/D</Text>
        <Text>{td2}</Text>
        </TouchableOpacity>
      )
      
      mycat.push(
        <TouchableOpacity style={this.state.colorId===0?styles.surfaceActive:styles.surface}
        onPress={()=>{
          this.changeCat(0);
        }}
        >
        <Text style={{fontSize:12}}>PENJUALAN</Text>
        </TouchableOpacity>    
      )
      mycat.push(
        <TouchableOpacity style={this.state.colorId===1?styles.surfaceActive:styles.surface}
        onPress={()=>{
          this.changeCat(1);
        }}
        >
        <Text style={{fontSize:12}}>STOK</Text>
        </TouchableOpacity>    
      )
      mycat.push(
        <TouchableOpacity style={this.state.colorId===2?styles.surfaceActive:styles.surface}
        onPress={()=>{
          this.changeCat(2);
        }}
        >
        <Text style={{fontSize:12}}>PEMBELIAN</Text>
        </TouchableOpacity>    
      )
      mycat.push(
        <TouchableOpacity style={this.state.colorId===3?styles.surfaceActive:styles.surface}
        onPress={()=>{
          this.changeCat(3);
        }}
        >
        <Text style={{fontSize:12}}>HUTANG</Text>
        </TouchableOpacity>    
      )
      mycat.push(
        <TouchableOpacity style={this.state.colorId===4?styles.surfaceActive:styles.surface}
        onPress={()=>{
          this.changeCat(4);
        }}
        >
        <Text style={{fontSize:12}}>PIUTANG</Text>
        </TouchableOpacity>    
      )
      mycat.push(
        <TouchableOpacity style={this.state.colorId===5?styles.surfaceActive:styles.surface}
        onPress={()=>{
          this.changeCat(5);
        }}
        >
        <Text style={{fontSize:12}}>LABA/RUGI</Text>
        </TouchableOpacity>    
      )
        
      
      var timeTbl=[];
      var h=9;
      var now=moment().format("H");
      var nowdate=moment().format("YYYY-MM-DD");
      if(this.state.showFromDate){
        return (
          <MyCalendar hidecalendar={this.hideToCal} setcalendar={this.setFromDate}></MyCalendar>
        )
      }
      else if(this.state.showToDate){
        return (
          <MyCalendar hidecalendar={this.hideToCal} setcalendar={this.setToDate}></MyCalendar>
        )
      }  
      else{
      return (
      
      <View style={styles.container}>
          {/*<View style={styles.header}></View>*/}
          <HeaderComponent src='Meja' r={this.props.navigation}/>
          <View style={styles.body}>
            <Text style={[styles.description,{color:'blue'}]}>PERIODE</Text>
            <Text style={[styles.description,{color:'red'}]}>{td1} s/d {td2}</Text>
            {/*<Text style={styles.description}>{this.state.fromdate}-{this.state.todate}</Text>*/}
            <View style={{flexDirection:"row",
                  justifyContent:"space-between",
                  alignItems:"center"}}>                    
                  {myLoop}
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator = { false }>
            {mycat}
            </ScrollView>
            <View>{mytitle}</View>
            <View style={styles.container}>
            <ScrollView style={{height:320,marginTop:0,backgroundColor:'b2b2b2'}}>
            {/*<ScrollView style={{height:350,marginTop:0}} horizontal={true} showsHorizontalScrollIndicator = { false }>*/}
            <Table borderStyle={{borderWidth: 1, borderColor: '#ffa1d2'}}>
              <Row data={this.state.headergrp} style={styles.HeadStyle} textStyle={styles.TableText}/>
              <Rows data={this.state.bodygrp} textStyle={styles.TableText}/>
            </Table>
            </ScrollView>
            </View>
            {/*</ScrollView>*/}
            {/*<ScrollView horizontal={true} showsHorizontalScrollIndicator = { false }>
            {myheader}
            </ScrollView>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator = { false }>
            {mybody}
            </ScrollView>*/}
            {/*<ScrollView horizontal={true} showsHorizontalScrollIndicator = { false }>
            
                {myheaders}
                
      </ScrollView>*/}
        </View>
      </View>
    );
      }
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BFFF",
    height:30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:0
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
    
  },
  body:{
    marginTop:-20,
  },
  bodyContent: {
    flex: 1,
    flexDirection:"column",
    alignItems: 'center',
    padding:0,
    
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:0
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:0,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    width:200,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  surfaceActive: {
    marginTop:10,
    padding: 8,
    height: 60,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    backgroundColor:"pink",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red'
  },
  surface: {
    marginTop:10,
    padding: 8,
    height: 60,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    marginRight:5,
    borderColor: '#fff'
  },
  surface1: {
    marginTop:10,
    padding: 8,
    height: 60,
    width: 170,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    backgroundColor:"#98E431",
    borderRadius: 10,
    borderWidth: 1,
    marginRight:5,
    borderColor: '#fff'
  },
  headersurface: {
    marginTop:10,
    flexDirection:"row",
    padding: 8,
    height: 40,
    width: 80,
    //alignItems: 'center',
    //justifyContent: 'center',
    //elevation: 4,
    //backgroundColor:"#98E431",
    borderRadius: 0,
    borderWidth: 1,
    marginRight:5,
    borderColor: '#fff',
    justifyContent:"space-between",
    alignItems:"center"
  },
  surface2: {
    marginTop:0,
    marginLeft:0,
    padding: 8,
    height: 40,
    width: 160,
    alignItems: 'baseline',
    justifyContent: 'space-between',
    backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  chipstyle0: {
    marginTop:100,
    marginLeft:0,
    padding: 8,
    height: 60,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff'
  },
  chipstyle1: {
    marginTop:160,
    marginLeft:0,
    padding: 8,
    height: 60,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  chipstyle2: {
    marginTop:220,
    marginLeft:0,
    padding: 8,
    height: 60,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  chipstyle3: {
    marginTop:280,
    marginLeft:0,
    padding: 8,
    height: 60,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  buttonJanji: {
    marginTop:360,
    marginLeft:0,
    padding: 0,
    //height: 40,
    //width: 180,
    alignItems: 'baseline',
    justifyContent: 'center',
    //backgroundColor:"#6fdf32",
    backgroundColor:"pink",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
    
    
  },
  selected: {
    backgroundColor: "coral",
    borderWidth: 0,
  },
  HeadStyle: { 
    height: 50,
    fontWeight:'100',
    //width:50,
    alignContent: "center",
    backgroundColor: '#ffe0f0'
  },
  TableText: { 
    margin: 0,
    alignContent:"center",
    //width: 40,
    textAlign: 'center'
  }
  
});