import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {Card,Header,Icon} from 'react-native-elements'
import firebase from 'firebase';
import db from '../config';

export default class UserDetailsScreen extends Component{
    constructor(props){
        super(props);
        this.state={
          userId: firebase.auth().currentUser.email,
          userName: "",
          recieverId : this.props.navigation.getParam('details')["user_id"],
          exchangeId  : this.props.navigation.getParam('details')["request_id"],
          itemName   : this.props.navigation.getParam('details')["item_name"],
          reason_for_requesting : this.props.navigation.getParam('details')["reason_to_request"],
          exchangerName : '',
          exchangerContact: '',
          exchangerAddress : '',
          exchangerRequestDocId : ''
        }
    }
    getReceiverDetails(){
        db.collection('users').where('email_id','==',this.state.recieverId).get()
        .then(snapshot=>{
            snapshot.forEach(doc =>{
                this.setState({
                  exchangerName : doc.data().first_name,
                  receiverContact : doc.data().contact,
                  exchangerAddress: doc.data().exchangerAddress
                })
            })
        });

         db.collection('requested_items').where('request_id','==',this.state.exchangeId).get()
         .then(snapshot=>{
            snapshot.forEach(doc =>{
                this.setState({
                    exchangerRequestDocId: doc.id
                })
            })
         })
        }

        getUserDetails=(userId)=>{
          db.collection("users").where('email_id','==', userId).get()
          .then((snapshot)=>{
            snapshot.forEach((doc) => {
              this.setState({
                userName  :doc.data().first_name + " " + doc.data().last_name
              })
            })
          })
        }
        

        addBarters=()=>{
          db.collection('my_barters').add({
            item_name : this.state.itemName,
            exchangeId : this.state.exchangeId,
            requested_by : this.state.exchangerName,
            donorId : this.state.userId,
            request_status: "Donor Interested"
          })
        }
        addNotification=()=>{
          var message = this.state.userName + "Has shown interest in exchanging the item!"
          db.collection("all_notifications").add({
            "targeted_user_id"    : this.state.recieverId,
            "donor_id"            : this.state.userId,
            "exchangeId"          : this.state.exchangeId,
            "item_name"           : this.state.itemName,
            "date"                : firebase.firestore.FieldValue.serverTimestamp(),
            "notification_status" : "Unread",
            "message"             : message                   
          })
        }
        componentDidMount(){
            this.getReceiverDetails()
            this.getUserDetails(this.state.userId)
        }

    render(){
        return(
            <View style={styles.container}>
              <View style={{flex: 0.1}}>
             <Header 
                leftComponent={<Icon name='arrow-left' type='feather' color='#696969' onPress={()=>this.props.navigation.goBack()}/>}
                centerComponent={{text: "Exchange Items",style={ color: '#90A5A9',fontSize: 20,fontWeight:'bold'}}}
                backgroundColor="#eaf8fe"
               />
               </View>
               <View   style={{flex: 0.3}}>
                <Card
                  title={"Item Information"}
                  titleStyle={{fontSize: 20}}
                >
                 <Card>
                  <Text style={{fontWeight: 'bold'}}>Name : {this.state.itemName}</Text>
                 </Card>   

                 <Card>
                  <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
                 </Card>
                </Card>
              </View>
              <View style={{flex: 0.3}}>
                <Card
                  title={"Exchanger Information"}
                  titleStyle={{fontSize: 20}} 
                >
                   <Card>
                  <Text style={{fontWeight: 'bold'}}>Name : {this.state.exchangerName}</Text>
                 </Card>   
                 <Card>
                  <Text style={{fontWeight: 'bold'}}>Contact :{this.state.exchangerContact}</Text>   
                 </Card>
                 <Card>
                  <Text style={{fontWeight: 'bold'}}>Address :{this.state.exchangerAddress}</Text>   
                 </Card>
                </Card>  
              </View>
     <View style={styles.buttonContainer}>
          {this.state.recieverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.addBarters()
                    this.addNotification()
                    this.props.navigation.navigate('MyBarters')

                  }}>
                <Text>I want to Exchange</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    buttonContainer : {
      flex:0.3,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:200,
      height:50,
      justifyContent:'center',
      alignItems : 'center',
      borderRadius: 10,
      backgroundColor: 'orange',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16
    }
  })
