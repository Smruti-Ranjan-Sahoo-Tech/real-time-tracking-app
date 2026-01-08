const server=require('./src/app')
require('dotenv').config()


server.listen(4000,()=>console.log("server beb connected"))
// app.listen(4000,()=>console.log("server beb connected"))