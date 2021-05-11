import PropTypes from 'prop-types';

const timeTaken = {Fast: 'Fast', Long: 'Long'};

const Expression = (props) => {
    let color = 'red';
    if (props.IsAnswered) {
        if (props.TimeTaken == timeTaken.Fast) {
            color = 'green';
        } else {
            color = 'orange';
        }
    }

    let durationElement = '';
    if (props.ShowDuration) {
        durationElement =
            <div role='history-duration' style={{display: 'inline-block'}}>[ {props.Duration} ]
            </div>;
    }

    return (
        <div role='history' style={{textAlign: 'center', color: color, fontSize: '15px'}}>
            <div style={{display: 'inline-block', padding: '5px'}}>
                {props.Operand1}
            </div>
            <div style={{display: 'inline-block', padding: '5px'}}>
                {props.Operator}
            </div>
            <div style={{display: 'inline-block', padding: '5px'}}>
                {props.Operand2}
            </div>
            <div style={{display: 'inline-block', padding: '5px'}}>=</div>
            <div style={{display: 'inline-block', padding: '5px'}}>
                {props.Result}
            </div>
            {durationElement}
        </div>
    );
};

Expression.propTypes = {
    Operand1: PropTypes.number.isRequired,
    Operand2: PropTypes.number.isRequired,
    Operator: PropTypes.string.isRequired,
    Result: PropTypes.number.isRequired,
    IsAnswered: PropTypes.bool.isRequired,
    TimeTaken: PropTypes.string.isRequired,
    Duration: PropTypes.number,
    ShowDuration: PropTypes.bool.isRequired,
};

Expression.defaultProps = {Duration: 0, ShowDuration: false};

export default Expression;
