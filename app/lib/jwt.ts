import jwt from 'jsonwebtoken'

export async function signJwtAccessToken(
  payload: any,
  options?: jwt.SignOptions
) {
  const secret = process.env.JWT_SECRET!
  const token = jwt.sign(payload, secret, {
    ...(options && options),
  })
  return token
}

export async function verifyJwtToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET!
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (error) {
    return null
  }
}
