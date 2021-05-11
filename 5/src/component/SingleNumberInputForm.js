import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import Library from '../Library';

const lib = new Library();

const SingleNumberInputForm = (props) => {
    const input = useRef();

    const onSubmit = (event) => {
        const inputValue = parseInt(input.current.value);
        const suppress = props.AlertMessageOnWrongUserInput ? false : true;
        if (lib.isBetween(inputValue, props.MinNumber, props.MaxNumber, suppress)) {
            props.onSubmit(inputValue);
        }
    };

    useEffect(() => {
        input.current.focus();
    });

    return (
        <div role='rounds-form' style={{textAlign: 'center'}}>
            <div style={{display: 'inline-block', padding: '20px'}}>
                {props.Label}
            </div>
            <div style={{display: 'inline-block', padding: '20px'}}>
                <input type='number'
                    name="rounds"
                    style={{width: '50px', height: '30px', fontSize: '20px'}}
                    ref={input}
                    defaultValue={props.DefaultNumber}
                    min={props.MinNumber}
                    max={props.MaxNumber} />
            </div>
            <div style={{padding: '20px'}}>
                <button style={{width: '100px', height: '40px', fontSize: '25px'}}
                    onClick={onSubmit}>
                    {props.SubmissionLabel}
                </button>
            </div>
        </div>
    );
};

SingleNumberInputForm.propTypes = {
    Label: PropTypes.string.isRequired,
    MinNumber: PropTypes.number,
    MaxNumber: PropTypes.number,
    DefaultNumber: PropTypes.number.isRequired,
    SubmissionLabel: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    AlertMessageOnWrongUserInput: PropTypes.bool.isRequired,
};

export default SingleNumberInputForm;
