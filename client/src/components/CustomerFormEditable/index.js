import React from "react";
import { Col } from "../Grid";
import { Input, OjBtn } from "../Form";
import API from "../../utils/API";

class CustomerFormEditable extends React.Component {

    state = {
        editCustomer: false,
        id: null,
        firstName: "",
        middleName: "",
        lastName: "",
        address: "",
        unit: "",
        city: "",
        state: "",
        zipCode: null,
        phone: "",
        email: "",
    }


    // Function to update the customer state with the current contents of the provided source
    setCustomerState = (src) => {
        // Set the state variables
        this.setState({
            id: src.id,
            firstName: src.firstName,
            middleName: src.middleName,
            lastName: src.lastName,
            address: src.address,
            unit: src.unit,
            city: src.city,
            state: src.state,
            zipCode: src.zipCode,
            phone: src.phone,
            email: src.email,
        });
    }


    // Button click event for the customer EDIT button
    // This method is only called when the form fields are disabled
    toggleCustomerEdit = (event) => {
        event.preventDefault();
        this.setState({
            editCustomer: !this.state.editCustomer
        });
    };

    // When a form field's value changes, update state to reflect that
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    // Button click event for the customer SAVE button
    // This method is only called when the form fields are enabled
    saveCustomerInfo = event => {
        event.preventDefault();
        // Package the customer data from state
        let updateData = this.packageCustomerData();
        // Then send an update PUT request to the DB
        API.updateThisCustomer(this.state.id, updateData)
            .then(updated => {
                console.log(JSON.stringify(updated.data));
                // Once the response comes back from the DB, set the customer editing attribute in state to false
                this.setState({
                    editCustomer: !this.state.editCustomer
                });
                this.props.customerUpdate();
                this.setCustomerState()
            }).catch(error => console.log(error));
    };

    // Small function to package up the customer data in state for movement to the DB
    packageCustomerData = () => {
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
        return customerData;
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

    componentDidMount() {
        // Wait 50 ms, then initialize the customer state by pulling the props from the parent component
        setTimeout(() => {
            const { customer } = this.props
            this.setCustomerState(customer)
        }
            , 100);
    }

    render() {

        return (
            <form>
                <div className="form-row">
                    <Col size="sm-3">
                        <Input
                            type="input"
                            name="firstName"
                            id="inputFirstName"
                            label="First Name"
                            placeholder="First Name"
                            value={this.state.firstName || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                    <Col size="sm-3">
                        <Input
                            type="input"
                            name="middleName"
                            id="inputMiddleName"
                            label="Middle Name"
                            placeholder="Middle Name"
                            value={this.state.middleName || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                    <Col size="sm-3">
                        <Input
                            type="input"
                            name="lastName"
                            id="inputLastName"
                            label="Last Name"
                            placeholder="Last Name"
                            value={this.state.lastName || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                </div>
                <div className="form-row">
                    <Col size="sm-6">
                        <Input
                            type="input"
                            name="address"
                            id="inputAddress"
                            label="Street Address"
                            placeholder="Street Address"
                            value={this.state.address || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                    <Col size="sm-3">
                        <Input
                            type="input"
                            name="unit"
                            id="inputUnit"
                            label="Apt./Unit"
                            placeholder="Apt./Unit"
                            value={this.state.unit || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                    <Col size="sm-3">
                        <OjBtn
                            style={{ textAlign: "center", margin: "auto" }}
                            type="submit"
                            onClick={this.state.editCustomer ? this.saveCustomerInfo : this.toggleCustomerEdit}
                            children={this.state.editCustomer ? "Save Customer" : "Edit Customer"}
                        />
                    </Col>
                </div>
                <div className="form-row">
                    <Col size="sm-2">
                        <Input
                            type="input"
                            name="city"
                            id="inputCity"
                            label="City"
                            placeholder="City"
                            value={this.state.city || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                    <Col size="sm-1">
                        <Input
                            type="input"
                            name="state"
                            id="inputState"
                            label="State"
                            placeholder="State"
                            value={this.state.state || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                    <Col size="sm-1">
                        <Input
                            type="input"
                            name="zipCode"
                            id="inputZipCode"
                            label="Zip"
                            placeholder="Zip"
                            value={this.state.zipCode || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                    <Col size="sm-2">
                        <Input
                            type="input"
                            name="phone"
                            id="inputPhone"
                            label="Phone Number"
                            placeholder="Phone Number"
                            value={this.state.phone || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                    <Col size="sm-3">
                        <Input
                            type="input"
                            name="email"
                            id="inputEmail"
                            label="Email"
                            placeholder="Email"
                            value={this.state.email || ""}
                            onChange={this.handleInputChange}
                            disabled={!(this.state.editCustomer)}
                        />
                    </Col>
                </div>
            </form>
        )
    };
};

export default CustomerFormEditable;