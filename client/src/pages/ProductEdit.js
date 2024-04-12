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
import TextareaAutoHeight from "../components/TextareaAutoHeight";
import AutoScroll from "../helpers/Autoscroll";
import { useNavigate } from 'react-router-dom';

function ProductEdit() {
    const productId = useParams().id;
    const [productState, setProductState] = useState({});

    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState(0);
    const [remain, setRemain] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        AutoScroll();
    }, [productId]);

    useEffect(() => {
        let isCancelled = false;

        if (!productId) {
            alert("Can't find the product");
            navigate('/products');
        }

        setId(productId); // ??? What did this do ?

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
                    if (isCancelled) return;
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
            .catch((err) => console.error(err))

        return () => {
            isCancelled = true;
        }
    }, [productId, navigate])

    useEffect(() => {
        setName(productState.name);
        setDescription(productState.description);
        setCost(productState.cost);
        setRemain(productState.remain);
    }, [productState]);

    async function handleSubmit(e) {
        e.preventDefault();

        var url = '/products';
        await axios.put(url, {
            id, name, description, cost, remain
        }, {
            headers: {
                accessToken: localStorage.getItem('accessToken'),
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        }).then(response => response.data)
            .then(data => {
                if (data['status'] === 'success') {
                    window.alert('Update successfully !!');
                    navigate('/account?tab=products')
                }
                else if (data['error']) window.alert('ERROR: ' + JSON.stringify(data['error']));
            })
            .catch(err => console.error(JSON.stringify(err)));
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
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
                                id="name"
                                className="heading"
                                name="name"
                                placeholder="name"
                                style={{ width: '100%' }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup style={{ margin: '1rem 0' }}>
                            <FormLabel>Description</FormLabel>
                            <TextareaAutoHeight
                                id="description"
                                rows={5}
                                placeholder="Description"
                                value={description}
                                onChange={setDescription}
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
                            productState.files.length > 0 &&
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