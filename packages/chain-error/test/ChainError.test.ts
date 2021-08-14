import { ChainError } from '../src'

jest.useFakeTimers()

async function flush(promise: Promise<unknown>) {
  const setImmediatePromise = new Promise(setImmediate)
  jest.runOnlyPendingTimers()
  await setImmediatePromise
  return promise
}

async function original() {
  throw new Error('Original Error')
}

async function chain1() {
  try {
    await original()
  } catch (e) {
    throw new ChainError({ message: 'chain1', cause: e })
  }
}

async function chain2() {
  try {
    await chain1()
  } catch (e) {
    throw new ChainError('chain2', e)
  }
}

describe('ChainError', () => {
  it('prints string cause', () => {
    const e = new ChainError({
      message: 'Prints string',
      cause: 'String cause',
    })

    expect(e.stack).toContain('Caused by: String cause')
  })

  it('chains causes to error stack', async () => {
    const promise = chain2()

    let error: Error | null = null
    try {
      await flush(promise)
    } catch (e) {
      error = e
    }

    const stack = error?.stack;

    expect(stack).toContain('Caused by: Error: chain1')
    expect(stack).toContain('Caused by: Error: Original Error')
  })
})
