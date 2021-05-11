import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

const Welcome = (props) => {
    const nameInput = useRef();

    const onConnect = () => {
        const pNameVal = nameInput.current.value;
        const isNameValid = pNameVal && pNameVal != '';
        if (!isNameValid) {
            alert('Please enter your name!');
            return;
        }
        props.onConnect(pNameVal);
    }

    useEffect(() => {
        nameInput.current.focus();
    });

    return (
        <div>
            <div style={{textAlign: 'center', padding: '30px'}}>
                Hi, this is <div role='player-name' style={{color: 'red', display: 'inline-block'}}>
                    {props.playerName}</div>
                &apos;s math game, choose your parameters and get to calculating!
            </div>
            <div style={{textAlign: 'center'}}>
                <div style={{display: 'inline-block', paddingRight: '10px'}}>Your name:</div>
                <input name="pName" type='text' ref={nameInput}
                    style={{width: '200px', height: '30px', fontSize: '20px'}}/>
            </div>
            <div style={{padding: '20px', textAlign: 'center'}}>
                <button style={{width: '120px', height: '40px', fontSize: '25px'}}
                    onClick={onConnect}>Connect</button>
            </div>
        </div>
    );
};

Welcome.propTypes = {
    playerName: PropTypes.string.isRequired,
    onConnect: PropTypes.func.isRequired,
};

export default Welcome;
