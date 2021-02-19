import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ITreeItem, SelectionType, Tree } from '../src';
import { MOCK_DATA } from '../mock';

const App = () => {
  const [state, setState] = React.useState<ITreeItem[]>([]);

  React.useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div>
      <Tree
        nodes={MOCK_DATA}
        selectionType={SelectionType.Child}
        onSelect={setState}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
