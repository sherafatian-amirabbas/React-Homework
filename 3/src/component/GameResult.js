import PropTypes from 'prop-types';
import ExpressionList from './ExpressionList';

const GameResult = (props) => {
    return (
        <div role='game-over' style={{textAlign: 'center', padding: '30px'}}>
            <div style={{display: 'inline-block'}}>
                Game Over. Time spent: {props.Duration} ms
            </div>
            <ExpressionList expressions={props.Histories}></ExpressionList>
        </div>
    );
};

GameResult.propTypes = {
    Duration: PropTypes.number.isRequired,
    Histories: PropTypes.array.isRequired,
};

export default GameResult;
