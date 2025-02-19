import '../../../../../App.css';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

/**
 * Multiple choice text poll creator used in polls component
 *
 * @param setShow - modal state passdown
 * @returns poll creation form
 */
const FreeText = ({ setShow }) => {

    // Start state with 2 options
    const [optionForm, setOptionForm] = useState(
        <div>
            <InputGroup className="my-4" size="sm">
                <Form.Control type="text" placeholder="Choice 1" />
            </InputGroup>
            <InputGroup className="my-4" size="sm">
                <Form.Control type="text" placeholder="Choice 2" />
            </InputGroup>
        </div>
    );
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookies] = useCookies(['access_token']);
    let { id } = useParams();

    /**
     * Handles submission of form, aka poll creation
     * @param event submission
     */
    const handleSubmit = (event) => {
        const prompt = event.target[0].value;
        let choices = [];
        let i;
        // Add all options to form data
        for (i = 1; i < event.target.length; i++) {
            if (event.target[i].value !== "")
                choices.push(event.target[i].value);
        }
        event.preventDefault();
        event.stopPropagation();
        // Link to poll creation endpoint
        fetch('/host/event/' + id + "/poll", {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + cookies['access_token'],
            },
            body: JSON.stringify({
                content: {
                    "prompt": prompt,
                    "type": "multipleChoice",
                    "options": choices,
                }
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                setShow();
            });
        event.currentTarget.reset();
    };

    const [optionsList, setOptionsList] = useState([1, 2]);

    /**
     * Increments the displayed number of choices the creator can add
     */
    const incrementOptions = () => {
        optionsList.push(optionsList[optionsList.length - 1] + 1);
        setOptionsList(optionsList);
        let temp = optionsList.map((number) =>
            <InputGroup className="my-4" size="sm">
                <Form.Control type="text" placeholder={"Choice " + number} />
            </InputGroup>
        )
        setOptionForm(temp)
    }


    return (
        <Form className="px-3 mx-auto" onSubmit={handleSubmit}>
            <InputGroup className="my-4" size="lg">
                <Form.Control type="text" placeholder="Question prompt" />
            </InputGroup>
            {optionForm}
            <InputGroup>
                <Button onClick={() => incrementOptions()} size="sm" variant="light">Extra Option</Button>
            </InputGroup>
            <Button variant="primary" type="submit" className="buttons my-2">
                Send
            </Button>
        </Form>
    )
}
export default FreeText;
