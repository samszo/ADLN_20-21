	/* 
		remplacez le chiffre 21 ci-dessous par l'ID de votre vocabulaire qui est, selon le groupe : 
		gr 1 : 16
		gr 2 : 7
		gr 3 : 6
	*/
	let gen = genF(21);
	gen.faire(["mourir","Marquise"]);
	gen.faire(["#"]);
	console.log (gen.finie);
	gen.faire(["deplacer","Dessetrousse","rue"]);
	console.log (gen.finie);
	console.log(gen.story);