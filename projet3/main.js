	/* 
		remplacez le chiffre 21 ci-dessous par l'ID de votre vocabulaire qui est, selon le groupe : 
		gr 1 : 16
		gr 2 : 7
		gr 3 : 6
	*/
	let gen = genF(6);
// les 2 lignes suivantes corrigent une erreur dans le traitement des données omeka et sont donc nécessaires
		gen.getItem("Event","function","kill").tablesParameters = ["Character","Character"];
		gen.getItem("Event","function","attack").tablesParameters = ["Character","Character","Location"];
		
// votre programme débute ici
