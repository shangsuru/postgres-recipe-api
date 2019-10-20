const jwt = require('jsonwebtoken')
const pool = require('../db/connection')
require('dotenv').config()

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    pool.query(
      'select * from users where username=$1',
      [decoded.username],
      (error, results) => {
        if (error || results.rows.length === 0) {
          throw error
        } else {
          req.token = token
          req.username = results.rows[0].username
          next()
        }
      }
    )
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' })
  }
}

module.exports = auth
