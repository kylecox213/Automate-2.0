import React from "react";
import LoadingMsg from "../components/LoadingMsg";
import { Redirect } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { Input, OjBtn } from "../components/Form";
import API from "../utils/API";

class Homepage extends React.Component {

  state = {
    redirect: false,
    redirectId: null,
    redirectData: {},
    addType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    make: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
    vin: ""
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


  // Work in progress function for handling errors
  handleError = err => {
    console.log(err);
  };

  // When a form field's value changes, update state to reflect that
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };


  // -------------------------------------------
  // Validation functions for customer data input


  // Check the phone number, reformat it to fit our preferred storage specs
  // Work in progress, not implemented at present
  reformatPhone = phone => {
    console.log("Reformatting phone number");
    console.log("Phone number prior to reformat: " + phone);
    console.log(phone.split(" ", "(", ")", "-").join());
    return phone.split(" ", "(", ")", "-").join();
  };


  // Function to validate length and reformat state var into all caps
  validateReformatState = state => {
    // If the length of the string is anything but 2
    if (state.length !== 2) {
      // It's an invalid state abbreviation; throw an error
      throw new Error("Please use a two-character state abbreviation.");
    }
    else {
      // Otherwise, it's valid; make sure it's all uppercase
      return state.toUpperCase();
    }
  };


  // -------------------------------------------
  // Validation functions for vehicle data input


  // Function to validate VIN length and make sure it's stored as an integer
  validateReformatVin = vin => {
    console.log("Validating VIN data and format");
    if (vin.length !== 17) {
      console.log("Invalid format, throwing error");
      throw new Error("VIN number must be 17 digits in length.");
    }
    else {
      console.log("Valid format, parsing data to integer");
      return parseInt(vin);
    }
  };

  // Function to validate year length and make sure it's stored as an integer
  validateReformatYear = year => {
    console.log("Validating year data and format");
    if (year.length !== 4) {
      console.log("Invalid format, throwing error");
      throw new Error("Year must have four digits.");
    }
    else {
      console.log("Valid format, parsing data to integer");
      return parseInt(year);
    }
  }


  // -------------------------------------------
  // Functions for data prep for DB


  // Function to package customer data from form fields
  packageCustomerData = () => {
    console.log("Packing up the customer information.")
    let customerData = {
      firstName: this.state.firstName,
      middleName: this.state.middleName,
      lastName: this.state.lastName,
      address: this.state.address,
      unit: this.state.unit,
      city: this.state.city,
      state: this.validateReformatState(this.state.state),
      zipCode: this.state.zipCode,
      // phone: this.reformatPhone(this.state.phone),
      phone: this.state.phone,
      email: this.state.email
    };
    console.log(customerData);
    return customerData;
  };

  // Function to package vehicle data from form fields
  packageVehicleData = () => {
    console.log("Packing up the vehicle information.")
    let vehicleData = {
      make: this.state.make,
      model: this.state.model,
      year: this.validateReformatYear(this.state.year),
      color: this.state.color,
      plateNumber: this.state.plateNumber,
      vin: this.state.vin
    };
    console.log(vehicleData);
    return vehicleData;
  };


  // -------------------------------------------
  // Data wrangling functions


  // Check to see if vehicle data was entered on the form before submission
  // Returns a boolean indicator
  vehicleDataProvided = () => {
    if (this.state.make && this.state.model && this.state.year) {
      return true;
    }
    return false;
  }

  // Button click function for Add Customer
  handleData = event => {
    event.preventDefault();
    console.log("Save button clicked, handling data.")
    // Query the DB for a Customer with the given parameters
    API.getCustomerByParams(this.state.firstName, this.state.lastName, this.state.phone)
      // Once the query response has returned...
      .then(customer => {
        console.log("Response received from the DB");
        console.log(customer.data);
        // If no customer data is returned from the DB...
        if (!customer.data) {
          console.log("No customer returned from DB");
          // Then package the customer data from state
          let customerData = this.packageCustomerData();
          // If vehicle data was provided on the submit form...
          if (this.vehicleDataProvided()) {
            console.log("Vehicle data was provided");
            // Then package the vehicle data from state
            let vehicleData = this.packageVehicleData();
            console.log("Vehicle data packaged.")
            // Add the Customer to the DB and use the sequelize magic method to create the Vehicle along with their association
            API.addNewCustomerWithVehicle(customerData, vehicleData)
              .then(data => {
                console.log("Successfully added both customer and vehicle");
                console.log(data.data);
                if (data.data) {
                  this.setState({
                    redirect: true,
                    redirectId: data.data.id
                  });
                }
              })
          }
          // Otherwise, no vehicle data was provided, so...
          else {
            // Just add a new Customer to the DB
            API.addNewCustomer(customerData)
              .then(customer => {
                console.log(customer);
                if (customer.data) {
                  this.setState({
                    redirect: true,
                    redirectId: customer.data.id
                  });
                }
              });
          }
        }
        else {
          // Handle the error message to the client
          this.handleError("This customer is already in the database.");
        }
      });
  };


  componentDidMount() {
    this.checkLoginStatus();
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


    // Refer to the redirect-related variables in state
    const { redirect, redirectId } = this.state;
    // If redirect is true (that is, we've got some customer data that's been posted)
    if (redirect) {
      // Then return a redirect component
      return < Redirect to={{
        // To the customer page for this specific customer
        pathname: `/app/customer/${redirectId}`,
        // Also pass the customer data to that page
        state: { customerId: redirectId }
      }}
      />
    }


    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <h1 style={{ textAlign: "center", margin: "10px auto" }}>New Customer</h1>
          </Col>
        </Row>
        <Row>
          <Col size="md-1" />
          <Col size="md-10" style={{ marginBottom: "50px" }}>
            <form>
              <div className="form-row" style={{ marginTop: "30px" }}>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="firstName"
                    id="inputFirstName"
                    label="First Name"
                    placeholder="First Name"
                    onChange={this.handleInputChange}
                    required
                  />
                </Col>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="middleName"
                    id="inputMiddleName"
                    label="Middle Name"
                    placeholder="Middle Name"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="lastName"
                    id="inputLastName"
                    label="Last Name"
                    placeholder="Last Name"
                    onChange={this.handleInputChange}
                    required
                  />
                </Col>
              </div>
              <div className="form-row" style={{ marginTop: "30px" }}>
                <Col size="sm-8">
                  <Input
                    type="input"
                    name="address"
                    id="inputAddress"
                    label="Street Address"
                    placeholder="Street Address"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="unit"
                    id="inputUnit"
                    label="Apt./Unit"
                    placeholder="Apt./Unit"
                    onChange={this.handleInputChange}
                  />
                </Col>
              </div>
              <div className="form-row" style={{ marginTop: "30px" }}>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="city"
                    id="inputCity"
                    label="City/County"
                    placeholder="City/County"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-1">
                  <Input
                    type="input"
                    name="state"
                    id="inputState"
                    label="State"
                    placeholder="State"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-1">
                  <Input
                    type="input"
                    name="zipCode"
                    id="inputZipCode"
                    label="Zip"
                    placeholder="Zip"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-2">
                  <Input
                    type="input"
                    name="phone"
                    id="inputPhone"
                    label="Phone Number"
                    placeholder="Phone Number"
                    onChange={this.handleInputChange}
                    required
                  />
                </Col>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="email"
                    id="inputEmail"
                    label="Email"
                    placeholder="Email"
                    onChange={this.handleInputChange}
                  />
                </Col>
              </div>
            </form>
            <form>
              <div className="form-row" style={{ marginTop: "70px" }}>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="make"
                    id="inputMake"
                    label="Make"
                    placeholder="Make"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="model"
                    id="inputModel"
                    label="Model"
                    placeholder="Model"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="year"
                    id="inputYear"
                    label="Year"
                    placeholder="Year"
                    onChange={this.handleInputChange}
                  />
                </Col>
              </div>
              <div className="form-row" style={{ marginTop: "30px" }}>
                <Col size="sm-3">
                  <Input
                    type="input"
                    name="color"
                    id="inputColor"
                    label="Color"
                    placeholder="Color"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-3">
                  <Input
                    type="input"
                    name="plateNumber"
                    id="inputPlateNumber"
                    label="Plate Number"
                    placeholder="Plate Number"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-4">
                  <Input
                    type="input"
                    name="vin"
                    id="inputVin"
                    label="VIN"
                    placeholder="VIN"
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col size="sm-2">
                  <OjBtn
                    type="submit"
                    className="btn btn-block"
                    onClick={this.handleData}
                  >Add Customer</OjBtn>
                </Col>
              </div>
            </form>
          </Col>
          <Col size="md-1" />
        </Row>
      </Container >
    )
  };

}

export default Homepage;
