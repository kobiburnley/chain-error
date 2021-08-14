export interface ChainErrorParams {
  readonly message?: string
  readonly cause?: unknown
}

export interface MaybeChainable {
  readonly cause?: unknown
  readonly stack?: string
}

function getLongStack(this: ChainError) {
  let s = this.originalStack
  let current = this.cause as MaybeChainable | undefined
  while (current != null) {
    const causeStack = current?.stack ?? String(current)
    s += '\nCaused by: ' + causeStack
    current = current?.cause as MaybeChainable | undefined
  }

  return s
}

export interface ChainError {
  readonly _tag: string
}

export class ChainError extends Error {
  public readonly cause?: unknown
  public readonly originalStack?: string

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

    // for `isChainableError` helper
    Object.defineProperty(this, '_tag', {
      value: 'ChainError',
      enumerable: false,
    })

    Object.defineProperty(this, 'cause', {
      value: cause,
      enumerable: false,
    })

    Object.defineProperty(this, 'originalStack', {
      value: this.stack,
      enumerable: false,
    })

    Object.defineProperty(this, 'stack', {
      get: getLongStack,
    })
  }
}
