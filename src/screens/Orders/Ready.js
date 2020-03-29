import React from 'react'
import { TouchableOpacity, View, ScrollView } from 'react-native';
import { Button, Icon, Text } from 'react-native-ui-kitten';
import firebase from 'firebase';

export default class Received extends React.Component {

    state = {
        orders : {},
        myOrders: {},
        toggle: {}
    }

    componentDidMount() {
        firebase.database().ref('/orders')
        .on('value', o => {
            firebase.database().ref('restaurants/'+firebase.auth().currentUser.uid+'/myOrders')
            .on('value', mo => {
                if(o && mo)
                    this.setState({ orders: o.val(), myOrders: mo.val() }, () => {
                        let oids = Object.keys(this.state.myOrders)
                        let temp = {}
                        for(let i=oids.length-1; i>=Object.keys(this.state.toggle).length; i--)
                            temp[oids[i]] = false
                        this.setState({ toggle: temp })
                    })
            });
        });
    }

    toggle(oid) {
        let temp = this.state.toggle
        if(temp[oid])
            temp[oid] = false
        else
            temp[oid] = true
        this.setState({ toggle: temp })
    }

    next(oid) {
        firebase.database().ref('orders/'+oid).update({ status: 3 })
    }

    back(oid) {
        firebase.database().ref('orders/'+oid).update({ status: 1 })
    }

    formTime(time) {
        if(time == '')
          return '-:-'
        let at = new Date(time)
        return at.getHours()+":"+at.getMinutes()
    }

    formDate(date) {
        if(date == '')
          return '-/-/-'
        let at = new Date(date)
        return at.getDate()+"/"+at.getMonth()+"/"+at.getFullYear()
    }

    foodItems(order) {
        let foodItems = []
        let names = Object.keys(order.items)
        for(let i=0; i < names.length; i++) {
            foodItems.push(
                <View style={{ flexDirection: 'row'}}>
                    <Text style={{ fontSize: 12 }}>{order.items[names[i]].title}</Text>
                    <Text style={{ alignSelf: 'center', position: 'absolute', fontSize: 12, right: 10 }}>x{order.items[names[i]].quantity}</Text>
                </View>
            )
        }
        return foodItems
    }

    showInfo(oid, order) {
        if(this.state.toggle[oid]) {
            return (
                <View style={{width:'85%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 5, padding: 12, backgroundColor: '#fdfdfd' }} >
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={{ fontFamily: 'serif', fontWeight: 'bold', fontSize: 12 }}>Item</Text>
                        <Text style={{ fontWeight: 'bold', alignSelf: 'center', position: 'absolute', fontSize: 12, right: 10, fontFamily: 'serif'}}>Qty</Text>
                    </View>
                    {this.foodItems(order)}
                    <View style={{ flexDirection: 'row'}}>
                    <Text style={{ fontFamily: 'serif', fontWeight: 'bold', fontSize: 12 }}>{'\n'}Total: </Text>
                        <Text style={{ fontSize: 12 }}>{'\n'}{order.totalPrice}/-</Text>
                    </View>
                </View>
            )
        }
    }

    orderCard(oid, order) {
        return (
        <View style={{ width:'100%', flexDirection:'row', marginTop: '2%', marginBottom: '2%' }} >

            <View style={{width:'90%', height:'100%', justifyContent: 'flex-start', alignItems: 'center', marginLeft: '2%' }}>
                <TouchableOpacity style={{width:'95%', borderRadius:20, elevation: 5, padding: 12, backgroundColor: '#fdfdfd' }}
                    onPress={this.toggle.bind(this, oid)}
                >
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={{ alignSelf: 'center', position: 'absolute', fontSize: 11, right: 5}}>{this.formDate(parseFloat(oid.split("_")[1]))}</Text>
                    </View>
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={{ fontSize: 12, fontFamily: 'serif', fontWeight: 'bold' }}>{order.email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row'}}>
                        <Text style={{ fontSize: 12 }}>Id#: {oid.split("_")[1]}</Text>
                        <Text style={{ alignSelf: 'center', position: 'absolute', fontSize: 12, right: 10}}>Arrival: {this.formTime(parseFloat(oid.split("_")[1]))}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 12 }}>Phone: {order.phone}</Text>
                        <Text style={{ alignSelf: 'center', position: 'absolute', fontSize: 12, right: 10}}>Ordered: {this.formTime(order.ordTime)}</Text>
                    </View>
                </TouchableOpacity>
                {this.showInfo(oid, order)}
            </View>

            <View style={{ width: '5%', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={this.next.bind(this, oid)}>
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
            if(this.state.orders[oids[i]].status == 2)
                renderArray.push(this.orderCard(oids[i], this.state.orders[oids[i]]))
        return renderArray
    }

    render()
    {
        return (
        <View style={{ height: '100%', width: '100%', paddingTop: '2%'}}>
            <ScrollView>
                {this.renderItems()}
            </ScrollView>
        </View>
        );
    }
}