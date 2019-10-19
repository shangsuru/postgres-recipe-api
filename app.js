const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const recipeRouter = require('./routes/recipe')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/recipes', recipeRouter)

app.listen(process.env.PORT || 3050, () => {
  console.log('Server listening')
})
