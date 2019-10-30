import React from "react";
import { Row, Col } from "../Grid";
import { Input, OjBtn } from "../Form";
import API from "../../utils/API";

class VehicleFormEditable extends React.Component {

    state = {
        id: null,
        model: "",
        make: "",
        year: "",
        color: "",
        plateNumber: "",
        vin: "",
    };

    // When a form field's value changes, update state to reflect that
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    // Button click event for the Vehicle SAVE button
    // This method is only called when the form fields are enabled
    addNewVehicle = event => {
        event.preventDefault();
        // Package the Vehicle data from state
        let newVehicle = this.packageVehicleData();
        // Then send an update POST request to the DB
        API.addNewVehicle(newVehicle)
            .then(vehicleAdded => {
                this.props.update(this.props.customerId);
                this.setState({
                    id: null,
                    model: "",
                    make: "",
                    year: "",
                    color: "",
                    plateNumber: "",
                    vin: "",
                });
            });
    };

    // Small function to package up the Vehicle data in state for movement to the DB
    packageVehicleData = () => {
        let VehicleData = {
            model: this.state.model,
            make: this.state.make,
            year: this.validateReformatYear(this.state.year),
            color: this.state.color,
            plateNumber: this.state.plateNumber,
            vin: this.state.vin,
            CustomerId: this.props.customerId
        };
        return VehicleData;
    };

    validateReformatVin = vin => {
        console.log("Validating VIN data");
        if (vin.length !== 17) {
            console.log("Invalid format, throwing error");
            throw new Error("VIN number must be 17 digits in length.");
        }
        else {
            console.log("Valid format, moving along.");
            return vin;
        }
    };

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
    };

    render() {

        return (
            <Row>
                <Col size="12">
                    <Row>
                        <Col size="sm-10">
                            <Row>
                                <form>
                                    <div className="form-row">
                                        <Col size="sm-2">
                                            <Input
                                                type="input"
                                                name="make"
                                                id="inputMake"
                                                label="Make"
                                                placeholder="Make"
                                                value={this.state.make}
                                                onChange={this.handleInputChange}
                                            />
                                        </Col>
                                        <Col size="sm-2">
                                            <Input
                                                type="input"
                                                name="model"
                                                id="inputModel"
                                                label="Model"
                                                placeholder="Model"
                                                value={this.state.model}
                                                onChange={this.handleInputChange}
                                            />
                                        </Col>
                                        <Col size="sm-1">
                                            <Input
                                                type="input"
                                                name="year"
                                                id="inputYear"
                                                label="Year"
                                                placeholder="Year"
                                                value={this.state.year}
                                                onChange={this.handleInputChange}
                                            />
                                        </Col>
                                        <Col size="sm-2">
                                            <Input
                                                type="input"
                                                name="color"
                                                id="inputColor"
                                                label="Color"
                                                placeholder="Color"
                                                value={this.state.color}
                                                onChange={this.handleInputChange}
                                            />
                                        </Col>
                                        <Col size="sm-2">
                                            <Input
                                                type="input"
                                                name="plateNumber"
                                                id="inputPlateNumber"
                                                label="Plate Number"
                                                placeholder="Plate Number"
                                                value={this.state.plateNumber}
                                                onChange={this.handleInputChange}
                                            />
                                        </Col>
                                        <Col size="sm-3">
                                            <Input
                                                type="input"
                                                name="vin"
                                                id="inputVin"
                                                label="VIN"
                                                placeholder="VIN"
                                                value={this.state.vin}
                                                onChange={this.handleInputChange}
                                            />
                                        </Col>
                                    </div>
                                </form>
                            </Row>
                        </Col>
                        <Col size="sm-1">
                            <OjBtn
                                style={{ float: "left" }}
                                type="submit"
                                className="btn btn-block"
                                onClick={this.addNewVehicle}
                                children="Add New"
                            />
                        </Col>
                        <Col size="sm-1" />
                    </Row>
                </Col>
            </Row >
        )
    };
};

export default VehicleFormEditable;