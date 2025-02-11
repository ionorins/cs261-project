import '../../App.css';
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { useCookies } from "react-cookie";
import PollForm from "./PollForm";
import { getIcon } from "../Host/Event/Polls";

/**
 * Gets submitted polls for attendee to answer
 * dependent on PollForm
 *
 * @param setUnansweredPolls - state passdown
 * @returns accordions of polls
 */
const AttendeePolls = ({ setUnansweredPolls }) => {

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookies] = useCookies(['access_token']);
    const [unansweredPollsList, setUnansweredPollsList] = useState(<></>);
    const [answeredPollsList, setAnsweredPollsList] = useState(<></>);

    /**
     * Gets all polls from API, answered and unanswered
     * @returns {Promise<void>}
     */
    async function getPolls() {
        let answered = [];
        let unanswered = [];
        let i;
        // Link to polls endpoint
        fetch('/attendee/polls', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + cookies['access_token'],
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                for (i = 0; i < responseJson.length; i++) {
                    if (responseJson[i].answered)
                        answered.push(responseJson[i]);
                    else unanswered.push(responseJson[i]);
                }
                const unansweredPolls = unanswered.map((poll) =>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle eventKey={poll.id} className="builder-toggle">
                                {poll.content['prompt']} {getIcon(poll.content.type)}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={poll.id}>
                            <Card.Body>
                                <PollForm getPolls={getPolls} poll={poll} />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                );
                const answeredPolls = answered.map((poll) =>
                    <Card>
                        <Card.Header>
                            {poll.content['prompt']} {getIcon(poll.content.type)}
                        </Card.Header>
                    </Card>
                );
                setUnansweredPollsList(unansweredPolls);
                setAnsweredPollsList(answeredPolls);
                setUnansweredPolls(unansweredPolls.length);
            });
    }

    /**
     * Sets refresh on getPolls to 3000ms on component mount, closing on unmount
     */
    useEffect(() => {
        getPolls();
        const timeoutID = setInterval(() => {
            getPolls();
        }, 3000);
        return () => clearInterval(timeoutID);
        // eslint-disable-next-line
    }, [])

    return (
        <div className="polls-container attendee-polls-container">
            <Accordion>
                {unansweredPollsList.length > 0 ? unansweredPollsList : "No polls left to answer :)"}
            </Accordion>

            <Accordion className="mt-4">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle eventKey="answered" className="builder-toggle">
                            <h5 className="my-2">Answered</h5>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="answered">
                        <Card.Body>
                            <Accordion>
                                {answeredPollsList}
                            </Accordion>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>

    );
}
export default AttendeePolls;
