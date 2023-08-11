import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let taskArray = [];
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
    });
})

app.post("/addnewtask", (req, res)=> {
    let task = req.body["newtask"];
    taskArray.push(task);
    res.render("index.ejs", {
        currentDay: day,
        currentMonth: month,
        currentDate: date,
        taskArrayToday: taskArray,
    })
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})