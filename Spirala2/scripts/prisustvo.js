let divRef = document.getElementById("divSadrzaj");

//instanciranje
let prisustvo = TabelaPrisustvo(divRef, {
      studenti: [{ ime: "Amila Rovčanin", index: 17235 }, { ime: "Lejla Talić", index: 17363 }],
      prisustva: [{ sedmica: 1, predavanja: 3, vjezbe: 1, index: 17235 }, { sedmica: 2, predavanja: 1, vjezbe: 2, index: 17235 }, { sedmica: 3, predavanja: 1, vjezbe: 2, index: 17235 },
      { sedmica: 1, predavanja: 2, vjezbe: 1, index: 17363 }, { sedmica: 2, predavanja: 3, vjezbe: 1, index: 17363 }, { sedmica: 3, predavanja: 1, vjezbe: 1, index: 17363 },], predmet: "WT",
      brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2
});




