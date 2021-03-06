import React, {Component} from 'react'
import {Checkbox, Icon, Grid, Form, Input, Ref} from 'semantic-ui-react'
import {Draggable} from 'react-beautiful-dnd'
import style from './TodoItemStyle'

class TodoItem extends Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onOkClick = this.onOkClick.bind(this)
        this.onEditIconClick = this.onEditIconClick.bind(this)
        this.CheckboxOrEditbox = this.CheckboxOrEditbox.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.state = {
            isEditActivated: false,
            inputTodoValue: '',
        }
    }

    toggle() {
        this.props.onSomethingChange(this.props.planId, this.props.text, Number(!this.props.checked))
    }

   
    onChange(e, {value}) {
        this.setState({inputTodoValue:value})
    } 

    onEditIconClick() {
        this.setState({
            isEditActivated: !this.state.isEditActivated,
            inputTodoValue: this.props.text,
        })
    }

    onOkClick(e) {
        e.preventDefault()
        this.props.onSomethingChange(this.props.planId, this.state.inputTodoValue, Number(this.props.checked))
        this.setState({
            isEditActivated: false
        })
    }

    onKeyPress(e) {
        if(e.key === 'Enter') {
            this.props.onSomethingChange(this.props.planId, this.state.inputTodoValue, Number(this.props.checked))
            this.setState({
                isEditActivated: false
            })
        }
    }

    onKeyDown(e) {
        if(e.keyCode === 27) {
            this.setState({
                isEditActivated: false
            })
        }
    }

    CheckboxOrEditbox(props) {
        const isEditActivated = props.isEditActivated
        if (isEditActivated) {
            return (
                <Form>
                    <Form.Group style={{marginBottom:0, display: 'flex', alignItems:'center' }} >
                        <Form.Field >
                            <Checkbox 
                                onChange = {
                                    () => this.props.onSomethingChange(
                                        this.props.planId,
                                        this.props.text,
                                        Number(!this.props.checked))
                                }
                                checked={Number(this.props.checked) === 1}/>
                        </Form.Field>
                        <Form.Field style={{flexGrow: '1'}}>
                            <Input
                                fluid
                                value={this.state.inputTodoValue}
                                onChange={this.onChange}
                                onKeyPress={this.onKeyPress}
                                onKeyDown={this.onKeyDown}                                
                                placeholder='Input TODO...'
                                icon={<Icon circular inverted link name='check' onClick={this.onOkClick}/>}
                                />
                        </Form.Field>
                    </Form.Group>                    
                </Form>
                )
            } else {
                return (
                <Checkbox 
                    label={this.props.text}
                    onChange = {
                        () => this.props.onSomethingChange(this.props.planId, this.props.text, Number(!this.props.checked))
                    }
                    checked={Number(this.props.checked) === 1}/>
            )
        }
    }
    render() {
        const isDuplicableOnDailyPlan = ((!!this.props.selectedDay) && (this.props.planType !== 'daily'))
        const duplcateOnDailyPlanVisibility = isDuplicableOnDailyPlan ? {} : {display:'none'}
        const isPutOffable = ((this.props.planType === 'daily'))
        const putOffableVisibility = isPutOffable ? {} : {display:'none'}
        
        return (
            <Draggable 
                key={this.props.planId}
                index={this.props.index}
                draggableId={this.props.planId}
                isDragDisabled={this.props.planId<0}>
                {
                    (provided) => (
                        <Ref innerRef={provided.innerRef} >
                            <Grid celled {...provided.draggableProps} {...provided.dragHandleProps} style={style.todoItem(provided.draggableProps.style)} verticalAlign="middle" >
                                <Grid.Row>
                                    <Grid.Column width={12} textAlign='justified' style={style.column}>
                                        <this.CheckboxOrEditbox isEditActivated={this.state.isEditActivated}/>
                                    </Grid.Column>
                                    <Grid.Column width={4} textAlign='center' style={style.column}>
                                        <Icon link onClick={() => this.props.deleteTodo(this.props.planId)} name='close' />
                                        <Icon link fitted={!(isDuplicableOnDailyPlan || isPutOffable)} onClick={this.onEditIconClick} name='pencil' />
                                        <Icon link 
                                            fitted={isDuplicableOnDailyPlan} 
                                            onClick={() => this.props.onDuplicateOnDailyPlan(this.props.text, this.props.checked)} 
                                            name='calendar plus' 
                                            style={duplcateOnDailyPlanVisibility}/>
                                        <Icon link 
                                            fitted={isPutOffable} 
                                            onClick={() => this.props.onPutOff(this.props.planId)} 
                                            name='hourglass half' 
                                            style={putOffableVisibility}/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Ref>
                    )
                }

            </Draggable>
        )
    }
}


export default TodoItem