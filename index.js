const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const questionsModel = require("./database/Question");
const answersModel = require("./database/Answer");
require("dotenv").config();

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Connection made to the database!")
    })
    .catch((msgError) => {
        console.log(msgError);
    })

//Tells Express to use EJS as a View Engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route
// "render" command that calls the .ejs file
// Within the parenthesis inform the file that will be called
app.get("/", (req, res) => {
    questionsModel.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(questions => {
        res.render("index", {
            questions: questions
        });
    });
});

app.get("/toask", (req, res) => {
    res.render("toask");
})

app.post("/savequestion", (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    questionsModel.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/question/:id", (req, res) => {
    var id = req.params.id;
    questionsModel.findOne({
        where: { id: id }
    }).then(questions => {
        if (questions != undefined) {
            answersModel.findAll({
                where: { questionId: questions.id },
                order: [['id', 'DESC']]
            }).then(answers => {
                res.render("question", {
                    questions: questions,
                    answers: answers
                });
            });
        } else {
            res.redirect("/");
        }
    });
});

app.post("/saveanswer", (req, res) => {
    var body = req.body.bodyText;
    var questionId = req.body.questionId;
    answersModel.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect("/question/" + questionId);
    });
});

app.listen(process.env.serverPort, () => {
    console.log("App running successfully!");
});