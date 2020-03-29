import React from 'react'
import { TouchableOpacity, View, Modal, ToastAndroid, ScrollView } from 'react-native';
import { Button, Icon, Text } from 'react-native-ui-kitten';
import firebase from 'firebase';

export default class Received extends React.Component {

    state = {
        orders : {},
        myOrders: {},
        toggle: {},
        ordDel: {},
        delOid: 0,
        chooseReason: false
    }

    componentDidMount() {
        firebase.database().ref('/orders')
        .on('value', o => {
            firebase.database().ref('restaurants/'+firebase.auth().currentUser.uid+'/myOrders')
            .on('value', mo => {
                if(o && mo)
                    this.setState({ orders: o.val(), myOrders: mo.val() }, () => {
                        let oids = Object.keys(this.state.myOrders)
                        let temp1 = {}
                        let temp2 = {}
                        for(let i=oids.length-1; i>=Object.keys(this.state.toggle).length; i--) {
                            temp1[oids[i]] = false
                            temp2[oids[i]] = "#fdfdfd"
                        }
                        this.setState({ toggle: temp1, ordDel: temp2 })
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

    ordDel(oid) {
        let temp = this.state.ordDel
        if(temp[oid] == "#fdfdfd")
            this.setState({ chooseReason: true, delOid: oid })
        else {
            temp[oid] = "#fdfdfd"
            this.setState({ ordDel: temp })
        }
    }

    next(oid) {
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
                <View style={{width:'85%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 5, padding: 12, backgroundColor: this.state.ordDel[oid] }} >
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

            <View style={{ marginLeft: '3%', marginRight: '1%', width: '5%', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.ordDel(oid)}>
                <Icon name={this.state.ordDel[oid]=="#fdfdfd"?'close-outline':'undo-outline'} width={33} height={33} tintColor='#cc1030' />
                </TouchableOpacity>
            </View>

            <View style={{width:'84%', height:'100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                <TouchableOpacity style={{width:'95%', borderRadius:20, elevation: 5, padding: 12, backgroundColor: this.state.ordDel[oid] }}
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

    onDel(opt) {
        // Request to admin with reason : opt
        let temp = this.state.ordDel
        temp[this.state.delOid] = '#ffcdc5'
        this.setState({ ordDel: temp, chooseReason: false })
    }

    renderOptions()
    {
        let renderArray = []
        let opts = [
            "Test1",
            "Test2"
        ];

        for(let i=0; i<opts.length; i++)
                renderArray.push(
                    <TouchableOpacity
                        style={{ borderWidth: 1, borderColor: '#ffcdc5', borderRadius: 25, margin: 5 }}
                        onPress={this.onDel.bind(this,opts[i])}
                    >
                        <Text style={{ padding: 7, color: '#555'}}>{opts[i]}</Text>
                    </TouchableOpacity>
                )

        return renderArray
    }

    renderItems()
    {
        let renderArray = [];
        let oids = []
        if(this.state.myOrders)
            oids = Object.keys(this.state.myOrders)
        for(let i=0; i<oids.length; i++)

        if(this.state.orders 
            && this.state.orders!==null 
            && this.state.orders[oids[i]]
            && this.state.orders[oids[i]]!==null
            && this.state.orders[oids[i]].status == 0)
                renderArray.push(this.orderCard(oids[i], this.state.orders[oids[i]]))
        return renderArray
    }

    render()
    {
        return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.chooseReason}
                onRequestClose={() => this.setState({ chooseReason: false })}
            >
                <View style={{
                    height: '40%',width: '80%', backgroundColor: '#fdfdfd', marginTop: '50%',
                    alignSelf: 'center', borderRadius: 10, elevation: 10
                    }}>
                    <TouchableOpacity onPress={() => this.setState({ chooseReason: false })}>
                        <Text style={{ textAlign: 'right', margin: 3, marginRight: 7, fontSize: 20, color: '#999'}}>x</Text>
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', margin: 4, color: '#f58e84'}}>Reason for Rejecting order ...</Text>
                    <View style={{ height: '100%', width: '100%'}}>
                        <ScrollView>
                            {this.renderOptions()}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <View style={{ height: '100%', width: '100%', paddingTop: '2%'}}>
                <ScrollView>
                    {this.renderItems()}
                </ScrollView>
            </View>
        </View>
        );
    }
}