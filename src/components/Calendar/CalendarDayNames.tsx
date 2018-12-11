import * as React from "react";

export default props => (
    <table className="no-bottom-padding no-top-padding">
        <thead>
        <tr className="thead">
            {props.children}
        </tr>
        </thead>
    </table>
);