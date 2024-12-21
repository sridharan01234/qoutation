import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { error = 'An unknown error occurred' } = req.query
  
  console.error('Auth error:', error)
  
  res.status(401).json({ error })
}