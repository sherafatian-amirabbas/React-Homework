import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.onChange = this.onChange.bind(this);
    }
    onChange(event) {
        const inputValue = parseInt(this.input.current.value);
        if (isNaN(inputValue)) {
            if (this.props.AlertMessageOnWrongUserInput) {
                alert('input value is not valid!');
            }
            return;
        } else {
            this.props.onEvaluate(inputValue);
        }
    }
    componentDidMount() {
        this.input.current.focus();
    }
    componentDidUpdate() {
        this.input.current.focus();
    }
    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '20px'}}>
                    {this.props.Operand1}
                </div>
                <div style={{display: 'inline-block', padding: '20px'}}>
                    {this.props.Operator}
                </div>
                <div style={{display: 'inline-block', padding: '20px'}}>
                    {this.props.Operand2}
                </div>
                <div style={{display: 'inline-block', padding: '20px'}}>=</div>
                <div style={{display: 'inline-block', padding: '20px'}}>
                    <input
                        type='number'
                        ref={this.input}
                        style={{width: '50px', height: '30px', fontSize: '20px'}}
                        onChange={this.onChange}
                        key={(new Date()).getTime()}
                    />
                </div>
            </div>
        );
    }
}

Game.propTypes = {
    NumberOfRound: PropTypes.number.isRequired,
    Operand1: PropTypes.number.isRequired,
    Operand2: PropTypes.number.isRequired,
    Operator: PropTypes.string.isRequired,
    onEvaluate: PropTypes.func.isRequired,
    AlertMessageOnWrongUserInput: PropTypes.bool.isRequired
};
