function genF(voca){ // module de génération de fiction
// variables publiques
	let Monde = []; // table des tables du monde et évènements récupérées de omeka. Toutes les clefs sont obligatoires et doivent avoir une valeur
	let Event = []; // table des évènements
	let story = []; //table contenant l'enchaînement des états du monde et évènements de l'histoire
	let messages = false; // permet d'afficher des messages d'erreur dans la console
	let fin = false; // plus aucun évènement n'est effectué lorsque fin = true : fin de l'histoire
	let affichage = false; // nécessaire car l'affichage est asynchrone
	
// variables privées
	let infoFin = false; // paramètre qui évite de répéter le message de fin à chaque fois qu'un évènement suit l'évènement de fin. Cette variable n'est utilisée que lorsque messages = true
	
	//let listeID; // liste des propriétés ID des tables du monde
	
	
	let oOmk = new omk({
            cont:d3.select('#omk')
            , apiUrl:"https://lire-ensemble.univ-paris8.fr/DigitalCreationWorkshop/omk/api/"
            , waitUrl:"asset/svg/wait-pacman.svg"
        });
	
	let genSVG = genFMEDIA ();
	
	let listeVocas = Array.from(arguments);
	if(listeVocas.length){
		init(listeVocas);
	
		/* marche mais inutile, utilisé uniquement dans verifieMonde
		let listeKeyDuMonde = [];
		Monde.forEach(t => {// t est une table du monde
			let tt =Object.keys(t.values[0]); // tt est la liste des prop des items de la table
			listeKeyDuMonde.push(tt);
		});
		*/
		
		story.push(JSON.parse(JSON.stringify(Monde))); // initialise l'histoire avec l'état initial du monde
		
		console.log ("tables initiales du monde puis des évènements");
		console.log (JSON.parse(JSON.stringify(Monde)));
		console.log(Event);
	}
	
	let retour = {};
	//retour.test = test; // pour déboggage : renommer n'importe quelle fonction "test" permet de la tester depuis le programme principal
	
	//récupération des variables utiles 
	retour.Monde = Monde; 
	retour.Event = Event; 
	retour.story = story; 
	retour.messages = messages; // propriété non documentée dans l'aide -- pour déboggage 
	
	// récupération des fonctions utiles
	retour.finie = finie; 
	retour.copieTable = copieTable; 
	retour.getEntity = Entity; 
	//retour.getListeProp = tableProp;
	retour.verifie = verifieReq; 
	retour.affecteValeur = affecteValeurProb; 
	retour.showData = showData; 
	retour.faire = faireAvecFin; 
	retour.faireAvecProba = faireAvecProba; 
	retour.affiche = afficheSVG; 
	retour.efface = effaceSVG; 
	retour.getAffichage = genSVG.getAffichage;
	retour.affichagePeriodique = genSVG.affichagePeriodique; 
	retour.getItem = getItem;	 
	//retour.definitID = definitID;
	
	retour.oOmk = oOmk;
	retour.init = init;
	retour.legende = new legende();
	retour.getMonde = getMonde;

	return retour;
	
		
// ----------------- fonctions publiques
/*
	function definitID(args){// définit la propriété qui constitue d'ID de l'item pour chaque table  -- marche mais inutile
	//args est une liste dont chaque élément est une liste [table, prop]
	// table(string) est la valeur de la propriété key de la table (son nom)
	//prop (string) est le nom de la propriété qui définit l'ID des items
		listeID = args;
	}
*/
	function getMonde(){
		return Monde;
	}


	function finie(){
		return fin;
	}
	
	function copieTable(table){
		return JSON.parse(JSON.stringify(table));
	}
	
	function afficheSVG (table, prop, nom, index=0){
	// l'affiche l'élément media SVG de l'item nom d'une table du monde ou des évènements
	// table (string) est la valeur key d'une table du monde ou l'indication "Event"
	// prop est la propriété ID de l'item recherché dans la table du monde ou "function" pour un évènement
	//nom (string) est la valeur de la propriété prop de l'item recherché
	// index (integer) est l'index du tableau média à afficher lorsque plusieurs médias sont associés à l'tem. Par défaut c'est le 1° média de la liste qui est affiché
		
		let item = getItem(table, prop, nom);
		if (item === null){
			console.log ("pas de média à afficher pour "+table+", "+prop+", "+nom);
		}
		if (Array.isArray(item.media)){
			genSVG.affiche(item.media[index]);
		}else{
			genSVG.affiche(item.media);
		}
	}
	
	function effaceSVG (t=2){// 
	// teste l'effacement pendant t s. Retourne un booléen selon le résultat
	// t (entier) est le nombre de secondes pour le test. Ce paramètre est optionnel
		
		let nb=0;
		let timer = setInterval(effacer, 50,nb);
		
		function effacer(){
			if (genSVG.getAffichage()){
				genSVG.efface();
				clearInterval(timer);
				return true;
			}else{
				nb++;
				if (nb ==20*t){
					if (messages) {console.log ("effacement avorté");}
					clearInterval(timer);
					return false;
				}
			}
		}
	
		genSVG.efface();
	}
	
	function getItem(table, prop, nom) {
	// retourne le premier item (objet) de la table "table" qui possède la valeur "nom" pour la propriété "prop"
	//table (string) : valeur de key pour une table du monde ou "Event" pour un évènement
	// prop est la propriété ID de l'item recherché dans la table du monde ou "function" pour un évènement
	//nom (string) est la valeur de la propriété prop de l'item recherché
	
		if (table === "Event"){// média associé à un évènement
			for (let i = 0; i<Event.length;i++){
				if (Event[i].function === nom){
					return Event[i];
				}
			}
			
		}else{// média associé à un item du monde
			let items = Entity(table);
			for (let i=0 ; i<items.length; i++){
				if (items[i][prop] === nom){
					return items[i];
				}
			}
			return null; // item non trouvé : on ne retourne rien
		}
	}

	function verifieReq(evenement){// vérifie les requirements d'un évènement.
	// evenement est une liste d'arguments au format des arguments de la fonction faire
			return faireInt(evenement,false);		
	}
	
	function faireAvecProba(args){// traite une série d'évènements comme un évènement avec branches dont les branches ont les poids indiqués. 
	// l'argument args est la liste des branches. Chaque branche est une liste de 2 éléments dont le 1° est la liste usuelle d'un argument de la fonction faireAvEcFin et le poids  le taux attribué à la branche considérée.
	// retourne true si une a eu lieu
	
		let NewEvent = {};
		Event.splice(0,0,NewEvent); // ajout du nouvel évènemment à la table des évènements
		NewEvent.function = "NE**";
		NewEvent.nbParameters = 0;
		NewEvent.tablesParameters = [];
		NewEvent.type = "choix";
		NewEvent.proba = 1;
		NewEvent.requirements = [];
		NewEvent.finalStates = [];
		NewEvent.sequence = [];
		let listeBranches = [];
		let listeProbas = [];
		args.forEach(b => {// vérification de la faisabilité des évènements demandés
			if(verifieReq(b[0])){
				listeBranches.push(b[0]);
				listeProbas.push(b[1]);
			}			
		});
		if (listeProbas.length == 0){return false;}
		let branches = [];
		for (let i = 0 ; i<listeProbas.length; i++){
			let Ob = {};
			Ob.sequence = [];//listeBranches[i];
			let Ob2 = {};
			Ob2.fonction = listeBranches[i][0];
			listeBranches[i].splice(0,1);
			Ob2.arguments = listeBranches[i]
			Ob.sequence = [];
			Ob.sequence.push(Ob2);
			Ob.proba = listeProbas[i];
			branches.push(Ob);
		}
		NewEvent.branches = branches;
		let resultat = faireAvecFin(["NE**"],false);
		Event.splice(0,1); // retrait du nouvel élément de la liste des évènements
		return resultat; // indique l'état de l'exécution
	}
	
	function faireAvecFin(args){ // exécute un évènement en tenant compte de l'évènement de fin
	// args est une liste dont le 1° élément est le nom de la fonction de l'évènement, 
	//les autres étant les paramètres utilisés par la fonction de l'évènement
		if (!fin){ // fin de l'histoire
			return(faire(args));
		}else{
			if (!infoFin){
				console.log("l'histoire suivante s'est finie par un évènement de fin :");
				console.log(story);
				infoFin = true;
			}
			return;
		}
	}
	
	function showData(voca){// affiche les items omeka d'un vocabulaire dans le html
		oOmk.showData(voca);
	}
	
	function Entity(nom) {// retourne une table Entité du monde
		return tableKey(Monde, nom);
	}
	
	function affecteValeurProb (tableMonde, propID, valID, propAAffecter, valAAffecter){
	// affecte la valeur valAAffecter à la propriété propAAffecter de l'item dont la propriété propID de la table du monde tableMonde a la valeur valID
	//propID, tableMonde et  propAAffecter sont des strings
	
		let table = Entity(tableMonde);
		if (table.length == 0){
			console.log ("le 1° argument passé à affecteValeur n'est pas la key d'une table du Monde");
			return false;
			}
		let item = tableProp(table,propID,valID);
		if (item.length == 0){
			console.log ("aucun item de la table du monde indiquée n'a la propriété "+ propID);
			return false;
		}
		item[0][propAAffecter] = valAAffecter;
		return true;
	}
	
// --------------------	 fonctions privées
	
	function init(listeVocas){
		let rM = recup(listeVocas);		
		console.log("données récupérées de Omeka :");
		console.log(rM);
		let tables = nettoye(rM);
		let clefs = ["sequence","branches","tablesParameters","requirements","finalStates"];
		
		// séparation des tables du monde de la table des évènements
		Monde = tables.filter(function(O){
			if (O.key !== "Event"){
				return O;
			}else{								
				Event= O.values;
			}
		});	
		Event.forEach(e => { // e est un évènement
			clefs.forEach(c => { // c est une clef
				switch (typeof (e[c])) {
					case "string":
						let v = e[c];
						e[c]=[v];
						break;
					case "object":
						if (!Array.isArray(e[c])){
							let v = e[c];
							e[c]=[v];
						}
						break;
					case "undefined":
						e[c] = [];
						break;
					default:
				}
			});		
		});
	}


	// fonctions relatives au traitement des évènements
	
	function faire(args){ // exécute un évènement sans tenir compte de l'évènement de fin
		let res = faireInt(args,true);
		return res;
	}
	
	function faireInt(args,statut){ // retourne true ou false et affiche les messages d'erreur dans la console
	// args est la liste des arguments passés. Le 1° argument doit être le nom de la fonction de l'évènement, les autres sont les arguments de cette fonction dans l'ordre prévu dans la table Event
	// statut = false spécifie si la fonction doit vérifier les requirements de l'évènement fourni, sinon elle effectue l'évènement

		let itemsReq=[]; // table des items impliqués dans les requirements de l'évènement
		let itemsFinal =[]; // table des items impliqués dans les final states de l'évènement
		// variables de tests
		let numReq = 0; // numéro du requirement analysé 
		let numF = 0 ; // numéro du final state analysé
		let eventEnCours; // objet de la table Event en cours d'exécution
		let tableDuMonde; // table du monde impliquée dans un requirement
		let tableObjetsRequirement = []; //table des objtes du monde des items requirement
		let ObjWorld; // objet du monde impliqué dans un requirement
		let resultat = true; // valeur retournée : true tant qu'aucune erreur ne se produit
		let sequence;
		
		// détermination de l'item évènement impliqué
			if (! trouveEvent()){return false;}
			
		// vérification du critère de fin d'histoire
			if (eventEnCours.function == "*"){
				fin = true;
				return true;
			}
						
		// récupération des items des requirements et des final States
			eventEnCours.requirements.forEach(r =>{
				itemsReq.push(r.item);
			});
			eventEnCours.finalStates.forEach(f =>{
				itemsFinal.push(f.item);
			});

		// analyse des requirements de cet item évènement
			eventEnCours.requirements.forEach(faireReq);		
			if (!resultat || !statut) {return resultat;}
			
		// suite de la fonction : exécution de l'évènement lorsque statut = true
								
		// traitement du type pg :
			if(eventEnCours.type === "pg"){
				args2 = args.slice();
				args2.shift(); // on retire le 1° argument qui est le nom de la propriété function de l'évènement
				//le second argument passé par l'utilisateur doit être le nom de la fonction qui gère l'évènement et les suivants sont les paramètres passés à cette fonction
				if (args.length < 15){
					executeTCallback(args2); // gereEventPg(args2);
				} else {
					console.log	("nombre d'arguments trop grand pour exécuter l'évènement programmé "+eventEnCours.function+", utilisez une liste (array) plutôt que des paramètres indépendants ");
					return false;
				}
				
			}
			
		// traitement des branches
			if (eventEnCours.branches.length > 0){
				let tableProbas = []; //table des bornes de probabilités
				let tableIndex = []; // table des index des branches
				let p=0; // random max
				let index = 0; //index de la branche
				eventEnCours.branches.forEach(b => {// b est une branche
					if (b.proba >0){
						p+= b.proba;
						tableProbas.push(p);
						tableIndex.push(index);
					}
					index++;
				});
				let rand = Math.random()*p;
				if (messages){console.log("rand = "+rand);}
				let i = 0;
				while (i < tableProbas.length) {
					if (rand > tableProbas[i]) {
						i++;						
					}else{
						//console.log(rand);
						args.push(i); // ajout du numéro de branche exécuté
						gereSequence(eventEnCours.branches[tableIndex[i]]);
						break;					
					}
				}					
			}
			
			//exécution de la séquence d'évènements pour un évènement composé
			if (eventEnCours.sequence.length >0){
				gereSequence(eventEnCours);
			}
			
		// affectation des final states de l'évènement
			eventEnCours.finalStates.forEach(faireFinal);
				
		// ajout à l'histoire
			let tM;
			story.push(args);
			if (resultat && (eventEnCours.type == "élémentaire" || eventEnCours.type == "pg")){
				tM = JSON.parse(JSON.stringify(Monde));
				story.push(tM);
			}
		return resultat; 
		//---------------- fin corps de la fonction faireInt
		
		// ----------------------- fonctions internes à faireInt
		
		function gereSequence(evenement){
			evenement.sequence.forEach(ev =>{
				let table = [ev.fonction];
				ev.arguments.forEach(ar =>{//ar est un objet de la liste arguments de sequence
					let ar2 = (typeof ar === "object") ? args[ar.para] : ar ;
					table.push(ar2);
				});
				faire(table);
			});
		}
		
		/*
		function gereEventPg(args){
			callback = args[0];
			args.shift();
			let a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15;
			[a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15] = args;
			callback(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
		}
		*/
		
		function faireFinal(f){
		// effectue une final state.
		// f est le final state à effectuer
						
			// détermination de l'item du monde à modifier
			if (!resoutValeurItem(f)){return false;}
			
			// détermination de l'item de l'objet réel à modifier
			tableDuMonde = tableKey(Monde,f.item.key);
			let t = tableProp(tableDuMonde,f.item.prop,f.item.valeur);
			if (t.length == 0){
				if (messages){
					console.log("valeur : "+f.item.valeur+" incorrecte pour la propriété : "+f.item.prop+ " dans l'item du finalState "+numF-1+" de l'évènement "+eventEnCours.function);
				}
				infoErreur();
				resultat = false;
				return;
			}
			ObjWorld = t[0]; //item du monde trouvé
			
			//affectation des valeurs
			f.valeurs.forEach(v =>{
				if (typeof(v.valeur) === "object"){
					let p = Object.keys(v.valeur);
					v.valeur = resoutValeur(args,itemsReq,p,v);	
					if (v.valeur === "faireErreur"){
					infoErreur();
					return;						
					}
				}
				let res = affecteValeur(ObjWorld,v);
			});
			numF++;
		}
		
		function affecteValeur(Obj,v){
		/*
			la fonction affecte la valeur v.valeur à la propriété v.prop de l'objet Obj en fonction du type v.type d'affectation. Elle retourne un booléen indiquant si l'affectation est réussie
		*/
		
			switch(v.type){
				case "=":
					Obj[v.prop] = v.valeur;
					return true;
					break;
				case "+":
					Obj[v.prop]=Obj[v.prop]+v.valeur;
					return true;
					break;
				case "-":
					Obj[prop]=Obj[v.prop]-v.valeur;
					return true;
					break;
				case "a":
					if (Array.isArray(Obj[v.prop])){
						Obj[v.prop].push(v.valeur);
						return true;
						break;
					}else{
						if (messages){
							console.log("la propriété "+Obj[v.prop]+" de l'objet "+Obj+" n'est pas un Array");
						}
						return false;
						break;
					}
				default:
					if (messages){
						console.log ("type : "+v.type+" non prévu dans les final states ");
					}
					return "faireErreur";
			}
		}
		
		function trouveEvent(){
		// détermine l'event évènement impliqué
		// retourne true ou false selon le résultat
			for(var i =0; i < Event.length; i++){
				if(Event[i].function === args[0]) {
					break;
				}
			}
			if (i==Event.length){
				if (messages){
					console.log ("l'évènement demandé dans faire n'existe pas ou l'argument n'est pas une liste");
				}
				eventEnCours = null;
				resultat = false;
				infoErreur();
				return false;
			}
			eventEnCours = JSON.parse(JSON.stringify(Event[i])); // clone l'évènement, y compris l'ensemble de ses propriétés et valeurs, donc aussi la table des entités du monde
			return true;
		}
	
		function faireReq(r){
		// analyse d'un requirement
		// r est le requirement traité
					
			// détermination de l'item du monde cherché
			if (!resoutValeurItem(r)){return false;}
			
			// détermination de l'objet réel dans la table du monde			
			
			tableDuMonde = tableKey(Monde,r.item.key);// table des objets du monde impliquée			
			if (tableDuMonde.length == 0){
				if (messages){
					console.log("valeur : "+r.item.valeur+" incorrecte pour la propriété : "+r.item.prop+ " dans l'item du requirement "+numReq-1+" de l'évènement "+eventEnCours.function);
				}
				infoErreur();
				resultat = false;
				return;
			}
			ObjWorld = tableProp(tableDuMonde,r.item.prop,r.item.valeur)[0]; //item du monde trouvé
			if (ObjWorld === undefined){
				if (messages){
					console.log("mauvais argument entré pour l'évènement "+eventEnCours);
					infoErreur();
				}
				resultat = false;
				return false;
			}
			tableObjetsRequirement.push(ObjWorld);
			
			// vérification des conditions exigées pour l'item
			r.conditions.forEach(c => {
				if (typeof(c.valeur) === "object"){
					let p = Object.keys(c.valeur);
					c.valeur = resoutValeur(args,itemsReq,p,c);	
					if (c.valeur === "faireErreur"){
					infoErreur();
					resultat = false;
					return;						
					}
				}
				let res = verifieCondition (c);
				switch (res){
					case false:
						if (messages){
							console.log ("la condition de l'évènement n'est pas remplie, l'évènement est avorté");
						} // pas de break !
					case null:
						if (messages){
							console.log ("état actuel de l'objet impliqué dans le requirement :");
							console.log (ObjWorld);
						}
						infoErreur();
						resultat = false;
						return;
						break;
					default:
				}
			});
			numReq++;			
		}
		
		function resoutValeurItem(r){
		// résout la valeur conditionnelle éventuelle de l'item
			if (typeof(r.item.valeur)==="object"){
				let p = Object.keys(r.item.valeur); // liste des propriétés de l'objet valeur
				
				r.item.valeur = resoutValeur(args,itemsReq,p,r.item); // affectation des valeurs conditionnelles à l'item du requirement
				if (r.item.valeur === "faireErreur"){let t = tableProp(tableDuMonde,r.item.prop,r.item.valeur);
					infoErreur();
					resultat = false;
					return;
				}
			}
			return true;
		}
	
		function verifieCondition(c){ // vérifie un objet condition d'un requirement		
			switch(c.type){
				case "=":
					return (ObjWorld[c.prop] === c.valeur);
					break;
				case "!=":
					return (ObjWorld[c.prop] !== c.valeur);
					break;
				case ">":
					return(ObjWorld[c.prop] > c.valeur);
					break;		
				case "<":
					return(ObjWorld[c.prop] < c.valeur)
					break;
				case ">=":
					return(ObjWorld[c.prop] >= c.valeur)
					break;		
				case "<=":
					return(ObjWorld[c.prop] <= c.valeur);
					break;
				case "a":
					return(ObjWorld[c.prop].indexOf(c.valeur) >= 0);
					break;
				default:
					if (messages){
						console.log ("type non prévu dans le requirements");
					}
					return null;
			}
		}
		
		function resoutValeur(args,itemsReq,p,c){ // résout une valeur conditionnelle		
			switch (p[0]) {
				case "para":
					return (args [c.valeur.para]);
					break;
				case "item":
					return (tableObjetsRequirement[c.valeur.item][c.valeur[p[1]]]);
					break;
				default:
					if (messages){
						console.log ("type de l'objet *valeur* non prévu dans les requirements ou les final states des objets du monde" );
						console.log("arguments passés à la fonction attribueValeur : args, p, c, itemsReq, itemsFinal : ");
						console.log(args);
						console.log(p);
						console.log(c);
						console.log(itemsReq);
						console.log(itemsFinal);
					}
					return "faireErreur";
			}
		}
		
		function infoErreur(){
			if (messages){
				console.log("situation dans le programme : num du requirement , num du final state, évènement, arguments : ");
				console.log(numReq);
				console.log(numF);
				console.log(eventEnCours);
				console.log(args);
			}
		}
		
		//-------------------- fin function faireInt
	}	
	
// ---------------- autres fonctions privées 

	// --------------- fonctions relatives au traitement des données omeka
	function recup(listeVoca){ // récupère les données omeka d'une liste de vocabulaires
	
        let rM = oOmk.getItems(listeVoca); // rM est une liste d'objets, chaque objet est une table du monde de la fiction, la dernière est celle des évènements
        if (messages) {console.log(rM);}
	
		return rM
	}

	function nettoye (rM){
	//analyse une table fournie par oOmk
		let table = [];
		rM.forEach(t =>{ // t est une table du monde ou la table évènement. C'est un objet qui contient dans values tous les items de la table
			//let table = [];
			let Obj = {};
			Obj.key = t[0];
			Obj.values = [];
			t[1].forEach(O => { // O est un item du monde ou un évènement
				let Objet = analyseObjet(O);
				//Objet.key = t.key
				//table.push(Objet);
				if (Array.isArray(O["o:media"])){
					let media = [];
					O["o:media"].forEach(elmt => {
						media.push(elmt["o:original_url"])
					});
					Objet.media = media;
				}else{
					Objet.media=O["o:media"]["o:original_url"];
				}
				Obj.values.push(Objet);
			});
			table.push(Obj);
		});
		return table;
	}
	
	function analyseObjet(item){
	// nettoye un objet du monde renvoyé par omeka
	//let Objet = {key:Obj.key};
	let Objet = {};
	//let item = Obj.values[0]; // un item d'une table du monde
	let l = Object.keys(item); 
	l = l.filter(index => ((index.charAt(0)!== "o") && (index.charAt(0)!== "@") && (index !== "thumbnail_display_urls")));
	//let p = ["requirements","finalStates","branches","sequence"];
	//let i;
	l.forEach(k =>{ //k est une clef de l'item
		if (typeof item[k] === "string"){ 
			let val = item[k].substr(0,5);
			switch (val){
				case "true":
					Objet[k]=true;
					break;
				case "false":
					Objet[k]=false;
					break;
				case "[]":
					Objet[k]=[];
					break;
				case "https":
					break;
				case "-" :
					break;
				default:
					Objet[k] = (item[k] == parseInt(item[k])) ? parseInt(item[k]) : item[k] ;	// vérifie si la valeur est un nombre décimal
					if  (typeof(Objet[k]) === "string"){
						if ((Objet[k].charAt(0)=="[") && (Objet[k].charAt(Objet[k].length-1)=="]")) { // récupération des Arrays. Dans omeka, Il faut coller les termes à la virgule et ne pas les mettre entre guillemets
							Objet[k] = Objet[k].slice(1,Objet[k].length-1);
							Objet[k]= Objet[k].split(",");
						}
					}
				break;					
			}
		} else {
			Objet[k]=item[k];
		}
	});
	//ATTENTION: il est bon de garder l'identifiant de l'item pour le gérer
	Objet['id']=item['o:id']; 
	return Objet;
	}
	
	// -------- fonctions générales
	
	function executeTCallback(args){
	// exécute une fonction callback en décomposant le tableau args en paramètres passés à la fonction
	
		callback = args[0];
		args2 = args.slice();
		args2.shift();
		let a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15;
		[a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15] = args2;
		callback(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);	
	}
	
	function tableKey(table,nom){
	// retourne la liste des objets de la propriété values de la table dont la propriété key est nom
		
		resultat = tableProp(table,"key",nom);
		if (resultat.length == 0){
			if (messages){
				console.log ("le nom entré : "+nom+" n'est pas une valeur de la propriété *key* de la table suivante :");
				console.log(table);
			}
			return resultat;
		}
		resultat = resultat[0].values
		return resultat ; // liste vide si nom n'est pas une clef
	}
	
	function tableProp(table, prop, val){
	// retourne la liste des objets d'une table d'objets qui ont la valeur val de la propriété prop
	// table est la liste initiale, prop la propriété recherchée, val la valeur recherchée
	// attention les objets sont passés par référence

		let resultat = [];
		table.filter( i => {
			if(i[prop] === val){resultat.push(i);}
		});
		return resultat;	
	}
	
	/*
	function executeCallback(callback){
	// exécute la fonction callback
	// le nombre d'arguments doit être inférieur à 16
	// le premier argument est la fonction callback à exécuter
	// les autres sont les arguments passés à la fonction
	
		let args = Array.from(arguments);
		if (args.length > 15){
			console.log ("nombre d'arguments trop grand pour exécuter "+callback+" utilisez un array");
			return false;
		}
		args.shift();
		let a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15;
		[a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15] = args;
		callback(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
		return true;
	}
	*/
	
	/*
	function verifieMonde (){ // marche mais résultats inintéressants. Faut listeKeyDuMonde
	// vérifie si l'état du monde a changé.
	// retourne true dans l'affirmative
	
	let M = JSON.parse(JSON.stringify(Monde));
	let st = story[story.length-1]; // dernière table du monde dans l'histoire
		for (let i = 0 ; i < st.length ; i++){ // i est le n° de l'entité du monde dans la table du monde
			let it = st[i].values; // liste des items de l'entité
			for (let k = 0; k < it.length-1; k++){// k est un item
				for (let j = 0; j <listeKeyDuMonde[i].length - 1; j++){ // j est le n° de la propriété utile d'un item de l'entité
					if (it[k][listeKeyDuMonde[i][j]] != M[i].values[k][listeKeyDuMonde[i][j]]){
						return true;
					}
				}
			}
			
		}
		return false;
	}
	*/
}