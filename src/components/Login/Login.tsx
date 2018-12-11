import * as React from "react";
import axios from "axios";
import { connect } from "react-redux";

import {loadingUser, updateUser} from "../../store/actions";
import {User} from "../../models/User";
import {Button} from "../Button/Button";

import "./Login.scss";
import {Utils} from "../utils";

class Login extends React.Component<{ updateUser, loadingUser }, {email: string, password: string}> {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.login.bind(this)} className="flex direction-column space-around login">
                    <label className="flex space-between align-center">
                        <span>Email:</span>
                        <input type="email" onKeyUp={(e) => this.updateUser(e, 'email')} />
                    </label>
                    <label className="flex space-between align-center">
                        <span>Password:</span>
                        <input type="password" onKeyUp={(e) => this.updateUser(e, 'password')} />
                    </label>
                    <Button onClick={this.login.bind(this)}>Login</Button>
                </form>
            </div>
        );
    }

    dispatchUpdateUser(user: User) {
        localStorage.setItem("accountingExtentionAuth", JSON.stringify({user}));

        const { updateUser } = this.props;

        updateUser(user);
    }

    login(e) {
        e.preventDefault();
        const { loadingUser } = this.props;
        loadingUser(true);

        if (!this.state.email || !this.state.password) {
            loadingUser(false);
            return;
        }



        axios.post(`${new Utils().api}/authenticate`, this.state)
            .then((auth) => {
                loadingUser(false);
            this.dispatchUpdateUser({ ...auth.data.user, token: auth.data.token})

        }).catch(error => {
            if (error.response.status) {
                loadingUser(false);
                this.dispatchUpdateUser({id: null, email: '', token: '', name: ''})
            }
        });
    }

    updateUser(e, target: 'email' | 'password') {
        if (target === 'email') {
            this.setState({
                email: e.currentTarget.value
            });
        } else {
            this.setState({
                password: e.currentTarget.value
            });
        }
    }
}

export default connect(
    state => ({state: state.root}),
    { updateUser, loadingUser }
)(Login);