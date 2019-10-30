import React from "react";
import { Redirect } from "react-router-dom";
import LoadingMsg from "../components/LoadingMsg";
import { Col, Row, Container } from "../components/Grid";
import { Input, Radio } from "../components/Form";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";


class Report extends React.Component {

  state = {
    startDate: "",
    endDate: "",
    salesResolution: "",
    revenueResolution: "",
    blob: ""
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
    const { name, value } = event.target;
    this.setState({
      [name]: value
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

    return (
      <Container fluid>
        <Row>
          <Col size="md-4" />
          <Col size="md-4">
            <h1 style={{ textAlign: "center", margin: "10px auto" }}>Generate Report</h1>
          </Col>
          <Col size="md-4" />
        </Row>
        <Row>
          <Col size="md-2" />
          <Col size="md-8" style={{ marginBottom: "60px" }}>
            <Jumbotron>
              <form>
                <h3 style={{ textAlign: "center", margin: "10px auto" }}>Date Range:</h3>
                <Row>
                  <Col size="md-4" />
                  <Col size="md-2" style={{ float: "left", marginBottom: "50px" }}>
                    <Input
                      type="input"
                      name="startDate"
                      id="inputStartDate"
                      label="Start Date"
                      placeholder="Start Date"
                      onChange={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-2" style={{ float: "left", marginBottom: "50px" }}>
                    <Input
                      type="input"
                      name="endDate"
                      id="inputEndDate"
                      label="End Date"
                      placeholder="End Date"
                      onChange={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-4" />
                </Row>
                <h3 style={{ textAlign: "center", margin: "10px auto" }}></h3>
                <Row>
                  <Col size="md-4" />
                  <Col size="md-2" >
                    <h3 style={{ textAlign: "left", margin: "10px auto", fontSize: "18px" }}>Sales:</h3>
                  </Col>
                  <Col size="md-2" >
                    <h3 style={{ textAlign: "left", margin: "10px auto", fontSize: "18px" }}>Revenue:</h3>
                  </Col>
                  <Col size="md-4" />
                </Row>
                <Row>
                  <Col size="md-4" />
                  <Col size="md-2" style={{ float: "center", marginBottom: "50px" }}>
                    <Radio
                      name="reportType"
                      id="reportRadio"
                      value="salesByDate"
                      label="By Date"
                      onClick={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-2" style={{ float: "center", marginBottom: "50px" }}>
                    <Radio
                      name="reportType"
                      id="reportRadio"
                      value="revenueByDate"
                      label="By Date"
                      onClick={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-4" />
                </Row>
                <Row>
                  <Col size="md-4" />
                  <Col size="md-2" style={{ float: "center", marginBottom: "50px" }}>
                    <Radio
                      name="reportType"
                      id="reportRadio"
                      value="salesByWeek"
                      label="By Week"
                      onClick={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-2" style={{ float: "center", marginBottom: "50px" }}>
                    <Radio
                      name="reportType"
                      id="reportRadio"
                      value="revenueByWeek"
                      label="By Week"
                      onClick={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-4" />
                </Row>
                <Row>
                  <Col size="md-4" />
                  <Col size="md-2" style={{ float: "center", marginBottom: "50px" }}>
                    <Radio
                      name="reportType"
                      id="reportRadio"
                      value="salesByMonth"
                      label="By Month"
                      onClick={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-2" style={{ float: "center", marginBottom: "50px" }}>
                    <Radio
                      name="reportType"
                      id="reportRadio"
                      value="revenueByMonth"
                      label="By Month"
                      onClick={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-4" />
                </Row>
                <Row style={{ marginBottom: "50px" }}>
                  <Col size="md-4" />
                  <Col size="md-2" style={{ float: "center", marginBottom: "50px" }}>
                    <Radio
                      name="reportType"
                      id="reportRadio"
                      value="salesSummary"
                      label="Summary Total"
                      onClick={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-2" style={{ float: "center", marginBottom: "50px" }}>
                    <Radio
                      name="reportType"
                      id="reportRadio"
                      value="revenueSummary"
                      label="Summary Total"
                      onClick={this.handleInputChange}
                    />
                  </Col>
                  <Col size="md-4" />
                </Row>
              </form>
            </Jumbotron>
          </Col>
          <Col size="md-2" />
        </Row>
      </Container>
    )
  };
}

export default Report;