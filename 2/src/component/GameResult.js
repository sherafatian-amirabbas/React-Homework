import PropTypes from 'prop-types';

const GameResult = (props) => {
    return (
        <div style={{textAlign: 'center', padding: '30px'}}>
            <div style={{display: 'inline-block'}}>
                Game Over. Time spent: {props.Duration} ms
            </div>
        </div>
    );
};

GameResult.propTypes = {
    Duration: PropTypes.number.isRequired,
};

export default GameResult;
