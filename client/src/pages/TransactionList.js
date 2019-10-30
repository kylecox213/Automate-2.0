import React from "react";
import { Redirect } from "react-router-dom";
import LoadingMsg from "../components/LoadingMsg";
import { Col, Row, Container } from "../components/Grid";
import Table from "../components/Table";
import CustomerFormStatic from "../components/CustomerFormStatic";
import { ErrorModal } from "../components/Errors";
// import SortableTable1 from "../components/SortableTable1";
import API from "../utils/API";


class TransactionList extends React.Component {

    state = {
        customerId: undefined,
        customerData: {},
        searchType: "transaction",
        tableHeads: ["id", "date", "odometer", "VehicleId"],
        tableData: []
    };

    checkLoginStatus = () => {
        API.userLoginCheck()
            .then(resp => {
                console.log(resp.data);
                this.setState({
                    user: resp.data.user,
                    loaded: true
                });
            });
    };


    setInitialState = () => {
        let customerId = this.props.location.state.customerId;
        let customerData = this.props.location.state.customerData;
        let queryParams = { CustomerId: customerId };
        console.log(queryParams);
        API.getTransactionsByParams(queryParams)
            .then(data => {
                // If there is data inside the response's {data} property...
                if (data.data.length > 0) {
                    console.log(data.data)
                    // Create an array to house the data (which as of now is stored in JSON
                    let transactionData = [];
                    // Map each transaction's data into the tableData in state;
                    data.data.map(transaction => {
                        transaction.date = transaction.date.slice(0, 10);
                        return transactionData.push(transaction);
                    });
                    // Set the table data in state to hold the mapped array
                    this.setState({
                        tableData: transactionData,
                        customerId: customerId,
                        customerData: customerData
                    });
                }
                // Otherwise, no data was returned on the search, so...
                else {
                    // Empty the table data from state and set an error message
                    this.setState({
                        tableData: [],
                        err: "No transactions are logged for this customer."
                    });
                }
            });
    }

    componentDidMount() {
        this.setInitialState();
        this.checkLoginStatus();
    };

    render() {

        if (!this.state.loaded) {
            return (<LoadingMsg />)
        }


        if (this.state.loaded && !this.state.user) {
            return (
                <Redirect to="/" />
            )
        }

        return (
            <div>
                <Row>
                    <Col size="12">
                        {
                            this.state.err ? <ErrorModal errMsg={this.state.err} hide={this.hideError} /> : <div />
                        }
                    </Col>
                </Row>
                <Container fluid>
                    <Row>
                        <Col size="12">
                            <h1 style={{ textAlign: "center", margin: "50px auto" }}>Transaction History</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col size="md-1" />
                        <Col size="md-10">
                            <CustomerFormStatic customer={this.state.customerData} />
                        </Col>
                        <Col size="md-1" />
                    </Row>
                    <Row>
                        <Col size="md-2" />
                        <Col size="md-8">
                            <Table
                                heads={this.state.tableHeads}
                                data={this.state.tableData}
                                pathType={this.state.searchType}
                            />
                        </Col>
                        <Col size="md-2" />
                    </Row>
                </Container >
            </div >
        )
    };

}

export default TransactionList;
