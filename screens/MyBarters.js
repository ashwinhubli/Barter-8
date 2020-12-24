import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js';

export default class MyBarterScreen extends Component{
    constructor(){
     super();
     this.state={
         donorId : firebase.auth().currentUser.email,
         donorName: "",
         allBarters : []
     }
      this.exchangeRef = null
    }

    static navigationOptions = {header: null};


    getDonorDetails=(donorId)=>{
      db.collection("users").where("email_id","==",donorId).get()
      .then((snapshot)=>{
         snapshot.forEach((doc)=>{
           this.setState({
             "donorName": doc.data().first_name + " " + doc.data().last_name
           })
         })
      })
    }

    getAllBarters=()=>{
        this.exchangeRef = db.collection("my_barters").where("donor_id","==",this.state.donorId)
        .onSnapshot((snapshot)=>{
          var allBarters = snapshot.docs.map(document => document.data());
          this.setState({
              allBarters : allBarters
          })
        })
    }
    
    sendItem=(itemDetails)=>{
      if(itemDetails.request_status === "Item Sent"){
        var requestStatus = "Donor Interested"
        db.collection("my_barters").doc(itemDetails.doc_id).update({
          "request_status" : "Donor Interested"
        })
       this.sendNotification(itemDetails,requestStatus)
      }
      else{
        var requestStatus = "Item Sent"
        db.collection("my_barters").doc(itemDetails.doc_id).update({
          "request_status" : "Item Sent"
        })
        this.sendNotification(itemDetails,requestStatus)
      }
    }
    sendNotification=(itemDetails,requestStatus)=>{
      var exchangeId = itemDetails.exchange_id
      var donorId    = itemDetails.donor_id
      db.collection("all_notifications")
      .where("exchange_id","==",exchangeId)
      .where("donor_id","==",donorId)
      .get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          var message = ""
          if(requestStatus === "Item Sent"){
             message = this.state.donorName + "Sent You An Item"
          }
          else{
             message = this.state.donorName + "Has Shown Interest In Exchanging An Item!"
           }
          db.collection("all_notifications").doc(doc.id).update({
            "message" : message,
            "notification_status" : "unread",
            "date"    : firebase.firestore.FieldValue.serverTimestamp() 
          })
        });
      })
    }


    keyExtractor = (item,index) => index.toString()

    renderItem=({item,i})=>{
        <ListItem
          key={i}
          title={item.item_name}
          titleStyle={{color: 'black',fontWeight: 'bold'}}
          subtitle={"Requested By :" + item.requested_by + "\nStatus : " + item.request_status} 
          rightElement={
              <TouchableOpacity 
              style={[
                styles.button,
                {
                  backgroundColor : item.request_status === "Item Sent" ? "green" : "#ff5722"
                }
              ]}
              onPress={()=>{
                this.sendItem(item)
              }}
                >
                  <Text style={{color:'#ffff'}}>{
                    item.request_status === "Item Sent" ? "Item Sent" : "Send Item"  
                  }</Text>
              </TouchableOpacity>
          }
          leftElement={<Icon name="item" type="font-awesome" color="#696969"/>}
          bottomDivider       
        />
    }

     componentDidMount(){
         this.getAllBarters()
     }
     componentWillUnmount(){
         this.exchangeRef();
     }


     render(){
         return(
             <View style={{flex: 1}}>
              <MyHeader navigation={this.props.navigation} title="My Barters"/>
              <View>
                {this.state.allBarters.length === 0
                ?(
                    <View style={styles.subtitle}>
                     <Text>List Of All Barters</Text>
                    </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allBarters}
                    renderItem={this.renderItem}
                  />
                 )
                }  
              </View>
             </View>
         )
     }
     }

const styles = StyleSheet.create({
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16
    },
    subtitle :{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    }
  })