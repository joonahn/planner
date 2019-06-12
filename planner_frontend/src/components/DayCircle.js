import React, {Component} from 'react'
import Moment from 'moment'
import { Label } from 'semantic-ui-react';

class DayCircle extends Component {
    constructor(props) {
        super(props)
        Moment.updateLocale('ko', {
            weekdays: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"],
        });
    }

    onClick() {
        console.log('clicked from ' + this.props.dayString)
        this.props.onSelect(this.props.dayString)
    }

    render() {
        const todayString = Moment(new Date()).format("YYYY-MM-DD")
        const isSelected = this.props.dayString === this.props.selectedDay
        const isToday = this.props.dayString === todayString
        const circleColor = isSelected?'teal':isToday?'pink':null
        const printedDayString = Moment(this.props.dayString).format("DD")
        const printedDayOfWeekString = Moment(this.props.dayString).format("ddd")

        return (
            <div style={{display:'inline-block'}}>
                <div style={{margin: 2}}>
                    <span>{printedDayOfWeekString}</span>
                    <div>
                        <Label as='a' circular size='large' color={circleColor} onClick={() => this.onClick()}>
                            {printedDayString}
                        </Label>

                    </div>
                </div>
            </div>
            // <li style={{color:circleColor}} onClick={() => this.onClick()}>
            //     {/* {this.props.dayString} */}
            //     {printedDayString}
            // </li>
        )
    }
}

export default DayCircle