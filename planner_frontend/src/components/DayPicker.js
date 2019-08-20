import React, {Component} from 'react'
import DayCircle from './DayCircle'
import Moment from 'moment'
import { Icon } from 'semantic-ui-react';

class DayPicker extends Component {
    onHomeButtonClick() {
        this.props.onSelect(Moment(new Date()).format("YYYY-MM-DD"))
        this.props.setCurrentWeek()
    }
    render() {
        const daysEls = this.props.weekDays.map((day, idx) =>
            <DayCircle 
                key={day} 
                dayString={day}
                selectedDay={this.props.selectedDay}
                onSelect={this.props.onSelect}
                />)
        return (
            <div>
                <Icon link name='angle left' onClick={() => this.props.onWeekChange(-1)}/>
                {daysEls}
                <Icon link name='angle right' onClick={() => this.props.onWeekChange(+1)}/>
                <Icon link name='home' onClick={() => this.onHomeButtonClick()}/>
            </div>
        )
    }
}

export default DayPicker