

document.addEventListener ('DOMContentLoaded',remplitDatas);

function remplitDatas(){ // construit les tables du monde
	//
	let p = ["nom","voleur","kfP_L","a les bijoux","en vie","malade","niveau maladie","cardiaque"];
	let l = ["nomL","bijoux_présents"];
	let c = ["kfC_L1","kfC_L2"];
	let lp = ["kflp_P","kflp_L"];
	
	let personnages = [ // class ID = 132 ; label = "Character"
		["flic",false,"ailleurs",false,true,false,0,false],
		["Fils",false,"salon",false,true,false,0,false],
		["Marquise",false,"salon",true,true,false,0,true],
		["Dessetrousse",true,"ailleurs",false,true,true,0,true]
	];
	let lieux = [ // class ID = 133 ; label = "Location"
		["ailleurs",false],
		["rue",false],
		["chambre",false],
		["salon",true]
	];
	let communications = [ // class ID = 135 ; label = "Communication"
		["ailleurs",["rue"]],
		["rue",["ailleurs","salon"]],
		["salon",["chambre","rue"]],
		["chambre",["salon"]]
	];
	let lieuxPos = [ // class ID = 134 ; label = "possible location"
		["flic",["ailleurs","rue"]],
		["Dessetrousse",["ailleurs","rue","salon"]],
		["Marquise",["salon","chambre"]],
		["Fils",["salon","rue"]]
	];
	
	let datas = [
		[Personnage,[p,personnages]],
		[Lieu,[l,lieux]],
		[Communication,[c,communications]],
		[lieuxPossibles,[lp,lieuxPos]]
	];
	//console.log(datas);
	datas.forEach(liste => {
		//console.log(liste);
		//console.log(liste[1][0]);
		let Obj = new Object();
		let nbProps = liste[1][0].length;
		let nbItems = liste[1][1].length;
		for (let it = 0; it < nbItems; it++){
			let item = liste[1][1][it];
			let Obj = new Object();
			for (let i = 0; i < nbProps; i++){
				let prop = liste[1][0][i];
				//console.log (prop);
				Obj[prop] = item[i];
			}
			//console.log(Obj); //item
			liste[0].push(Obj);
		}
		//console.log(liste[0]);
	});
	suite();
}