import * as React from "react"
import { CalendarContainer } from "./CalendarContainer"
import CalendarHeader from "./CalendarHeader";
import Virtualization from "./Virtualization";

import "./Calendar.scss";
import CalendarDayNames from "./CalendarDayNames";
import Timeout = NodeJS.Timeout;
import {RefObject} from "react";

interface CalendarState {
    currentMonth: number;
    currentYear: number;
    firstYear: number;
    yearHeight: number;
    monthHeight: number;
    scroll: number;
    months: {
        lg: string[],
        md: string[]
    },
    days: {
        lg: string[],
        md: string[],
        sm: string[],
        xs: string[]
    }
    timeout: Timeout | number
    next: boolean
    prev: boolean
    startYear: Date
    endYear: Date
    selectedDate: Date
}
export default class Calendar extends React.Component<{}, CalendarState> {
    private ref: RefObject<any>;
    constructor(props) {

        super(props);
        const monthHeight: number = 247
        const yearHeight: number = (monthHeight * 12)

        this.state = {
            scroll: 0,
            currentMonth: 0,
            yearHeight: yearHeight,
            monthHeight: monthHeight,
            timeout: null,
            months: {
                lg: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                md: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            days: {
                lg: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                md: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                sm: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                xs: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            },
            next: true,
            prev: true,
            firstYear: 2000,
            startYear: new Date(2000, 0, 0, 0, 0, 0, 0),
            endYear: new Date((2018 + (Math.floor(0 / yearHeight) + 3)), 0, 0, 0, 0, 0, 0),
            currentYear: new Date(2018, 0, 0, 0, 0, 0, 0).getFullYear(),
            selectedDate: new Date()
        }

        this.ref = React.createRef()
    }

    render() {
        const dayNames = <CalendarDayNames>{this.state.days.sm.map((name, i) => <td key={i} className="hdays">{name}</td>)}</CalendarDayNames>;

        return (
            <div className="datapicker">

                <CalendarHeader month={this.state.months.lg[this.state.currentMonth]} year={this.state.currentYear} selectToday={this.setToToday.bind(this)}/>
                {/*<ul>*/}
                    {/*{this.state.months.md.map((month, i) => <li key={i}>{month}</li>)}*/}
                {/*</ul>*/}

                {dayNames}

                <Virtualization onMonthChange={this.onMonthChangeHandler.bind(this)} onScrollChange={this.onVirtualizationScrollChange.bind(this)} monthHeight={this.state.monthHeight} ref={this.ref}>
                    <CalendarContainer next={this.state.next} prev={this.state.prev} startYear={this.state.startYear} endYear={this.state.endYear} selectedDate={this.state.selectedDate}/>
                </Virtualization>
            </div>
        );
    }

    setToToday() {
        this.setState({
            endYear: new Date((2018 + 2), 0, 0, 0, 0, 0, 0)
        })
        const selectedDays = this.ref.current.virtualization.current.getElementsByClassName('selected');
        const selected = this.ref.current.virtualization.current.getElementsByClassName('initial-selected')[0];
        selected.click();


        [...selectedDays].forEach(el => {
            if (!selected.classList.contains('selected')) {
                el.classList.remove('selected');
            }

        })
        selected.classList.add("selected");


    }

    onVirtualizationScrollChange(scrolled) {
        let check = Math.floor(+new Number(scrolled / this.state.yearHeight));

        this.setState({
            scroll: scrolled,
            currentYear: this.state.firstYear + check,
            endYear: new Date((this.state.startYear.getFullYear() + 1) + (Math.floor(scrolled / this.state.yearHeight) + 3), 0, 0, 0, 0, 0, 0)
        });

    }

    onMonthChangeHandler(month) {
        this.setState({
            currentMonth: month
        })
    }

    // private debounce(func, wait, immediate?) {
    //     return () => {
    //         var context = this, args = arguments;
    //         var later = () => {
    //             this.setState({
    //                 timeout: null
    //             })
    //             if (!immediate) func.apply(context, args);
    //         };
    //         var callNow = immediate && !this.state.timeout;
    //         clearTimeout(this.state.timeout as number);
    //         this.setState({
    //             timeout: setTimeout(later, wait)
    //         });
    //         if (callNow) func.apply(context, args);
    //     };
    // };
}