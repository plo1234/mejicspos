import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';
import moment, { now } from 'moment';
import 'moment/locale/id';
export default class MyCalendar extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      selectedStartDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  
  onDateChange(date) {
    //alert('onDateChange'+date);
    this.setState({
      selectedStartDate: date,
      //this.state.currentDate:date,
    });
    //this.props.cbfunct("hallo");
  }
  render() {
    //alert('render in calendar');
    //const { route } = this.props;
    //const {m1} = route.params==null?'':route.params;
    //const {m2} = route.params==null?'':route.params;
    //alert("in calendar:"+m1+','+m2);  
    /*if(m2!=undefined){
      var s=moment().add(1,"M");
      this.state.selectedStartDate=s;
    }
    else if(m1!=undefined){
      var s=moment().add(1,"M");
      this.state.selectedStartDate=s;
    }*/
    
    
    //}
    //if(m!=this.state.selectedStartDate){
    //  alert('in calendar not same');
    //  this.state.selectedStartDate=m;
      //this.onDateChange(m);
    //}
    const {selectedStartDate}  =this.state;
    //alert(moment(selectedStartDate).format("DD-MM-YYYY"));
    const startDate = selectedStartDate ? selectedStartDate : '';
    //alert('startDate:'+startDate);
    return (
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}

        />
        <View style={{flexDirection:"row",
                    marginTop:60,
                    justifyContent:"space-evenly",
        alignItems:"center"}}>
          <TouchableOpacity style={styles.buttonStyle}>
            {/*<Button onPress={()=>{this.props.navigation.navigate("Laporan")}}>BATAL</Button>*/}
            <Button onPress={()=>{this.props.hidecalendar()}}>BATAL</Button>
          </TouchableOpacity>              
          <TouchableOpacity style={styles.buttonStyle}>
            <Button onPress={()=>{this.props.setcalendar(startDate)}}>SELESAI</Button>
          </TouchableOpacity>
        
        </View>
        {/*<View>
          <Text>SELECTED DATE:{ startDate }</Text>
        </View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  buttonStyle:{
    backgroundColor:"#6fdf32",
    borderRadius: 10,
    
    borderWidth: 1,
    borderColor: '#fff',
    width:100,
    height:40,
    //textAlign:"center",
  }
});