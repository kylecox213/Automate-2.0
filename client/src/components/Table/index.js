import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

function Table(props) {

    function formatHeader(string) {
        let targIndex = string.indexOf(string.match(/[A-Z]{1}/));
        if (targIndex > 0) {
            let wordArray = [];
            wordArray.push(string.slice(0, targIndex));
            wordArray.push(string.slice(targIndex, (string.length)));
            let formattedArray = [];
            wordArray.map(word => {
                let cap = word[0].toUpperCase();
                let trunc = word.slice(1, word.length)
                let formattedWord = cap + trunc;
                return formattedArray.push(formattedWord);
            });
            return formattedArray.join(" ");
        }
        else {
            let cap = string[0].toUpperCase();
            let trunc = string.slice(1, string.length)
            let formattedWord = cap + trunc;
            return formattedWord;
        };
    };

    let tableHeaders = [];

    if (props.heads.length) {
        props.heads.map(header => {
            return tableHeaders.push(formatHeader(header));
        });
    };

    // Determine the ID to pass through on links
    let idType;

    if (props.pathType === "customer") {
        idType = "customerId";
    }

    if (props.pathType === "vehicle") {
        idType = "vehicleId";
    }

    if (props.pathType === "transaction") {
        idType = "transactionId";
    }

    if (tableHeaders.length) {
        return (
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        {tableHeaders.map(header => {
                            return (<th key={`col-${header}`} scope="col">{header}</th>)
                        })}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map(dataRow => {
                        return (
                            <tr key={dataRow.id}>
                                {props.heads.map(header => {
                                    return (<td key={dataRow.id + "-" + header}>
                                        <Link to={{
                                            pathname: `/app/${props.pathType}/${dataRow.id}`,
                                            state: { [idType]: dataRow.id }
                                        }}>{dataRow[header]}</Link>
                                    </td>)
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table >
        );
    } else return (<div></div>)
}

export default Table;