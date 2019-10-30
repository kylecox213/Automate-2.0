import React from "react";
import { Redirect } from "react-router-dom";
import LoadingMsg from "../components/LoadingMsg";
import { Col, Row, Container } from "../components/Grid";
import { ErrorModal } from "../components/Errors";
import { Input, TextArea, RedBtn, OjBtn, BlueBtn } from "../components/Form";
import CustomerFormStatic from "../components/CustomerFormStatic";
import DatePicker from "react-datepicker";
import API from "../utils/API";
import "react-datepicker/dist/react-datepicker.css";

class Transaction extends React.Component {

  state = {
    editTransaction: false,
    vehicleId: undefined,
    vehicleData: {},
    customerId: undefined,
    customerData: {},
    date: undefined,
    serviceDesc: "",
    partsPrice: undefined,
    laborPrice: undefined,
    totalPrice: undefined,
    tax: undefined,
    grandTotal: undefined,
    err: "",
    transactionId: undefined,
    transaction: {},
    redirect: false
  }

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
      partsPrice: this.reformatPriceForDB(this.state.partsPrice),
      laborPrice: this.reformatPriceForDB(this.state.laborPrice),
      totalPrice: this.reformatPriceForDB(this.state.totalPrice),
      tax: this.reformatPriceForDB(this.state.tax),
      grandTotal: this.reformatPriceForDB(this.state.grandTotal)
    };
    console.log(transactionData);
    return transactionData;
  };

  validInput = () => {
    // Display an error message if any of the following is true
    // There is nothing entered into the parts or labor price fields
    if (!this.state.laborPrice || !this.state.partsPrice) {
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

  reformatPriceForDB = price => {
    console.log(price);
    let cents = parseInt(price * 100);
    console.log(cents);
    return cents;
  };

  reformatPriceForDisplay = cents => {
    console.log(cents);
    let price = parseInt(cents / 100);
    console.log(price);
    return price;
  };

  toggleTransactionEdit = (event) => {
    event.preventDefault();
    this.setState({
      editTransaction: !this.state.editTransaction
    });
  };

  updateTransaction = (event) => {
    event.preventDefault();
    // Package the Transaction data from state
    let updateData = this.packageTransactionData();
    // Then send an update PUT request to the DB
    API.updateThisTransaction(this.state.transactionId, updateData)
      .then(updated => {
        console.log(updated);
        API.getThisTransaction(this.state.transactionId)
          .then(transaction => {
            this.setState({
              transaction: transaction.data,
              transactionId: transaction.data.id,
              odometer: transaction.data.odometer,
              date: new Date(transaction.data.date),
              serviceDesc: transaction.data.serviceDesc,
              partsPrice: this.reformatPriceForDisplay(transaction.data.partsPrice),
              laborPrice: this.reformatPriceForDisplay(transaction.data.laborPrice),
              totalPrice: this.reformatPriceForDisplay(transaction.data.totalPrice),
              tax: this.reformatPriceForDisplay(transaction.data.tax),
              grandTotal: this.reformatPriceForDisplay(transaction.data.grandTotal),
              editTransaction: false
            });
          });
      });
  };

  deleteTransaction = (event) => {
    event.preventDefault();
    console.log("Deleting this transaction...");
    console.log("ID#: " + this.state.transactionId);
    API.deleteThisTransaction(this.state.transactionId)
      .then(deleted => {
        this.setState({
          redirect: true
        })
        console.log("Transaction deleted from database. Redirecting to customer page.");
      }).catch(err => console.log(err));
  };

  setInitialState = () => {
    console.log(this.props.location.state.transactionId)
    // First retrieve the transaction from the DB using the id passed to the page
    API.getThisTransaction(this.props.location.state.transactionId)
      .then(transaction => {
        // If there's a response...
        if (transaction) {
          console.log("Transaction data:")
          console.log(transaction);
          // Create a promise array for the other two API calls
          let promises = [];
          let customerPromise = API.getCustomerById(transaction.data.CustomerId);
          let vehiclePromise = API.getThisVehicle(transaction.data.VehicleId);
          promises.push(customerPromise);
          promises.push(vehiclePromise);
          // Send both out; when the data return from both...
          Promise.all(promises).then(data => {
            // An array of promises come back in the same order they were issued (by index)
            // So customer will be first and vehicle second
            let customer = data[0];
            let vehicle = data[1];
            console.log("Transaction customer:")
            console.log(customer);
            console.log("Transaction vehicle:")
            console.log(vehicle);
            // Now set the local state to contain all the data needed for the page
            this.setState({
              transaction: transaction.data,
              transactionId: transaction.data.id,
              customerId: customer.data.id,
              customerData: customer.data,
              vehicleData: vehicle.data,
              vehicleId: parseInt(this.props.location.state.vehicleId),
              odometer: transaction.data.odometer,
              date: new Date(transaction.data.date),
              serviceDesc: transaction.data.serviceDesc,
              partsPrice: this.reformatPriceForDisplay(transaction.data.partsPrice),
              laborPrice: this.reformatPriceForDisplay(transaction.data.laborPrice),
              totalPrice: this.reformatPriceForDisplay(transaction.data.totalPrice),
              tax: this.reformatPriceForDisplay(transaction.data.tax),
              grandTotal: this.reformatPriceForDisplay(transaction.data.grandTotal),
            });
          })
        }
      });
  };

  componentDidMount() {
    setTimeout(() => {
      this.setInitialState();
      this.checkLoginStatus();
    }, 100)
  }


  render() {


    if (!this.state.loaded) {
      return (<LoadingMsg />)
    }


    if (this.state.loaded && !this.state.user) {
      return (
        <Redirect to="/" />
      )
    }

    const { redirect } = this.state;
    if (redirect) {
      return (
        <Redirect
          to={{
            // To the customer page for this specific customer
            pathname: `/app/customer/${this.state.customerId}`,
            // Also pass the customer data to that page
            state: { customerId: this.state.customerId }
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
                      Vehicle Serviced:
                    </p>
                    {
                      // Is there anything inside the state's vehicles array?
                      this.state.vehicleData ? (
                        // If there is, create a select menu with a default option
                        <select
                          style={{ marginBottom: 50 }}
                          name="vehicleId"
                          onChange={this.handleInputChange}
                          disabled>
                          <option key={this.state.vehicleData.id} value={this.state.vehicleData.id}>
                            {this.state.vehicleData.year} {this.state.vehicleData.make} {this.state.vehicleData.model} | Plate #: {this.state.vehicleData.plateNumber}
                          </option>
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
                      disabled={!this.state.editTransaction}
                    />
                  </Col>

                  <Col size="sm-2">
                    <Input
                      type="input"
                      name="odometer"
                      id="odometer"
                      label="Odometer"
                      placeholder="Miles"
                      value={this.state.odometer}
                      onChange={this.handleInputChange}
                      disabled={!this.state.editTransaction}
                    />
                  </Col>
                  <Col size="sm-3">
                    <Row>
                      <Col size="6">
                        <OjBtn
                          type="submit"
                          className="btn btn-block"
                          onClick={this.state.editTransaction ? this.updateTransaction : this.toggleTransactionEdit}
                          children={this.state.editTransaction ? "Save" : "Edit"}
                        />
                      </Col>
                      <Col size="6">
                        <RedBtn
                          type="submit"
                          className="btn btn-block"
                          onClick={this.deleteTransaction}
                          children="Delete"
                        />
                      </Col>
                    </Row>
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
                            value={this.state.serviceDesc}
                            onChange={this.handleInputChange}
                            disabled={!this.state.editTransaction}
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
                            value={this.state.partsPrice}
                            onChange={this.handleInputChange}
                            disabled={!this.state.editTransaction}
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
                            value={this.state.laborPrice}
                            onChange={this.handleInputChange}
                            disabled={!this.state.editTransaction}
                          />
                        </Col>
                        <Col size="12">
                          <BlueBtn
                            type="button"
                            className="btn btn-block"
                            onClick={this.calculateGrandTotal}
                            children="Calculate Grand Total"
                            disabled={!this.state.editTransaction}
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
                            value={this.state.tax}
                            onChange={this.handleInputChange}
                            disabled={!this.state.editTransaction}
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
                            disabled={!this.state.editTransaction}
                          />
                        </Col>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </form>

              <h3 style={{ marginTop: 30 }}>Customer:</h3>
              <CustomerFormStatic
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
