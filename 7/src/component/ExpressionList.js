import Expression from './Expression';
import PropTypes from 'prop-types';
import Library from '../Library';

const lib = new Library();

const ExpressionList = (props) => {
    const getElement = (expression, index, showExpressionDuration) => {
        return (<Expression Operand1={expression.operand1} Operator={expression.operator}
            Operand2={expression.operand2} Result={expression.result}
            IsAnswered={expression.isAnswered} TimeTaken={expression.timeTaken}
            key={ 'exp_' + expression.id + '_' + index.toString()}
            Duration={expression.duration ? expression.duration : 0}
            ShowDuration={showExpressionDuration}></Expression>);
    };
    const getFinishedGamesFromDic = (gamesDic) => {
        const games = [];
        for (const id in gamesDic) { // eslint-disable-line guard-for-in
            const game = gamesDic[id];
            if (game && game.mode == lib.GameMode.Finished) {
                games.push(game);
            }
        }
        return games;
    };

    const expressionEls = [];
    if (props.Expressions && props.Expressions.length != 0) {
        if (props.isFinishedMode) {
            const finishedGames = getFinishedGamesFromDic(props.gamesDic);
            const finishedGamesInDescendingOrder = lib.orderArrayBy(finishedGames, 'finishedDate', true);
            const len = finishedGamesInDescendingOrder.length;
            finishedGamesInDescendingOrder.forEach((game, index) => {
                if (index == 0) {
                    expressionEls.push(<div style={{padding: '10px', fontSize: '25px'}}
                        key={ 'last_' + game.id}>{'Last game'}</div>);
                } else {
                    if (index == 1) {
                        expressionEls.push(<div style={{padding: '10px', fontSize: '25px'}}
                            key={ 'prev_' + game.id}>{'Previous games'}</div>);
                    }

                    expressionEls.push(<div style={{padding: '10px', fontSize: '20px'}}
                        key={ 'game_' + game.id}>{'Game #' + (len - index).toString()}</div>);
                }
                const gameHistory = props.Expressions.filter((exp) => exp.id == game.id);
                const orderedExpressions = lib.orderArrayBy(gameHistory, 'timestamp', false);
                orderedExpressions.forEach((expression, index) => {
                    expressionEls.push(getElement(expression, index, props.ShowExpressionDuration));
                });
            });
        } else {
            const orderedExpressions = lib.orderArrayBy(props.Expressions, 'timestamp', false);
            orderedExpressions.forEach((expression, index) => {
                expressionEls.push(getElement(expression, index, props.ShowExpressionDuration));
            });
        }
    }
    return <div>{expressionEls}</div>;
};

ExpressionList.propTypes = {
    gamesDic: PropTypes.object.isRequired,
    Expressions: PropTypes.array.isRequired,
    ShowExpressionDuration: PropTypes.bool.isRequired,
    isFinishedMode: PropTypes.bool.isRequired,
};

ExpressionList.ShowExpressionDuration = {ShowExpressionDuration: false};

export default ExpressionList;
