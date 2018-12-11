import * as React from "react";

import "./Showcase.scss";

const Showcase = (props) => (
    <div className="showcase">
        {props.children}
    </div>
);

export default Showcase;