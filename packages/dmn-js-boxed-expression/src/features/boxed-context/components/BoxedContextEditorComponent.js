import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { withChangeSupport } from '../../../util/withChangeSupport';
import Input from 'dmn-js-shared/lib/components/Input';

class _BoxedContextEditorComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._boxedContext = context.injector.get('boxedContext');
    this._entries = boxedContext.getEntries(expression);
  }

  getEntries = () => {
    return this._entries;
  }

  addEntry = () => {
    this._boxedContext.addEntry(expression);
  };

  render() {
    const entries = this.getEntries();

    return (
    <table className="boxed-context">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        { entries.map((entry, idx) => (
          <ContextEntry
            key={ idx }
            entry={ entry }
            parent={ expression }
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={ 2 }>
            <button onClick={ addEntry }>Add entry</button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
  }
}

const ContextEntry = withChangeSupport(_ContextEntry, props => [ props.entry ]);

function _ContextEntry({ entry, parent }, context) {

  const variable = entry.get('variable');
  const value = entry.get('value');

  const Expression = context.components.getComponent('expression', {
    expression: value
  });

  const onNameChange = value => {
    context.injector.get('modeling').updateProperties(variable, { name: value });
  };

  return (
    <tr className="boxed-context-entry">
      <td>
        <Input onChange={ onNameChange } value={ variable.name } />
      </td>
      <td>
        <Expression parent={ entry } expression={ value } />
      </td>
    </tr>
  );
}

const BoxedContextEditorComponent = withChangeSupport(
  _BoxedContextEditorComponent,
  props => [ props.expression ]
);

export class BoxedContextComponentProvider {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:Context')) {
        return BoxedContextEditorComponent;
      }
    });
  }
}
