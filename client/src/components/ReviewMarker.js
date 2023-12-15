import { useState, useMemo, useCallback, memo } from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import ImageBox from "./ImageBox";
import '../Assets/SCSS/reviewMarker.scss';
import config from "../config/config";
function LocationMarker({
    review
}, key) {
    const position = useMemo(() => review.location, [review.location]);

    const [showImageBox, setShowImageBox] = useState(false);

    const imgData = useMemo(
        () => ({
            url: (config.SERVER_URI ? `${config.SERVER_URI}/${review.image.url}`
                : `https://server-maps-travel-website2.onrender.com/${review.image.url}`),
            description: review.description
        }),
        [review.description, review.image.url]);

    const hideImageBox = useCallback(() => {
        setShowImageBox(false);
    }, []);

    const ImgBox = useCallback(
        () =>
        (<ImageBox
            user={review.user}
            url={imgData.url}
            description={imgData.description}
            hide={hideImageBox}
        />)
        , [hideImageBox, imgData.description, imgData.url, review.user])

    return position === null ? null : (
        <>
            {showImageBox && (<ImgBox />)}
            <Marker
                key={key}
                position={position}
                icon={
                    new Icon({
                        iconUrl: './marker-review-green.png',
                        iconSize: [40, 41],
                        iconAnchor: [12, 41],
                    })
                }
                className={'review-marker'}
            >
                <Popup>
                    <div
                        className="thumbnail position-relative"
                        onClick={e => setShowImageBox(true)}
                    >
                        <div className="center fw-bold z-0">...</div>
                        <img
                            src={imgData.url}
                            style={{ zIndex: 1 }}
                            alt="Harryguci"
                        />
                    </div>
                </Popup>
            </Marker>
        </>
    );
}


export default memo(LocationMarker);