// il faut passer par le json de correspondance et la liste item set de chaque table

//var nomTemplates = ["Des_Character","Des_Location","Des_locations_communication","Des_possible_locations"];
var Personnage = {template:"Des_Character",itemSetID:90,itemSetType:"des:Character"};
var Lieux = {template:"Des_Location",itemSetID:91,itemSetType:"des:Location"};
var lieuxPossibles = {template:"Des_possible_locations",itemSetID:92,itemSetType:"des:possibleLocation"};
var Communication={template:"Des_locations_communication",itemSetID:93,itemSetType:"des:Communication"};
var tables = [Personnage,Lieux,lieuxPossibles,Communication];




document.addEventListener ('DOMContentLoaded',init);

function init(){
// ----- extraction des propriétés des tables à partir des json des resource templates

// *** récupération des noms des propriétés utiles
	
	// construction des urls des jsons locaux des resource templates
	let urls=[];
	tables.forEach(num=>{ 
		nom="src/"+num.template+".json";
		nom = "https://lire-ensemble.univ-paris8.fr/DigitalCreationWorkshop/omk/api/items?item_set_id"+Personnage.itemSetID
		//console.log(nom);
		urls.push(nom);
	});
	//console.log(urls);	
	// récupération des noms des propriétés utiles pour chaque table
	let promises = [];
	urls.forEach( // récupération des json des item templates dans une liste
		url => {promises.push(d3.json(url));}
	);
	//console.log(urls);
	Promise.all(promises).then(valeur => { // récupération des resource templates séparées
		console.log(valeur);
		let tableProps = []; // tableau de la liste des propriétés par table
		valeur.forEach((i)=>{// séparation des tables
			let props = []; // liste des propriétés utiles de la table
			//console.log(i); // affichage du template de la table
			//console.log(i["o:resource_template_property"]); // affichage des propriétés spécifiques de la table
			propSpe = i["o:resource_template_property"];
			propSpe.forEach(j =>{
				propUtil = j["label"];
				props.push(propUtil);
				});
				//console.log(props); // affichage des poropriétés utiles de la table
				tableProps.push(props);
			});
			//console.log(tableProps);			
		// addition de la liste des propriétés dans la propriété .props de chaque table
		for (i = 0; i<tables.length;i++){
			tables[i].props=tableProps[i];
		}
	});
	//console.log(Personnage);	// la liste props de la table comporte bien la liste des propriétés

//*** récupération des éléments des tables à partir de leurs items-set

	// récupération des item-set
	urls = [];
	tables.forEach(num=>{ 
		//url="http://lire-ensemble.univ-paris8.fr/DigitalCreationWorkshop/omk/api/items?item_set_id="+num.itemSet;
		url = "src/"+num.itemSetID+".json";
		urls.push(url);
	});
	console.log(urls);
	// récupération des items de chaque item-set
	promises = [];
		urls.forEach( // récupération des json des item templates dans une liste
		url => {promises.push(d3.json(url));}
	);
	Promise.all(promises).then(valeur => { // récupération des resource templates séparées
		console.log(valeur);
		valeur.forEach(set => { // pour chaque table	
			set.forEach( // récupération des propriété utiles
				item => {console.log(item); // 
			}); 					
		});
	});


	generation(); // passage au programme de génération
}

function generation(){
	console.log(Personnage);
}

/*
"https://lire-ensemble.univ-paris8.fr/DigitalCreationWorkshop/omk/api/items/73"; //"fils.json";
	let url2 = "src/Des_Character.json";	
*/