import React, {Component} from 'react'
import {Input, Icon} from 'semantic-ui-react'
import style from './AddTodoItemStyle'

class AddTodoItem extends Component {
    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onFocusLost = this.onFocusLost.bind(this)
        this.onAddIconClick = this.onAddIconClick.bind(this)
        this.state = {
            inputTodoValue: '',
            isAddActivated: false,
        }
    }

    componentDidMount() {
        this.inputTodo = document.querySelector('#inputTodo')
    }

    onChange(e, {value}) {
        this.setState({inputTodoValue:value})
    }

    onKeyPress(e) {
        if(e.key === 'Enter') {
            this.props.addTodo(this.state.inputTodoValue)
            this.setState({
                inputTodoValue: '',
            })
        }
    }

    onKeyDown(e) {
        if(e.keyCode === 27) {
            this.setState({
                inputTodoValue: '',
                isAddActivated: false
            })
        }
    }

    onFocusLost() {
        setTimeout(()=> {
            this.setState({
                inputTodoValue: '',
                isAddActivated: false
            })
        }, 100)
    }

    onClick(e) {
        e.preventDefault()
        this.props.addTodo(this.state.inputTodoValue)
        this.setState({
            inputTodoValue: '',
            isAddActivated: false
        })
    }

    onAddIconClick() {
        this.setState({
            isAddActivated: true
        })
    }

    render() {
        const iconComponent = (visibility) => {
            if (visibility) {
                return (
                    <div style={style.iconContainer}>
                        <Icon 
                            link
                            onClick={this.onAddIconClick}
                            name='plus'/>
                    </div>
                )
            }
        }
        const inputComponent = (visibility) => {
            if (visibility) {
                return (
                    <Input 
                        action={{content:'add', onClick:this.onClick}} 
                        value={this.state.inputTodoValue}
                        onChange={this.onChange}
                        onKeyPress={this.onKeyPress}
                        onKeyDown={this.onKeyDown}
                        onBlur={this.onFocusLost}
                        autoFocus
                        size='mini'/>
                )
            }
        }
        return (
            <div style={{textAlign:this.state.isAddActivated?'center':'left', ...style.container}}>
                {inputComponent(this.state.isAddActivated)}
                {iconComponent(!this.state.isAddActivated)}
            </div>
            
        )
    }
}

export default AddTodoItem