// Login 
function loginClick() {
    PoziviAjax.postLogin(
        document.getElementById("loginUsername").value,
        document.getElementById("loginPassword").value,
        CallbackAjax.uspjesanLoginCallback
    );
}

// Login click 
function logoutMeniClick(event) {
    logoutMeni.style.display = "none";
    PoziviAjax.postLogout(CallbackAjax.logoutCallback);
}

// Predmeti click 
function predmeti(event) {
    PoziviAjax.getPredmeti(CallbackAjax.predmetiCallback);
    event.preventDefault();
}

// Azuriraj prisustvo click 
function azurirajPrisustvo(naziv, index, sedmica, predavanja, vjezbe) {
    var prisustvaObject = {sedmica, predavanja, vjezbe};
    PoziviAjax.postPrisustvo(
        naziv, 
        index,
        prisustvaObject,
        CallbackAjax.prisustvoCallback
    );
}

// Prethodna sedmica click
function prethodnaSedmica(naziv) {
    PoziviAjax.getPredmet(
        naziv,
        CallbackAjax.predmetPrethodnaSedmicaCallback
    );
}

// Sljedeca sedmica click 
function sljedecaSedmica(naziv) {
    PoziviAjax.getPredmet(
        naziv, 
        CallbackAjax.predmetSljedecaSedmicaCallback
    );
}

const PoziviAjax = (() => {

    function impl_postLogin(username, password, fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {

            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.responseText);
            } else if (ajax.readyState == 4) fnCallback(ajax.statusText, null);
        };

        ajax.open("POST", "http://localhost:3000/login", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({username: username, password: password }));
    }
     
    function impl_postLogout(fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {

            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.responseText);
            } else if (ajax.readyState == 4) fnCallback(ajax.statusText, null);
        };

        ajax.open("POST", "http://localhost:3000/logout", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }


    function impl_getPredmet(naziv, fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.responseText);
            } else if (ajax.readyState == 4) fnCallback(ajax.statusText, null);
        };

        ajax.open("GET", "http://localhost:3000/predmet/" + naziv, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    function impl_getPredmeti(fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {

            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.responseText);
            } else if (ajax.readyState == 4) fnCallback(ajax.statusTest, null);
        };

        ajax.open("GET", "http://localhost:3000/predmeti", false);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    function impl_postPrisustvo(naziv, index, prisustvo, fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.responseText);
            } else if (ajax.readyState == 4) fnCallback(ajax.statusText, null); 
        };

        ajax.open(
            "POST",
            "http://localhost:3000/prisustvo/predmet/" + naziv + "/student/" + index,
            true
        );

        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(prisustvo));
    }

    return {
        postLogin: impl_postLogin, 
        postLogout: impl_postLogout, 
        getPredmet: impl_getPredmet, 
        getPredmeti: impl_getPredmeti, 
        postPrisustvo: impl_postPrisustvo,
    };

}) ();


const CallbackAjax = (() => {

    function impl_uspjesanLogin(error, data) {
        if (data !== null) {
            logoutMeni = document.getElementById("logoutMeni");
            logoutMeni.style.display = "block";
        }
        PoziviAjax.getPredmeti(CallbackAjax.predmetiCallback);
    }

    function impl_logoutCallback(error, data) {
        if (data !== null) 
        window.location = '/prijava.html';
    }

    function impl_predmetiCallback(error, data) {
        if (data !== null) {
            document.body.innerHTML = JSON.parse(data).html;
            logoutMeni = document.getElementById("logoutMeni");
            logoutMeni.style.display = "block";
            window.history.replaceState(data, "title", "predmeti.html");

            var predmeti = JSON.parse(data).predmeti;
            var predmetiList = document.getElementById("predmetiList");
           
            predmeti.forEach((el) => {
                var novi = document.createElement("p");

                novi.innerHTML = el;
                novi.onclick = function predmet() {
                    PoziviAjax.getPredmet(
                        this.innerHTML, 
                        CallbackAjax.predmetCallback
                    );
                };

                predmetiList.appendChild(novi);
            });
        } 
    }

    function impl_predmetCallback(error, data) {
        if (data !== null) {
            document.getElementById("izabranaSedmica").innerHTML = "";
            TabelaPrisustvo(
                document.getElementById("prisustvaPrikaz"),
                JSON.parse(data)
            );
        }
    }

    function impl_prisustvoCallback(error, data) {
        if (data !== null) {
            TabelaPrisustvo(
                document.getElementById("prisustvaPrikaz"),
                JSON.parse(data)
            );
        }
    }

    function impl_predmetPredhodnaSedmicaCallback(error, data) {
        if (data !== null) {
            TabelaPrisustvo(
                document.getElementById("prisustvaPrikaz"),
                JSON.parse(data)
            ).prethodnaSedmica();
        }
    }

    function impl_predmetSljedecaSedmicaCallback(error, data) {
        if (data !== null) {
            TabelaPrisustvo(
                document.getElementById("prisustvaPrikaz"),
                JSON.parse(data)
            ).sljedecaSedmica();
        }
    }
    

    return {
        uspjesanLoginCallback: impl_uspjesanLogin, 
        logoutCallback: impl_logoutCallback,
        predmetiCallback: impl_predmetiCallback, 
        predmetCallback: impl_predmetCallback, 
        prisustvoCallback: impl_prisustvoCallback, 
        predmetPrethodnaSedmicaCallback: impl_predmetPredhodnaSedmicaCallback,
        predmetSljedecaSedmicaCallback: impl_predmetSljedecaSedmicaCallback,
    };

}) ();



// SPIRALA 2 
let TabelaPrisustvo = function(divRef, podaci) {
    // privatni atributi modula 
    var sedmice = [];
    podaci.prisustva.forEach((element) => {
        if (!sedmice.includes(element.sedmica)) sedmice.push(element.sedmica);
    });

    // Validacija
    var validniPodaci = true;
    var istiStudent = [];


    podaci.prisustva.forEach((element) => {
        // Broj prisustva na predavanju/vježbi je veći od broja predavanja/vježbi sedmično 
        if (
            element.predavanja > podaci.brojPredavanjaSedmicno ||
            element.vjezbe > podaci.brojVjezbiSedmicno
        )

        validniPodaci = false;

        // Broj prisustva je manji od nule 
        if (element.predavanja < 0 || element.vjezbe < 0) validniPodaci = false;

        // Isti student ima dva ili više unosa prisustva za istu sedmicu 
        if (!istiStudent.includes(element.sedmica + "-" + element.index))
            istiStudent.push(element.sedmica + "-" + element.index);
        else validniPodaci = false;

        // Postoji prisustvo za studenta koji nije u listi studenata 
        // Postoje dva ili više studenta sa istim indeksom u listi studenata 
        var studentIndexi = [];

        podaci.studenti.forEach((element) => {
            if (
                studentIndexi.length > 0 && 
                studentIndexi.includes(element.index)
            )
            validniPodaci = false;
            studentIndexi.push(element.index);
        });

        if (studentIndexi.length > 0 && !studentIndexi.includes(element.index))
            validniPodaci = false;
    });

    // Postoji sedmica, između dvije sedmice za koje je uneseno prisustvo bar jednom studentu, u kojoj nema unesenog prisustva
    // Npr. uneseno je prisustvo za sedmice 1 i 3 ali nijedan student nema prisustvo za sedmicu 2

    sedmice.sort();
    for (var i = 0; i < sedmice.length - 1; i++) {
        if (sedmice[i] !== sedmice[i+1]-1) {
            validniPodaci = false;
            break;
        }
    }

    if (!validniPodaci) {
        const tekst = document.createTextNode(
            "Podaci o prisustvu nisu validni!"
        );

        if (divRef != null) divRef.appendChild(tekst);
        return;
    }

    // Iscrtavanje tabele 
    var detaljnaSedmica = sedmice.length;
    if (document.getElementById("izabranaSedmica").innerHTML != "") {
        detaljnaSedmica = parseInt(document.getElementById("izabranaSedmica").innerHTML)
    }

    var izabranaSedmica;
    iscrtajTabelu(divRef, podaci, sedmice, detaljnaSedmica);

    // Implementacija metoda
    let prethodnaSedmica = function () {
        izabranaSedmica = document.getElementById("izabranaSedmica").innerHTML;
        if (izabranaSedmica === "" && detaljnaSedmica != sedmice[0]) {
            izSed = detaljnaSedmica - 1;
            document.getElementById("izabranaSedmica").innerHTML = izSed;
            iscrtajTabelu(divRef, podaci, sedmice, detaljnaSedmica - 1);
        } else if (izabranaSedmica !== "" && parseInt(izabranaSedmica) != sedmice[0]) {
            izSed--;
            document.getElementById("izabranaSedmica").innerHTML = izSed;
            iscrtajTabelu(divRef, podaci, sedmice, izSed);
        }
    };

    let sljedecaSedmica = function () {
        izabranaSedmica = document.getElementById("izabranaSedmica").innerHTML;
        if (
            izabranaSedmica === "" &&
            detaljnaSedmica != sedmice[sedmice.length - 1]
        ) {
            izSed = detaljnaSedmica + 1;
            document.getElementById("izabranaSedmica").innerHTML = izSed;
            iscrtajTabelu(divRef, podaci, sedmice, detaljnaSedmica + 1);
        } else if (
            izabranaSedmica != undefined &&
            parseInt(izabranaSedmica) != sedmice[sedmice.length - 1]
        ) {
            izSed--;
            document.getElementById("izabranaSedmica").innerHTML = izSed;
            iscrtajTabelu(divRef, podaci, sedmice, izabranaSedmica);
        }
    };

    return {
        prethodnaSedmica: prethodnaSedmica,
        sljedecaSedmica: sljedecaSedmica,
    };

};


function iscrtajTabelu(divRef, podaci, sedmice, detaljnaSedmica) {
    divRef.innerHTML = "";
    var nazivPredmeta = document.createElement("p");
    var predmetText = document.createTextNode(
        "Naziv predmeta: " + podaci.predmet
    );

    // 1 - NAZIV PREDMETA
    nazivPredmeta.appendChild(predmetText);
    divRef.appendChild(nazivPredmeta);

    var tabela = document.createElement("table");
    tabela.classList.add("content-tabela");

    var redBrojac = 0;
    for (var i = 0; i < podaci.studenti.length; i++) {
        var red = tabela.insertRow(redBrojac++);
        var ime = red.insertCell(0);
        ime.innerHTML = podaci.studenti[i].ime;
        ime.setAttribute("rowspan", "2");
        var index = red.insertCell(1);

        // 2 - INDEX
        brojIndexa = podaci.studenti[i].index;
        index.innerHTML = brojIndexa;
        index.setAttribute("rowspan", "2");

        var brojac = 2;

        for (var j = 0; j < podaci.prisustva.length; j++) {
            if (
                podaci.studenti[i].index == podaci.prisustva[j].index &&
                detaljnaSedmica == podaci.prisustva[j].sedmica
            ) {
                for (var k = 1; k <= podaci.brojPredavanjaSedmicno; k++) {
                    red.insertCell(brojac++).innerHTML = "p" + k;
                }

                for (var z = 1; z <= podaci.brojVjezbiSedmicno; z++) {
                    red.insertCell(brojac++).innerHTML = "v" + z;
                }

                var bojaBrojac = 0; 
                var noviRed = tabela.insertRow(redBrojac++);

                if (
                    podaci.studenti[i].index == podaci.prisustva[j].index && 
                    detaljnaSedmica == podaci.prisustva[j].sedmica
                ) {
                    for (var r = 1; r <= podaci.brojPredavanjaSedmicno; r++) {
                        var bojaPredavanja = noviRed.insertCell(bojaBrojac++);

                        if (r <= podaci.prisustva[j].predavanja) {
                            bojaPredavanja.style = "background-color: rgb(126, 213, 126)";

                            bojaPredavanja.setAttribute(
                                "onclick", 
                                'azurirajPrisustvo("' +
                                podaci.predmet + 
                                '",' +
                                brojIndexa +
                                ',' + 
                                podaci.prisustva[j].sedmica +
                                ',' + 
                                (podaci.prisustva[j].predavanja - 1) +
                                ',' + 
                                podaci.prisustva[j].vjezbe + 
                                ')'
                            );
                        } else {
                            bojaPredavanja.style = "background-color:rgb(190, 105, 105)";

                            bojaPredavanja.setAttribute(
                                "onclick", 
                                'azurirajPrisustvo("' +
                                podaci.predmet + 
                                '",' +
                                brojIndexa +
                                ',' + 
                                podaci.prisustva[j].sedmica +
                                ',' + 
                                (podaci.prisustva[j].predavanja + 1) +
                                ',' + 
                                podaci.prisustva[j].vjezbe + 
                                ')'
                            );
                        }

                        bojaPredavanja.innerHTML = "";
                    }

                    for (var z = 1; z <= podaci.brojVjezbiSedmicno; z++) {
                        var bojaVjezbe = noviRed.insertCell(bojaBrojac++);

                        if (z <= podaci.prisustva[j].vjezbe) {
                            bojaVjezbe.style = "background-color: rgb(126, 213, 126)";
                            
                            bojaVjezbe.setAttribute(
                                "onclick", 
                                'azurirajPrisustvo("' +
                                podaci.predmet +
                                '",' +
                                brojIndexa +
                                ',' + 
                                podaci.prisustva[j].sedmica +
                                ',' +
                                podaci.prisustva[j].predavanja +
                                ',' +
                                (podaci.prisustva[j].vjezbe - 1) +
                                ')'
                            );
                        } else {
                            bojaVjezbe.style = "background-color: rgb(190, 105, 105)";

                            bojaVjezbe.setAttribute(
                                "onclick", 
                                'azurirajPrisustvo("' +
                                podaci.predmet +
                                '",' +
                                brojIndexa +
                                ',' + 
                                podaci.prisustva[j].sedmica +
                                ',' +
                                podaci.prisustva[j].predavanja +
                                ',' +
                                (podaci.prisustva[j].vjezbe + 1) +
                                ')'
                            );
                        }

                        bojaVjezbe.innerHTML = "";
                    }
                }
            } else if (podaci.studenti[i].index == podaci.prisustva[j].index) {
                var procenti = red.insertCell(brojac);
                procenti.setAttribute("rowspan", "2");
                procenti.innerHTML = 
                ((podaci.prisustva[j].predavanja +
                    podaci.prisustva[j].vjezbe) *
                    100) /
                    (podaci.brojPredavanjaSedmicno +
                        podaci.brojVjezbiSedmicno) +
                        "%";
                        brojac++;
            }
        }
    }

    const rimskiBrojevi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
    var prviRed = tabela.insertRow(0);
    prviRed.insertCell(0).innerHTML = "Ime i prezime";
    prviRed.insertCell(1).innerHTML = "Index";

    for (var i = 0; i < sedmice.length; i++) {
        if (i == detaljnaSedmica - 1) {
            var kolona = prviRed.insertCell(i + 2);
            kolona.innerHTML = rimskiBrojevi[sedmice[i] - 1];
            kolona.setAttribute("colspan", podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno);
        }

        else prviRed.insertCell(i + 2).innerHTML = rimskiBrojevi[i];
    }

    prviRed.insertCell(sedmice.length + 2).innerHTML = rimskiBrojevi[sedmice.length] + " - " + rimskiBrojevi[rimskiBrojevi.length - 1];


    divRef.appendChild(tabela);

    postavka = divRef.appendChild(document.createElement('script'));
    postavka.setAttribute("src", "https://kit.fontawesome.com/04a4ec8674.js");
    postavka.setAttribute("crossorigin", "anonymous");

    var strelicaLijevo = divRef.appendChild(document.createElement("i"));
    strelicaLijevo.setAttribute("class", "fa-solid fa-arrow-left");
    var prethodnaSedmicaDugme = divRef.appendChild(document.createElement("button"));

    prethodnaSedmicaDugme.style = "margin-left:24%";
    prethodnaSedmicaDugme.appendChild(strelicaLijevo);
    prethodnaSedmicaDugme.setAttribute("onclick", "prethodnaSedmica(\""+ podaci.predmet + "\")");

    var strelicaDesno = divRef.appendChild(document.createElement("i"));
    strelicaDesno.setAttribute("class", "fa-solid fa-arrow-right");
    var sljedecaSedmicaDugme = divRef.appendChild(document.createElement("button"));
    sljedecaSedmicaDugme.appendChild(strelicaDesno);
    sljedecaSedmicaDugme.setAttribute("onclick", "sljedecaSedmica(\"" + podaci.predmet + "\")");
}