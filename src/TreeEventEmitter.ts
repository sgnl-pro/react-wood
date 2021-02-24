import { ITreeItem } from './types';

interface Unsubscribe {
  (): void;
}

export interface ITreeEvents {
  select(items: ITreeItem[], type?: 'merge' | 'update'): void;
}

export class TreeEventEmitter {
  constructor(
    private _events: {
      [E in keyof ITreeEvents]: ITreeEvents[E][];
    } = Object.create(null)
  ) {}

  public on<K extends keyof ITreeEvents>(
    event: K,
    listener: ITreeEvents[K]
  ): Unsubscribe {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].push(listener);

    return () => {
      this._events[event] = (this._events[event] ?? []).filter(
        (l) => l !== listener
      );
    };
  }

  public emit<K extends keyof ITreeEvents>(
    event: K,
    ...listenerArgs: Parameters<ITreeEvents[K]>
  ) {
    (this._events[event] ?? []).forEach(
      (cb) => cb(...(listenerArgs as Parameters<typeof cb>)) // TODO
    );
  }
}
