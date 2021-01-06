	/* 
		remplacez le chiffre 21 ci-dessous par l'ID de votre vocabulaire qui est, selon le groupe : 
		gr 1 : 16
		gr 2 : 7
		gr 3 : 6
	*/
	let gen = genF(7);

gen.faire(["talk","Worm","Book",2]);

let arrChap = [];
for (let i = 1; i < 4; i++) {
	let seqs =[];
	if(i==1){
		/*
		gen.Monde[1].values.forEach(c => {
			seqs.push(c);
		});
		*/		
		for (let j = 1; j < 20; j++) {
			seqs.push('seq'+j);
		}
	}
	if(i==2){
		/*
		seqs.push(gen.Monde[1].values[1]);
		seqs.push(gen.Monde[1].values[4]);
		*/
		for (let j = 1; j < 3; j++) {
			seqs.push('seq'+j);
		}

	}
	arrChap.push({'id':'ch'+i,'seq':seqs,'used':false});
}
//console.log(arrChap);
console.log(getUseChap());
console.log(getUseChap());
console.log(getUseChap());
console.log(getUseChap());

function getUseChap(){
	let unsedChap = arrChap.filter(c=>c.used==false);
	if(unsedChap.length==0)return false;
	curChap = unsedChap[getRandomInt(0,unsedChap.length-1)];
	curChap.used = true;
	return curChap;	
}

// On renvoie un entier aléatoire entre une valeur min (incluse)
// et une valeur max (exclue).
// Attention : si on utilisait Math.round(), on aurait une distribution
// non uniforme !
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
  }

/*
	{'nom':'titi',id='chp1','seq':[
		{'id':'g1.1',alive:true,used:false}
		,{'g1.2'
	]}
	,{'nom':'toto',id='chp2','seq':[
		'g2.1','g2.2'
	]}
]
*/
