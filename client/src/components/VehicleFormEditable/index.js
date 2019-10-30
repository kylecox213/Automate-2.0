import React from "react";
import { Row, Col } from "../Grid";
import { Input, OjBtn } from "../Form";
import API from "../../utils/API";

class VehicleFormEditable extends React.Component {

    state = {
        editVehicle: false,
        id: null,
        model: "",
        make: "",
        year: "",
        color: "",
        plateNumber: "",
        vin: "",
    };

    setVehicleState = () => {
        let vehicle = this.props.vehicle;
        this.setState({
            id: vehicle.id,
            model: vehicle.model,
            make: vehicle.make,
            year: vehicle.year,
            color: vehicle.color,
            plateNumber: vehicle.plateNumber,
            vin: vehicle.vin,
        });
    };

    // Button click event for the Vehicle EDIT button
    // This method is only called when the form fields are disabled
    toggleVehicleEdit = (event) => {
        event.preventDefault();
        this.setState({
            editVehicle: !this.state.editVehicle
        });
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
    saveVehicleInfo = event => {
        event.preventDefault();
        // Package the Vehicle data from state
        let updateData = this.packageVehicleData();
        // Then send an update PUT request to the DB
        API.updateThisVehicle(this.state.id, updateData)
            .then(updated => {
                console.log(JSON.stringify(updated.data));
                this.props.update(this.props.customerId);
                this.setState({
                    editVehicle: false
                })
            })
    };

    // Small function to package up the Vehicle data in state for movement to the DB
    packageVehicleData = () => {
        console.log(this.state);
        let VehicleData = {
            model: this.state.model,
            make: this.state.make,
            year: this.validateReformatYear(this.state.year.toString()),
            color: this.state.color,
            plateNumber: this.state.plateNumber,
            vin: this.state.vin,
        };
        console.log(VehicleData);
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
        console.log(year.length);
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

    componentDidMount() {
        // Wait 50 ms, then initialize the Vehicle state by pulling the props from the parent component
        setTimeout(this.setVehicleState, 50);
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
                                                value={this.state.make || ""}
                                                onChange={this.handleInputChange}
                                                disabled={!(this.state.editVehicle)}
                                            />
                                        </Col>
                                        <Col size="sm-2">
                                            <Input
                                                type="input"
                                                name="model"
                                                id="inputModel"
                                                label="Model"
                                                placeholder="Model"
                                                value={this.state.model || ""}
                                                onChange={this.handleInputChange}
                                                disabled={!(this.state.editVehicle)}
                                            />
                                        </Col>
                                        <Col size="sm-1">
                                            <Input
                                                type="input"
                                                name="year"
                                                id="inputYear"
                                                label="Year"
                                                placeholder="Year"
                                                value={this.state.year || ""}
                                                onChange={this.handleInputChange}
                                                disabled={!(this.state.editVehicle)}
                                            />
                                        </Col>
                                        <Col size="sm-2">
                                            <Input
                                                type="input"
                                                name="color"
                                                id="inputColor"
                                                label="Color"
                                                placeholder="Color"
                                                value={this.state.color || ""}
                                                onChange={this.handleInputChange}
                                                disabled={!(this.state.editVehicle)}
                                            />
                                        </Col>
                                        <Col size="sm-2">
                                            <Input
                                                type="input"
                                                name="plateNumber"
                                                id="inputPlateNumber"
                                                label="Plate Number"
                                                placeholder="Plate Number"
                                                value={this.state.plateNumber || ""}
                                                onChange={this.handleInputChange}
                                                disabled={!(this.state.editVehicle)}
                                            />
                                        </Col>
                                        <Col size="sm-3">
                                            <Input
                                                type="input"
                                                name="vin"
                                                id="inputVin"
                                                label="VIN"
                                                placeholder="VIN"
                                                value={this.state.vin || ""}
                                                onChange={this.handleInputChange}
                                                disabled={!(this.state.editVehicle)}
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
                                onClick={this.state.editVehicle ? this.saveVehicleInfo : this.toggleVehicleEdit}
                                children={this.state.editVehicle ? "Save" : "Edit"}
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