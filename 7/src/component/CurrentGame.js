import React from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';
import Game from './Game';
import GameResult from './GameResult';
import Monitor from './Monitor';
import Library from '../Library';

const lib = new Library();

const CurrentGame = (props) => {
    const params = useParams();
    const currentGame = props.gamesDic[params.gameId];
    if(currentGame) {
        let markup = '';
        if (currentGame.mode == lib.GameMode.InProgress) {
            markup = <Game Operand1={currentGame.expression.lhs}
                Operand2={currentGame.expression.rhs} Operator={currentGame.expression.operator}
                onEvaluate={props.onEvaluate} AlertMessageOnWrongUserInput={false}
                Histories={currentGame.currentHistories} OrderHistoryColumnName={'timestamp'}
                SkipVisibility={currentGame.skipVisibility} onSkip={props.onSkip}></Game>;
        } else if (currentGame.mode == lib.GameMode.Finished) {
            markup = <GameResult Duration={currentGame.gameDuration} Histories={props.histories}
                onNew={props.onNewGame} OrderHistoryColumnName={'timestamp'}></GameResult>;
        }

        return (
            <div>
                <Monitor disconnectHandler={props.onClose} players={props.wsPlayerList}
                    currentPlayer={{id: props.wsPlayerId, name: props.wsPlayerName}}></Monitor>
                {markup}
            </div>
        )
    }
    else {
        return (<div style={{textAlign: 'center', fontSize:'20px', padding: '20px 0px 0px 0px'}}>
                Game {params.gameId} not found
            </div>)
    }
};

CurrentGame.propTypes = {
    gamesDic: PropTypes.object.isRequired,
    onEvaluate: PropTypes.func.isRequired,
    onSkip: PropTypes.func.isRequired,
    onNewGame: PropTypes.func.isRequired,
    histories: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    wsPlayerList: PropTypes.array.isRequired,
    wsPlayerId: PropTypes.string.isRequired,
    wsPlayerName: PropTypes.string.isRequired,
};

export default CurrentGame;
