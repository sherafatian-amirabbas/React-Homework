import PropTypes from 'prop-types';
import ExpressionList from './ExpressionList';

const GameResult = (props) => {
    const onNew = () => props.onNew();

    return (
        <div role='game-over' style={{textAlign: 'center', padding: '30px'}}>
            <div>
                Game Over. Time spent: {props.Duration} ms
            </div>
            <div style={{display: 'inline-block', padding: '20px'}}>
                <button style={{width: '100px', height: '30px', fontSize: '15px'}}
                    aria-label="newGame-button" onClick={onNew}>New Game</button>
            </div>
            <ExpressionList Expressions={props.Histories} ShowExpressionDuration={true}
                isFinishedMode={true} gamesDic={props.gamesDic}></ExpressionList>
        </div>
    );
};

GameResult.propTypes = {
    gamesDic: PropTypes.object.isRequired,
    Duration: PropTypes.number.isRequired,
    Histories: PropTypes.array.isRequired,
    onNew: PropTypes.func.isRequired,
};

export default GameResult;
