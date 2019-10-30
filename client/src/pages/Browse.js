import React from "react";
import { Redirect } from "react-router-dom";
import LoadingMsg from "../components/LoadingMsg";
import { Col, Row, Container } from "../components/Grid";
import Table from "../components/Table";
import { OjBtn } from "../components/Form";
import API from "../utils/API";


class Browse extends React.Component {

  state = {
    filter: "",
    tableHeads: "",
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

  setFilter = event => {
    const { value } = event.target;
    let headArray = value === "customer" ? ["firstName", "lastName", "phone"] : value === "vehicle" ? ["make", "model", "year", "plateNumber"] : ["date", "totalPrice", "CustomerId"];
    this.setState({
      filter: value,
      tableHeads: headArray
    });
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
      <Container fluid>
        <Row>
          <Col size="md-12">
            <h1 style={{ textAlign: "center", margin: "50px auto" }}>Filter Options</h1>
          </Col>
        </Row>
        <Row>
          <Col size="4">
            <OjBtn
              value="customer"
              onClick={this.setFilter}
            >Customers</OjBtn>
          </Col>
          <Col size="4">
            <OjBtn
              value="vehicle"
              onClick={this.setFilter}
            >Vehicles</OjBtn>
          </Col>
          <Col size="4">
            <OjBtn
              value="transaction"
              onClick={this.setFilter}
            >Transactions</OjBtn>
          </Col>
        </Row>
        <Row>
          <Col size="md-2" />
          <Col size="md-8">
            <Table
              heads={this.state.tableHeads}
              data={this.state.tableData}
              pathType={this.state.filter}
            />
          </Col>
          <Col size="md-2" />
        </Row>
      </Container>
    );
  }
}

export default Browse;
