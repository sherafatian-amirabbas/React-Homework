import PropTypes from 'prop-types';

const Expression = (props) => {
    let durationElement = '';
    if (props.Duration) {
        durationElement =
            <div style={{display: 'inline-block'}}>[ {props.Duration} ]
            </div>;
    }

    return (
        <div role='history' style={{textAlign: 'center', color: props.Color, fontSize: '15px'}}>
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
    Color: PropTypes.string.isRequired,
    Duration: PropTypes.number,
};
Expression.defaultProps = {Duration: 0};

export default Expression;
