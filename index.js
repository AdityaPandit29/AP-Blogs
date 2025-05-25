// import { time } from "console";
import express from "express";
import {dirname} from "path";
import {fileURLToPath} from "url";

const app = express();
const port = 3000;
const __dirName = dirname(fileURLToPath(import.meta.url));
var blogArr = [];
var timeArr = [];
var username;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // bodyParser

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/createPost", (req, res) => {
    res.render("create.ejs", {
        uname : username
    });
});

app.get("/myPosts", (req, res) => {
    res.render("viewPosts.ejs", {
        blogs : blogArr,
        time : timeArr
    });
});

app.get("/about", (req, res) => {
    res.render("about.ejs")
});


app.post("/createPost", (req, res) => {
    username = req.body.username;
    res.render("create.ejs", {
        uname : username
    });
});

app.post("/myPosts", (req, res) => {
    setBlogs(req.body.blog);
    setTime();
    res.render("viewPosts.ejs", {
        blogs : blogArr,
        time : timeArr
    });
});

app.post("/deletePost", (req, res) => {
    let index = req.body.index;
    deleteBlog(index);
    res.redirect("/myPosts");
});

app.post("/editPost", (req, res) => {
    let index = req.body.index;

    res.render("editPost.ejs", {
        blog : blogArr[index]
    });
    deleteBlog(index);
});

function setBlogs(blog) {
    blogArr.push(blog);
}

function setTime() {
    let now = new Date();
    let hours = (now.getHours() % 12).toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let timeMarker = "am";

    if(now.getHours() === 0 || now.getHours() === 12) hours = 12;
    if(now.getHours() >= 12) timeMarker = "pm"
    timeArr.push(`${hours}:${minutes} ${timeMarker}`);
}

function deleteBlog(index) {
    blogArr.splice(index, 1);
    timeArr.splice(index, 1);
}


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});