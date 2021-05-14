import CurrentGame from '../src/component/CurrentGame';

describe('CurrentGameComponent', () => {
    it('render', () => {
        <CurrentGame gamesDic={{}}
            onEvaluate={() => {}}
            onSkip={() => {}}
            onNewGame={() => {}}
            histories={[]}
            onClose={() => {}}
            wsPlayerList={[]}
            wsPlayerId=''
            wsPlayerName=''
        />;
    });
});
