var Personnage = [{nomTable:"Personnage"}];
var Lieu= [{nomTable:"Lieu"}];
var Communication = [{nomTable:"Communication"}];
var lieuxPossibles = [{nomTable:"lieuxPossibles"}];
var Monde = [Personnage,Lieu,Communication,lieuxPossibles];
var resultat;

var Event = [{
		nomE: "se déplacer en un lieu", // optionnel
		function: "deplacer",
		nbParameters: 2, //optionnel
		type: "elementary",
		requirements: [{
				item: {
					table: Personnage,
					prop: "nom",
					valeur: {
						para: 1
					}
				},
				conditions: [{
						prop: "kfP_L",
						type: "!=",
						valeur: {
							para: 2
						}
					},
					{
						prop: "en vie",
						type: "=",
						valeur: true
					},
				]
			},
			{
				item: {
					table: Communication,
					prop: "kfC_L1",
					valeur: {
						item: 0,
						prop: "kfP_L"
					}
				},
				conditions: [{
					prop: "kfC_L2",
					type: "a",
					valeur: {
						para: 2
					}
				}]
			},
			{
				item: {
					table: lieuxPossibles,
					prop: "kflp_P",
					valeur: {
						para: 1
					}
				},
				conditions: [{
					prop: "kflp_L",
					type: "a",
					valeur: {
						para: 2
					}
				}]
			}
		],
		finalStates: [{
			item: {
				table: Personnage,
				prop: "nom",
				valeur: {
					para: 1
				}
			},
			valeurs: [{
				prop: "kfP_L",
				type: "=",
				valeur: {
					para: 2
				}
			}]
		}]
	},
	{
		nomE: "prendre les bijoux",
		function: "prendre",
		nbParameters: 1,
		type: "elementary",
		requirements: [{
				item: {
					table: Personnage,
					prop: "a les bijoux",
					valeur: true
				},
				conditions: []
			},
			{
				item: {
					table: Personnage,
					prop: "nom",
					valeur: {
						para: 1
					}
				},
				conditions: [{
						prop: "voleur",
						type: "!=",
						valeur: {
							item: 0,
							prop: "voleur"
						}
					},
					{
						prop: "kfP_L",
						type: "=",
						valeur: {
							item: 0,
							prop: "kfP_L"
						}
					},
					{
						prop: "a les bijoux",
						type: "=",
						valeur: false
					},
					{
						prop: "en vie",
						type: "=",
						valeur: true
					}
				]
			},
			{
				item: {
					table: Lieu,
					prop: "bijoux_présents",
					valeur: true
				},
				conditions: [{
					prop: "nomL",
					type: "=",
					valeur: {
						item: 0,
						prop: "kfP_L"
					}
				}]
			}
		],
		finalStates: [{
				item: {
					table: Personnage,
					prop: "nom",
					valeur: {
						para: 1
					}
				},
				valeurs: [{
					prop: "a les bijoux",
					type: "=",
					valeur: true
				}]
			},
			{
				item: {
					table: Personnage,
					prop: "nom",
					valeur: {
						item: 0,
						prop: "nom"
					}
				},
				valeurs: [{
					prop: "a les bijoux",
					type: "=",
					valeur: false
				}]
			}
		]
	},
	{
		nomE: "mourir",
		function: "mourir",
		nbpParameters: 1,
		type: "elementary",
		requirements: [{
			item: {
				table: Personnage,
				prop: "nom",
				valeur: {
					para: 1
				}
			},
			conditions: [{
				prop: "en vie",
				type: "=",
				valeur: true
			}]
		}],
		finalStates: [{
			item: {
				table: Personnage,
				prop: "nom",
				valeur: {
					para: 1
				}
			},
			valeurs: [{
				prop: "en vie",
				type: "=",
				valeur: false
			}]
		}, ]
	},
	{
		nomE: "aggraver la maladie",
		function: "",
		parameters: [],
		type: "",
		requirements: [],
		finalState: []
	},
	{
		nomE: "",
		function: "",
		parameters: [],
		type: "",
		requirements: [],
		finalState: []
	},
	{
		nomE: "",
		function: "",
		parameters: [],
		type: "",
		requirements: [],
		finalState: []
	},
	{
		nomE: "",
		function: "",
		parameters: [],
		type: "",
		requirements: [],
		finalState: []
	},
	{
		nomE: "",
		function: "",
		parameters: [],
		type: "",
		requirements: [],
		finalState: []
	},
	{
		nomE: "",
		function: "",
		parameters: [],
		type: "",
		requirements: [],
		finalState: []
	},
	{
		nomE: "test",
		function: "test",
		parameters: ["A"],
		type: "",
		requirements: [

		],
		finalState: []
	}

];



function suite(){
	//console.log("on continue");
	afficheTables(Event);
	faire("deplacer","Fils","rue");
	faire ("mourir","Fils");
	//faire ("deplacer","Dessetrousse","rue");// marche pas
	//faire ("deplacer","Dessetrousse","salon"); // marche pas
	//let r = faire("prendre","Dessetrousse");// marche pas même si Dessetrousse est mis dans le salon manuellement avant l'évènement
	//console.log(r);
	afficheTables(Personnage);
	
}

function faire(){ // retourne true ou false et affiche les messages d'erreur dans la console
//	on passe les arguments dans l'ordre : nom de la fonction, 1° paramètre, 2° paramètre...
// cette fonction traite les évènements élémentaires 
	resultat = true;
	let args = Array.from(arguments);
	let itemsReq=[]; // table des items impliqués dans les requirements de l'évènement
	let itemsFinal =[]; // table des items impliqués dans les final states de l'évènement
	if (args.length ==0){
		console.log("missing arguments in faire");
		return false;
	}
	
	// détermination de l'item évènement impliqué
	for(var i =0; i < Event.length; i++){
		if(Event[i].function === args[0]) {
			//console.log(Event[i]);
			//var ObjEvent = Event[i];	// Event[i] est l'évènement impliqué		
			break;
		}
	}
	if (i==Event.length){
		console.log ("the applied Event does not exist for faire");
		return false;
	}
	// analyse des requirements 
	//console.log(Event[0]);
	Event[i].requirements.forEach(r=>{ // r est l'item requirement en cours d'analyse
		//console.log(r); 	
		
		//détermination des items de tables du monde impliqués dans les requirements
		
		//console.log(r.item.valeur);
		if (typeof(r.item.valeur)==="object"){// attribution des valeurs finales à la propriété définissant l'item
			let p = Object.keys(r.item.valeur); // liste des propriétés de l'objet valeur
			//console.log(p);
			
			r.item.valeur = attribueValeur(args,itemsReq,p,r.item); // affectation des valeurs conditionnelles
			if (r.item.valeur === false){resultat = false;} 
			//console.log(r.item.valeur);
			
		}	
		let ObjWorld=chercheItem(r.item.table,r.item);
			itemsReq.push(ObjWorld); // item récupéré
			//vérification des conditions du requirement analysé
			if (resultat){
				r.conditions.forEach( c => { // c est l'objet condition examiné
					//console.log(c);
					let p = Object.keys(c.valeur);
					//console.log(p.length);
					//affectation des valeurs conditionnelles
					if (p.length > 0){
						c.valeur = attribueValeur(args,itemsReq,p,c);
						if (c.valeur=== false){
							resultat = false;
						} 
						if (c.valeur) {
							//console.log(c); // condition réelle à tester
							res = verifieCondition(ObjWorld,c.prop,c.valeur,c.type);
						}  
					}
				});
			}			
		
		//console.log(itemsReq); // liste des items du monde impliqués dans les requirements
		
	});
	if (resultat === false){return false;}

	// application des final states
	Event[i].finalStates.forEach(f =>{ // f est l'item final state examiné
		//console.log(f);
		
		//détermination des items de tables du monde impliqués dans les final states
		if (typeof(f.item.valeur)==="object"){
			let p = Object.keys(f.item.valeur);
			f.item.valeur = attribueValeur(args,itemsReq,p,f.item);
			//console.log(f.item.valeur);
			if (!f.item.valeur){resultat = false;}
			let Obj = chercheItem(f.item.table,f.item); // objet concerné par le final state
			// application des nouvelles valeurs
			if (resultat){
				f.valeurs.forEach(v =>{ // v est l'objet valeur à affecter 
					let p = Object.keys(v.valeur);
					//console.log(p);
					if (p.length > 0){
						v.valeur = attribueValeur(args,itemsReq,p,v);
						//console.log (v.valeur);
					}
					resultat = affecteValeur(Obj,v.prop,v.valeur,v.type);
				});
			}
		}
	});

	return resultat;
}

function attribueValeur(args,itemsReq,p,c){
	// résout une valeur conditionnelle
	switch (p[0]) {
		case "para":
			return (args [c.valeur.para]);
			break;
		case "item":
			return (itemsReq[c.valeur.item][c.valeur[p[1]]]);
			break;
		default:
			console.log ("type of object 'valeur' not foreseen in the requirements or final states of a world object" );
			return false;
	}
}

function affecteValeur(Obj, prop, val, type){
/*
	la fonction affecte la valeur val à la propriété p de l'objet Obj en fonction du type d'affectation. Elle retourne un booléen indiquant si l'affectation est réussie
*/

	switch(type){
		case "=":
			Obj[prop] = val;
			return true;
			break;
		case "+":
			Obj[prop]++;
			return true;
			break;
		case "-":
			Obj[prop]--;
			return true;
			break;
		case "a":
			if (Array.isArray(Obj[prop])){
				Obj[prop].push(val);
				return true;
				break;
			}else{
				console.log("the property "+Obj[prop]+" of object "+Obj+" is not an Array");
				return false;
				break;
			}
		default:
			console.log ("no foreseen type in final states");
			return false;
	}
	
}

function verifieCondition(Obj, prop, val, type){
/*
	La fonction vérifie que la valeur de la propriété prop de l'objet Obj vérifie la condition type relativement à la valeur val et retourne un booleen
*/

	switch (type) {
		case "=":
			return (Obj[prop] === val);
			break;
		case "!=":
			return (Obj[prop]!== val);
			break;
		case ">":
			return(Obj[prop] > val);
			break;		
		case "<":
			return(Obj[prop]< val)
			break;
		case ">=":
			return(Obj[prop] >= val)
			break;		
		case "<=":
			return(Obj[prop] <= val);
			break;
		case "a":
			return(Obj[prop].indexOf(val) >= 0);
			break;
		default:
			console.log ("no foreseen type in requirements");
			return false;
	}
}

function chercheItem (table, condition) {
// la fonction retourne le 1° item de la table qui vérifie la condition
// ou un objet vide si aucun item n'est trouvé	
// la condition est nécessairement "=" 

	for (let i = 0 ; i<table.length;i++){
		if (table[i][condition.prop] == condition.valeur){
			return table[i];
			break;
		}
	}
	return ({});
}

function afficheTables(){
// affiche dans la console une ou des table de la base. 
//Affiche toutes les tables du monde lorsqu'aucun argument n'est passé

	let args = Array.from(arguments);
	if (args.length === 0){
		Monde.forEach(table =>{
			console.log(Monde);
		}); 
	}else{
		args.forEach(table =>{
			console.log(table);
		} );		
	}
}