import { useState, useEffect, memo } from 'react';
import '../Assets/SCSS/components/loadingcard.scss';

function LoadingCard({
    style
}) {
    style = { ...style };

    return (
        <>
            <div className='loading-card'
                style={style}>
                <div className='loading-card__heading'></div>
                <div className='loading-card__content'></div>
            </div>
        </>
    )
}

export default memo(LoadingCard);