import React from "react";
import { Redirect } from "react-router-dom";
import LoadingMsg from "../components/LoadingMsg";
import { Col, Row, Container } from "../components/Grid";
import { Input, OjBtn, BlueBtn } from "../components/Form";
import VehicleFormEditable from "../components/VehicleFormEditable";
import CustomerFormStatic from "../components/CustomerFormStatic";
import API from "../utils/API";

class Vehicle extends React.Component {

  state = {
    editVehicle: false,
    addType: "",
    vehicle: "",
    vehicleId: "",
    make: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
    vin: "",
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    unit: "",
    city: "",
    state: "",
    zip: "null",
    phone: "",
    email: ""
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

  handleInputChange = event => {
    const { objname, name, value } = event.target;
    if (objname === "vehicle") {
      this.setState({
        vehicle: { [name]: value }
      });
    }
  };

  toggleVehicleEdit = (event) => {
    event.preventDefault();
    this.setState({
      editVehicle: !this.state.editVehicle
    });
  };

  pullVehicleData = (vehicleId) => {
    API.getThisVehicle(vehicleId)
      .then(res => {
        let vehicle = (res.data);
        console.log(vehicle);
        API.getCustomerById(vehicle.CustomerId)
          .then(res => {
            let customer = (res.data);
            console.log(customer);
            console.log(vehicle);
            console.log(vehicleId);
            this.setState({
              vehicleId: vehicleId,
              vehicle: vehicle,
              customer: customer
            });
          })
      });
  };


  componentDidMount() {

    this.pullVehicleData(this.props.location.state.vehicleId);
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
            <h1 style={{ textAlign: "center", margin: "10px auto 30px" }}>Vehicle Information</h1>
          </Col>
        </Row>
        <Row style={{ marginTop: 30 }}>
          <Col size="md-1" />
          <Col size="md-10" style={{ marginBottom: "100px" }}>
            <VehicleFormEditable vehicle={this.state.vehicle} />
          </Col>
          <Col size="md-1" />
        </Row>
        <Row style={{ marginBottom: "100px" }}>
          <Col size="md-1" />
          <Col size="md-10" style={{ marginTop: "100px" }} >
          <h3 style={{ marginTop: 30 }}>Customer:</h3>
            <CustomerFormStatic customer={this.state.customer} />
          </Col>
          <Col size="md-1" />
        </Row>
      </Container>
    )
  };

}

export default Vehicle;
