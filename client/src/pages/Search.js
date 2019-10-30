import React from "react";
import { Redirect } from "react-router-dom";
import LoadingMsg from "../components/LoadingMsg";
import { Col, Row, Container } from "../components/Grid";
import { Radio, Input, OjBtn } from "../components/Form";
import Table from "../components/Table";
import { ErrorModal } from "../components/Errors";
// import SortableTable1 from "../components/SortableTable1";
import API from "../utils/API";


class Search extends React.Component {

  state = {
    err: "",
    searchType: "",
    firstName: "",
    lastName: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    plateNumber: "",
    tableHeads: [],
    tableData: [],
    user: undefined,
    loaded: false
  };

  checkLoginStatus = () => {
    API.userLoginCheck()
      .then(resp => {
        console.log(resp.data);
        this.setState({
          user: resp.data.user,
          loaded: true
        })
      })
  };

  // When a form field's value changes, update state to reflect that
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // Function to set the type of search (customer vs. vehicle)
  setSearchType = event => {
    const { value } = event.target;
    // Change the array of table headers based on the value of the radio button clicked
    // (specifically whether it's true if the value is customer)
    let headArray = value === "customer" ? ["id", "firstName", "lastName", "phone"] : ["id", "make", "model", "year", "plateNumber"];
    // Push the header array into state
    this.setState({
      searchType: value,
      tableHeads: headArray
    });
  };

  // Function to hide the error message
  hideError = () => {
    // Simply reset the err in state to empty
    this.setState({
      err: ""
    })
  }

  // Function to handle the search on button click
  handleSearch = event => {
    event.preventDefault();
    // Declare an object to serve as a set of query params
    let queryParams = {};
    // If the searchType state attribute is set to customer...
    // (i.e., the query needs to be routed to the Customers table)
    if (this.state.searchType === "customer") {
      // Then test to see which of the form fields had data entered (and is therefore stored in state)
      // For each one that did, push it into the query params
      // (be sure to trim it in case there is some errant white space)
      if (this.state.firstName) queryParams.firstName = this.state.firstName.trim();
      if (this.state.lastName) queryParams.lastName = this.state.lastName.trim();
      if (this.state.phone) queryParams.phone = this.state.phone.trim();
      console.log(queryParams);
      // Once the query params are set, send out an api call to get the customer(s) by those params
      API.getCustomersByParams(queryParams)
        // Once the response data has returned...
        .then(data => {
          // If there is data inside the response's {data} property...
          if (data.data.length > 0) {
            console.log(data.data)
            // Create an array to house the data (which as of now is stored in JSON
            let customerData = [];
            // Map each customer's data into the tableData in state;
            data.data.map(customer => {
              return customerData.push(customer);
            });
            // Set the table data in state to hold the mapped array
            this.setState({
              tableData: customerData
            });
          }
          // Otherwise, no data was returned on the search, so...
          else {
            // Empty the table data from state and set an error message
            this.setState({
              tableData: [],
              err: "No customers were found with those search parameters."
            });
          }
        })
    }
    // Otherwise, if the searchType state attribute is set to vehicle...
    // (i.e., the query needs to be routed to the Vehicles table)
    else if (this.state.searchType === "vehicle") {
      // Then test to see which of the form fields had data entered (and is therefore stored in state)
      // For each one that did, push it into the query params
      // (be sure to trim it in case there is some errant white space)
      if (this.state.make) queryParams.make = this.state.make.trim();
      if (this.state.model) queryParams.model = this.state.model.trim();
      if (this.state.year) queryParams.year = this.state.year.trim();
      if (this.state.plateNumber) queryParams.plateNumber = this.state.plateNumber.trim();
      console.log(queryParams);
      // Once the query params are set, send out an api call to get the customer(s) by those params
      API.acquireVehiclesByParams(queryParams)
        // Once the response data has returned...
        .then(data => {
          // If there is data inside the response's {data} property...
          if (data.data.length > 0) {
            console.log(data.data);
            // Create an array to house the data (which as of now is stored in JSON
            let vehicleData = [];
            // Map each customer's data into the tableData in state;
            data.data.map(vehicle => {
              return vehicleData.push(vehicle);
            });
            // Set the table data in state to hold the mapped array
            this.setState({
              tableData: vehicleData
            });
          }
          // Otherwise, no data was returned on the search, so...
          else {
            // Empty the table data from state and set an error message
            this.setState({
              tableData: [],
              err: "No vehicles were found with those search parameters."
            });
          }
        })
    }
    // Otherwise, if neither of the two conditions above are satisfied
    // Then the user forgot to select a search type
    else {
      // Empty the table data from state and set an error message
      this.setState({
        tableData: [],
        err: "Please indicate whether you would like to search for vehicles or customers."
      });
    }
  };

  componentDidMount() {
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
            <Col size="md-12">
              <h1 style={{ textAlign: "center", margin: "50px auto" }}>Search Database</h1>
            </Col>
          </Row>
          <Row>
            <Col size="md-1" />
            <Col size="md-10" style={{ marginBottom: "50px" }}>
              <h3>Search by:</h3>
              <form>
                <OjBtn
                  type="submit"
                  className="btn btn-block"
                  onClick={this.handleSearch}
                >Search</OjBtn>
                <Radio
                  name="searchType"
                  id="customerRadio"
                  value="customer"
                  label="Customer"
                  onClick={this.setSearchType}
                />
                <Radio
                  name="searchType"
                  id="vehicleRadio"
                  value="vehicle"
                  label="Vehicle"
                  onClick={this.setSearchType}
                />
                <div className="form-row" style={{ marginTop: "30px" }}>
                  <Col size="sm-4">
                    <Input
                      type="input"
                      name="firstName"
                      id="inputFirstName"
                      label="First Name"
                      placeholder="First Name"
                      disabled={!(this.state.searchType === "customer")}
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
                      disabled={!(this.state.searchType === "customer")}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                  <Col size="sm-4">
                    <Input
                      type="input"
                      name="phone"
                      id="inputPhone"
                      label="Phone Number"
                      placeholder="Phone Number"
                      disabled={!(this.state.searchType === "customer")}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                </div>
                <div className="form-row" style={{ marginTop: "20px" }}>
                  <Col size="sm-3">
                    <Input
                      type="input"
                      name="make"
                      id="inputMake"
                      label="Make"
                      placeholder="Make"
                      disabled={!(this.state.searchType === "vehicle")}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                  <Col size="sm-3">
                    <Input
                      type="input"
                      name="model"
                      id="inputModel"
                      label="Model"
                      placeholder="Model"
                      disabled={!(this.state.searchType === "vehicle")}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                  <Col size="sm-3">
                    <Input
                      type="input"
                      name="year"
                      id="inputYear"
                      label="Year"
                      placeholder="Year"
                      disabled={!(this.state.searchType === "vehicle")}
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
                      disabled={!(this.state.searchType === "vehicle")}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                </div>
              </form>
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

export default Search;
