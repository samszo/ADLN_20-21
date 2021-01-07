	/* 
		remplacez le chiffre 21 ci-dessous par l'ID de votre vocabulaire qui est, selon le groupe : 
		gr 1 : 16
		gr 2 : 7
		gr 3 : 6
	*/
	let gen = genF(21);
<<<<<<< HEAD


// début de l'histoire
// on exécute des évènements peut conséquents

	let pRue;
	let pMalade;
	let liste;
	let Marquise;
	for (let i = 0; i<4 ; i++) {
		pRue = (i+1)*3;
		pMalade = Math.max(i,2)*3;
		liste = [
			[["deplacer","flic","rue"],3],
			[["deplacer","Dessetrousse","rue"],pRue],
			[["deplacer","Marquise","salon"],2],
			[["deplacer","Marquise","chambre"],3],
			[["malade","Marquise"],3],
			[["malade","Dessetrousse"],pMalade],
			[["deplacer","Fils","rue"],2],
			[["mourirCardiaque","Marquise"],1]			
		];
		gen.faireAvecProba(liste);
		Marquise = gen.getItem("Personnage","nom","Marquise");
		if (!Marquise["en vie"]) {gen.faire(["*"]);}
	}
	
	nonFin();
	
function nonFin (){
	let retour = gen.finie();
	if (retour){
		document.querySelector("#story").innerHTML = gen.copieTable(gen.story);
	}
}


=======
	gen.faire(["mourir","Marquise"]);
	gen.faire(["*"]);
	console.log (gen.finie());
	gen.faire(["deplacer","Dessetrousse","rue"]);
	console.log (gen.finie());
	console.log(gen.story);
>>>>>>> 19b01cf54ceef3faa1a39cdce7a1ac92d104c1d2
