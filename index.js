import express from "express";
import bodyParser from "body-parser";
import mongoose, { connect, model } from "mongoose";
import _ from "lodash";
const app = express();
const port = 3000;
const { Schema } = mongoose;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_HoangVu:test123@cluster0.0l50ogx.mongodb.net/toDoListDB", {
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

const listsSchema = new Schema ({
    name: String,
    tasks: [tasksSchema]
})

const List = mongoose.model("List", listsSchema);

const currentDate = new Date();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let date = currentDate.getDate();
let day = daysOfWeek[currentDate.getDay()];
let month = monthsOfYear[currentDate.getMonth()];

app.get("/", async(req, res) => {
    try {
        const tasks = await Task.find({});
        if(tasks.length === 0) {
            await Task.insertMany(defaultTasks)
                .then(() => {
                    console.log("Successfully inserted default tasks.");
                })
                .catch(err => console.log(err));
            res.redirect("/");
        } else {
            res.render("index.ejs", {
                currentDay: day,
                currentMonth: month,
                currentDate: date,
                taskToday: tasks,
            });
        }
        
    } catch (error) {
        console.log(error);
    }
})

app.post("/addnewtask", async (req, res)=> {
    try {
        const newTaskName = req.body.newtask;
        const listName = _.capitalize(req.body.list);

        const newTask = new Task({
            name: newTaskName
        });

        if(listName === "Today"){
            await newTask.save();
            res.redirect("/");
        } else {
            await List.findOne({name: listName})
                .then((listNameFound) => {
                    listNameFound.tasks.push(newTask);
                    listNameFound.save();
                    res.redirect("/" + listName);
                })
                .catch(err => console.log(err));
        } 

    } catch (error) {
        console.log(error);
    }
})

app.post("/delete", async(req, res) => {
    try {
        const idTaskChecked = req.body.checkbox;
        const listNameChecked = req.body.listName;

        if(listNameChecked === "Today"){
            await Task.findByIdAndDelete(idTaskChecked)
                .then(() => console.log("Successfully deleted."))
                .catch((err) => console.log(err));
            res.redirect("/");
        } else {
            await List.findOneAndUpdate({name: listNameChecked}, {$pull: {tasks: {_id: idTaskChecked}}})
                .then(() => {
                    res.redirect("/" + listNameChecked);
                })
                .catch((err) => {
                    console.log(err);
                })
        }        
    } catch (error) {
        console.log(error);
    }
})

app.get("/:customListName", async(req, res) => {
    try {
        const customListName = _.capitalize(req.params.customListName);
        const customListNameChecked = await List.findOne({name: customListName}).exec();
        if(customListNameChecked){
            res.render("list.ejs", {
                listTitle: customListNameChecked.name,
                newListTask: customListNameChecked.tasks
            })
        } else {
            const list = new List ({
                name: customListName,
                tasks: defaultTasks
            })
            await list.save();
            res.redirect("/" + customListName);
        }
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})

    