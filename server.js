const express=require('express');
const app= express();
const connectDB=require('./config/db');
//Connect Mongoose DB
connectDB();
app.get('/',(req,res)=>res.send('API is running'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server is running at PORT ${PORT}`));