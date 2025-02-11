import '../../App.css';
import React from "react";
import Login from "./Login.js";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Tab from "react-bootstrap/Tab";
import Signup from "./Signup";
import { Link, useHistory } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import Button from "react-bootstrap/Button";
import TitleLogo from "../Utils/TitleLogo";
import Div100vh from "react-div-100vh";

/**
 * Component controlling the login/signup flows, in other words access to host functionality
 * depends on Login and Signup
 *
 * @returns login/signup page
 */
const Access = () => {

    // Used for back button
    let history = useHistory();

    return (
        <Div100vh>
        <div className="main-container">
            <Link to="/" className="clickable-link">
                <h1 className="display-4">BallotBox <TitleLogo /></h1>
            </Link>
            <Card className="access-card mx-auto my-3">
                <Tab.Container defaultActiveKey="login">
                    <Card.Header style={{ borderBottom: "none", backgroundColor: "transparent", }}>
                        <Nav variant="tabs" className="tab-bar" >
                            <Nav.Item className="custom-nav-tabs mx-1">
                                <Nav.Link className="custom-nav-links" eventKey="login">Login</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="custom-nav-tabs mx-1">
                                <Nav.Link className="custom-nav-links" eventKey="signup">Sign Up
                            </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body className="access-card-body">
                        <Tab.Content>
                            <Tab.Pane eventKey="login">
                                <Login />
                            </Tab.Pane>
                            <Tab.Pane eventKey="signup">
                                <Signup />
                            </Tab.Pane>
                        </Tab.Content>
                    </Card.Body>
                </Tab.Container>
                <Card.Footer style={{ background: "none", }}>
                    <Button className="back-button" onClick={() => history.push("/")}>
                        <FiChevronLeft />
                    </Button>
                </Card.Footer>
            </Card>

            <Navbar fixed="bottom">
                <Navbar.Text className="mx-auto navbar-text">
                    BallotBox | 2021
                </Navbar.Text>
            </Navbar>
        </div>

        </Div100vh>
    )
}
export default Access;
