const express = require('express')
const cors = require('cors')
const { createDatabaseConnection } = require('./database.js')
const UserRoutes = require('./userRoutes.js')

const app = express()
app.use(express.json())
app.use(cors())
createDatabaseConnection()

app.use('/user', UserRoutes);



app.listen(4000, () => {
    console.log('Server Running at port 4000...')
})

