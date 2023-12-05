import { memo, useContext, useEffect } from "react";
import ContactForm from "../components/ContactForm";
import { Container } from "react-bootstrap";
import CurrentPageContext from "../helpers/CurrentPageContext";

function Contact() {
    const { setPageState } = useContext(CurrentPageContext);
    useEffect(() => setPageState("contact"), [setPageState]);

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '70vh' }}
        >
            <ContactForm />
        </Container>
    )
}

export default memo(Contact);
