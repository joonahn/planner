import React, {Component} from 'react'
import { Icon, Menu, Button} from 'semantic-ui-react'
import {deauthenticate} from '../remote'

class TitleBar extends Component {
    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        deauthenticate().then(() => {
            this.props.logout()
        })
    }

    render() {
        return (
            <Menu>
                <Menu.Item position='right' >
                    <Icon link name='refresh' onClick={this.props.onRefresh}/>
                    <Button onClick={this.onClick} style={{ marginLeft: '0.5em' }}>logout</Button>
                </Menu.Item>
            </Menu>
        )
    }
}


export default TitleBar