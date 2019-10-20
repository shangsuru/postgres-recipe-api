const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const recipeRouter = require('./routes/recipe')
const userRouter = require('./routes/user')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/recipes', recipeRouter)
app.use('/users', userRouter)

app.listen(process.env.PORT || 3050, () => {
  console.log('Server listening')
})
