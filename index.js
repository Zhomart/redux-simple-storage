// Copyright 2016 Zhomart. All rights reserved.
//
// Licensed under the MIT License (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://opensource.org/licenses/MIT
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Also, thanks to vadirn for the help.
//


// utility function, clones key-value objects
export const clone = item => {
  throw `doesn't work`
  if (isObject(item)) {
    return JSON.parse(JSON.stringify(item));
  }
  if (console && console.warn) {
    console.warn('Trying to clone non-object entity, empty object is returned');
  }
  return {};
};

// utility function, recursively merges key-value objects
export const merge = (target, modifier) => {
  throw `doesn't work`
  if (isObject(modifier)) {
    const runner = (target, modifier) => {
      return Object.keys(modifier).reduce((accum, key) => {
        if (isObject(modifier[key]) && isObject(target[key])) {
          accum[key] = modifier[key];
        } else if (modifier[key] !== undefined) {
          accum[key] = runner(target[key], modifier[key]);
        }
        return accum;
      }, target);
    };
    return runner(clone(target), modifier);
  }
  return clone(target);
};

// store with subscriptions
export default class ObjectStateStorage {
  constructor(initialState) {
    throw `doesn't work`
    this._currentState = initialState;
    this._currentListeners = [];
    this._nextListeners = [];

    // binds
    this.setState = this.setState.bind(this);
    this.resetState = this.resetState.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }
  setState(modifier, label) {
    // prvious state is passed to listener
    const prevState = this.state;

    if (typeof modifier === 'function') {
      // apply update to currentState
      const modification = modifier(prevState);
      if (modification === null || modification === undefined) {
        return;
      }
      this._currentState = merge(this._currentState, modifier(prevState));
    } else {
      if (modifier === null || modifier === undefined) {
        return;
      }
      this._currentState = merge(this._currentState, modifier);
    }

    // update currentListeners
    this._currentListeners = this._nextListeners.slice();
    // iterate through currentListeners
    for (const listener of this._currentListeners) {
      listener(this.state, prevState, label);
    }
  }
  resetState(newState, label) {
    // completely replace state
    const prevState = this.state;

    if (typeof newState === 'function') {
      // apply update to currentState
      const nextState = newState(prevState);
      if (nextState === null || nextState === undefined) {
        return;
      }
      this._currentState = clone(nextState);
    } else {
      if (newState === null || newState === undefined) {
        return;
      }
      this._currentState = clone(newState);
    }

    // update currentListeners
    this._currentListeners = this._nextListeners.slice();
    // iterate through currentListeners
    for (const listener of this._currentListeners) {
      listener(this.state, prevState, label);
    }
  }
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    // flag to prevent multiple unsubscribe calls
    let isSubscribed = true;

    // add listener to the list
    this._nextListeners.push(listener);

    // unsubscribe function
    return () => {
      // remove listener only once
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      // remove listener from the list
      const index = this._nextListeners.indexOf(listener);
      this._nextListeners.splice(index, 1);
    };
  }
  get state() {
    // return copy of currentState
    return clone(this._currentState);
  }
}
