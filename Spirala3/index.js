const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const crypto = require("crypto");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extender: true}));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(session({secret: "secret"}));

app.get("/", (req, res) => {
    res.redirect("/prijava.html");
});

app.get("/prijava.html", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/prijava.html"));
});

app.post("/login", (req, res) => {
    var username = req.body.username;
    var s = "secret";
    var password = crypto 
    .pbkdf2Sync(req.body.password, s, 1000, 64, `sha512`)
    .toString(`hex`);

    var sviNastavnici = JSON.parse(
        fs.readFileSync(path.join(__dirname, "./data/nastavnici.json"))
    );

    var postoji = undefined;
    sviNastavnici.forEach((element) => {
        if (
            element.nastavnik.username === username && 
            element.nastavnik.password_hash == password
        ) {
            postoji = element;
        }
    });

    if (postoji !== undefined) {
        req.session.nastavnik = postoji.nastavnik.username;
        req.session.predmeti = postoji.predmeti;
        res.send("{poruka: Uspješna prijava}");
    } 
    if (postoji === undefined) {
        res.send(401, "{poruka: Neuspješna prijava}");
    }
});

app.post("/logout", (req, res) => {
    req.session.nastavnik = null;
    req.session.predmeti = null;
    res.send("{poruka:Uspješna odjava}");
});

app.get("/predmeti", (req, res) => {
    if (req.session.nastavnik === undefined) {
        res.send(401, "{greska: Nastavnik nije logovan}");
        return;
    }

    const html = fs.readFileSync(__dirname + "/public/predmeti.html");
    res.send({ html: html.toString(), predmeti: req.session.predmeti });
});

app.get("/predmet/:naziv", (req, res) => {
    if (req.session.nastavnik === undefined) {
        res.send(401, "{greska:Nastavnik nije logovan}");
    }

    const prisustva = JSON.parse(
        fs.readFileSync(__dirname + "/data/prisustva.json")
    );

    prisustva.forEach((element) => {
        if (element.predmet === req.params.naziv) {
            res.send(element);
        }
    });
});

app.post("/prisustvo/predmet/:naziv/student/:index", (req, res) => {
    if (req.session.nastavnik == undefined) {
        res.sendStatus(401, "{greska:Nastavnik nije logovan}.");
    }

    const prisustva = JSON.parse(
        fs.readFileSync(__dirname + "/data/prisustva.json")
    );

    var naziv = req.params.naziv;
    var index = parseInt(req.params.index);
    var sedmica = JSON.parse(req.body.sedmica);
    var predavanja = JSON.parse(req.body.predavanja);
    var vjezbe = JSON.parse(req.body.vjezbe);

    prisustva.forEach((element) => {
        if (element.predmet === naziv) {
            element.prisustva.forEach((elementP) => {
                if (elementP.index === index && elementP.sedmica === sedmica) {
                    elementP.predavanja = predavanja;
                    elementP.vjezbe = vjezbe;
                }
            });
        }
    });

    fs.writeFileSync(
        __dirname + "/data/prisustva.json", 
        JSON.stringify(prisustva)
    );

    prisustva.forEach((element) => {
        if (element.predmet === naziv) {
            res.send(element);
        }
    });
});

app.listen(port, () => {
    console.log(`${port}`);
});