import '../../../App.css';
import { Link, useHistory, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import React, { useEffect, useRef, useState } from "react";
import Tab from "react-bootstrap/Tab";
import CommentWall from "./CommentWall";
import { useCookies } from "react-cookie";
import Navbar from "react-bootstrap/Navbar";
import { FiUser } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri"
import Polls from "./Polls";
import EmotionAnalysis from "./EmotionAnalysis";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { Row } from "react-bootstrap";
import TitleLogo from "../../Utils/TitleLogo";
import Col from "react-bootstrap/Col";
import Logout from "../../Access/Logout";
import Div100vh from "react-div-100vh";

/**
 * Macro component for host view of the event
 * dependent on CommentWall, EmotionAnalysis and Polls
 *
 * @returns host event view
 */
const ControlPanel = () => {
    let { id } = useParams();

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(['access_token']);
    const [eventName, setEventName] = useState("Loading...");
    const [eventCode, setEventCode] = useState("Loading...");
    const [attendees, setAttendees] = useState(0);
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false);
    const target = useRef(null);

    let history = useHistory();

    /**
     * Sets current number of attendees in the event
     */
    async function getAttendees() {
        fetch('/host/event/' + id + "/attendees", {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + cookies['access_token'],
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                setAttendees(responseJson.length)
            });
    }


    /**
     * Checks host authorisation to view event, sets refresh on getAttendees to 3000ms on mount, closing on unmount
     */
    useEffect(() => {
        // Link to event endpoint
        fetch('/host/event/' + id, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + cookies['access_token'],
            }
        }).then((response) => {
            if (response.status !== 200) {
                history.push("/");
                return;
            }
            response.json().then((responseJson) => {
                setEventName(responseJson['name']);
                setEventCode(responseJson['code']);
                setLoad(true);
            });
        })

        getAttendees();
        const timeoutID = setInterval(() => {
            getAttendees();
        }, 3000);
        return () => clearInterval(timeoutID);
        // eslint-disable-next-line
    }, []);

    if (load)
    return (
        <Div100vh>
            <div className="main-container">
                <Navbar fixed="top" className="flex-column mb-3">
                    <Row className="min-vw-100">
                        <Navbar.Text className="mx-auto nav-stats-font">
                            <Link to="/host" className="clickable-link">
                                {eventName} <TitleLogo size={"-small"} />
                            </Link>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Logout />
                        </Navbar.Text>
                    </Row>
                    <Row className="min-vw-100">
                        <Col className="text-left d-inline-block">
                            <div className="nav-stats-font copy-link">
                                <Link to={"/qr/" + eventCode} className="clickable-link" target="_blank">
                                    <RiQrCodeLine className="mr-2 mb-1" />
                                </Link>

                                <span ref={target} style={{ whiteSpace: "nowrap" }} onClick={() => { setShow(!show); navigator.clipboard.writeText(eventCode) }}>
                                    {eventCode}
                                </span>
                            </div>

                            <Overlay target={target.current} show={show} placement="bottom">
                                {(props) => (
                                    <Tooltip id="overlay-example" {...props}>
                                        Copied!
                                    </Tooltip>

                                )}
                            </Overlay>
                        </Col>
                        <Col className="text-right">
                            <div className="nav-stats-font">
                                <span id="attendees" className="">{attendees}</span> <FiUser className="mb-1" />
                            </div>
                        </Col>
                    </Row>
                </Navbar>
                <Card className="standard-card">
                    <Tab.Container defaultActiveKey="comments">
                        <Card.Header style={{ borderBottom: "none", backgroundColor: "transparent", }}>
                            <Nav variant="tabs" className="tab-bar" >
                                <Nav.Item className="custom-nav-tabs mx-1">
                                    <Nav.Link className="custom-nav-links" eventKey="emotion">
                                        Mood Analysis
                            </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="custom-nav-tabs mx-1">
                                    <Nav.Link className="custom-nav-links" eventKey="comments">
                                        Comments
                            </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="custom-nav-tabs mx-1">
                                    <Nav.Link className="custom-nav-links" eventKey="polls">
                                        Polls
                            </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body className="access-card-body control-panel-card-body">
                            <Tab.Content>
                                <Tab.Pane eventKey="emotion">
                                    <EmotionAnalysis />
                                </Tab.Pane>
                                <Tab.Pane eventKey="comments">
                                    <CommentWall />
                                </Tab.Pane>
                                <Tab.Pane eventKey="polls">
                                    <Polls attendees={attendees} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Card.Body>
                    </Tab.Container>
                </Card>
            </div>
        </Div100vh>

    );
    else return null;
}
export default ControlPanel;
