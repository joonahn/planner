import React, {Component} from 'react'
import {Form} from 'semantic-ui-react'
import {authenticate} from '../remote'
import {Redirect} from 'react-router-dom'

class Login extends Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.state = {
            id: '',
            pw: '',
        }
    }

    onChange(_, {name, value}) {
        this.setState({
            [name]: value
        })
    }

    onSubmit() {
        console.log(this.props)
        authenticate(this.state.id, this.state.pw).then((res) => {
            if (res.status === 200) {
                console.log('authentication succeeded')
                this.props.login()
            } 

        })
    }

    render() {
        let {from} = this.props.location.state || {from: {pathname:"/"}}
        if (this.props.isAuthenticated) return <Redirect to={from} />
        return (
            <Form onSubmit={this.onSubmit}>
                <Form.Input label='Id' name='id' onChange={this.onChange}/>
                <Form.Input label='Password' name='pw' type='password' onChange={this.onChange}/>
                <Form.Button content='Login' />
                {/* <pre>{JSON.stringify(this.state.id)}</pre>
                <pre>{JSON.stringify(this.state.pw)}</pre> */}
            </Form>
        )
    }
}

export default Login