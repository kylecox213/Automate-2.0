import React from "react";
import { Redirect } from "react-router-dom";
import LoadingMsg from "../components/LoadingMsg";
import { Col, Row, Container } from "../components/Grid";
import { Link } from "react-router-dom";
import { BlueBtn } from "../components/Form";
import CustomerFormEditable from "../components/CustomerFormEditable";
import VehicleFormEditable from "../components/VehicleFormEditable";
import VehicleFormAddNew from "../components/VehicleFormAddNew";
import API from "../utils/API";


class Customer extends React.Component {

  state = {
    vehicles: [],
    editVehicle: false,
    customerId: null,
    customerData: {}
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

  // When a form field's value changes, update state to reflect that
  handleInputChange = event => {
    const { objName, name, value } = event.target;
    if (objName === "customer") {
      this.setState({
        [name]: value
      });
    }
  };

  // Button click event for the vehicle EDIT button
  // Turns on/off the 'disabled' prop for form fields, thereby enabling
  // users to edit the information
  toggleVehicleEdit = (event) => {
    event.preventDefault();
    this.setState({
      editVehicle: !this.state.editVehicle
    });
  };

  // Function to pull the customer's vehicles from the DB by customer id
  pullVehicleData = (customerId) => {
    // Grab the vehicles from the database by feeding in the customer id
    API.getVehicleByParams(customerId)
      // When the response comes back...
      .then(res => {
        // Define an array to store the data inside, which will later be set to state
        let vehicles = [];
        // If the data property has anything in it...
        if (res.data) {
          // Loop through the set of keys in the response object
          for (let i = 0; i < Object.keys(res.data).length; i++) {
            // Push the corresponding sub-object from the data into the state vehicles array
            vehicles.push(res.data[i]);
          };
        }
        // Stuff both of them into state
        this.setState({
          vehicles: vehicles
        });
      }).catch(error => console.log(error));
  };

  // Function to set the customer state with the current contents of the DB
  setCustomerState = () => {
    let customerId = this.props.location.state.customerId;
    // Pull customer data from the API based on the id passed in through props on the component
    API.getCustomerById(customerId)
      .then(customer => {
        // If customer data returns...
        if (customer.data) {
          console.log("Customer.data post api call")
          console.log(customer.data)
          // Set the state variables
          this.setState({
            customerId: customerId,
            customerData: customer.data
          })
        }
      }).catch(error => console.log(error));
    // Also pull the vehicle data from the API basedon the customer id
    this.pullVehicleData(customerId);
  };

  // When the component mounts...
  componentDidMount() {
    // Grab all the data needed to set the initial state and set it
    this.setCustomerState();
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
      <Container fluid>

        <Row>
          <Col size="md-12">
            <h1 style={{ textAlign: "center", margin: "10px auto 30px" }}>Customer Information</h1>
          </Col>
        </Row>
        <Row>
          <Col size="md-1" />
          <Col size="md-10" style={{ marginBottom: "50px" }}>
              <CustomerFormEditable customer={this.state.customerData} customerUpdate={this.setCustomerState}/>
            <Row>
              <Col size="6">
                <BlueBtn
                  style={{ textAlign: "center", margin: "auto" }}
                  type="submit"
                  className="btn btn-block"
                  onClick={this.handleInputChange}
                >
                  <Link
                    style={{ color: "inherit", textDecoration: "inherit" }}
                    to={{
                      pathname: "/app/addtransaction",
                      state: { customerId: this.state.customerId, customerData: this.state.customerData, vehicles: this.state.vehicles }
                    }}>
                    Add Transaction
                  </Link>
                </BlueBtn>
              </Col>
              <Col size="6">

                <BlueBtn
                  style={{ textAlign: "center", margin: "auto" }}
                  type="submit"
                  className="btn btn-block"
                  onClick={this.handleInputChange}
                >
                  <Link
                    style={{ color: "inherit", textDecoration: "inherit" }}
                    to={{
                      pathname: `/app/history/customer/${this.state.customerId}`,
                      state: { customerId: this.state.customerId, customerData: this.state.customerData }
                    }}>
                    View Transactions
                  </Link>
                </BlueBtn>
              </Col>
            </Row>
            <h3 style={{ margin: "50px auto 20px" }}>Vehicle(s):</h3>
            { // Is there anything inside the state's vehicles array?
              this.state.vehicles ? (
                // If there is, map those vehicles and return an editable vehicle form for each
                this.state.vehicles.map(vehicle => {
                  return <VehicleFormEditable key={vehicle.id} update={this.pullVehicleData} customerId={this.state.customerId} vehicle={vehicle} />
                })) :
                // If there isn't, return an empty div
                <div></div>
            }
            <VehicleFormAddNew update={this.pullVehicleData} customerId={this.state.customerId} />
          </Col>
          <Col size="md-1" />
        </Row>
      </Container >
    )
  };

}

export default Customer;
