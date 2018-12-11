import * as React from "react";
import {connect} from "react-redux";

import {library} from '@fortawesome/fontawesome-svg-core';
import {faStroopwafel, faSignOutAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faStroopwafel, faSignOutAlt, faPlus);

import "./App.scss";
import Showcase from "./components/Showcase/Showcase";
import Account from "./components/Account/Account";
import * as moment from "moment";
import Login from "./components/Login/Login";
import {loadingUser, updateUser} from "./store/actions";
import {State} from "./store/store";
import axios from "axios";
import {User} from "./models/User";
import {Utils} from "./components/utils";
import Calendar from "./components/Calendar/Calendar";


class App extends React.Component<{ state: State, updateUser, loadingUser }, { loading: boolean, daysToNextSalary: number, api: string }> {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            daysToNextSalary: 0,
            api: new Utils().api
        }
    }

    componentWillMount() {

        this.setState({
            daysToNextSalary: this.daysToNextSalary()
        });

        const accountingExtentionAuth = JSON.parse(localStorage.getItem('accountingExtentionAuth'))
        const {loadingUser} = this.props;
        loadingUser(true);
        const startTime = new Date().getTime();
        const duration = 300;

        if (accountingExtentionAuth && accountingExtentionAuth.user && accountingExtentionAuth.user.token) {

            axios.post(`${this.state.api}/authenticate/token`, {token: accountingExtentionAuth.user.token})
                .then((auth) => {

                    this.dispatchUpdateUser({...auth.data.user, token: auth.data.token});

                    const endTime = new Date().getTime();

                    if (startTime + duration > endTime) {
                        setTimeout(() => loadingUser(false), duration);
                    } else {
                        loadingUser(false);
                    }


                }).catch(error => {
                if (error.response.status === 401) {

                    loadingUser(false);
                }
            });
        } else {
            loadingUser(false);
        }
    }

    render() {
        const {state: {user, loading}} = this.props;

        const content = user.id ?
            (<Account/>) :
            (<Showcase>
                <Login/>
            </Showcase>);

        return <div className="app">
            {/*{ !loading ? content : (<p>Loading...</p>)}*/}
            <Calendar />
        </div>;
    }

    public daysToNextSalary() {
        const day = moment();
        const payDay = 5;

        return (payDay > (+new Date().getDate() + 1)) ?
            Math.abs(day.diff(moment([new Date().getFullYear(), new Date().getMonth(), payDay]), 'days')) + 1 :
            (+moment().endOf('month').format('D') - (+moment(day).format('D'))) + payDay;
    }

    dispatchUpdateUser(user: User) {
        localStorage.setItem("accountingExtentionAuth", JSON.stringify({user}));

        const {updateUser} = this.props;

        updateUser(user);
    }
}

export default connect(
    state => ({state: state.root}),
    {updateUser, loadingUser}
)(App);