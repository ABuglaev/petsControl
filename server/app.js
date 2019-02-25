var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var email = require("emailjs");
var formidable = require('express-formidable');
var crypto = require('crypto');
var { Client } = require('pg');
var redis = require('redis');
var redisClient = redis.createClient();
var cors = require('cors');

//connect to email server
var server = email.server.connect({
    user: "mypetscontrol@gmail.com",
    password: "qq2ww3ee4",
    host: "smtp.gmail.com",
    tls: { ciphers: "SSLv3" }
});

var sendVerificationMessage = function (email, id) {
    //configure the email
    var message = {
        from: "MyPetsControlPanel mypetscontrol@gmail.com",
        to: `${email}`,
        subject: 'account activation',
        attachment:
            [
                {
                    data: `<html>\
                            Please follow <a href=http://tonight.by:3012/activate?id=${id}>the link</a> to activate your account\
                            </html>`,
                    alternative: true
                },
            ]
    };
    //send the message and get a callback with an error or details of the message that was sent
    server.send(message, function (err, message) { console.log(err || `Email(activate) to ${email} is send`); });
};

var sendResetPasswordMessage = function (email, password) {
    //configure the email
    var message = {
        from: "MyPetsControlPanel mypetscontrol@gmail.com",
        to: `${email}`,
        subject: 'Password reset',
        attachment:
            [
                {
                    data: `<html>\
                            Your new password is: ${password}\
                            </html>`,
                    alternative: true
                },
            ]
    };
    //send the message and get a callback with an error or details of the message that was sent
    server.send(message, function (err, message) { console.log(err || `Email(password reset) to ${email} is send`); });
};

var sendResetLink = function (email, link) {
    //configure the email
    var message = {
        from: "MyPetsControlPanel mypetscontrol@gmail.com",
        to: `${email}`,
        subject: 'Link to reset your password',
        attachment:
            [
                {
                    data: `<html>\
                            To reset your password follow <a href=${link}> the link </a>\
                            </html>`,
                    alternative: true
                },
            ]
    };
    //send the message and get a callback with an error or details of the message that was sent
    server.send(message, function (err, message) { console.log(err || `Email(password link) to ${email} is send`); });
};

var app = express();

app.use(cors({ exposedHeaders: 'Authorization' }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//middleware for formdata
app.use(formidable());

/*----------------------------------------*/
//подключение к postgre
var client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'zoo',
    password: 'zoo',
    database: 'zoo',
});

client.connect()
    .then(console.log('Connected to postgre'))
    .catch(err => { console.log(err) });
/*----------------------------------------*/


//запуск серверного приложения, поключения к Mongo=
app.listen(3012, function () {
    MongoClient.connect('mongodb://127.0.0.1:27141/users', function (err, database) {
        if (err) {
            return console.log(err);
        }
        db = database;
    });

    console.log('Server succefully started on :3012');
});

app.post('/signup', function (req, res) {
    var newUser = {
        name: req.fields.name,
        email: req.fields.email,
        age: req.fields.age,
        password: crypto.createHmac('sha256', req.fields.password).update('I love cupcakes').digest('hex'),
        id: Date.now(),
        status: 'inactive',
    };

    db.collection('users').insert(newUser, function (err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

    sendVerificationMessage(newUser.email, newUser.id);

    res.sendStatus(201);
});

/*
 * активация пользователя по линке из емейла
 */
app.get('/activate', function (req, res) {
    var _id = +req.url.slice(-13);
    db.collection('users').update(
        { id: _id },
        { $set: { status: 'active', } }
    );
    res.send('Your account is activated for now');
});


/*login route*/
app.post('/login', function (req, res) {

    var login = req.fields.login;
    var passwordHash = crypto.createHmac('sha256', req.fields.password).update('I love cupcakes').digest('hex');

    db.collection('users').find({ email: `${login}` }).toArray((err, docs) => {
        if (!docs[0] || docs[0].password !== passwordHash) return res.status(200).send({ text: `Wrong login / password!`, status: 0 });
        if (docs[0].status == 'inactive') return res.status(200).send({ text: `You should activate your account!`, status: 0 });
        if (docs[0].password == passwordHash) {
            let token = (Math.floor(Math.random() * (10 ** 16))).toString(16);
            redisClient.set(token, docs[0].id, 'EX', 120); //save session id(random number) as key to redis
            res.header('Authorization', token);
            return res.status(200).send({ text: `Welcome ${docs[0].name}!`, status: 1 });
        };
    });

});

/*get tableData route*/
app.post('/getTableData', function (req, res) {
    console.time(1);
    redisClient.get(req.headers.authorization, (err, reply) => {
        // reply is null when the key is missing
        if (!reply) { return res.status(200).send({ text: 'Session expired. Please, login.', status: 0 }) }
        redisClient.EXPIRE(req.headers.authorization, 120); // set / update ttl
        
        client.query(`SELECT * FROM petsn WHERE user_id = ${reply};`)
            .then(result => {
                res.status(200).send(result.rows)
                console.timeEnd(1);
            })
            .catch(e => console.error(e.stack))
        
    });
    
});

/*add a pet route*/
app.post('/addPet', function (req, res) {
    console.time(2);
    redisClient.get(req.headers.authorization, (err, reply) => {
        // reply is null when the key is missing
        if (!reply) { return res.status(200).send({ text: 'Session expired. Please, login.', status: 0 }) }
        redisClient.EXPIRE(req.headers.authorization, 120); // set / update ttl
        client.query(`INSERT INTO petsn ( user_id, type, name, age ) VALUES ( ${reply}, '${req.fields.petType}', '${req.fields.petName}', ${req.fields.petAge} ) RETURNING id, created_on;`)
            .catch(e => console.error(e.stack))
    });
    res.sendStatus(200);
    console.timeEnd(2);
});

/*remove pets route*/
app.post('/removePets', function (req, res) {
    let str = req.fields.petsNames.split(/\W/).map((v) => `'${v}'`).join(', ');
    redisClient.get(req.headers.authorization, (err, reply) => {
        if (!reply) { return res.status(200).send({ text: 'Session expired. Please, login.', status: 0 }) }
        redisClient.EXPIRE(req.headers.authorization, 120); // set / update ttl
        client.query(`DELETE FROM petsn WHERE user_id=${reply} AND name IN (${str})`)
            .catch(e => console.error(e.stack))
    });
    res.sendStatus(200);
});

/*update a pet route*/
app.post('/updatePet', function (req, res) {
    redisClient.get(req.headers.authorization, (err, reply) => {
        // reply is null when the key is missing
        if (!reply) { return res.status(200).send({ text: 'Session expired. Please, login.', status: 0 }) }
        redisClient.EXPIRE(req.headers.authorization, 120); // set / update ttl
        client.query(`UPDATE petsn SET type = '${req.fields.petTypeUp}', name = '${req.fields.petNameUp}' , age = ${req.fields.petAgeUp} WHERE id = ${req.fields.id};`)
            .catch(e => console.error(e.stack))
    });
    res.sendStatus(200);
});

/*Password reset route*/
app.get('/resetPassword', function (req, res) {
    let newPassword = (Math.floor(Math.random() * (10 ** 16))).toString(16);
    let newPasswordHash = crypto.createHmac('sha256', newPassword).update('I love cupcakes').digest('hex');
    db.collection('users').find({ id: +req.url.slice(-13) }).toArray((err, docs) => {
        db.collection('users').update(
            { id: +req.url.slice(-13) },
            { $set: { password: newPasswordHash, } }
        )
            .then(() => {
                sendResetPasswordMessage(docs[0].email, newPassword);
            })
            .then(() => {
                return res.status(200).send(`Password has been reset. Check your email`);
            })
    });
});

/*Get password reset link route*/
app.post('/resetPassword', function (req, res) {
    //look for user with _id from the link
    db.collection('users').find({ email: req.fields.email }).toArray((err, docs) => {
        if (!docs[0]) return res.status(200).send({ text: `User with email "${req.fields.email}" doesn't exist!`, status: 0 });
        let link = `http://tonight.by:3012/resetPassword?id=${docs[0].id}`;
        sendResetLink(req.fields.email, link);

        return res.status(200).send({ text: `We send you the link to reset the password. Check your email`, status: 1 });
    })
});