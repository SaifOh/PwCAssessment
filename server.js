var rp = require('request-promise');
var request = require('request');
var express = require('express');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser')
var path = require('path');
var md5 = require('md5')
var base64 = require('base-64');


const fs = require('fs');

const jwt = require('jsonwebtoken');
const port = process.env.PORT || 8080;


var log_file = fs.createWriteStream(__dirname + '/debug.log', {
    flags: 'a'
});

const sqlite3 = require("sqlite3").verbose()

//What does a user have?
//uid(generated), username(unique-string), password(string), email(string), type(bool)(Regular/Admin)
let db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.log("Error Connecting to users database");
        console.error(err.message);
    } else {
        db.exec(`create table if not exists "Users"(
            uid integer PRIMARY KEY AUTOINCREMENT,
            username string,
            password string,
            email string,
            type bool
        );`)
    }
    console.log('Connected to Users database.');
});

//What does the complaints db have?
//cid(generated), uid(refers to userid),type(bool)(refers to complaint type 0/1 service/employee) context(string)(what the complaint is),status(string),
let db2 = new sqlite3.Database('./complaints.db', (err) => {
    if (err) {
        console.log("Error Connecting to Complaints database");
        console.error(err.message);
    } else {
        db2.exec(`create table if not exists "Complaints"(
            cid integer PRIMARY KEY AUTOINCREMENT,
            uid string,
            type bool,
            context string,
            status string
        );`)
    }
    console.log('Connected to Complaints database.');
});


//Initialize the server to listen to requests and such

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(cookieParser());
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var cors = require('cors');
const { callbackify } = require('util');
app.use(cors());
app.use(express.static(__dirname + '/frontend'));

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

//returns all users, must elevate permissions perhaps

app.get('/api/users', async (req, res) => {
    db.all('select * from Users', (err, data) => {
        if (err) {
            console.error(err);
            res.json(err);
        } else {
            res.json(data);
        }
    })
});

//returns specific user information
app.get('/api/users/:i', async (req, res) => {
    console.log(req.body);
    let token = req.body.token.split(".");
    console.log(base64.decode(token));
    db.all(`select * from Users where uid = ?`, [req.body.uid], (err, data) => {
        if (err) {
            console.error(err);
            res.json(err);
        } else {
            res.json(data);
        }
    })
});

//What we're expecting in registeration
//body : {username, password, email}

app.post('/api/users', function (req, res) {
    console.log(req.body);
    if (req.body.type == "register") {
        if (req.body.special == "admin1" && req.body.username != "" && req.body.password != "" && req.body.email != "") {
            db.all(`select * from Users where username = ?`, [req.body.username], (error, row) => {
                if (error) {
                    console.error(error);
                }
                else {
                    if (row.length == 0) {

                        db.run(`insert into "Users" (username,password,email,type) values(?,?,?,?)`, [[req.body.username], md5([req.body.password]), [req.body.email], 1], (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.send({ "message": "Successfully Registered." });
                            }
                        });
                    }
                    else {
                        res.send({ "message": "User already exists." })
                    }
                }
            });
        } else if (req.body.username != "" && req.body.password != "" && req.body.email != "") {
            db.all(`select * from Users where username = ?`, [req.body.username], (error, row) => {
                // console.log(row);
                if (error) {
                    console.error(error);
                    console.log("we here 2");
                }
                else {
                    if (row.length == 0) {
                        ///console.log("we here 3");
                        db.run(`insert into "Users" (username,password,email,type) values(?,?,?,?)`, [[req.body.username], [req.body.password], [req.body.email], 0], (err, row) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.send({ "message": "Successfully Registered." });
                            }
                        });
                    }
                    else {
                        res.send({ "message": "User already exists." });
                    }
                }
            });
        }
        else {
            res.send({ "message": "Missing Parameters." });
        }
    }
    else if (req.body.type == "login") {
        //console.log("we here 1");
        if (req.body.username == "" || req.body.password == "") {
            //console.log("we here 2");
            res.status(401).json("Missing login information.");
        }
        else {
            console.log("we here 3");
            db.all(`select password, uid from Users where username = ?`, [req.body.username], (error, row) => {
                if (error) {
                    console.error(error);
                    //console.log("we here 4");
                }
                else {
                    console.log(row[0]['password']);
                    var data = JSON.stringify(row);
                    if (row.length == 0) {
                        res.status(401).json("Invalid Login");
                        //console.log("we here 5");
                    }
                    else {
                        console.log(row[0]['password'] + " " + req.body.password);
                        if (req.body.password == row[0]['password']) {
                            //console.log("we here 6");
                            res.status(200).json(login(req.body.username, row[0]['uid']));
                        }
                    }
                }
            })
        }
    }
    if (req.body.type == "logout") {
        res.json(logout(req));
    }
});

/* 
app.post('/api/login', function(req,res){
    console.log(req.body);
    if(...);
})
 */
//returns all present complaints
app.get('/api/complaints', async (req, res) => {
    console.log(req.body);

    //is user admin?

    db2.all('select * from Complaints', (err, data) => {
        if (err) {
            console.error(err);
            res.json(err);
        } else {
            res.json(data);
        }
    })
});

//returns specific complaint
app.get('/api/complaints/:i', async (req, res) => {
    console.log(req.body);

    //match cid with the one we're getting complaints for
    if (checkTokenValid(req.body.token)) {
        db2.all(`select * from Complaints where cid = ?`, [req.body.cid], (err, data) => {
            if (err) {
                console.error(err);
                res.status(401).json(err);
            } else {
                if (data.length == 1) {
                    db.all(`select type from Users where uid = ?`, [req.body.uid], (err, row) => {
                        if (err) {
                            console.error(err);
                            res.status(401).json(err);
                        }
                        else {
                            if ((row.length == 1 && row[0]['type'] == 1) || data[0]['uid'] == req.body.uid) {
                                res.status(200).json(data);
                            }
                        }
                    });

                }
                else
                    res.status(404).json("Could not find complaint.");
            }
        })
    }
});

//adds complaint to the system
//cid(generated), uid(refers to userid),type(bool)(refers to complaint type 0/1 service/employee) context(string)(what the complaint is),status(string), token

app.post('/api/complaints/', async function (req, res) {
    console.log(req.body);
    // console.log(checkTokenValid(req.body.token));
    var ctype = "";
    if (req.body.ctype)
        ctype = "Service";
    else
        ctype = "Product";
    var result = checkTokenValid(req.body.token);
    console.log(result);
    if (checkTokenValid(req.body.token)) {
        if (req.body.uid && req.body.type == "new") {
            db2.run(`insert into "Complaints" (uid,type,context,status) values(?,?,?,?)`, [[req.body.uid], ctype, [req.body.context], "Open"], (err, row) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.status(201).json("Complaint received.");
                }
            });
        }
        if (req.body.uid && req.body.type == "modify") {
            //is the modifier an admin?
            db.all(`select type from Users where uid = ?`, [req.body.uid], (err, row) => {
                if (error) {
                    console.error(error);
                }
                else {
                    if (row.length == 1 && row.type == 1) {
                        db2.run(`UPDATE Complaints set STATUS = ? where cid = ?`, [req.body.status], [req.body.cid]);
                    }
                }
            })
        }
    }
    else {
        res.status(401).json("Invalid Token");
    }
});


//
//idea for login, match stuff, return a generated token to be stored as cookie or something
//for logout, just invalidate this token/cookie
//also change it so that u send the received parameters to login() and handle everything there
//
//Was going to use jsonwebtoken library we can sign a token with an expiry date but it requires to re-code some stuff in the API
//Instead, I'm gonna generate my own authentication token

function login(username, uid) {
    console.log("Username: " + username + " , uid: " + uid);
    let t = Date.now();
    console.log("Generating Login Token at " + t);
    //var tok = CryptoJS.enc.Utf8.parse(plain);
    var encoded = base64.encode(Date.now()) + "." + base64.encode(username) + "." + base64.encode(uid);
    //const token = jwt.sign({ userId: uid }, 'secret', { expiresIn: '24h' });
    var res = { userId: uid, token: encoded };
    return res;
}

function logout(req) {
    if (req.session.user) {
        req.session.user = null;
        return callbackify(null, { 'success': true, "message": "User logged out" });
    }
}

function checkTokenValid(token) {
    //Buffer.from(tk1[0], 'base64').toString('utf-8')
    var tk1 = token.split(".");
    var uid = base64.decode(tk1[2]);
    if (base64.decode(tk1[0]) < Date.now() && (Date.now() - base64.decode(tk1[0])) < 1000 * 36000) {
        return new Promise(function (resolve, reject) {
            db.all(`select uid from Users where uid = ?`, uid, async (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(data.length > 0);
                }
            });
        })
    }
    return false;
}


app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/frontend/login.html'));
})

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + '/frontend/register.html'));
})

app.get('/complaints', function (req, res) {
    res.sendFile(path.join(__dirname + '/frontend/complaints.html'));
});
app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname + '/frontend/admin.html'));
});