import log from 'loglevel'
import type { Reactive, Subscriber } from './types'

export type Store<S> = Reactive<S> & {
  getState(): S
  setState(setter: S | ((s: S) => S)): void
}

/**
 * A state store which accepts subscribers for state updates.
 */
export function Store<S>(initial: S): Store<S> {
  let current = initial
  const subscribers = new Set<Subscriber<S>>()

  function subscribe(subscriber: Subscriber<S>) {
    subscribers.add(subscriber)
    return () => unsubscribe(subscriber as VoidFunction)
  }

  function unsubscribe(subscriber: VoidFunction) {
    subscribers.delete(subscriber)
  }

  function writeState(newState: S) {
    log.debug('writeState', newState)
    current = newState
    for (const subscriber of subscribers) {
      subscriber(newState)
    }
  }

  return {
    subscribe,
    unsubscribe,
    getState() {
      return current
    },
    setState(setter: S | ((s: S) => S)) {
      if (typeof setter === 'function') {
        writeState((setter as (s: S) => S)(current))
      } else {
        writeState(setter as S)
      }
    },
  }
}
