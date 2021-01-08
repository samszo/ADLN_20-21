	/* 
		remplacez le chiffre 21 ci-dessous par l'ID de votre vocabulaire qui est, selon le groupe : 
		gr 1 : 16
		gr 2 : 7
		gr 3 : 6
	*/
	let gen = genF(6);
// les lignes suivantes corrigent une erreur dans le traitement des données omeka de tablesParameters et sont donc nécessaires
		gen.getItem("Event","function","kill").tablesParameters = ["Character","Character"]; // item 180
		gen.getItem("Event","function","attack").tablesParameters = ["Character","Character","Location"]; // item 
		console.group("affichage des tables corrigées : table du Monde puis table des évènements"); // item 182
		// curieusement pas de pb pour l'item 188 pour lequel le doublon se trouve sur les 2 dernières lignes du champ
		console.log(gen.copieTable(gen.Monde)); // affichage console de la table du monde corrigée
		console.log(gen.copieTable(gen.Event)); // affichage console de la table des évènements corrigée
		console.groupEnd();
		
// votre programme débute ici
	
