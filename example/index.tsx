import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ITreeItem, SelectionType, Tree, TreeEventEmitter } from '../src';
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
  const [selected, setSelected] = React.useState<ITreeItem[]>([]);
  const [selection, setSelection] = React.useState<SelectionType>(
    SelectionType.All
  );
  const [multiSelect, setMultiSelect] = React.useState(false);

  const emitter = React.useRef(new TreeEventEmitter());

  React.useEffect(() => {
    console.log(selected);
  }, [selected]);

  const clearSelection = () => {
    emitter.current.emit('select', [], 'update');
  };

  const selectElement = () => {
    const select: ITreeItem[] = [];
    if (selection === SelectionType.Parent || selection === SelectionType.All) {
      select.push(MOCK_DATA[0]);
    }
    if (selection === SelectionType.Child || selection === SelectionType.All) {
      select.push(MOCK_DATA[0].children![0]);
    }
    emitter.current.emit('select', select, 'merge');
  };

  return (
    <div>
      <div style={{ padding: '1rem 0', display: 'flex' }}>
        <select
          id="selection"
          value={selection}
          onChange={(e) => setSelection(e.target.value as SelectionType)}
        >
          {Object.entries(SelectionType).map(([k, v]) => (
            <option key={v} value={v}>
              {k}
            </option>
          ))}
        </select>
        <div style={{ margin: '0 0.5rem' }}>
          <input
            type="checkbox"
            id="multiSelect"
            checked={multiSelect}
            onChange={() => setMultiSelect((x) => !x)}
          />
          <label htmlFor="multiSelect">multiSelect</label>
        </div>
      </div>
      <div>
        <button type="button" onClick={clearSelection}>
          Clear selected
        </button>
        <button
          type="button"
          onClick={selectElement}
          style={{ margin: '0 0.5rem' }}
        >
          Select some elements
        </button>
      </div>
      <hr />
      <Tree
        nodes={MOCK_DATA}
        selectionType={selection}
        multipleSelection={multiSelect}
        selectAction="check"
        onSelect={setSelected}
        renderCustomCheckbox={renderCheckbox}
        eventEmitter={emitter.current}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
