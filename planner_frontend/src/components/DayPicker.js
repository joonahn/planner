import React, {Component} from 'react'
import DayCircle from './DayCircle'
import { Icon } from 'semantic-ui-react';

class DayPicker extends Component {
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
            </div>
        )
    }
}

export default DayPicker