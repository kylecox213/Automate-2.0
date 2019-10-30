import React from "react";
import "./style.css";

export function ErrorModal(props) {
    return (
        <div className="errorModal">{props.errMsg}<span id="closeModal" onClick={props.hide}>x</span></div>
    );
}