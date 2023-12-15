import { useCallback, useMemo, memo } from 'react';
import { FormControl, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

function MapsControl({
    cites,
    setCenter,
    setCurrentLocation,
    setPoints,
    hanoipoints,
    showPolygon,
    setShowPolygon,
    newCityState,
    setNewCityState,
    handleAddPlace,
    setShowImageForm,
    hide,
    map
}) {
    const detectCurrentLocation = useCallback((e) => {
        if (navigator.geolocation) {
            window.scrollTo(0, 0);
            // detect real location
            map.locate();

            // setCurrentLocation()
        }
    }, [map]);

    const handleHide = useCallback(() => {
        try {
            document.getElementsByClassName('maps-section__control')[0].classList.add('hidden');
        } catch (err) {
            console.log(err);
        }
        if (hide)
            setTimeout(() => hide(), 300);
    }, [hide]);

    const brandElement = useMemo(() => (
        <div className="brand">
            <div className='thumbnail d-flex justify-content-center'>
                <img src={'./harryguci-logo-white.png'} alt='HARRYGUCI' width={50} height={50} />
            </div>
        </div>
    ), []);

    const currentLocationBtn = useMemo(() => (
        <button
            className="custom-button danger"
            onClick={detectCurrentLocation}
        >
            Current Location
        </button>
    ),
        [detectCurrentLocation]);

    return (
        <>
            <div className='background-dark' onClick={handleHide}></div>
            <button
                className="custom-button position-absolute"
                style={{ top: 20, left: 210, zIndex: 2000 }}
                onClick={handleHide}
            >
                <FontAwesomeIcon icon={faClose} />
            </button>
            <div className="maps-section__control p-4" style={{ zIndex: 1000 }}>
                <Row>
                    {brandElement}
                </Row>
                <Row className='my-5'>
                    <a className="custom-button" href='/'>Back to Feed</a>
                </Row>
                <Row className="my-2 d-flex justify-content-center gap-2">
                    {currentLocationBtn}
                    {cites &&
                        cites.length &&
                        cites.map((city) => (
                            <button
                                key={city.id}
                                className="custom-button"
                                onClick={(e) => {
                                    map.flyTo({
                                        lat: city.points[0][0],
                                        lng: city.points[0][1],
                                    }, map.getZoom());

                                    setCurrentLocation({
                                        lat: city.points[0][0],
                                        lng: city.points[0][1],
                                    });

                                    setPoints(city.points || hanoipoints);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                {city.name}
                            </button>
                        ))}
                </Row>
                <Row className="d-flex justify-content-center my-5 gap-2">
                    <button
                        className="custom-button danger"
                        onClick={(e) => setPoints([])}
                    >
                        Reset Outline
                    </button>
                    <button // prettier-ignore
                        className='custom-button'
                        onClick={(e) => { setShowPolygon((prev) => !prev); setPoints([]) }}
                    >
                        {showPolygon ? 'Hide Outline' : 'Show Outline'}
                    </button>
                    <FormControl
                        type="text"
                        style={{ maxWidth: 500, padding: '1rem' }}
                        value={newCityState}
                        onChange={(e) => setNewCityState(e.target.value)}
                        placeholder="city"
                        required
                    />
                    <button
                        className="custom-button primary"
                        onClick={handleAddPlace}
                    >
                        Add City
                    </button>
                    <button
                        className="custom-button"
                        onClick={e => { setShowImageForm(prev => !prev); window.scrollTo(0, 0) }}
                    >
                        Add Image
                    </button>
                </Row>
                <Row>
                    <div className="opacity-50">
                        {/* <p>[space] back to current location</p> */}
                        <p>[-][+] change zoom</p>
                    </div>
                </Row>
            </div>
        </>
    )
}

export default memo(MapsControl);