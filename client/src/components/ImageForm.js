import { useState, useEffect, useCallback, useMemo, memo, useContext } from 'react';
import { Button, Form, FormControl, FormLabel } from 'react-bootstrap';
import '../Assets/SCSS/imageForm.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import config from '../config/config';
import AuthContext from '../helpers/Authcontext';

function ImageForm({ location, hide }) {
    const [description, setDescription] = useState("");
    const [fileState, setFileState] = useState();
    const { authState } = useContext(AuthContext);

    const [locationState, setLocationState] = useState({
        lat: location.lat,
        lng: location.lng
    });

    const [previewUrl, setPreviewUrl] = useState("");

    const handleAddFile = (e) => {
        try {
            setFileState(e.target.files[0]);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (fileState && fileState.name) {
            setPreviewUrl(URL.createObjectURL(fileState));
        }

        return () => {
            if (fileState && fileState.name) {
                setPreviewUrl("");
                URL.revokeObjectURL(fileState);
            }
        }
    }, [fileState]);

    const handleHide = useCallback(() => {
        if (hide) {
            document.querySelector('.image-form').classList.add('hidden');
            setTimeout(() => hide(false), 300);
        }
    }, [hide]);

    const bgDark = useMemo(
        () =>
            (<div className='background-dark' onClick={handleHide}></div>),
        [handleHide]
    )

    return (
        <>
            {bgDark}
            <Form
                action={config.SERVER_URI ? `${config.SERVER_URI}/send-image`
                    : 'https://server-maps-travel-website2.onrender.com/send-image'}
                method='POST'
                enctype="multipart/form-data"
                className='image-form center'
            >
                <button
                    className='close-button'
                    style={{ position: 'absolute', top: 0, right: -10 }}
                    onClick={handleHide}
                >
                    <FontAwesomeIcon icon={faClose} style={{ fontSize: '1rem' }} />
                </button>
                <h2 className='text-center mb-4'>Thêm ảnh</h2>
                <div>
                    <FormControl // disabled prettier
                        type="text"
                        name="user"
                        // value={user}
                        placeholder='Your name'
                        value={authState.username}
                        // onChange={e => setUser(e.target.value)}
                        disabled={true}
                        required
                    />
                </div>
                <div>
                    <FormControl type="text" // disabled prettier
                        name="description"
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <FormLabel className="custom-button">
                        <FormControl // disabled prettier
                            type="file"
                            name="image"
                            placeholder='Your image'
                            onChange={handleAddFile}
                            accept="image/png, image/jpeg"
                            required
                        />
                        Add Image
                    </FormLabel>
                    {fileState && fileState.name && previewUrl &&
                        <div className='preview'>
                            <div className='thumbnail'>
                                <img src={previewUrl} alt='Harryguci' />
                            </div>
                        </div>}
                </div>
                <div className='d-none'>
                    <FormControl // disabled prettier
                        type='text'
                        name='location_lat'
                        value={locationState.lat}
                        //onChange={e => setLocationState({ lat: e.target.value, lng: locationState.lng })}
                    />
                    <FormControl // disabled prettier
                        type='text'
                        name='location_lng'
                        value={locationState.lng}
                        //onChange={e => setLocationState({ lat: locationState.lat, lng: e.target.value })}
                    />
                </div>
                <div>
                    <Button type="submit" disabled={fileState && fileState.name ? false : true}>
                        Send
                    </Button>
                </div>
            </Form>
        </>
    )
}


export default memo(ImageForm);