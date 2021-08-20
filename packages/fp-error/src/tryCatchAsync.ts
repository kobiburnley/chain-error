import { TaskEither, tryCatch as tryCatchBase } from 'fp-ts/TaskEither'
import { Lazy } from 'fp-ts/function'
import { Either } from 'fp-ts/Either'

export function tryCatchTask<A>(f: Lazy<Promise<A>>): TaskEither<unknown, A> {
  return tryCatchBase(f, (e) => e)
}

export function tryCatchAsync<A>(f: Lazy<Promise<A>>): Promise<Either<unknown, A>> {
  return tryCatchTask(f)()
}
