import React from 'react'
import { TouchableOpacity, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-ui-kitten';
import firebase from 'firebase';

const base62 = {
    charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split(''),
    encode: integer => {
      if (integer === 0) {
        return 0;
      }
      let s = [];
      while (integer > 0) {
        s = [base62.charset[integer % 62], ...s];
        integer = Math.floor(integer / 62);
      }
      return s.join('');
    },
    decode: chars => chars.split('').reverse().reduce((prev, curr, i) =>
      prev + (base62.charset.indexOf(curr) * (62 ** i)), 0)
  };

export default class Received extends React.Component {

    state = {
        orders : {},
        myOrders: {}
    }

    componentDidMount() {
        firebase.database().ref('/orders')
        .on('value', o => {
            firebase.database().ref('restaurants/'+firebase.auth().currentUser.uid+'/myOrders')
            .on('value', mo => this.setState({ orders: o.val(), myOrders: mo.val() }));
        });
    }

    handlePress() {
        this.props.navigation.navigate('OrderItemList', {ordermode: this.props.navigation.getParam('ordermode'), restId: restId})
    }

    orderCard(order) {
        return (
        <View style={{ width:'100%', flexDirection:'row', height:'13%' }} >

            <View style={{ marginLeft: '3%', width: '5%', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity>
                <Icon name='arrow-ios-back' width={40} height={40} tintColor='#cc1030' />
                </TouchableOpacity>
            </View>

            <View style={{width:'85%', flexDirection:'row', height:'100%', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => this.handlePress()}
            >
                <TouchableOpacity style={{width:'95%', borderRadius:20, elevation: 5, padding: '3%', backgroundColor: '#fdfdfd' }} >
                    <View style={{ marginLeft: '7%', backgroundColor: 'transperent' }}>
                        <Text style={{fontWeight:'bold', fontSize:15, width:'100%', fontFamily: 'serif' }}>1</Text>
                        <Text style={{fontSize:10, color:'#757575', width:'100%', marginTop: '3%' }}>2</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ width: '5%', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity>
                <Icon name='arrow-ios-forward' width={40} height={40} tintColor='#7cb342' />
                </TouchableOpacity>
            </View>

        </View>
        )
    }

    renderItems()
    {
        let renderArray = [];
        let oids = []
        if(this.state.myOrders)
            oids = Object.keys(this.state.myOrders)
        for(let i=0; i<oids.length; i++)
            renderArray.push(this.orderCard(this.state.orders[i]))
        return renderArray
    }

    render()
    {
        return (
        <View style={{width:'100%', height:'100%'}}>
            {this.renderItems()}
        </View>
        );
    }
}