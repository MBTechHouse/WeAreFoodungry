import React from 'react'
import { Button, Layout, Icon, Text } from 'react-native-ui-kitten';
import firebase from 'firebase';

export default class Received extends React.Component {

    state = {
        orders : {}
    }

    componentDidMount() {
        firebase.database().ref('restaurants/'+firebase.auth().currentUser.uid+'/myOrders')
        .on('value', snapshot => this.setState({ orders: snapshot.val() }));
    }
    render()
    {
        return(
            <Layout><Text>Hey</Text></Layout>
        )
    }
}