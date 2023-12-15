import { memo, useMemo, useCallback } from 'react';
import '../Assets/SCSS/imageBox.scss';

function ImageBox({ user, url, description, hide }) {

    const handleHide = useCallback(() => {
        if (hide) {
            document.querySelector('.image-box').classList.add('hidden');
            setTimeout(() => hide(), 300);
        }
    }, [hide]);

    const bgDark = useMemo(() =>
        (<div className='background-dark' onClick={handleHide}></div>)
        , [handleHide]
    );

    const styleThumbnail = useMemo(() =>
        window.innerWidth > 800 ?
            {
                width: 'auto',
                height: '70vh'
            }
            : {
                width: '90vw',
                height: 'auto'
            }
        , []
    )

    return (
        <>
            {bgDark}
            <div className='center image-box'>
                <div className='thumbnail'
                    style={styleThumbnail}>
                    <img src={url} alt='harryguci' />
                </div>
                <p className='description'>
                    <small className='fw-bold mx-2 opacity-75'>{user}</small>
                    {description}
                </p>
            </div>
        </>
    )
}

export default memo(ImageBox);
