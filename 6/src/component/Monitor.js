import React from 'react';
import PropTypes from 'prop-types';

const Monitor = (props) => {
    const onSubmit = (event) => {
        if (props.disconnectHandler) {
            props.disconnectHandler();
        }
    };

    const playerEls = [];
    if (props.players && props.players.length != 0) {
        for (let i = 0; i < props.players.length; i++) {
            const player = props.players[i];
            let you = '';
            if (player.id == props.currentPlayer.id) {
                you = ' (you) ';
            }
            playerEls.push(<li style={{fontSize: '20px'}}
                key={i}>{player.name + you}</li>);
        }
    }

    return (
        <div role='monitor-form' style={{textAlign: 'center'}}>
            <div style={{padding: '20px'}}>
                <button style={{width: '120px', height: '35px', fontSize: '15px'}}
                    aria-label="disconnect-button" onClick={onSubmit}>Disconnect</button>
            </div>
            <ul style={{display: 'inline-block', padding: '0px 0px 30px 20px', margin: '0px'}}>
                {playerEls}</ul>
        </div>
    );
};

Monitor.propTypes = {
    disconnectHandler: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    currentPlayer: PropTypes.object.isRequired
};

export default Monitor;
