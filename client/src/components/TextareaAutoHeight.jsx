import { FormControl } from 'react-bootstrap'
import { memo, useRef, useEffect } from 'react';
import '../Assets/SCSS/customFormControl.scss';

function TextareaAutoHeight({ id, className, value, handleChange, handleFocus, required }) {
    const textAreaRef = useRef(null);
    useEffect(() => {
        if (!textAreaRef) return;

        textAreaRef.current.style.height = "5px";
        textAreaRef.current.style.height = (textAreaRef.current.scrollHeight) + "px";
    }, [value]);

    return (
        <FormControl
            ref={textAreaRef}
            id={id}
            name={id}
            className={(className ? className : '') + ' custom-form-control'}
            as="textarea"
            rows={3}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            required={required}
            style={{
                minHeight: '10rem',
                maxHeight: '100rem'
            }}
            placeholder='' />
    )
}

export default memo(TextareaAutoHeight);
