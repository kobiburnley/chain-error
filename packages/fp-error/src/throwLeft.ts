import { Either, isLeft } from 'fp-ts/Either'

export const throwLeft = async <E, A>(
  lazy: () => Promise<Either<E, A>>,
): Promise<A> => {
  const either = await lazy()
  if (isLeft(either)) {
    throw either.left
  }
  return either.right
}
