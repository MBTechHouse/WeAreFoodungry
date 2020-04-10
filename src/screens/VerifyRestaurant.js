import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Layout, Text } from 'react-native-ui-kitten';
import firebase from 'firebase'

export default class VerifyRestaurant extends React.Component{

    state = { 
        verified:false 
    }

    componentDidMount() {
        let restaurantUID = firebase.auth().currentUser.uid
        console.log(restaurantUID)
        firebase
        .database()
        .ref(`restaurants/${restaurantUID}`)
        .on('value',(verified)=>{
            console.log("illi", verified.val())
            // if(verified.val()==false){
            //     this.verfiyRestaurant(restaurantUID)
            //     this.setState({
            //         verified: false
            //     })
            // } else {
            //     this.props.navigation.navigate('Orders')
            // }
        })
    }

    async verfiyRestaurant(restaurantUID) {
        firebase
        .database()
        .ref(`1FithETVAzs4Yb2iZtUPkEcqm2jXIjGnsBiVVgRPAc/restaurants/ygbkshdbaw`)
        .on('value',(restaurant)=>{
            console.log(restaurant)
        })
    }


  render()
  {
  return(
  <Layout style={styles.container}>
    <Text>dawda</Text>
  </Layout>
  )
  }
}

const styles = StyleSheet.create({
  container: { width:'100%',height:'100%', alignItems: 'center' },
  text: { marginVertical: 16 },
});
