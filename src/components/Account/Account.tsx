import * as React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {connect} from "react-redux";

import {User} from "../../models/User";
import { loadingUser, updateUser } from "../../store/actions";
import {State} from "../../store/store";
import "./Account.scss";
import {Button} from "../Button/Button";

interface StateProps {
    user: User,
    loadContent: boolean
}

class Account extends React.Component<{ state: State, updateUser: any, loadingUser: any }, StateProps> {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                email: '',
                id: null,
                name: '',
                token: ''
            },
            loadContent: false
        };
    }

    componentWillMount() {
        /*
        *
        * {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzM1ODIzNzAsImlkIjo3LCJpYXQiOjE1MzM1Nzg3NzB9.R6seRkfSV7UKMfWK2sKY8L-TlW8XjJJ_JuIaZffPl9Q",
        * "transaction":{
        * "id":null,
        * "date":"2018-11-17T19:23:53.455Z",
        * "createdAt":null,
        * "updatedAt":null,
        * "userId":7,
        * "categoryId":null,
        * "amount":5,
        * "originalAmount":5,
        * "transactionId":null,
        * "currencyId":41,
        * "comment":"",
        * "type":"withdrawal",
        * "simulation":false,
        * "accountId":2,
        * "deletedAt":null
        * }
        * }
        * */

        /*
         * Currency: https://ancient-fjord-87958.herokuapp.com/api/v1/currency
         * Account: https://ancient-fjord-87958.herokuapp.com/api/v1/account
         * Categories: https://ancient-fjord-87958.herokuapp.com/api/v1/transaction-category
         * */

        const accountingExtentionAuth = JSON.parse(localStorage.getItem('accountingExtentionAuth'));

        if (accountingExtentionAuth) {
            this.setState({
                user: {
                    ...accountingExtentionAuth.user,
                    token: accountingExtentionAuth.token
                }
            });
        }

    }

    render() {
        const content = (<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa ea est excepturi exercitationem id illo in, incidunt nam natus perspiciatis ratione sapiente, sint ut? Accusamus debitis dignissimos fuga nisi velit.</p>);
        return (
            <div className="padding account flex direction-column space-between">
                <header>Hello {this.state.user.name} </header>
                <section>
                    {this.state.loadContent ? content: ''}
                </section>
                <footer className="flex direction-row space-around">
                    <Button icon="sign-out-alt" size="2x" onClick={this.logout.bind(this)} />
                    <Button icon="plus" size="2x" onClick={this.loadContent.bind(this)}/>
                </footer>
            </div>
        );
    }

    private loadContent() {
        this.setState({
            loadContent: !this.state.loadContent
        })
    }

    private logout(e) {
        e.preventDefault();
        const {updateUser, loadingUser} = this.props;

        // loadingUser(true);
        const user: User = {
            id: null,
            name: '',
            email: '',
            token: ''
        };

        updateUser(user);
        localStorage.setItem('accountingExtentionAuth', JSON.stringify(user));
    }

}

export default connect(
    state => ({state: state.root}),
    {updateUser, loadingUser}
)(Account);