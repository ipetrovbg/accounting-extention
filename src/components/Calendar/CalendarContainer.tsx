import * as React from "react";


import Virtualization from "./Virtualization";
import CalendarHeader from "./CalendarHeader";


/*
*
* style={{
        transform: `translateY(${this.state.scroll  - (this.state.scroll * 1.001)}px)`
    }}
* */

interface ICalendar {
    month: number;
    day: number;
    year: number;
    selectedMonth: number;
    date: Date;
    selectedDate: Date;
    setUnchangeableDate: Date;
    open: boolean;
    resetOnOpen: boolean;
    startYear: number;
    endYear: number;
    totalDays: number;
    months: {
        lg: string[],
        md: string[]
    }
    days: {
        lg: string[],
        md: string[],
        sm: string[],
        xs: string[]
    },
    scroll: number;
    scrolled: {
        month: number,
        year: number
    }
}

interface CalendarContainerProps {
    next: boolean
    prev: boolean
    startYear: Date
    endYear: Date
    selectedDate: Date
}

interface CalendarDate {
    date: number
    today: boolean
    selected?: boolean
    unchangeable?: boolean
}

export class CalendarContainer extends React.Component<CalendarContainerProps, ICalendar, any> {
    private ref: any;

    private fullCalendar: any[] = [];

    constructor(props) {
        super(props);

        this.state = {
            month: new Date().getMonth(),
            day: new Date().getDay(),
            year: new Date().getFullYear(),
            selectedMonth: new Date().getMonth(),
            date: new Date(),
            selectedDate: new Date(""),
            setUnchangeableDate: new Date(),
            open: true,
            resetOnOpen: true,
            startYear: 2000,
            endYear: 5000,
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
            totalDays: 0,
            scroll: 0,
            scrolled: {
                month: 0,
                year: 2008
            }
        };

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current.addEventListener('click', e => {
            // this.handleEvent(e, {date: new Date(this.state.selectedDate).getDate(), today: false});
            const selectedDays = this.ref.current.getElementsByClassName('selected');

            [...selectedDays].forEach(el => {
                if (!e.target.offsetParent.classList.contains('selected')) {
                    el.classList.remove('selected');
                }

            })
            e.target.offsetParent.classList.add("selected");
        });

        // const myEfficientFn = this.debounce((e) => {
        //     const scrolled = e.target.scrollTop;
        //     const height = 245;
        //
        //     let month = Math.floor(scrolled / height);
        //     // this.debounce(function() {
        //     //     if (scrolled >= this.state.scroll && (this.state.scrolled.month > 10 && this.state.scrolled.month <= 11)) {
        //     //         console.log('next');
        //     //     } else if (false) {
        //     //         console.log('prev');
        //     //     }
        //     // }, 100);
        //
        //     // this.setState({
        //     //     year: this.state.year + 1
        //     // });
        //
        //     let year = 0;
        //     if (scrolled >= this.state.scroll && month >= 11 && month < 12) {
        //         year = Math.floor(scrolled / 2733);
        //         this.setState({
        //             next: true
        //         });
        //     } else {
        //         year = Math.floor(scrolled / 2733) - (Math.floor(scrolled / 2733) * 2);
        //     }
        //
        //
        //     this.setState({
        //         scroll: scrolled <= 0 ? 0 : (e.target.scrollTop),
        //         scrolled: {
        //             month: month,
        //             year: this.state.scrolled.year //year === 0 ? this.state.scrolled.year : this.state.scrolled.year + year
        //         },
        //         startYear: this.state.startYear // + year,
        //         // endYear: Math.floor(scrolled / height) >= 11 ? this.state.startYear + 1 : this.state.startYear + 1
        //     });
        //
        //
        // }, 10, true);

        // this.virtualization.current.addEventListener('scroll', myEfficientFn);

    }

    shouldComponentUpdate(nextProps: CalendarContainerProps, nextState: ICalendar, nextContext: any) {

        const shouldUpdate = nextState.endYear !== this.state.endYear || nextState.startYear !== this.state.startYear ||
        nextProps.next !== this.props.next || nextProps.prev !== this.props.prev || nextProps.startYear !== this.props.startYear || nextProps.endYear.getFullYear() !== this.props.endYear.getFullYear();

        return shouldUpdate;
    }

    render() {
        let fullCalendar: any[] = this.createFullCalendarObject(this.props.startYear.getFullYear())

        const calendar = fullCalendar.map((calendar, j) =>
            <tbody key={j} >
            <tr>
                <th className="hdays" colSpan={7}>{this.state.months.lg[calendar.settings.month]} {calendar.settings.year}</th>
            </tr>
            {calendar.body.map((item, indexx) => <tr key={indexx}>
                {
                    item.map((date, index) =>
                        <td
                            key={index}
                            className={this.buildDayClassNames(date)}
                            onClick={(e) => this.selectDate(date, calendar.settings.month, calendar.settings.year, e)}
                            tabIndex={date.date}
                        >
                            {date.date ? <span className={date.today ? 'today' : ''}>{date.date}</span> : null}

                        </td>
                    )
                }
            </tr>)
            }
            </tbody>);

        return (
            <table className="no-top-padding" ref={this.ref}>
                    {calendar}
            </table>
        );
    }

    createFullCalendarObject(year): any[] {

        const fullCalendar: any[] = [];
        const count =  this.props.endYear.getFullYear() - year ? this.props.endYear.getFullYear() - year : 1;

        for (let i = 1; i <= count; i++) {
            for (let j = 0; j <= 11; j++) {

                let dateObj = new Date(year + i, j, 1, 0, 0, 0, 0),
                    option: any = {},
                    defaults = {
                        type: "month",
                        month: dateObj.getMonth(),
                        year: dateObj.getFullYear(),
                        date: dateObj.getDate(),
                    };

                option = this.extendSource(option, defaults);


                const calendarSettings = this.getCalendar(option.year, option.month, option.date);
                const calendar: any = this.createObjectMonthTable(calendarSettings);
                calendar.settings = calendarSettings;
                fullCalendar.push(calendar);
            }
        }

        return fullCalendar;

    }

    handleEvent(e, date: CalendarDate) {
        if (date.date) {
            switch (e.which) {
                case 40:
                    // down
                    // this.selectDate({date: date.date + 7 > this.state.totalDays ? 1 : date.date + 7, today: false});
                    break;
                case 39:
                    // right
                    // this.selectDate({date: date.date + 1 > this.state.totalDays ? 1 : date.date + 1, today: false});
                    break;
                case 38:
                    // up
                    // this.selectDate({date: date.date - 7 < 1 ? this.state.totalDays : date.date - 7, today: false});
                    break;
                case 37:
                    // left
                    // this.selectDate({date: (date.date - 1) < 1 ? this.state.totalDays : date.date - 1, today: false});
                    break;
            }
        }

    }

    selectDate(date: CalendarDate, month: number, year: number, e: any) {
        if (date.date) {
            this.setState({
                selectedDate: new Date(year, month, date.date)
            });
            if (e.currentTarget && e.currentTarget.parentElement && e.currentTarget.parentElement.parentElement) {

                e.currentTarget.parentElement.parentElement.scrollIntoView( {
                    behavior: 'smooth',
                    inline: 'end'
                });
                let scrolled: number = e.currentTarget.parentElement.parentElement.offsetTop + 30;

                const options: ScrollToOptions = {
                    top: scrolled,
                    behavior: "smooth"
                };

                e.currentTarget.parentElement.parentElement.parentElement.parentElement.scrollTo(options);
            }

        }
    }

    buildDayClassNames(date: CalendarDate): string {
        const classNames = [];
        if (date.date) {
            classNames.push("date");
        }
        if (date.today) {
            classNames.push("today");
        }

        if (date.selected) {
            // classNames.push("selected");
        }

        if (date.unchangeable) {

            classNames.push("initial-selected");
        }
        return classNames.join(" ");
    }

    createObjectMonthTable(data) {

        let calendar = {body: []}, c, td = [], count, r;

        calendar.body[0] = td;

        td = [];
        for (c = 0; c <= 6; c++) {
            if (c === data.firstDayIndex) {
                break;
            }
            if (c === new Date(this.state.date).getDate() && data.month === new Date(this.state.date).getMonth() && this.state.year === new Date(this.state.date).getFullYear()) {

                td.push({date: 0, today: true});


            } else {

                td.push({date: 0, today: false});
            }

        }
        calendar.body[1] = td;

        count = 1;
        while (c <= 6) {

            // td.push(count);
            if ((count === new Date(this.state.date).getDate() && data.month === new Date(this.state.date).getMonth() && this.state.year === new Date(this.state.date).getFullYear())) {

                td.push({date: count, today: true});
            } else {
                td.push({date: count, today: false});
            }

            /* apply selection */
            if (new Date(this.props.selectedDate).getDate() === count && new Date(this.props.selectedDate).getMonth() === data.month && new Date(this.props.selectedDate).getFullYear() === data.year) {
                td[c].selected = true;
            }
            if (new Date(this.state.setUnchangeableDate).getDate() === count && new Date(this.state.setUnchangeableDate).getMonth() === data.month && new Date(this.state.setUnchangeableDate).getFullYear() == data.year) {
                td[c].unchangeable = true;
            }
            count = count + 1;
            c = c + 1;
        }
        calendar.body[1] = td;


        //create remaining rows
        for (r = 3; r <= 7; r = r + 1) {
            td = [];
            for (c = 0; c <= 6; c = c + 1) {

                if (count > data.totaldays) {
                    break;
                }
                /*(count === data.date && data.year === new Date().getFullYear()) || */
                if ((count === new Date(this.state.date).getDate() && data.month === new Date(this.state.date).getMonth() && this.state.year === new Date(this.state.date).getFullYear())) {

                    td.push({date: count, today: true});


                } else {
                    // td.push(count);

                    td.push({date: count, today: false});

                }

                /* apply selection */

                if (new Date(this.state.selectedDate).getDate() === count && new Date(this.state.selectedDate).getMonth() === data.month) {

                    td[c].selected = true;
                }

                if (new Date(this.state.setUnchangeableDate).getDate() === count && new Date(this.state.setUnchangeableDate).getMonth() === data.month && new Date(this.state.setUnchangeableDate).getFullYear() == data.year) {
                    td[c].unchangeable = true;
                }


                count = count + 1;

            }
            calendar.body.push(td);
        }


        return calendar;
    }

    getCalendar(year, month, date) {

        let dateObj = new Date(),
            dateString,
            idx;

        const result: any = {};

        if (year < this.state.startYear || year > this.state.endYear) {
            console.error("Invalid Year");
            return false;
        }
        if (month > 11 || month < 0) {
            console.error("Invalid Month");
            return false;
        }
        if (date > 31 || date < 1) {
            console.error("Invalid Date");
            return false;
        }

        result.year = year;
        result.month = month;
        result.date = date;

        //today
        result.today = {};
        dateString = dateObj.toString().split(" ");

        idx = this.state.days.md.indexOf(dateString[0]);
        result.today.dayIndex = idx;
        result.today.dayName = dateString[0];
        result.today.dayFullName = this.state.days.md[idx];

        idx = this.state.months.md.indexOf(dateString[1]);
        result.today.monthIndex = idx;
        result.today.monthName = dateString[1];
        result.today.monthNameFull = this.state.months.md[idx];

        result.today.date = dateObj.getDate();

        result.today.year = dateString[3];

        //get month-year first day
        dateObj.setFullYear(year);
        dateObj.setMonth(month);
        dateObj.setDate(1);
        dateString = dateObj.toString().split(" ");

        idx = this.state.days.md.indexOf(dateString[0]);
        result.firstDayIndex = idx;
        result.firstDayName = dateString[0];
        result.firstDayFullName = this.state.days.md[idx];

        idx = this.state.months.md.indexOf(dateString[1]);
        result.monthIndex = idx;
        result.monthName = dateString[1];
        result.monthNameFull = this.state.months.md[idx];

        //get total days for the month-year
        dateObj.setFullYear(year);
        dateObj.setMonth(month + 1);
        dateObj.setDate(0);
        result.totaldays = dateObj.getDate();

        //get month-year targeted date
        dateObj.setFullYear(year);
        dateObj.setMonth(month);
        dateObj.setDate(date);
        dateString = dateObj.toString().split(" ");

        idx = this.state.days.md.indexOf(dateString[0]);
        result.targetedDayIndex = idx;
        result.targetedDayName = dateString[0];
        result.targetedDayFullName = this.state.days.md[idx];

        return result;

    }

    extendSource(source, defaults) {
        var property;
        for (property in defaults) {
            if (source.hasOwnProperty(property) === false) {
                source[property] = defaults[property];
            }
        }
        return source;
    }


}