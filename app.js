const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./app.db', {verbose: console.log})
const session = require('express-session')
const dotenv = require('dotenv');


dotenv.config()


const saltRounds = 10
const app = express()
const staticPath = path.join(__dirname, 'public')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))



// Define your middleware and routes here


app.use(express.static(staticPath));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login',  (req, res) => {
    console.log(req.body)
    try {
        let user = checkUserPassword(req.body.username, req.body.password) 
        if ( user != null) {

            req.session.loggedIn = true
            req.session.username = req.body.username
            req.session.userrole = user.role
            req.session.userid = user.userid
    
        //res.redirect('/');
        // Pseudocode - Adjust according to your actual frontend framework or vanilla JS
 
        } 
        if (user == null || !req.session.loggedIn) {
            res.redirect("/login.html?error=not_logged_in");
        }
        else {
            res.redirect('/')
        }

    }
    catch {
       
        res.redirect("/login.html?error=noe_gikk_feil");
    }

})


app.get('/', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "\public\\app.html"));

});

app.post('/register', (req, res) => {
    console.log("registerUser", req.body);
    const reguser = req.body;
    const user = addUser(reguser.username,  reguser.password, reguser.email, reguser.mobile, reguser.role)
    // Redirect to user list or confirmation page after adding user
    if (user)   {
        req.session.loggedIn = true
        req.session.username = user.username
        req.session.userrole = user.role
        req.session.userid = user.userid

        req.session.loggedIn = true
        //res.redirect('/');
        // Pseudocode - Adjust according to your actual frontend framework or vanilla JS
        if (req.session.loggedIn) {
            res.send(true)
        } 

    } 
    res.send(true)
});

//app.use(checkLoggedIn); // Apply globally if needed, or selectively to certain routes

 function checkUserPassword(username, password ){
    const sql = db.prepare('SELECT user.id as userid, username, roles.role as role, password FROM user inner join roles on user.idrole = roles.id   WHERE username  = ? ');
    let user = sql.get(username);

    if (user && bcrypt.compareSync(password, user.password)) {

        return user 
    } else {
        return null;
    }
}

 function checkLoggedIn(req, res, next) {
    if (!req.session.loggedIn) {
        res.sendFile(path.join(__dirname, "\public\\login.html"));
    } else {
        next();
    }
    
}

app.get('/subjects', (req, res) => {
    const sql = db.prepare('SELECT id, name, points FROM fag')
    let rows = sql.all()

    res.send(rows)
})

app.delete('/removefag_user', (req, res) => {
    console.log("removefag_user", req.body);
    const body = req.body;
    const deletion = removefag_user(body.id, req.session.userid)
    // Redirect to user list or confirmation page after adding user
    res.redirect('/');
});

function removefag_user(id, userid) {

    const sql = db.prepare('DELETE FROM fag_user WHERE idFag = ? AND idUser = ?')
    const info = sql.run(id, userid)
}

app.post('/addfag_user', (req, res) => {
    console.log("addfag_user", req.body)
    const body = req.body
    const addFag = addfag_user(req.session.userid, body.id)
    res.redirect('/');
})

function addfag_user(userId, fagId) {
    const sql = db.prepare('INSERT INTO fag_user (idUser, idFag)' + 
                            "values (?, ?)")
    const info = sql.run(userId, fagId)
}

app.post('/user-add', (req, res) => {
    console.log(req.body)
    addUser(req.body.username, req.body.password)
    res.sendFile(path.join(__dirname, "public/app.html"));
     
 });
 
 app.get('/somedata', checkLoggedIn, (req, res) => {

    const sql = db.prepare('select fag_user.id as fag_userId, idFag, fag.name as fag, points from fag_user ' +
                        ' inner join user on fag_user.idUser = user.id ' +
                        ' inner join fag on fag_user.idFag = fag.id ' +
                        ' where user.id =  ? ')

    let userfag = sql.all(req.session.userid)
    console.log(userfag)
    res.json(userfag)
    
})

 
app.get('/logout', (req, res) => {
    req.session.destroy()
    res.sendFile(path.join(__dirname, "public/login.html"));
})

function addUser(username, password, email, mobile, idrole)
 {
    //Denne funksjonen må endres slik at man hasher passordet før man lagrer til databasen
    //rolle skal heller ikke være hardkodet.
    const hash = bcrypt.hashSync(password, saltRounds)
    let sql = db.prepare("INSERT INTO user (username,  idrole, password, email, mobile) " + 
                         " values (?, ?, ?, ?, ?)")
    const info = sql.run(username,  idrole, hash, email, mobile)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT user.id as userid, username, roles.role  as role FROM user inner join roles on user.idrole = roles.id   WHERE user.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  
    console.log("rows.length",rows.length)

    return rows[0]
}




app.get('/currentUser', checkLoggedIn,  (req, res) => {
    
    res.send([req.session.userid, req.session.username, req.session.userrole]);
});



app.get('/', checkLoggedIn,(req, res) => {
    res.sendFile(path.join(__dirname, "public/app.html"));
  });
  


//denne må defineres etter middleware. 
//Jeg prøvde å flytte den opp, for å rydde i koden og da fungerte det ikke
app.use(express.static(staticPath));


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});




/*


select elev.id as elevId, elev.username as elevName, elev.idRole as elevRole, larer.username as larerName, larer.idRole as larerrole from fag_user as elev_fag
inner join user as elev on elev.id = elev_fag.idUser
inner join roles as elevRole on elev.idRole = elevRole.id 
inner join fag_user as larer_fag on larer_fag.idFag = elev_fag.idFag
inner join user as larer on larer_fag.idUser = larer.id 
where elev.idRole = 2 
and larer.idRole = 1
*/
