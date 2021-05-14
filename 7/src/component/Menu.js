import {Link} from 'react-router-dom';

const Menu = (props) => {
    return (
        <div style={{textAlign: 'center', fontSize: '20px'}}>
            <ul>
                <li style={{display: 'inline-block', padding: '0px 10px 0px 10px'}}>
                    <Link to="/">Home</Link>
                </li>
                <li style={{display: 'inline-block', padding: '0px 10px 0px 10px'}}>
                    <Link to="/createGame">Create Game</Link>
                </li>
                <li style={{display: 'inline-block', padding: '0px 10px 0px 10px'}}>
                    <Link to="/players">Players</Link>
                </li>
                <li style={{display: 'inline-block', padding: '0px 10px 0px 10px'}}>
                    <Link to="/ongoingGames">Ongoing Games</Link>
                </li>
                <li style={{display: 'inline-block', padding: '0px 10px 0px 10px'}}>
                    <Link to="/finishedGames">Finished Games</Link>
                </li>
            </ul>
        </div>
    );
};

export default Menu;
