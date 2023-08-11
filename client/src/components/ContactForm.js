import { useState, memo } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap'
import '../Assets/SCSS/components/contactForm.scss';

function ContactForm() {
    const [nameState, setNameState] = useState("");
    const [emailState, setEmailState] = useState("");
    const [messageState, setMessageState] = useState("");

    return (
        <div>
            <h3 className="text-center fw-bold heading">Liên hệ</h3>
            <Form
                name="contact-form"
                className="contact-form"
                action="/contact"
                method="POST"
            >
                <div className="mt-5">
                    <FormControl
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={nameState}
                        onChange={e => setNameState(e.target.value)}
                    />
                </div>
                <div className="mt-3">
                    <FormControl
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={emailState}
                        onChange={e => setEmailState(e.target.value)}
                    />
                </div>
                <div className="mt-3">
                    <FormControl
                        as="textarea"
                        type="text"
                        rows={2}
                        name="message"
                        placeholder="Message"
                        value={messageState}
                        onChange={e => setMessageState(e.target.value)}
                    />
                </div>
                <div className="mt-5 d-flex justify-content-end">
                    <Button className="custom-btn primary" type="submit">
                        Send
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default memo(ContactForm);
