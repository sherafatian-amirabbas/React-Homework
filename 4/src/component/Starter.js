import PropTypes from 'prop-types';
import SingleNumberInputForm from './SingleNumberInputForm';

const Starter = (props) => {
    return (
        <div>
            <div style={{textAlign: 'center', padding: '30px'}}>
                Hi, this is <div role='player-name' style={{color: 'red', display: 'inline-block'}}>
                    {props.PlayerName}</div>
                &apos;s math game, choose your parameters and get to calculating!
            </div>
            <SingleNumberInputForm
                Label='Number of rounds:'
                MinNumber={1}
                MaxNumber={20}
                DefaultNumber={3}
                SubmissionLabel='START'
                AlertMessageOnWrongUserInput={props.AlertMessageOnWrongUserInput}
                onSubmit={props.onSubmit}>
            </SingleNumberInputForm>
        </div>
    );
};

Starter.propTypes = {
    PlayerName: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    AlertMessageOnWrongUserInput: PropTypes.bool.isRequired,
};

export default Starter;
