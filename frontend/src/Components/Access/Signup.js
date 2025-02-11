import '../../App.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { FiLock, FiMail } from "react-icons/fi";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { useState } from "react";

/**
 * Signup form inside Access component
 *
 * @returns signup form
 */
const Signup = () => {

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookies] = useCookies(['access_token']);
    const [emailValidated, setEmailValidated] = useState("");
    const [passValidated, setPassValidated] = useState("");
    let history = useHistory();

    /**
     * Handles and verifies submission of signup0 form
     * @param event submission
     */
    const handleSubmit = (event) => {
        const email = event.target[0].value;
        const pass = event.target[1].value;
        const conf_pass = event.target[2].value;
        // password regex
        const regex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")
        event.preventDefault();
        event.stopPropagation();
        if (pass !== conf_pass) {
            setPassValidated("Passwords do not match");
            return;
        }
        if (!regex.test(pass)) {
            setPassValidated("Password requires 8 characters including at least 1 number and at least 1 letter")
            return;
        }
        // link to signup endpoint
        fetch('/auth/create', {
            method: 'POST',
            body: JSON.stringify({
                username: email,
                password: pass,
            }),
        }).then((response) => {
            if (response.status === 403) {
                setPassValidated("");
                setEmailValidated("Email already in use");
            }
            else if (response.status === 422) {
                setEmailValidated("Invalid email address")
            }
            else {
                response.json().then((responseJson) => {
                    setCookies('access_token', responseJson["access_token"]);
                    history.push("/host");
                })
            }
        });

    };

    return (
        <Form className="forms mx-auto" onSubmit={handleSubmit}>
            <Form.Text style={{ color: "crimson", }}>
                {emailValidated}
            </Form.Text>
            <InputGroup className="mb-4" size="lg">
                <InputGroup.Prepend>
                    <InputGroup.Text>
                        <FiMail />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="email" placeholder="Email" size="lg" />
            </InputGroup>
            <Form.Text style={{ color: "crimson", }}>
                {passValidated}
            </Form.Text>
            <InputGroup size="lg">
                <InputGroup.Prepend>
                    <InputGroup.Text>
                        <FiLock />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="password" placeholder="Password" />
            </InputGroup>
            <InputGroup className="my-4" size="lg">
                <InputGroup.Prepend>
                    <InputGroup.Text>
                        <FiLock />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="password" placeholder="Confirm Password" />
            </InputGroup>
            <Button type="submit" className="buttons my-2">
                Sign up
            </Button>
        </Form>
    );
}
export default Signup;
