import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import Library from '../Library';

const lib = new Library();

const GameList = (props) => {
    const history = useHistory();

    const onLinkClick = (id) => {
        props.onGameClick(id + "1");
        history.push(`/games/${id + "1"}`);
        return false;
    }

    const gameEls = [];
    for (const id in props.gamesDic){
        const isInProgress = props.gamesDic[id].mode == lib.GameMode.InProgress;
        if((props.inProgressMode && isInProgress) || (!props.inProgressMode && !isInProgress)) {
            gameEls.push(<br key={id + '_1'}></br>);
            gameEls.push(<br key={id + '_2'}></br>);
            gameEls.push(<a key={id + '_3'} onClick={() => {return onLinkClick(id)}}
                className='link'>{id}</a>);
        }
    }

    return (
        <div style={{textAlign: 'center', fontSize:'20px'}}>
            <div style={{display: 'inline-block', margin: '0px'}}>
                {gameEls}
            </div>
        </div>
    );
};

GameList.propTypes = {
    onGameClick: PropTypes.func.isRequired,
    inProgressMode: PropTypes.bool.isRequired,
    gamesDic: PropTypes.object.isRequired
};

export default GameList;
