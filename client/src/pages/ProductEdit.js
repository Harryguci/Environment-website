import { useState, useEffect, memo } from "react";
import {
    Container,
    Button, Form,
    FormControl,
    FormGroup,
    Row,
    FormLabel,
    Col
} from "react-bootstrap";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import axios from "axios";
function ProductEdit() {
    const productId = useParams().id;
    const [productState, setProductState] = useState({});

    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState(0);
    const [remain, setRemain] = useState(0);

    useEffect(() => {
        if (!productId) {
            alert("Can't find the product");
            window.location = '/products'
        }

        setId(productId);

        axios.get(`/products/single/${productId}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        })
            .then((res) => res.data)
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    console.log(data);
                    setProductState({
                        id: productId,
                        name: data.name,
                        description: data.description,
                        cost: data.cost,
                        remain: data.remain,
                        files: data.files
                    })
                }
            })
            .catch((err) => console.log(err))
    }, [productId])

    useEffect(() => {
        setName(productState.name);
        setDescription(productState.description);
        setCost(productState.cost);
        setRemain(productState.remain);
    }, [productState]);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form>
                        <FormGroup style={{ margin: '1rem 0' }}>
                            <FormLabel>Id</FormLabel>
                            <FormControl
                                id="id" name="id"
                                placeholder="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                disabled={true} />
                        </FormGroup>
                        <FormGroup style={{ margin: '1rem 0' }}>
                            <FormLabel>Name</FormLabel>
                            <FormControl
                                id="name" name="name"
                                placeholder="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup style={{ margin: '1rem 0' }}>
                            <FormLabel>Description</FormLabel>
                            <FormControl
                                id="description" name="description"
                                as="textarea"
                                rows={5}
                                placeholder="Description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup style={{ margin: '1rem 0' }}>
                            <FormLabel>Cost</FormLabel>
                            <FormControl
                                id="cost" name="cost"
                                placeholder="Cost"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup style={{ margin: '1rem 0' }}>
                            <FormLabel>Remain</FormLabel>
                            <FormControl
                                id="remain" name="remain"
                                placeholder="Remain"
                                value={remain}
                                onChange={(e) => setRemain(e.target.value)}
                                disabled={true}
                            />
                        </FormGroup>
                        <div>
                            <Button type="submit" className="custom-btn">Save</Button>
                        </div>
                    </Form>
                </Col>
                <Col md={6}>
                    <div className="d-flex" style={{
                        flexWrap: 'wrap',
                        maxHeight: '100rem',
                        overflow: 'auto'
                    }}>
                        {productState.files &&
                            productState.files.length &&
                            productState.files.map((file) => (
                                <div key={file.filename} style={{ margin: '1rem' }}>
                                    {file.mimetype.indexOf("video") !== -1 ? (
                                        <div className="video-section">
                                            <ReactPlayer
                                                url={`/blogs/${file.filename}`}
                                                width="100%"
                                                height="auto"
                                                playing={false}
                                                controls={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="thumbnail h-100 d-flex justify-content-center align-items-center rounded-2 overflow-hidden"
                                            style={{ aspectRatio: '16/9' }}>
                                            <img
                                                src={`/blogs/${file.filename}`}
                                                alt="SFIT"
                                                width={100 + "%"}
                                                height={100 + "%"}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default memo(ProductEdit);