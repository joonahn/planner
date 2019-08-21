import React, {Component} from 'react'
import PlanList from './PlanList'
import {DragDropContext} from 'react-beautiful-dnd'

class PlanListGroup extends Component {

    render() {
        const onDragEnd = (result) => {
            const {destination, source} = result;
            if (!destination) {
                return
            }

            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) {
                return
            }

            const src = {
                planType: source.droppableId,
                index: source.index
            }
            const dst = {
                planType: destination.droppableId,
                index: destination.index
            }

            this.props.handleReorder(src, dst)
        }
        return (
            <DragDropContext
                onDragEnd = {onDragEnd}>
                <PlanList
                    planType = 'weekly'
                    selectedDay={this.props.selectedDay}
                    plans={this.props.weeklyPlans}
                    addTodo={this.props.addTodo}
                    deleteTodo={this.props.deleteTodo}
                    handleReorder={this.props.handleReorder}
                    handleDuplicate={this.props.handleDuplicate}
                    onSomethingChange={this.props.onSomethingChange}/>
                <PlanList
                    planType = 'daily'
                    selectedDay={this.props.selectedDay}
                    plans={this.props.selectedDayPlans}
                    addTodo={this.props.addTodo}
                    deleteTodo={this.props.deleteTodo}
                    handleReorder={this.props.handleReorder}
                    handleDuplicate={this.props.handleDuplicate}
                    onSomethingChange={this.props.onSomethingChange}/>
            </DragDropContext>
            // <ul style={{visibility: visibility}}>
            //     {todoItems}
            //     <AddTodoItem addTodo={addTodo}/>
            // </ul>
        )
    }
}

export default PlanListGroup