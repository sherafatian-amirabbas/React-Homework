import Expression from './Expression';
import PropTypes from 'prop-types';
import Library from '../logic/Library';

const lib = new Library();

const ExpressionList = (props) => {
    const expressionEls = [];

    if (props.Expressions && props.Expressions.length != 0) {
        const rounds = lib.getArrayMax(props.Expressions, (exp) => exp.round);

        for (let round = rounds; round > 0; round--) {
            if (props.ShowRoundTitle && round == rounds) {
                expressionEls.push(<div style={{padding: '10px',
                    fontSize: '25px'}} key={ 'last_' + round.toString()}>
                    {'Last game'}</div>);
            }

            const roundHistories = props.Expressions.filter((exp) => exp.round == round);
            if (roundHistories.length) {
                if (props.ShowRoundTitle && round != rounds) {
                    if (round == rounds - 1) {
                        expressionEls.push(<div style={{padding: '10px', fontSize: '25px'}}
                            key={ 'prev_' + round.toString()}>{'Previous games'}</div>);
                    }

                    expressionEls.push(<div style={{padding: '10px', fontSize: '20px'}}
                        key={ 'game_' + round.toString()}>{'Game #' + round.toString()}</div>);
                }

                const orderedExpressions = lib.orderArrayBy(roundHistories, props.OrderColumnName);
                orderedExpressions.forEach((expression, index) => {
                    expressionEls.push(
                        (<Expression Operand1={expression.operand1}
                            Operator={expression.operator}
                            Operand2={expression.operand2}
                            Result={expression.result}
                            IsAnswered={expression.isAnswered}
                            TimeTaken={expression.timeTaken}
                            key={ 'exp_' + round.toString() + '_' + index.toString()}
                            Duration={expression.duration ? expression.duration : 0}
                            ShowDuration={props.ShowExpressionDuration}>
                        </Expression>)
                    );
                });
            }
        }
    }

    return <div>{expressionEls}</div>;
};

ExpressionList.propTypes = {
    Expressions: PropTypes.array.isRequired,
    ShowExpressionDuration: PropTypes.bool.isRequired,
    OrderColumnName: PropTypes.string.isRequired,
    ShowRoundTitle: PropTypes.bool.isRequired,
};

ExpressionList.ShowExpressionDuration = {ShowExpressionDuration: false};

export default ExpressionList;
