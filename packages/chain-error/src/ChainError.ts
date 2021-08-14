export interface ChainErrorParams {
  readonly message?: string
  readonly cause?: unknown
}

export interface Chainable {
  readonly cause?: unknown
  readonly stack?: string
}

function getOriginalStack(this: ChainError) {
  return this._originalStack
}

function getStack(this: ChainError) {
  return this.longStack
}

function getLongStack(this: ChainError) {
  if (this._longStack == null) {
    let s = this._originalStack
    let current = this.cause
    while (current != null) {
      const causeStack = (current as Chainable)?.stack ?? String(current)
      s += '\nCaused by: ' + causeStack
      current = (current as Chainable)?.cause
    }

    Object.defineProperty(this, '_longStack', {
      value: s,
      enumerable: false,
    })
  }

  return this._longStack
}

export interface ChainError {
  readonly cause: unknown
  readonly longStack?: string
  readonly originalStack?: string
  readonly _tag: string
}

export class ChainError extends Error {
  public readonly _originalStack?: string
  public readonly _longStack?: string

  constructor(params?: ChainErrorParams)
  constructor(message?: string, cause?: unknown)
  constructor(
    paramsOrMessage: ChainErrorParams | string = {},
    maybeCause?: unknown,
  ) {
    const { cause, message } =
      typeof paramsOrMessage === 'string'
        ? { message: paramsOrMessage, cause: maybeCause }
        : paramsOrMessage

    super(message)

    Object.defineProperty(this, '_tag', {
      value: 'ChainError',
      enumerable: false,
    })

    Object.defineProperty(this, 'cause', {
      get() {
        return cause
      },
      configurable: true,
    })

    // memoize original stack before overriding `stack` property
    Object.defineProperty(this, '_originalStack', {
      value: this.stack,
      enumerable: false,
    })

    Object.defineProperty(this, 'stack', {
      get: getStack,
    })

    Object.defineProperty(this, 'originalStack', {
      get: getOriginalStack,
    })

    Object.defineProperty(this, 'longStack', {
      get: getLongStack,
    })
  }
}
