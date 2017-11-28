# Redux Global Storage

Redux Global Storage is a tiny state container written in es6.

It is based on [Redux](https://github.com/reactjs/redux), but has no reducers and actions.
You can also have as many storage units as you want.

Install with `npm install --save redux-global-storage` or `yarn add redux-global-storage`.


## Usage

```javascript
import ObjectStateStorage from 'redux-global-storage';
import { merge, clone } from 'redux-global-storage';

// create a storage unit with initial value { foo: 'bar' }
const store = new ObjectStateStorage({ foo: 'bar' });

// subscribe to store updates
const unsubscribe = store.subscribe((curState, prevState) => {
  // log previous state and current state
  console.log(curState, prevState);
  // unsubscribe
  unsubscribe();
});

// update the state (merges current state and provided object)
// expect to see in console { foo: 'bar' } and { foo: 'bar', bar: 'foo' }
store.setState({ bar: 'foo' });

// log current state after store was updated
// expect the following object to be in console.log
// {
//   foo: 'bar',
//   bar: 'foo',
// }
console.log(store.state);

// resets the state (replaces current state and provided object)
store.resetState({ foobar: 'foobar' });

// expect to see { foobar: 'foobar' } in console
console.log(store.state);

// immutable merge, used in setState:
const mergeExample = { foo: 'bar' };
const mergeResult = merge(mergeExample, { bar: 'foo' });

// expect { foo: 'bar' }
console.log(mergeExample);
// expect { foo: 'bar', bar: 'foo' }
console.log(mergeResult);

// clone:
const cloneExample = { foo: 'bar' };
const cloneResult = clone(cloneExample);
cloneExample.bar = 'foo';

// expect { foo: 'bar', bar: 'foo' }
console.log(cloneExample);
// expect { foo: 'bar' }
console.log(cloneResult);

```


## Disclaimer

Don't use this package in your projects. It's still work in progress. I'm not responsible for anything happens to you, your project or anyone/anything else if you use this package. I warned you. Seriously!


## Maintainers

- Zhomart Mukhamejanov
