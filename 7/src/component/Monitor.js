import React from 'react';
import PropTypes from 'prop-types';
import OnlinePlayers from './OnlinePlayers';

const Monitor = (props) => {
    const onSubmit = () => {
        if (props.disconnectHandler) {
            props.disconnectHandler();
        }
    };

    return (
        <div role='monitor-form' style={{textAlign: 'center'}}>
            <div style={{padding: '20px'}}>
                <button style={{width: '120px', height: '35px', fontSize: '15px'}}
                    aria-label="disconnect-button" onClick={onSubmit}>Disconnect</button>
            </div>
            <OnlinePlayers players={props.players} currentPlayer={props.currentPlayer}></OnlinePlayers>
        </div>
    );
};

Monitor.propTypes = {
    disconnectHandler: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    currentPlayer: PropTypes.object.isRequired
};

export default Monitor;
