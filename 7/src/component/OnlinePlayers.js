import React from 'react';
import PropTypes from 'prop-types';

const OnlinePlayers = (props) => {
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
        <div style={{textAlign: 'center'}}>
            <ul style={{display: 'inline-block', padding: '0px 0px 30px 20px', margin: '0px'}}>
                {playerEls}</ul>
        </div>
    );
};

OnlinePlayers.propTypes = {
    players: PropTypes.array.isRequired,
    currentPlayer: PropTypes.object.isRequired
};

export default OnlinePlayers;
