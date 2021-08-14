import { tryCatch } from '../src'
import { ChainError, isChainError } from '@qoby/chain-error'
import { isLeft } from 'fp-ts/Either'

describe('tryCatch', () => {
  it('catches', () => {
    let error: Error | null = null
    try {
      const either = tryCatch(() => {
        throw new ChainError('EitherChain', new Error('Root Cause'))
      })

      if (isLeft(either)) {
        throw either.left
      }
    } catch (e) {
      error = e
    }

    expect(isChainError(error)).toBe(true)
    expect(error?.stack).toContain('Root Cause')
  })
})
