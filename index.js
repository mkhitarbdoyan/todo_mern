const express = require('express');
const mongoose = require('mongoose')

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({extended: true}));
app.use("/api/auth", require('./routes/auth.routes'));
app.use("/api/todo", require('./routes/todo.routes'));


async function start() {
    try {
        await mongoose.connect("mongodb+srv://mic123:mic123@cluster0.n906v.mongodb.net/newTodo?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        })
        app.listen(PORT,()=> console.log(`server started in port ${PORT}`))
    } catch (err) { console.log(err) }
}
start()