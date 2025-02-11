import '../../../../../App.css';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

/**
 * Text input based poll creator used in polls component
 *
 * @param setShow - modal state passdown
 * @returns poll creation form
 */
const FreeText = ({ setShow }) => {

    let { id } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookies] = useCookies(['access_token']);

    /**
     * Handles submission of form, aka poll creation
     * @param event submission
     */
    const handleSubmit = (event) => {
        const prompt = event.target[0].value;
        event.preventDefault();
        event.stopPropagation();
        // link to poll creation endpoint
        fetch('/host/event/' + id + "/poll", {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + cookies['access_token'],
            },
            body: JSON.stringify({
                content: {
                    "prompt": prompt,
                    "type": "freeText",
                }
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                setShow(false);
            });
        event.currentTarget.reset();
    };

    return (
        <Form className="px-3 mx-auto" onSubmit={handleSubmit}>
            <InputGroup controlId="email" className="my-4" size="lg">
                <Form.Control type="text" placeholder="Question prompt" />
            </InputGroup>
            <Button variant="primary" type="submit" className="buttons my-2">
                Send
            </Button>
        </Form>
    )
}
export default FreeText;
