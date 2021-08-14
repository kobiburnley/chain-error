import { ChainError } from './ChainError'

export function isChainError(e: unknown): e is ChainError {
  return e != null && (e as { _tag?: unknown })._tag === 'ChainError'
}
