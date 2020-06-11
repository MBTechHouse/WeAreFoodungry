import React from 'react'
import OrderTemplate from '../../components/OrderTemplate'

export default class Received extends React.Component {

    render()
    {
        return (
            <OrderTemplate
                navigation={this.props.navigation}
                showStatus={[3,4]}
                reverse={true}
            />
        )
    }
}