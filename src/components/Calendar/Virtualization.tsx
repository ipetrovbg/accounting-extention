import * as React from "react"

import "./Virtualization.scss"

interface VirtualizationProps {
    monthHeight: number;
    onMonthChange: (month: number) => void
    onScrollChange: (month: number) => void
}

class Virtualization extends React.Component<VirtualizationProps, {month: number, scroll: number}> {
    private virtualization: any;

    constructor(props) {
        super(props);

        this.state = {
            month: 0,
            scroll: 0
        };

        this.virtualization = React.createRef();
    }

    shouldComponentUpdate(nextProps: any, nextState: {month: number, scroll: number}, nextContext: any) {

        const shouldUpdate = nextState.month !== this.state.month

        if (this.state.scroll !== nextState.scroll) {
            this.props.onScrollChange(nextState.scroll);
        }

        if (shouldUpdate) {
            this.props.onMonthChange(nextState.month)
        }
        return shouldUpdate
    }

    componentDidMount() {
        this.virtualization.current.addEventListener('scroll', this.scrollHandler.bind(this));
        this.props.onMonthChange(this.state.month)

        this.setToToday();
    }

    setToToday() {
        const selected = this.virtualization.current.getElementsByClassName('initial-selected')[0];

        if (selected) {

            selected.parentElement.parentElement.scrollIntoView({
                behavior: 'auto',
                inline: 'end'
            });

            let scrolled: number = selected.parentElement.parentElement.offsetTop + 30;
            const options: ScrollToOptions = {
                top: scrolled,
                behavior: "smooth"
            };
            selected.parentElement.parentElement.parentElement.parentElement.scrollTo(options);
        }
    }

    render() {
        return (
            <div ref={this.virtualization} className="container">
                {this.props.children}
            </div>
        );
    }

    private scrollHandler(e) {

        const scrolled = e.target.scrollTop;
        let scroll = Math.floor(scrolled / this.props.monthHeight);

        let check = +new Number(scroll).toFixed();
        while (check > 11) { check = (check - 12) }

        this.setState({
            month: check,
            scroll: scrolled
        })

    }
}

export default Virtualization;