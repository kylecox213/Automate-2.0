import React from "react";
import { Col, Row, Container } from "../components/Grid";
import { ErrorModal } from "../components/Errors";
import { Input, TextArea, OjBtn, BlueBtn } from "../components/Form";
import { Redirect } from "react-router-dom";
import CustomerFormSatic from "../components/CustomerFormStatic";
import DatePicker from "react-datepicker";
import API from "../utils/API";
import "react-datepicker/dist/react-datepicker.css";


class Transaction extends React.Component {

    state = {
        vehicleId: null,
        vehicles: [],
        customerId: null,
        customerData: {},
        date: new Date(),
        serviceDesc: "",
        partsPrice: undefined,
        laborPrice: undefined,
        totalPrice: undefined,
        tax: undefined,
        grandTotal: undefined,
        err: "",
        transaction: {},
        transactionId: undefined,
        redirect: false
    }

    handleInputChange = event => {
        console.log(this.state);
        // Pull the name and value to change from the event target
        const { name, value } = event.target;
        console.log(name);
        console.log(value);
        // If the event target is named parts price...
        if (name === "partsPrice") {
            let laborPrice = parseFloat(this.state.laborPrice) || 0;
            // Add the value to whatever currently exists in state for the labor price
            let totalPrice = (parseFloat(value) + laborPrice).toFixed(2);
            // Set the state for both the parts price and the total price
            this.setState({
                [name]: value,
                totalPrice: totalPrice
            });
        }
        // Otherwise, if the event target is named labor price...
        else if (name === "laborPrice") {
            let partsPrice = parseFloat(this.state.partsPrice) || 0;
            // Add the value to whatever currently exists in state for the parts price
            let totalPrice = (parseFloat(value) + partsPrice).toFixed(2);
            // Set the state for both the labor price and the total price
            this.setState({
                [name]: value,
                totalPrice: totalPrice
            });
        }
        // If neither of the above, then just run the simple set state
        else {
            this.setState({
                [name]: value
            });
        };
    };

    changeDate = date => {
        console.log(date);
        console.log(this.state);
        this.setState({
            date: date
        });
    };

    calculateGrandTotal = event => {
        event.preventDefault();
        let taxAdd = parseFloat(this.state.tax) || 0;
        let grandTotal = (parseFloat(this.state.totalPrice) + taxAdd).toFixed(2)
        this.setState({
            grandTotal: grandTotal
        });
    };

    // Function to hide the error message
    hideError = () => {
        // Simply reset the err in state to empty
        this.setState({
            err: ""
        })
    }

    // Small function to package up the Vehicle data in state for movement to the DB
    packageTransactionData = () => {
        // // Convert date to ISO string for parsing later
        // let convertedDate = this.state.date.toISOString();
        // console.log(this.state.date);
        // console.log(convertedDate);
        let transactionData = {
            date: this.state.date,
            odometer: this.state.odometer,
            serviceDesc: this.state.serviceDesc,
            partsPrice: this.reformatPrice(this.state.partsPrice),
            laborPrice: this.reformatPrice(this.state.laborPrice),
            totalPrice: this.reformatPrice(this.state.totalPrice),
            tax: this.reformatPrice(this.state.tax),
            grandTotal: this.reformatPrice(this.state.grandTotal),
            VehicleId: this.state.vehicleId,
            CustomerId: this.state.customerId
        };
        console.log(transactionData);
        return transactionData;
    };

    validInput = () => {
        // Display an error message if any of the following is true
        // There is no vehicle ID or it is set to the default "Select vehicle" message
        if (!this.state.vehicleId || this.state.vehicleId === "Select vehicle") {
            this.setState({
                err: "Please select a vehicle for this transaction."
            });
            return false;
        }
        // There is nothing entered into the parts or labor price fields
        else if (!this.state.laborPrice || !this.state.partsPrice) {
            this.setState({
                err: "Please enter a price (even if it is 0) for both parts and service."
            });
            return false;
        }
        // There is no grand total price
        else if (!this.state.grandTotal) {
            this.setState({
                err: "Please provide or calculate a grand total price."
            });
            return false;
        }
        // If none of the above criteria were met, return true
        return true;
    }

    reformatPrice = price => {
        console.log(price);
        let cents = parseInt(price * 100);
        console.log(cents);
        return cents;
    };

    submitTransaction = event => {
        event.preventDefault();
        if (this.validInput()) {
            let transaction = this.packageTransactionData();
            console.log(transaction);
            API.addNewTransaction(transaction)
                .then(response => {
                    if (response) {
                        this.setState({
                            transaction: response.data,
                            transactionId: response.data.id,
                            redirect: true
                        });
                    }
                }).catch(err => console.log(err));
        }
    };

    componentDidMount() {
        console.log("Vehicles:")
        console.log(this.props.location.state.vehicles);
        console.log("Customer ID:")
        console.log(this.props.location.state.customerId);
        console.log("Customer Data:")
        console.log(this.props.location.state.customerData);
        this.setState({
            vehicles: this.props.location.state.vehicles,
            customerId: this.props.location.state.customerId,
            customerData: this.props.location.state.customerData
        });
    };


    render() {

        const { redirect } = this.state;
        if (redirect) {
            return (
                <Redirect
                    push to={{
                        // To the customer page for this specific customer
                        pathname: `/app/transaction/${this.state.transaction.id}`,
                        // Also pass the customer data to that page
                        state: { transactionId: this.state.transactionId }
                    }}
                />
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
                        <Col size="md-12">
                            <h1 style={{ textAlign: "center", margin: "10px auto 30px" }}>Transaction Information</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col size="md-1" />
                        <Col size="md-10" style={{ marginBottom: "50px" }}>
                            <form>
                                <div className="form-row">
                                    <Col size="sm-4">
                                        <p>
                                            {this.state.customerData ? `Which one of ${this.state.customerData.firstName}'s vehicles received service?` : ""}
                                        </p>
                                        {
                                            // Is there anything inside the state's vehicles array?
                                            this.state.vehicles ? (
                                                // If there is, create a select menu with a default option
                                                <select
                                                    style={{ marginBottom: 50 }}
                                                    name="vehicleId"
                                                    onChange={this.handleInputChange}>
                                                    <option defaultValue>Select vehicle</option>
                                                    { // Then map each vehicle in the array to a subsequent menu item
                                                        this.state.vehicles.map(vehicle => {
                                                            return (<option key={vehicle.id} value={vehicle.id}>
                                                                {vehicle.year} {vehicle.make} {vehicle.model} | Plate #: {vehicle.plateNumber}
                                                            </option>)
                                                        })
                                                    }
                                                </select>) :
                                                // If there isn't, return an empty div
                                                <div></div>
                                        }
                                    </Col>
                                    <Col size="sm-3">
                                        <p>Date</p>
                                        <DatePicker
                                            name="date"
                                            todayButton="Today"
                                            selected={this.state.date}
                                            onChange={this.changeDate}
                                            dateFormat="MM/dd/yyyy"
                                        />
                                    </Col>

                                    <Col size="sm-2">
                                        <Input
                                            type="input"
                                            name="odometer"
                                            id="odometer"
                                            label="Odometer"
                                            placeholder="Miles"
                                            onChange={this.handleInputChange}
                                        />
                                    </Col>
                                    <Col size="sm-3">
                                        <OjBtn
                                            type="submit"
                                            className="btn btn-block"
                                            onClick={this.submitTransaction}
                                            children="Save"
                                        />
                                    </Col>
                                </div>
                                <Col size="12">
                                    <Row>
                                        <Col size="sm-6">
                                            <div className="form-row">
                                                <Col size="12">
                                                    <TextArea
                                                        name="serviceDesc"
                                                        id="serviceDesc"
                                                        label="Service Description"
                                                        onChange={this.handleInputChange}
                                                    />
                                                </Col>

                                            </div>
                                        </Col>
                                        <Col size="sm-3">
                                            <div className="form-row">
                                                <Col size="12">
                                                    <Input
                                                        type="input"
                                                        name="partsPrice"
                                                        id="inputPartsPrice"
                                                        label="Total Parts Price"
                                                        placeholder="Total Parts"
                                                        onChange={this.handleInputChange}
                                                    />
                                                </Col>
                                            </div>
                                            <div className="form-row">
                                                <Col size="12">
                                                    <Input
                                                        type="input"
                                                        name="laborPrice"
                                                        id="inputLaborPrice"
                                                        label="Total Service Price"
                                                        placeholder="Total Service"
                                                        onChange={this.handleInputChange}
                                                    />
                                                </Col>
                                                <Col size="12">
                                                    <BlueBtn
                                                        type="button"
                                                        className="btn btn-block"
                                                        onClick={this.calculateGrandTotal}
                                                        children="Calculate Grand Total"
                                                    />
                                                </Col>
                                            </div>
                                        </Col>
                                        <Col size="sm-3">
                                            <div className="form-row">
                                                <Col size="12">
                                                    <Input
                                                        type="input"
                                                        name="totalPrice"
                                                        id="inputTotalPrice"
                                                        label="Total Pre-Tax"
                                                        placeholder="Total Pre-Tax"
                                                        disabled
                                                        value={this.state.totalPrice}
                                                        onChange={this.handleInputChange}
                                                    />
                                                </Col>
                                            </div>
                                            <div className="form-row">
                                                <Col size="12">
                                                    <Input
                                                        type="input"
                                                        name="tax"
                                                        id="inputTax"
                                                        label="Tax"
                                                        placeholder="Tax"
                                                        onChange={this.handleInputChange}
                                                    />
                                                </Col>
                                            </div>
                                            <div className="form-row">
                                                <Col size="12">
                                                    <Input
                                                        type="input"
                                                        name="grandTotal"
                                                        id="grandTotal"
                                                        label="Grand Total"
                                                        placeholder="Grand Total"
                                                        value={this.state.grandTotal}
                                                        onChange={this.handleInputChange}
                                                    />
                                                </Col>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </form>

                            <h3 style={{ marginTop: 30 }}>Customer:</h3>
                            <CustomerFormSatic
                                customer={this.state.customerData}
                            />
                        </Col>
                    </Row>
                    <Col size="md-1" />
                </Container >
            </div>
        )
    };

}

export default Transaction;
