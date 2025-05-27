import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { HeaderComponent } from "../component/headercomponent";
import { Dimensions } from "react-native";
import { Badge } from "react-native-paper";
import { Button } from "react-native-paper";
import MejaScreen from "./MejaScreen";

export default class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mid: "",
      isloading: true,
      menu: [],
      order: [],
      colorId: 0,
      clrId: -1,
      itemcart: [],
      submitorder: false,
      orderid: "",
    };
  }
  currencyFormat(num) {
    num = "" + num;
    //alert(num);
    if (num !== "") {
      return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    } else {
      return "0";
    }
  }
  addItemToCart = (id, orderid) => {
    var m = this.state.menu[id];
    var founditem = this.state.itemcart.find((element) => {
      return element.kodebrng === m.kodebrng;
    });
    if (founditem != null) {
      founditem.qty++;
      //founditem.harga=founditem.qty*m.harga;
    } else {
      var nobj = {
        kodebrng: m.kodebrng,
        namabrng: m.namabrng,
        harga: m.harga,
        satuan: m.satuan,
        qty: 1,
        id: orderid,
      };
      this.state.itemcart.push(nobj);
    }
    this.setState({ clrId: id });
  };
  batal = () => {
    var item = this.state.itemcart[this.state.itemcart.length - 1];
    //alert(item.namabrng);
    if (item.qty > 1) {
      item.qty--;
      this.setState({ clrId: 0 });
    } else {
      //this.state.itemcart.pop();
      this.setState({ itemcart: this.state.itemcart.slice(0, -1) });
    }
  };

  hapus = (meja) => {
    Alert.alert("Batal Pesanan", "Batal Pesanan " + meja + "?", [
      {
        text: "Yes",
        onPress: () => {
          this.hapus2(meja);
        },
      },
      {
        text: "No",
        onPress: () => {},
      },
    ]);
  };
  hapus2 = (meja) => {
    fetch(global.remotehosting + "/hapus.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        meja: meja,
        orderid: global.orderid,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        global.reload = true;
        this.setState({ submitorder: true });
        this.props.navigation.navigate("Meja", { msg: "hello" });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  bayar = () => {
    fetch(global.remotehosting + "/bayar.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        meja: meja,
        orderid: global.orderid,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        global.reload = true;
        this.setState({ submitorder: true });
        this.props.navigation.navigate("Meja", { msg: "hello" });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  simpan2 = (meja, pko) => {
    console.log("simpan" + meja + "," + pko);
    fetch(global.remotehosting + "/buatorder.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        meja: meja,
        orderid: global.orderid,
        items: this.state.itemcart,
        printko: pko,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        global.reload = true;
        this.setState({ submitorder: true });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  simpan = (meja) => {
    Alert.alert("Kitchen Order", "Print Kitchen Order ?", [
      {
        text: "Yes",
        onPress: () => {
          this.simpan2(meja, true);
        },
      },
      {
        text: "No",
        onPress: () => {
          this.simpan2(meja, false);
        },
      },
    ]);
  };
  changeCat = (id) => {
    var temp = [];
    var cat = global.category[id];
    //alert(cat);
    //var temp=[];
    //alert('loadOrder:'+m);
    //this.setState({colorId: id});
    fetch(global.remotehosting + "/extractmenu.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        cat: cat,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.includes("|")) {
          var result = responseJson.split("|");
          var ctr = 0;
          while (ctr < result.length) {
            var obj = {
              kodebrng: result[ctr++],
              namabrng: result[ctr++],
              harga: result[ctr++],
              satuan: result[ctr++],
              desc: result[ctr++],
              //qty:1
            };
            temp.push(obj);
          }
          this.setState({ menu: temp });
          this.setState({ colorId: id });

          //global.menu=temp;
          //this.props.navigation.navigate('Menu',{order:temp,mid:m});
        } else {
          //this.props.navigation.navigate('Menu',{order:temp,mid:m,total:total});
          alert(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  componentDidMount() {
    //alert('componentDIdAmount');
    //this.forceUpdate();
    this.changeCat(0);
    //this.extractMenu();
  }
  render() {
    //alert('render-->'+this.state.order.length);
    const { route } = this.props;
    const { order } = route.params == null ? "" : route.params;
    const { mid } = route.params == null ? "" : route.params;
    //const{total}=route.params==null?'':route.params;
    //alert('alert:'+mid);
    var myLoop = [];
    var total = 0;

    if (!this.state.submitorder) {
      // if cart has not been submitted
      //render first from cart
      for (let i = this.state.itemcart.length - 1; i >= 0; i--) {
        var obj = this.state.itemcart[i];
        var subtotal = parseFloat(obj.harga) * obj.qty;
        total += parseFloat(obj.harga) * obj.qty; //subtotal;
        myLoop.push(
          <View style={[styles.cartLine, { backgroundColor: "yellow" }]}>
            <Text style={styles.lineLeft}>
              {obj.qty} x {obj.namabrng}
            </Text>
            <Text style={styles.lineRight}>
              {this.currencyFormat(subtotal)}
            </Text>
          </View>
        );
      }
    } else {
      //copy cartitem to order and empty it
      //alert('copy the cart to order and empty the cart');
      for (let i = 0; i < this.state.itemcart.length; i++) {
        var obj = this.state.itemcart[i];
        obj.harga = obj.qty * parseFloat(obj.harga);
        //alert(obj.namabrng+","+obj.qty+","+obj.harga);
        //order.push(obj);
        order.unshift(obj); //at the beginning
      }
      //while (this.state.itemcart.length) {
      //  this.state.itemcart.pop();
      //}
      this.state.itemcart = []; //empty the empty cart
      this.state.submitorder = false;
    }
    for (let i = 0; i < order.length; i++) {
      var obj = order[i];
      total += parseFloat(obj.harga);
      myLoop.push(
        <View style={styles.cartLine}>
          <Text style={styles.lineLeft}>
            {obj.qty} x {obj.namabrng}
          </Text>
          <Text style={styles.lineRight}>
            {this.currencyFormat("" + obj.harga)}
          </Text>
        </View>
      );
    }
    //var orderid=order.length>0?order[0].id:Date.now();
    var ctrlbutton = [];
    if (this.state.itemcart.length > 0) {
      ctrlbutton.push(
        <View
          style={{
            flexDirection: "row",
            marginTop: 0,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              this.batal();
            }}
          >
            <Button>BATAL</Button>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              this.simpan(mid);
            }}
          >
            <Button>SIMPAN</Button>
          </TouchableOpacity>
        </View>
      );
    } else {
      if (order.length > 0) {
        ctrlbutton.push(
          <View
            style={{
              flexDirection: "row",
              marginTop: 0,
              height: 40,
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.hapus(mid);
              }}
            >
              <Button>HAPUS</Button>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.props.navigation.navigate("Payment", {
                  mid: mid,
                  order: order,
                });
              }}
            >
              <Button>BAYAR</Button>
            </TouchableOpacity>
          </View>
        );
      }
    }

    //render menu, when categori is cliecked
    var menusize = this.state.menu.length;
    //alert(menusize);
    //console.log('mejasize:'+mejasize);
    var x = Math.round(menusize / 2);
    x = menusize % 2 !== 0 ? x + 1 : x;
    //alert(x);
    var mymenu = [];
    var top1 = 10;

    for (let i = 0; i < menusize; i++) {
      var o = this.state.menu[i];

      mymenu.push(
        <TouchableOpacity
          style={this.state.clrId === i ? styles.card : styles.card}
          onPress={() => {
            this.addItemToCart(i, orderid);
          }}
        >
          <View style={styles.infoContainer2}>
            <Image
              source={{
                uri:
                  global.remotehosting +
                  "/photos/" +
                  o.kodebrng +
                  ".png?val=" +
                  new Date(),
              }}
              style={{ width: 100, height: 100 }}
            />
            <View style={styles.infoContainer3}>
              <Text style={styles.textItem}>{o.namabrng}</Text>
              <Text style={styles.textItem1}>{o.desc}</Text>
              <Text style={styles.textItem2}>
                IDR.{this.currencyFormat(o.harga)}
              </Text>
            </View>
          </View>

          {/*<Badge style={styles.status} status='success'>{this.currencyFormat(o.harga)}</Badge>*/}
          {/*</View>*/}
        </TouchableOpacity>
      );
    }
    var mycat = [];

    for (let i = 0; i < global.category.length; i++) {
      mycat.push(
        <TouchableOpacity
          style={
            this.state.colorId === i ? styles.surfaceActive : styles.surface
          }
          onPress={() => {
            this.changeCat(i);
          }}
        >
          <Text style={{ fontSize: 12 }}>{global.category[i]}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        <HeaderComponent
          src="Meja"
          r={this.props.navigation}
          subtitle={mid}
          title={mid}
        />
        {/*<HeaderComponent src='Meja' r={this.props.navigation} title={mid}/>*/}
        <View style={styles.cartLineTotal}>
          <Text style={[styles.lineLeft, styles.lineTotal]}>TOTAL</Text>
          <Text style={styles.lineRight}>
            {this.currencyFormat("" + total)}
          </Text>
        </View>
        <ScrollView style={{ height: 130 }}>{myLoop}</ScrollView>

        {ctrlbutton}

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {mycat}
        </ScrollView>

        <ScrollView style={{ height: "60%", backgroundColor: "yellow" }}>
          {mymenu}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    height: 30,
  },

  cartLine: {
    flexDirection: "row",
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
  lineTotal: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  lineLeft: {
    fontSize: 15,
    width: 260,
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
  itemsList: {
    backgroundColor: "#eeeeee",
  },
  itemsListContainer: {
    backgroundColor: "#eeeeee",
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  surfaceActive: {
    marginTop: 10,
    marginLeft: 5,
    padding: 8,
    height: 60,
    width: 90,
    backgroundColor: "pink",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  surface: {
    marginTop: 10,
    marginLeft: 5,
    padding: 8,
    height: 60,
    width: 90,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "black",
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
  infoContainer2: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", //flex-start,flex-end,center,space-between,space-around,space-evenly
    alignItems: "stretch", // if you want to fill rows left to right
  },
  infoContainer3: {
    padding: 10,
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between", //flex-start,flex-end,center,space-between,space-around,space-evenly
    alignItems: "flex-start", // if you want to fill rows left to right,stretch,flex-start,flex-end,enter,baseline
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 0,
    textAlign: "center",
  },
  status: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  buttonStyle: {
    backgroundColor: "#6fdf32",
    borderRadius: 10,

    borderWidth: 1,
    borderColor: "#fff",
    width: 100,
    height: 40,
    //textAlign:"center",
  },
  image: {
    height: 300,
    width: "100%",
  },
  textItem: {
    width: "100%", // is 50% of container width
    //backgroundColor:"yellow",
    textAlign: "left",
  },
  textItem1: {
    width: "100%", // is 50% of container width
    textAlign: "left",
    fontSize: 12,
    ///backgroundColor:"green",
  },
  textItem2: {
    width: "100%", // is 50% of container width
    textAlign: "left",
    top: 0,
    fontSize: 18,
    color: "red",
    //backgroundColor:"yellow",
    //textAlign:"right",
    //backgroundColor:"green",
  },
});
