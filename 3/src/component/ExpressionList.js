import Expression from './Expression';
import PropTypes from 'prop-types';

const ExpressionList = (props) => {
    const expressionEls = props.expressions.map((expression, index) => {
        return (
            <Expression Operand1={expression.operand1}
                Operator={expression.operator}
                Operand2={expression.operand2}
                Result={expression.result}
                Color={expression.color}
                key={index}
                Duration={expression.duration ? expression.duration : 0}>
            </Expression>
        );
    });
    return <div>{expressionEls}</div>;
};

ExpressionList.propTypes = {
    expressions: PropTypes.array.isRequired,
};

export default ExpressionList;
