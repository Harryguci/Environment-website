import { memo, useState, useEffect } from "react"
import '../Assets/SCSS/components/loading.scss';

function Loading({ visible }) {
    const [visibleState, setVisibleState] = useState(false);
    
    useEffect(() => {
        if (visible) {
            setVisibleState(true);
        } else {
            var idTimeout = setTimeout(() => { setVisibleState(false) }, 1000);
        }
        return (() => !visible && clearTimeout(idTimeout));
    }, [visible])
    return (
        <>
            <div id="load" className={visibleState ? "active" : "regular"}>
                <div>G</div>
                <div>N</div>
                <div>I</div>
                <div>D</div>
                <div>A</div>
                <div>O</div>
                <div>L</div>
            </div>
        </>
    )
}

export default memo(Loading);
