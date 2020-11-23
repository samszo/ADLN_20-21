var nomTemplates = ["Des_Character","Des_Location","Des_locations_communication","Des_possible_locations"];
var itemsSets = []; //liste des ids Omeka des items set de chaque table
var Personnage = {template:"Des_Character",itemSet:0};
var Lieux = {template:"Des_Location",itemSet:0};
var lieuxPossibles = {template:"Des_locations_communication",itemSet:0};
var Communication={template:"possible_locations",itemSet:0};
var tables = [Personnage,Lieux,lieuxPossibles,Communication];




document.addEventListener ('DOMContentLoaded',init);

function init(){
// ----- extraction des propriétés des tables à partir des json des resource templates
	
	// récupération des urls des jsons locaux des resource templates
	let urls=[];
	let deb="src/"
	nomTemplates.forEach(nom=>{ 
		nom="src/"+nom+".json";
		urls.push(nom);
	});
	//console.log(urls);
	
	// récupération des noms des propriétés utiles pour chaque table
	let promises = [];
	urls.forEach( 
		url => {promises.push(d3.json(url));}
	);
	Promise.all(promises).then(valeur => { // récupération des resource templates
		//console.log(valeur);
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

	


	generation(); // passage au programme de génération
}

function generation(){
	console.log(Personnage);
}

/*
"https://lire-ensemble.univ-paris8.fr/DigitalCreationWorkshop/omk/api/items/73"; //"fils.json";
	let url2 = "src/Des_Character.json";	
*/