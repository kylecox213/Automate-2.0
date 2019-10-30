import React from "react";
import { Col } from "../Grid";
import { Input, BlueBtn } from "../Form";
import { Link } from "react-router-dom";

class CustomerFormStatic extends React.Component {

    state = {
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

    // Function to update the customer state with the current contents of the DB
    setCustomerState = () => {
        let customer = this.props.customer;
        console.log(customer);
        // Set the state variables
        this.setState({
            id: customer.id,
            firstName: customer.firstName,
            middleName: customer.middleName,
            lastName: customer.lastName,
            address: customer.address,
            unit: customer.unit,
            city: customer.city,
            state: customer.state,
            zipCode: customer.zipCode,
            phone: customer.phone,
            email: customer.email,
        })
    }

    // When a form field's value changes, update state to reflect that
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
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
        setTimeout(this.setCustomerState, 300);
    }

    render() {

        console.log("Static customer form state:");
        console.log(this.state);

        return (
            <form>
                <div className="form-row">
                    <Col size="sm-4">
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
                    <Col size="sm-4">
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
                    <Col size="sm-4">
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
                    <Col size="sm-6">
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
                    <Col size="sm-4">
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
                    <Col size="sm-2">
                        <BlueBtn
                            type="submit"
                            className="btn btn-block"
                            onClick={this.handleInputChange}
                        >
                            <Link
                                style={{ color: "inherit", textDecoration: "inherit" }}
                                to={{
                                    pathname: `/app/customer/${this.state.customerId}`,
                                    state: { customerId: this.state.id }
                                }}>
                                Full Customer Details
                      </Link>
                        </BlueBtn>
                    </Col>
                </div>
            </form>
        )
    };
};

export default CustomerFormStatic;