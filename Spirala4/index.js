const Sequelize = require('sequelize');
const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extender: true}));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(session({secret: "secret"}));

const db = require('./scripts/db.js');
const prisustvo = require('./scripts/prisustvo.js').Prisustvo;
const student = require('./scripts/student.js').Student;


db.sequelize.sync({force: true}).then(function() {
    inicijaliziraj().then(function() {
        process.exit();
    });
});

    var nastavniciLista = [];
    var predmetiLista = [];
    var studentiLista = [];
    var prisustvaLista = [];

function inicijaliziraj() {
    
    return new Promise(function(resolve, reject) {
       // nastavniciLista.push(db.nastavnik.create({username: 'Amila', password:'password'}));
        predmetiLista.push(db.predmet.create({naziv: 'Web tehnologije', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}));
        predmetiLista.push(db.predmet.create({naziv: 'Diskretna matematika', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}));

        prisustvaLista.push(db.prisustvo.create({sedmica: 1, predavanja: 2, vjezbe: 0, index: 17235}));
        prisustvaLista.push(db.prisustvo.create({sedmica: 2, predavanja: 2, vjezbe: 1, index: 17235}));
        prisustvaLista.push(db.prisustvo.create({sedmica: 3, predavanja: 0, vjezbe: 1, index: 17235}));
        prisustvaLista.push(db.prisustvo.create({sedmica: 1, predavanja: 2, vjezbe: 1, index: 17363}));
        prisustvaLista.push(db.prisustvo.create({sedmica: 2, predavanja: 0, vjezbe: 1, index: 17363}));
        prisustvaLista.push(db.prisustvo.create({sedmica: 3, predavanja: 0, vjezbe: 1, index: 17363}));
        

        Promise.all(predmetiLista).then(function(predmeti) {
            var wt = predmeti.filter(function(a){return a.naziv === 'Web tehnologije'})[0];
            var dm = predmeti.filter(function(a){return a.naziv === 'Diskretna matematika'})[0];

            nastavniciLista.push(
                db.nastavnik.create({username: 'Amila', password_hash: '6a8233984ca86d129801c58e3b67cd5ec9b0abe0f8425b322df16c634d830db2399c70a3552dc6691065b57dfbec9755f93735328f9d5872f52f8f138b165e6f'}).then(function(b) {
                    return b.setPredmetiNastavnik([wt, dm]).then(function() {
                        return new Promise(function(resolve, reject){resolve(b);});
                    });
                })
            );
        }).catch(function(err){console.log("Greska" + err);});

        Promise.all(prisustvaLista).then(function(prisustva) {
            var prisustvo1 = prisustva.filter(function(a){return a.index === 17235})[0];
            var prisustvo2 = prisustva.filter(function(a){return a.index === 17235})[1];
            var prisustvo3 = prisustva.filter(function(a){return a.index === 17235})[2];
            var prisustvo4 = prisustva.filter(function(a){return a.index === 17363})[0];
            var prisustvo5 = prisustva.filter(function(a){return a.index === 17363})[1];
            var prisustvo6 = prisustva.filter(function(a){return a.index === 17363})[2];

            studentiLista.push(
                db.student.create({ime: 'Amila Rovčanin', index: 17235}).then(function(b) {
                    return b.setPrisustvaStudent([prisustvo1, prisustvo2, prisustvo3]).then(function() {
                        return new Promise(function(resolve, reject){resolve(b);});
                    });
                })
            );

            studentiLista.push(
                db.student.create({ime: 'Lejla Talic', index: 17363}).then(function(b) {
                    return b.setPrisustvaStudent([prisustvo4, prisustvo5, prisustvo6]).then(function() {
                        return new Promise(function(resolve, reject){resolve(b);});
                    });
                })
            );
        }).catch(function(err) {console.log("Greška"+ err)});
    });

}

var predmetiBaza = [];
var prisustvaStudenta = [];
var naziviPredmeta = [];
var postojiNastavnik; 
var studentiNaPredmetu = [];
var vratiElement = [];
var brojPredavanjaBaza = [];
var brojVjezbiBaza = [];

app.get("/",  (req, res) => {
    res.redirect("/prijava.html");
});

app.get("/prijava.html",  (req, res) => {
    res.sendFile(path.join(__dirname, "./public/prijava.html"));
});


app.post("/login", async (req, res) => {
    var username = req.body.username;
    var s = "secret";
    var password = crypto 
    .pbkdf2Sync(req.body.password, s, 1000, 64, `sha512`)
    .toString(`hex`);
   
    try {
    
    postojiNastavnik = await db.nastavnik.findOne({
        where: {
            username: username,
            password_hash: password   
        }
    });

    if (postojiNastavnik) {
        req.session.nastavnik = postojiNastavnik.username;
        res.send("{poruka: Uspješna prijava}");
    }

    if (!postojiNastavnik) {
        res.send(401, "{poruka: Neuspješna prijava}");
    }



    if (postojiNastavnik) {
        try {
           predmetiBaza =  await db.predmet.findAll({
            where: {
                NastavnikId : postojiNastavnik.id
            }
           }).then(podaci => {
              predmetiBaza = podaci;
              
              for (let i = 0; i < predmetiBaza.length; i++) {
                  naziviPredmeta.push(predmetiBaza[i].naziv);
                  brojPredavanjaBaza.push(predmetiBaza[i].brojPredavanjaSedmicno);
                  brojVjezbiBaza.push(predmetiBaza[i].brojVjezbiSedmicno);
              }
              // console.log("OVO SU PODACI", naziviPredmeta);


              req.session.predmeti = naziviPredmeta;
              req.session.save();
           });

        } catch(error) {
            console.log("Greška" + error);
        }
        
    } 

} catch(error) {
    console.log("Greška: " + error);
}

});

app.post("/logout",  (req, res) => {
    req.session.nastavnik = null;
    req.session.predmeti = null;
   
    res.send("{poruka:Uspješna odjava}");
});


app.get("/predmeti", async  (req, res) => {
    if (req.session.nastavnik === undefined) {
        res.send(401, "{greska: Nastavnik nije logovan}");
        return;
    }
    const html = fs.readFileSync(__dirname + "/public/predmeti.html");
    res.send({html: html.toString(), predmeti: req.session.predmeti});
    
    
});

app.get("/predmet/:naziv", async (req, res) => {
    if (req.session.nastavnik === undefined) {
        res.send("{greska:Nastavnik nije logovan}");
    }

});



app.listen(port, () => {
    console.log(`${port}`);
});