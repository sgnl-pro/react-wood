import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ITreeItem, SelectionType, Tree } from '../src';
import { MOCK_DATA } from '../mock';

const renderCheckbox = (checked: boolean, onChange: () => void) => (
  <input
    type="checkbox"
    style={{ marginRight: '1rem' }}
    checked={checked}
    onChange={onChange}
    onClick={(e) => e.stopPropagation()}
  />
);

const App = () => {
  const [state, setState] = React.useState<ITreeItem[]>([]);

  React.useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div>
      <Tree
        nodes={MOCK_DATA}
        selectionType={SelectionType.Parent}
        selectAction="check"
        onSelect={setState}
        renderCustomCheckbox={renderCheckbox}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
