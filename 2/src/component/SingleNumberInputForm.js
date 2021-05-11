import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Library from '../logic/Library';

const lib = new Library();

export default class SingleNumberInputForm extends Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(event) {
        const inputValue = parseInt(this.input.current.value);
        const suppress = this.props.AlertMessageOnWrongUserInput ? false : true;
        if (lib.isBetween(inputValue, this.props.MinNumber, this.props.MaxNumber, suppress)) {
            this.props.onSubmit(inputValue);
        }
    }
    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '20px'}}>
                    {this.props.Label}
                </div>
                <div style={{display: 'inline-block', padding: '20px'}}>
                    <input type='number'
                        style={{width: '50px', height: '30px', fontSize: '20px'}}
                        ref={this.input}
                        defaultValue={this.props.DefaultNumber}
                        min={this.props.MinNumber}
                        max={this.props.MaxNumber} />
                </div>
                <div style={{padding: '20px'}}>
                    <button style={{width: '100px', height: '40px', fontSize: '25px'}}
                        onClick={this.onSubmit}>
                        {this.props.SubmissionLabel}
                    </button>
                </div>
            </div>
        );
    }
}
SingleNumberInputForm.propTypes = {
    Label: PropTypes.string.isRequired,
    MinNumber: PropTypes.number, // since I have seen this form more general this prop is not required
    MaxNumber: PropTypes.number, // since I have seen this form more general this prop is not required
    DefaultNumber: PropTypes.number.isRequired,
    SubmissionLabel: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    AlertMessageOnWrongUserInput: PropTypes.bool.isRequired,
};
