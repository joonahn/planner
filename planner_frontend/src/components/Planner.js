import React, { Component } from 'react';
import DayPicker from './DayPicker';
import PlanListGroup from './PlanListGroup';
import Moment from 'moment'
import {searchPlannerDataByDate, deleteTodoItem, changeOrders} from '../remote'
import {searchPlannerDataByRange} from '../remote'
import {changeOrder} from '../remote'
import {addTodoItem} from '../remote'
import {changeTodoItem} from '../remote'
import {changePlanType} from '../remote'
import 'semantic-ui-css/semantic.min.css'
import TitleBar from './TitleBar';

const getObjectNameByPlanType = (planType) => {
    return planType === 'daily' ?
        'selectedDayPlans' : planType === 'weekly' ?
        'weeklyPlans' : null
}

const setOrderByItsIndex = (plans) => {
    return plans.map((value, index) => {
        value.order = index;
        return value
    })
}

class Planner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weekDays: [],
            selectedDay: null,
            selectedDayPlans: [],
            weeklyPlans: [],
            delayedOperations:[],
            tempIdList:[],
        }
    }

    async reloadWeeklyPlans() {
        if (this.state.weekDays.length >= 2) {
            const {0: first, length: l, [l-1] : last} = this.state.weekDays
            const res = await searchPlannerDataByRange(first, last, 'weekly')
            if (!res) {
                this.props.logout()
            } 
            this.setState({
                weeklyPlans: res
            });
        }
    }

    async reloadSelectedPlans(dateStr) {
        const res = await searchPlannerDataByDate(dateStr, 'daily')
        if (!res) {
            this.props.logout()
        }
        this.setState({
            selectedDayPlans: res
        });
    }

    async syncCurrentOrder(planType) {
        console.log("syncCurrentOrder!")
        console.log(planType)
        const targetArray = this.state[getObjectNameByPlanType(planType)]
        return changeOrders(
            targetArray.map((value, index) => 
                ({
                    id: value.id,
                    order: index
                }))
        )
    }

    generateTempId() {
        let newId = -1;
        while (this.state.tempIdList.includes(newId)) {
            newId -= 1
        }
        this.setState({
            tempIdList: [
                ...this.state.tempIdList,
                newId
            ]
        })
        return newId
    }

    addDelayedOperation(operation) {
        this.setState({
            delayedOperations: [
                ...this.state.delayedOperations,
                operation,
            ]
        })
    }

    runOperations(operation) {
        switch(operation.method) {
            case 'changeOrder':
                return changeOrder(operation.planId, operation.order)
            case 'delete':
                return deleteTodoItem(operation.planId)
            case 'change':
                return changeTodoItem(operation.planId, operation.text, operation.checked)
            case 'changeType':
                return changePlanType(operation.planId, operation.planType, operation.planDate)
            default:
                return new Promise((resolve)=>resolve())
        }
    }

    replaceTempId(tempId, realId) {
        let trigger = null
        let prevPromise = new Promise(resolve => trigger = resolve)
        this.setState({
            selectedDayPlans: this.state.selectedDayPlans.map((value) => {
                if (value.id === tempId) {
                    return {
                        ...value,
                        id: realId,
                    }
                }
                return value
            }),
            weeklyPlans: this.state.weeklyPlans.map((value) => {
                if (value.id === tempId) {
                    return {
                        ...value,
                        id: realId,
                    }
                }
                return value
            }),
            delayedOperations: this.state.delayedOperations.filter((value) => {
                if (value.planId === tempId) {
                    prevPromise = prevPromise.then(() => {
                        return this.runOperations({
                            ...value,
                            planId: realId,
                        })
                    })
                    return false
                }
                return true
            }),
            tempIdList: this.state.tempIdList.filter(value => value!==tempId)
        }, () => {
            trigger()
        })
    }

    handleSelectDate(dateStr) {
        this.setState({selectedDay:dateStr})
        this.reloadSelectedPlans(dateStr)
    }

    handleAddTodo(dateStr, planType, text) {
        const newOrder = this.state[getObjectNameByPlanType(planType)].length
        const newItem = {
            id: this.generateTempId(),
            plan_date: dateStr,
            order: newOrder,
            is_finished: false,
            content: text,
            plan_type: planType,
        }
        const nextState = {}
        const newPlans = [...this.state[getObjectNameByPlanType(planType)], newItem]
        nextState[getObjectNameByPlanType(planType)] = newPlans
        this.setState(nextState, () => {
            addTodoItem(dateStr, planType, text, newOrder).then((res) => {
                this.replaceTempId(newItem.id, res.id)
            })
        })
    }

    handleDuplicate(dateStr, planType, text, checked, order) {
        console.log("handleDuplicate")
        console.log("order: " + order)
        // Add Item to plans
        const newItem = {
            id: this.generateTempId(),
            plan_date : dateStr,
            order: order,
            is_finished: checked===1,
            content: text,
            plan_type: planType,
        }
        const stateTransition = {}
        const newPlans = Array.from(this.state[getObjectNameByPlanType(planType)])
        newPlans.splice(order, 0, newItem)
        stateTransition[getObjectNameByPlanType(planType)] = newPlans
        this.setState(stateTransition, () => {
            Promise.all(this.state[getObjectNameByPlanType(planType)].map((value, index) => {
                if (index > order) {
                    return changeOrder(value.id, index)
                }
                return null
            })).then(() => {
                addTodoItem(dateStr, planType, text, order).then((res) => {
                    this.replaceTempId(newItem.id, res.id)
                })
            })
        })
    }

    handleDelete(dateStr, planType, planId) {
        const nextState = {}
        const newPlans = this.state[getObjectNameByPlanType(planType)].filter( value => value.id !== planId)
        nextState[getObjectNameByPlanType(planType)] = newPlans
        this.setState(nextState, () => {
            if (planId >= 0) {
                deleteTodoItem(planId)
            } else {
                this.addDelayedOperation({
                    method: 'delete',
                    planId: planId,
                })
            }
        })
    }

    handleChange(dateStr, planType, planId, text, checked) {
        const nextState = {}
        const newPlans = this.state[getObjectNameByPlanType(planType)].map(value => {
            if (value.id === planId) {
                return {
                    ...value,
                    content: text,
                    is_finished: (checked === 1),
                }
            } else {
                return value
            }
        })
        nextState[getObjectNameByPlanType(planType)] = newPlans
        this.setState(nextState, () => {
            if (planId >= 0) {
                changeTodoItem(planId, text, checked)
            } else {
                this.addDelayedOperation({
                    method: 'change',
                    planId: planId,
                    text: text,
                    checked: checked,
                })
            }
        })
    }

    handleRefresh() {
        this.reloadSelectedPlans(this.state.selectedDay)
        this.reloadWeeklyPlans()
    }

    handleReorder(source, destination) {
        const sourceArray = this.state[getObjectNameByPlanType(source.planType)]
        const destArray = this.state[getObjectNameByPlanType(destination.planType)]
        const sourceClone = Array.from(sourceArray)
        const destClone = sourceArray === destArray ? sourceClone : Array.from(destArray)
        const [removed] = sourceClone.splice(source.index, 1)
        removed.plan_type = destination.planType
        removed.plan_date = this.state.selectedDay === null ? Moment(new Date()).format("YYYY-MM-DD") : this.state.selectedDay
        destClone.splice(destination.index, 0, removed)
        const result = {}
        result[getObjectNameByPlanType(source.planType)] = setOrderByItsIndex(sourceClone)
        result[getObjectNameByPlanType(destination.planType)] = setOrderByItsIndex(destClone)
        this.setState(result, () => {
            if (removed.id >= 0) {
                changePlanType(removed.id, removed.plan_type, removed.plan_date)
            } else {
                this.addDelayedOperation({
                    method: 'changeType',
                    planId: removed.id,
                    type: removed.plan_type,
                    planDate: removed.plan_date,
                })
            }
            if(sourceArray !== destArray) {
                this.syncCurrentOrder(source.planType)
            }
            this.syncCurrentOrder(destination.planType)
        })
    }

    handleWeekChange(weekOffset) {
        if (this.state.weekDays.length !== 7) {
            return;
        }
        const weekDays = this.state.weekDays.map((value) => {
            return Moment(value).add(weekOffset, 'weeks').format("YYYY-MM-DD")
        })
        this.setState({weekDays, selectedDay: null}, () => {
            this.reloadWeeklyPlans()
        })
    }

    componentDidMount() {
        const startOfWeek = Moment(new Date()).startOf('week')
        const weekOffset = [...Array(7).keys()]
        const weekDays = weekOffset.map((value, idx) => startOfWeek.clone().add(value, 'd').format("YYYY-MM-DD"))
        this.setState({weekDays}, () => {
            this.reloadWeeklyPlans()
        })
    }

    render() {
        return (
            <div className="Planner">
                <TitleBar 
                    logout={this.props.logout}
                    onRefresh={this.handleRefresh.bind(this)}/>
                <DayPicker 
                    weekDays={this.state.weekDays} 
                    selectedDay={this.state.selectedDay}
                    onSelect={this.handleSelectDate.bind(this)}
                    onWeekChange={this.handleWeekChange.bind(this)}/>
                <PlanListGroup
                    selectedDay={this.state.selectedDay}
                    weeklyPlans={this.state.weeklyPlans}
                    startOfWeek={this.state.weekDays[0]}
                    selectedDayPlans={this.state.selectedDayPlans}
                    addTodo={this.handleAddTodo.bind(this)}
                    deleteTodo={this.handleDelete.bind(this)}
                    handleReorder={this.handleReorder.bind(this)}
                    handleDuplicate={this.handleDuplicate.bind(this)}
                    onSomethingChange={this.handleChange.bind(this)}/>
            </div>
        );
    }
}

export default Planner;
