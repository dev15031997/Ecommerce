const mongoose=require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/ecommerce',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Connection Succesful with DB')
}).catch((error)=>{
    console.log('Connection Failed with DB', error)
})

