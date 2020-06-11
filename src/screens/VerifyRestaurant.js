import 'react-native-get-random-values';
import React from 'react';
import { StyleSheet, ActivityIndicator, View,TouchableOpacity } from 'react-native';
import { Button, Layout, Text } from 'react-native-ui-kitten';
import firebase from 'firebase'
import { WebView } from 'react-native-webview';

export default class VerifyRestaurant extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Verify Restaurant",
        headerStyle: { backgroundColor: "#ffffff" },
    });

    state = { 
        verified:false 
    }

    componentDidMount() {
        let restaurantUID = firebase.auth().currentUser.uid
        firebase
        .database()
        .ref(`restaurants/${restaurantUID}/verified`)
        .on('value',(verified)=>{
            console.log("illi", verified.val())
            if(verified.val()==false){
                this.verfiyRestaurant(restaurantUID)
                this.setState({
                    verified: false
                })
            } else {
                this.props.navigation.navigate('Orders')
            }
        })
    }

    async verfiyRestaurant(restaurantUID) {
        firebase
        .database()
        .ref(`1FithETVAzs4Yb2iZtUPkEcqm2jXIjGnsBiVVgRPAcdc/restaurants/${restaurantUID}`)
        .on('value',(restaurant)=>{
            console.log(restaurant.val())
            if(restaurant.val() !== null) {
                firebase
                .database()
                .ref(`restaurants/${restaurantUID}/verified`)
                .set(true)
            }
        })
    }

    ActivityIndicatorLoadingView() {
    
        return (
     
          <ActivityIndicator
            color='#009688'
            size='large'
            style={styles.ActivityIndicatorStyle}
          />
        );
      }
     

    render() {
        if(!this.state.verified)
        return(
            <View style={{width:'100%', height:'100%'}}>
                <View 
                style={{width:"100%",height:'90%'}}>
                <WebView 
                source={{ uri: "https://docs.google.com/forms/d/e/1FAIpQLSc6QOLre32hkTvFbCRU19j6ZMuJzOOWyDaWwqExT3_SP5Sepw/viewform?usp=sf_link" }} 
                style={styles.WebViewStyle}  
                javaScriptEnabled={true}
                domStorageEnabled={true}
                renderLoading={this.ActivityIndicatorLoadingView} 
                startInLoadingState={true}  
                />
                
                </View>
                <View style={{width:'100%', height:'10%', alignItems:'center', justifyContent:'center'}} >
                    <TouchableOpacity style={{backgroundColor:'#ff6666', padding:'2%',paddingLeft:'5%',paddingRight:'5%', borderRadius:25}} onPress={()=>{
                        firebase.auth().signOut();
                        this.props.navigation.navigate('Login')
                    }}>
                        <Text style={{color:'#fff'}}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
        return <View style={{width:'100%', height:'100%'}}>
            <ActivityIndicator size="large" />
        </View>
    }
}

const styles = StyleSheet.create({
  container: { width:'100%',height:'100%', alignItems: 'center' },
  text: { marginVertical: 16 },
  WebViewStyle:
  {
     justifyContent: 'center',
     alignItems: 'center',
     flex:1,
     marginTop: (Platform.OS) === 'ios' ? 20 : 0
  },
   
  ActivityIndicatorStyle:{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    
  }
});

