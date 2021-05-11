import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import Library from '../Library';

const lib = new Library();

const CreateGame = (props) => {
    const input = useRef();
    const minVal = 1;
    const maxVal = 20;

    const onSubmit = () => {
        const inputValue = parseInt(input.current.value);
        const suppress = props.enableAlertMessage ? false : true;
        if (lib.isBetween(inputValue, minVal, maxVal, suppress)) {
            props.onNewGame(inputValue);
        }
    };

    useEffect(() => {
        input.current.focus();
    });

    return (
        <div role='rounds-form' style={{textAlign: 'center'}}>
            <div style={{display: 'inline-block', padding: '20px'}}>Number of rounds</div>
            <div style={{display: 'inline-block', padding: '20px'}}>
                <input type='number' name="rounds" ref={input}
                    style={{width: '50px', height: '30px', fontSize: '20px'}}
                    defaultValue={3} min={minVal} max={maxVal} />
            </div>
            <br></br>
            <div style={{padding: '20px'}}>
                <button style={{width: '160px', height: '40px', fontSize: '25px'}}
                    onClick={onSubmit}>New Game</button>
            </div>
        </div>
    );
};

CreateGame.propTypes = {
    onNewGame: PropTypes.func.isRequired,
    enableAlertMessage: PropTypes.bool.isRequired,
};

export default CreateGame;
