const express=require('express')
const cors=require('cors')
const app=express()
require('dotenv').config()
require('./db/conn')

const port=process.env.PORT
const router=require('./router/route')

app.use(cors()) 
app.use(express.json())
app.use(router)

app.listen(port,()=>{
    console.log(`Server working at port ${port}`)
})

