import React, {Component} from 'react'
import TodoItem from './TodoItem'
import AddTodoItem from './AddTodoItem'
import Moment from 'moment'
import { Droppable } from 'react-beautiful-dnd'
import { Accordion } from 'semantic-ui-react';
import style from './PlanListStyle'


class PlanList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accordionOpened: true
        }
    }

    handleClick = () => {
        this.setState({
            accordionOpened: !this.state.accordionOpened
        })
    }

    render() {
        const addTodo = (text) => {
            const selectedDay = (this.props.selectedDay == null) ? 
                Moment(new Date()).format("YYYY-MM-DD") : 
                this.props.selectedDay
            this.props.addTodo(selectedDay, this.props.planType, text)
        }
        const deleteTodo = (planId) => {
            this.props.deleteTodo(this.props.selectedDay, this.props.planType, planId)
        }
        const onSomethingChange = (planId, text, checked) => {
            this.props.onSomethingChange(this.props.selectedDay, this.props.planType, planId, text, checked)
        }
        const onDuplicate = (text, checked, order) => {
            const selectedDay = (this.props.selectedDay == null) ?
                Moment(new Date()).format("YYYY-MM-DD") :
                this.props.selectedDay
            this.props.handleDuplicate(selectedDay, this.props.planType, text, checked, order)
        }
        const todoItems = this.props.plans.map((value, index) => 
                <TodoItem 
                    key={value.id}
                    planId={value.id}
                    text={value.content} 
                    checked={value.is_finished}
                    deleteTodo={deleteTodo}
                    onSomethingChange={onSomethingChange}
                    onDuplicate={onDuplicate}
                    index={index}
                    />
        )

        const visibility = (!!this.props.selectedDay) || (this.props.planType !== 'daily') ? 'visible' : 'hidden'

        return (
            <div style={{...style.container, visibility: visibility}}>
                <Accordion>
                    <Accordion.Title content={this.props.planType} active={this.state.accordionOpened} onClick={this.handleClick}/>
                    <Accordion.Content active={this.state.accordionOpened}>
                        <Droppable droppableId={this.props.planType}>
                            {
                                (provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}>
                                        {todoItems}
                                        {provided.placeholder}
                                    </div>
                
                                )
                            }
                            
                            
                        </Droppable>

                    </Accordion.Content>
                </Accordion>
                <AddTodoItem addTodo={addTodo}/>
            </div>
            // <ul style={{visibility: visibility}}>
            //     {todoItems}
            //     <AddTodoItem addTodo={addTodo}/>
            // </ul>
        )
    }
}

export default PlanList