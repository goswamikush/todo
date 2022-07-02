const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Task = require("./models/task");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { takeCoverage } = require('v8');

mongoose.connect('mongodb://localhost:27017/todo1');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('database connected');
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const tasks = await Task.find({});
    res.render('home', { tasks });
}) 

app.get('/home', async (req, res) => {
    const tasks = await Task.find({});
    res.render('home', { tasks });
}) 

app.get('/new', (req, res) => {
    res.render('new');
})

app.delete('/delete/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/home');
})


app.get('/edit/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('edit', { task });
})

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, {...req.body.task});
    res.redirect('../home');
})

app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body.task);
    await newTask.save();
    res.redirect('home');
})


app.listen(3000, () => {
    console.log('port 3000');
})
