import { Either, tryCatch as tryCatchBase } from 'fp-ts/Either'
import { Lazy } from 'fp-ts/function'

export function tryCatch<A>(f: Lazy<A>): Either<unknown, A> {
  return tryCatchBase(f, (e) => e)
}
