import { useState, useEffect, memo } from 'react';
import '../Assets/SCSS/components/submenu.scss';
import { Link } from 'react-router-dom';

function Submenu({
    items,
    style,
    id,
    className,
}) {

    return (
        <>
            <div id={id} className={'submenu' + className ? ` ${className}` : ''}
                style={style ? style : {}}>
                <ul className='list-group submenu__list-group'>
                    {items.map((item, index) =>
                        <li key={item.id ? item.id : index}
                            className='list-group-item submenu__list-group__item'>
                            <Link to={item.link}
                                style={{ textDecoration: 'none' }}>
                                <p>{item.content}</p>
                            </Link>
                        </li>)}
                </ul>
            </div>
        </>
    )
}

export default memo(Submenu);