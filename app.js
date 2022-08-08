require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrpyt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// connect to mongodb server
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
mongoose.set("useCreateIndex", true)

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});



// mongoose model
const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
	res.render("home");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.get("/logout", (req, res) => {
	res.redirect("/");
});

app.post("/register", (req, res) => {
	bcrpyt.hash(req.body.password, saltRounds, (err, hash) => {
		const newUser = new User({
			email: req.body.username,
			password: hash,
		});

		newUser.save((err) => {
			if (err) {
				console.log(err);
			} else {
				res.render("secrets");
			}
		});
	});
});

app.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({ email: username }, (err, foundUser) => {
		if (err) {
			console.log(err);
		} else {
			if (foundUser) {
				bcrpyt.compare(password, foundUser.password, (err, result) => {
					if (result === true) {
						res.render("secrets");
					}
				});
			}
		}
	});
});

app.listen(5000, function () {
	console.log("Server started on port 5000...");
});
