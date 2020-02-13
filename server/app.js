var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb+srv://Unstar:etoile1@cluster0-pncly.mongodb.net/chap24vue?retryWrites=true&w=majority', {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log('DB Connexion ERROR');
    } else {
        console.log('CONNEXION DB OK!');
    }
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client-build')));

app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../client-build/index.html'));
    })
    // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;