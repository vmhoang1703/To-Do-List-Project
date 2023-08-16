import express from "express";
import bodyParser from "body-parser";
import mongoose, { connect, model } from "mongoose";
const app = express();
const port = 3000;
const { Schema } = mongoose;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB", {
    useNewUrlParser: true
});

const tasksSchema = new Schema({
    name: String
});

const Task = mongoose.model("Task", tasksSchema);

const task1 = new Task ({
    name: "Welcome to your To Do List!"
})

const task2 = new Task ({
    name: "Add new your task on the search box."
})

const task3 = new Task ({
    name: "<-- Hit this to delete a task."
})

const defaultTasks = [task1, task2, task3];

Task.insertMany(defaultTasks)
    .then(console.log("Successfully inserted."))
    .catch(err => console.log(err)); 


let taskArray = [];
let workArray = [];
const currentDate = new Date();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let date = currentDate.getDate();
let day = daysOfWeek[currentDate.getDay()];
let month = monthsOfYear[currentDate.getMonth()];

app.get("/", (req, res) => {
    res.render("index.ejs", {
        currentDay: day,
        currentMonth: month,
        currentDate: date,
        taskArrayToday: taskArray,
    });
})

app.post("/addnewtask", (req, res)=> {
    let task = req.body["newtask"];
    taskArray.push(task);
    res.redirect("/")
})

app.get("/work", (req, res) => {
    res.render("work.ejs", {
        currentDay: day,
        currentMonth: month,
        currentDate: date,
        workArrayToday: workArray,
    });
})

app.post("/work/addnewwork", (req, res)=> {
    let work = req.body["newwork"];
    workArray.push(work);
    res.redirect("/work");
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})