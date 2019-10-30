import React from "react";
import LoadingMsg from "../components/LoadingMsg";
import { Redirect } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { Input, RedBtn } from "../components/Form";
import API from "../utils/API";

class Login extends React.Component {

    state = {
        username: "",
        password: ""
    }

    checkLoginStatus = () => {
        API.userLoginCheck()
            .then(resp => {
                if (resp.data.user) {
                    console.log(resp.data);
                    this.setState({
                        user: resp.data.user,
                        loaded: true
                    })
                }
                else if (!this.state.loaded) {
                    this.setState({
                        loaded: true
                    })
                }
            })
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleLoginAttempt = event => {
        event.preventDefault();
        if (!this.state.username || !this.state.password) {
            return;
        }
        API.userLogin({
            username: this.state.username,
            password: this.state.password
        }).then(data => {
            console.log(data);
            if (data.status === 200) {
                console.log(data);
                this.setState({
                    loggedIn: true
                })
            }
        }).catch(err => {
            console.log(err);
        });
    };

    componentDidMount() {
        this.checkLoginStatus();
    }

    render() {

        this.checkLoginStatus();

        if (!this.state.loaded) {
            return (<LoadingMsg />)
        }


        if (this.state.loaded && this.state.user) {
            return (
                <Redirect to="/app" />
            )
        }

        return (
            <Container fluid>
                <Row className="max-width: 900px; margin:auto;">
                    <Col size="md-3" />
                    <Col size="md-6">
                        <h1 className="text-center mb-3" style={{marginTop:20}}><i className="fas fa-sign-in-alt" style={{marginRight: "15px"}}></i>Login</h1>
                        <form className="login">
                            <Input
                                type="input"
                                id="username-input"
                                label="Username"
                                name="username"
                                className="form-control"
                                onChange={this.handleInputChange}
                                placeholder="Enter Email"
                                required
                            />
                            <Input
                                type="password"
                                label="Password"
                                id="password-input"
                                name="password"
                                className="form-control"
                                onChange={this.handleInputChange}
                                placeholder="Enter Password"
                                required
                            />
                            <RedBtn
                                type="submit"
                                className="btn btn-block"
                                onClick={this.handleLoginAttempt}
                            >Login</RedBtn>
                        </form>
                    </Col>
                    <Col size="md-3" />
                </Row>
            </Container>
        )
    };




}

export default Login;