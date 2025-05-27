import React from "react";
import { Component } from "react";
import { render } from "react-dom";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import MenuSetting from "./SettingScreen";
import SettingMejaScreen from "./SettingMejaScreen";
import SettingProfileScreen from "./SettingProfileScreen";

import {
  MenuContext,
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { HeaderComponent } from "../component/headercomponent";
import SettingMenuScreen from "./SettingMenuScreen";
import ActivationScreen from "./ActivationScreen";
export default class MejaScreen extends Component {
  constructor(props) {
    super(props);
    //this.extractMeja=this.extractMeja.bind(this);

    this.state = {
      clrId: 0,
      isloading: true,
      tbl: [],
      mid: "",
      issettingmeja: false,
      issettingmenu: false,
      issettingprofile: false,
      isactivation: false,
    };
    //this.showMeja = this.showMeja.bind(this);
  }
  //this.showMeja = this.showMeja.bind(this);
  logout = () => {
    BackHandler.exitApp();
    //this.props.navigation.navigate("Login");
  };

  showMeja = () => {
    this.setState({ issettingmeja: true });
  };
  showMenu = () => {
    this.setState({ issettingmenu: true });
  };
  showProfile = () => {
    this.setState({ issettingprofile: true });
  };
  showActivation = () => {
    this.setState({ isactivation: true });
  };
  hideMeja = () => {
    this.setState({ issettingmeja: false });
  };

  hideMenu = () => {
    this.setState({ issettingmenu: false });
  };
  hideProfile = () => {
    this.setState({ issettingprofile: false });
  };
  hideActivation = () => {
    this.setState({ isactivation: false });
  };

  loadCategory = () => {
    var cat = [];
    fetch(global.remotehosting + "/extractcategory.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.includes("|")) {
          var result = responseJson.split("|");
          for (let i = 0; i < result.length; i++) {
            cat.push(result[i]);
          }

          global.category = cat;
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  loadOrder = (m) => {
    //this.setState({mid: m});
    this.loadCategory();
    var temp = [];
    //alert('loadOrder:'+m);
    //this.setState({colorId: id});
    fetch(global.remotehosting + "/extractorder.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        meja: m,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.includes("|")) {
          var result = responseJson.split("|");
          var ctr = 0;
          while (ctr < result.length) {
            var obj = {
              id: result[ctr++],
              harga: result[ctr++],
              qty: result[ctr++],
              namabrng: result[ctr++],
              hargasatuan: result[ctr++],
              satuan: result[ctr++],
            };
            temp.push(obj);
          }
          global.orderid = temp[0].id;
          //this.extractMeja();
          this.props.navigation.navigate("Menu", { order: temp, mid: m });
        } else {
          global.orderid = Date.now();
          //this.extractMeja();
          this.props.navigation.navigate("Menu", { order: temp, mid: m });
          //alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  extractMeja = () => {
    var temp = [];
    fetch(global.remotehosting + "/extractmeja.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var result = responseJson.split("|");
        var ctr = 0;
        while (ctr < result.length) {
          var obj = {
            name: result[ctr++],
            status: result[ctr++],
          };
          temp.push(obj);
        }
        this.setState({ tbl: temp });
        this.setState({ isloading: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  extractMejaOld = async () => {
    //alert('extractMeja');
    const resp = await fetch(global.remotehosting + "/extractmeja.php");
    const data = await resp.json();
    var result = data.split("|");
    var ctr = 0;
    while (ctr < result.length) {
      var obj = {
        //id:result[ctr++],
        name: result[ctr++],
        status: result[ctr++],
      };
      this.state.tbl.push(obj);
    }
    //global.reload=false;
    //alert(this.state.tbl.length);
    this.setState({ isloading: false });

    //}
  };
  componentDidMount() {
    this.extractMeja();
  }

  render() {
    //alert('render, issetting:'+this.state.issetting);
    if (global.reload) {
      //alert('fdsafadsf');
      global.reload = false;
      this.extractMeja();
    }
    //this.extractMeja();
    const { route } = this.props;
    const { msg } = route.params == null ? "" : route.params;
    const { isloading } = this.state;
    const { issettingmeja, issettingmenu, issettingprofile, isactivation } =
      this.state;
    //alert('render:'+isloading+","+msg);
    if (issettingmeja) {
      return <SettingMejaScreen hidemeja={this.hideMeja}></SettingMejaScreen>;
    } else if (issettingmenu) {
      return <SettingMenuScreen hidemenu={this.hideMenu}></SettingMenuScreen>;
    } else if (issettingprofile) {
      return (
        <SettingProfileScreen
          hidemenu={this.hideProfile}
        ></SettingProfileScreen>
      );
    } else if (isactivation) {
      return (
        <ActivationScreen hidemenu={this.hideActivation}></ActivationScreen>
      );
    } else {
      if (!isloading) {
        //    this.setState({isloading:true})

        //alert('render'+this.state.isloading);
        //this.extractMeja();
        var activation = [];
        if (global.department === "Demo") {
          activation.push(
            <TouchableOpacity
              style={styles.smallsurfaceActive1}
              onPress={() => {
                this.showActivation();
              }}
            >
              <Text style={{ fontSize: 14, color: "red" }}>
                Click here to activate demo version
              </Text>
            </TouchableOpacity>
          );
        } else {
          activation.push(<Text>Expired: {global.department}</Text>);
        }
        var mejasize = this.state.tbl.length;
        //console.log('mejasize:'+mejasize);
        var x = Math.round(mejasize / 4);
        x = mejasize % 4 !== 0 ? x + 1 : x;
        //alert(x);
        var myLoop = [];
        var top = 0;

        for (let i = 0; i < x; i++) {
          let children = [];
          for (let j = 0; j < 4; j++) {
            var k = i * 4 + j;
            if (k < mejasize) {
              var o = this.state.tbl[k];
              children.push(
                <TouchableOpacity
                  style={
                    o.status === "1"
                      ? [styles.surfaceActive, { marginTop: top }]
                      : [styles.surface, { marginTop: top }]
                  }
                  onPress={() => {
                    var o = this.state.tbl[i * 4 + j];
                    this.loadOrder(o.name);
                    // this.props.navigation.navigate('Menu',{mid:o.name})
                  }}
                >
                  <Text>{o.name}</Text>
                </TouchableOpacity>
              );
            }
          }
          top = 20; //space between row in meja
          myLoop.push(
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "stretch",
              }}
            >
              {children}
            </View>
          );
        }
        return (
          //global.department=result[0];
          //global.username=result[1];
          <MenuProvider>
            <MenuSetting
              showmeja={this.showMeja}
              showmenu={this.showMenu}
              logout={this.logout}
              showprofile={this.showProfile}
            ></MenuSetting>
            <View style={styles.cartLineTotal}>
              <Text style={[styles.lineLeft]}>Welcome: {global.username}</Text>
              <View style={styles.lineRight}>{activation}</View>
            </View>
            <ScrollView style={{ height: 420 }}>{myLoop}</ScrollView>
          </MenuProvider>
        );
      } else {
        //this.extractMeja();
        return <Text>Loading......</Text>;
        //return <SettingMejaScreen></SettingMejaScreen>
      }
    }
  }
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    height: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 0,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    marginTop: 10,
  },
  bodyContent: {
    flex: 3,
    flexDirection: "column",
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600",
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 0,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 0,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: 200,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  smallsurfaceActive: {
    marginTop: 0,
    marginLeft: 0,
    padding: 8,
    height: 20,
    width: 180,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    backgroundColor: "yellow",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "yellow",
    //color:'black',
  },
  surfaceActive: {
    marginTop: 40,
    marginLeft: 0,
    padding: 8,
    height: 60,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    backgroundColor: "pink",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
  },
  surface: {
    marginTop: 40,
    padding: 8,
    height: 60,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  surface1: {
    marginTop: 0,
    marginLeft: 0,
    padding: 8,
    height: 40,
    width: 60,
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  chipstyle0: {
    marginTop: 100,
    marginLeft: 0,
    padding: 8,
    height: 60,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chipstyle1: {
    marginTop: 160,
    marginLeft: 0,
    padding: 8,
    height: 60,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  chipstyle2: {
    marginTop: 220,
    marginLeft: 0,
    padding: 8,
    height: 60,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  chipstyle3: {
    marginTop: 280,
    marginLeft: 0,
    padding: 8,
    height: 60,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonJanji: {
    marginTop: 360,
    marginLeft: 0,
    padding: 0,
    //height: 40,
    //width: 180,
    alignItems: "baseline",
    justifyContent: "center",
    //backgroundColor:"#6fdf32",
    backgroundColor: "pink",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  selected: {
    backgroundColor: "coral",
    borderWidth: 0,
  },
  cartLineTotal: {
    flexDirection: "row",
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    marginTop: 0,
    marginBottom: 10,
    height: 20,
    //backgroundColor:'lightgreen',
    //marginLeft:10,
  },
  lineLeft: {
    fontSize: 15,
    width: 160,
    lineHeight: 20,
    color: "#333333",
    marginLeft: 10,
  },
  lineRight: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 20,
    color: "#333333",
    textAlign: "right",
    marginRight: 10,
  },
});
