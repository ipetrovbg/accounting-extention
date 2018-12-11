import * as React from "react";
import {Button} from "../Button/Button";

export default props => (
    <table className="header no-bottom-padding no-top-padding">
        <thead>
            <tr>
                <td colSpan={6}>{props.month} {props.year}</td>
                <td>
                    <Button classNames="primary" onClick={props.selectToday.bind(this)}>TODAY</Button>
                </td>
            </tr>
        </thead>
    </table>
);