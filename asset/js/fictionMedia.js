class fictionMedia {
    constructor(params) {
        var me = this;
	    this.affichage = false;
		
        this.chargeSVG = function(url){
            d3.xml(url)
                .then(data => {
                    effaceSVG();
                    d3.select("#svg-container").node().append(data.documentElement);
                    let cont = d3.select("#svg-container").node();
                    let svg = d3.select("#svg-container svg");
                    let g = d3.select("#svg-container svg g");
                    let bb = g.node().getBBox();
                    svg.attr('id','monSVG')
                        .attr('height',cont.offsetHeight)
                        .attr('width',cont.offsetWidth)        
                        .attr('viewBox',bb.x+' '+bb.y+' '+bb.width+' '+bb.height)
                        .attr('preserveAspectRatio','xMinYMin meet');
                    affichage = true;
                    //console.log(affichage);				
                });	
        }

        this.chargeImage = function (url){ // non utilisé
            let img = new Image(800,600);
            img.src = url;
            img.decoding = 'sync';
            let x = document.querySelector('#media');
            x.setAttribute("src", url);
        }

        this.effaceSVG = function(){
            document.querySelector("#svg-container").innerHTML="";
            affichage = false;
        }
        
        this.getAffichage = function(){
            return affichage;
        }
        
        this.affichagePeriodique = function(){
        // exécute périodiquement une fonction callback d'affichage 
        
            let id; // identifiant du timer
            let id2; // identifiant de request frame
            
            let retour = {};
            retour.run = run;
            retour.stop = stop;
            return retour;
            
            function run(callback,f=25){
            // exécute périodiquement la fonction callback à une fréquence donnée.
            // callback est le nom de la fonction à exécuter
            // f (float) est la fréquence du timer en fps, limitée à 60 fps (défaut = 25 fps)
            // les arguments passés à callback suivent f
            // la liste des arguments est de la forme [callback, t, para1, para2..., para15]. Le nombre maximal de paramètres pouvant être passés à callback est 15

                f = Math.min(f,60);
                let t = 1000/f; // période du timer
                let args = Array.from(arguments);
                args.splice(1,1);
                execute ();
                
                function execute(){
                    id = window.setTimeout(function(){
                        id2 = window.requestAnimationFrame (execute);
                        executeTCallback(args);
                        //console.log (id);
                    },t);
                }
            }
            
            function stop(){
                window.clearTimeout(id);
                window.cancelAnimationFrame(id2);
            }		
        }
        
        // fonctions privées
        
        this.executeTCallback = function(args){
        // exécute une fonction callback en décomposant le tableau args en paramètres passés à la fonction
        
            callback = args[0];
            args2 = args.slice();
            args2.shift();
            let a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15;
            [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15] = args2;
            callback(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);	
        }
    
    }
}

