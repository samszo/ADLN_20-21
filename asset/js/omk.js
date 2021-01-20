class omk {
    constructor(params) {
        var me = this;
        this.cont = params.cont ? params.cont : d3.select('body');
        this.apiUrl = params.apiUrl ? params.apiUrl : false;
        this.waitUrl = params.waitUrl ? params.waitUrl : false;
        this.data = params.data ? params.data : {}; 
        this.idVocab = 0;
        this.scenes=[];
        this.itemsVocab=[];
        var vocab, tables, classes, properties, items=[], omekaQuery=[],divWait
        , propsForOmekaType = {
            'o:ResourceClass':['@id','o:id','o:label','o:term']
            ,'o:Property':['@id','o:id','o:label','o:term']
            ,'o:Item':['@id','o:id','o:title','o:resource_class','properties']
        };

        function verifInit(){
            if(!me.apiUrl){
                throw "L'url de l'API n'est pas valide. Merci de le définir";
                return;
            }            
            if(me.apiUrl.substr(me.apiUrl.length-1,1)!='/')me.apiUrl+='/';
        }

        this.getListeVocabulaire = function(idCont, fctChange, dataOnly=false){
            me.showWait();
            verifInit();    
            d3.json(me.apiUrl+"vocabularies").then(function(vocabs) {
                if(dataOnly){
                    fctChange(vocabs);
                    return;
                }
                let contSlct = d3.select("#"+idCont);
                contSlct.append('label').attr('for','slctVocabs').html('Choisir un vocabulaire :');
                let slct = contSlct.append('select')
                    .attr('id','slctVocabs')
                    .attr('name','vocabs')                    
                    .on('change',function(d){
                        let id = this.options[this.selectedIndex].id;
                        if(fctChange)fctChange(id);
                    });
                slct.selectAll('option').data(vocabs).enter().append('option')
                    .attr('id',d=>{
                        return d['o:id'];
                    })
                    .html(d=>d['o:label']);
                me.hideWait();               
            });
        }

        this.getListeMonde = function(fctBack){
            me.showWait();
            verifInit();
            //TODO gérer les identifiants     
            d3.json(me.apiUrl+"items?resource_class_id=170").then(function(mondes) {
                fctBack(mondes);
                me.hideWait();               
            });
        }        
        //récupère les items liés à un vocabulaire  
        this.getItems = function (idVocab) {
            me.showWait();               
            let result = [];
            Promise.resolve(me.init(idVocab,null,true)).then(function(d){                
                let rs = [];
                items.forEach(i=>{
                    //rs.push(getTypeVals(i));
                    rs.push(getAllVals(i));
                })
                //met à plat les valeurs
                rs = rs.map(d=>{
                    let r=[];
                    d.forEach(p=>{
                        let k = p.p ? p.p :p.k;
                        if(r[k]){
                            if(Array.isArray(r[k])){
                                r[k] = r[k].concat(p.v);
                            }else{
                                let oV = r[k];
                                //on ne supprime plus les doublons
                                //if(oV!=p.v)r[k] = [oV,p.v];
                                r[k] = [oV,p.v];
                            } 
                        }else
                            r[k]=p.v
                    });
                    return r;
                });
                result = result.concat(rs)                
            
                //regroupe les valeurs par class 
                result = Array.from(d3.group(result, d => d['o:resource_class']));

                me.hideWait();
                me.itemsVocab = result;               
                return result;
            });
            console.log('Attente getItems');
        }

        this.init = function (idVocab, endFct=null, synchrone=false) {
            verifInit();            
            
            me.idVocab = idVocab;
            if(!me.idVocab){
                throw "L'identifiant du vocabulaire n'est pas bon. Merci de le définir";
                return;
            }
            
            items = [];
            tables = [];
            if(synchrone){
                //charges les vocabulaires de la fiction en synchrone
                vocab = getJsonSynchrone(me.apiUrl+"vocabularies/"+me.idVocab);
                classes = getJsonSynchrone(me.apiUrl+"resource_classes?vocabulary_id="+me.idVocab);
                properties = getJsonSynchrone(me.apiUrl+"properties?vocabulary_id="+me.idVocab);

                //récupère les items
                classes.forEach(d => {
                    items = items.concat(getJsonSynchrone(me.apiUrl+"items?resource_class_id="+d['o:id']));
                })
            }else{
                Promise.resolve(getAsyncDataVocab()).then(function(d){     
                    return items;
                });           
            }
        }

        function getAsyncDataVocab(){
            //charges les vocabulaires de la fiction
            let jsonVocabs = [
                d3.json(me.apiUrl+"vocabularies/"+me.idVocab)
                , d3.json(me.apiUrl+"resource_classes?vocabulary_id="+me.idVocab)
                , d3.json(me.apiUrl+"properties?vocabulary_id="+me.idVocab)
            ];

            Promise.all(jsonVocabs).then(function(values) {
                vocab = values[0];
                classes = values[1];
                properties = values[2];
                //récupère les items
                let jsonItems = [];
                classes.forEach(d => {
                    jsonItems.push(d3.json(me.apiUrl+"items?resource_class_id="+d['o:id']));
                })
                Promise.all(jsonItems).then(function(rs) {
                    rs.forEach(rsItem=>{
                        items = items.concat(rsItem);
                    });
                    return items;
                });
            });
        }

        this.showData = function (idVocab) {
            me.showWait();               
            me.init(idVocab,createTableData);
        }

        this.cleanScene = function() {
            //suprime les conteneurs obsolètes
            me.cont.select('h1').remove();
            me.cont.selectAll('table').remove(); 
            me.cont.select('svg').remove();
        }   

        function createTableData(){
            //suprime les conteneurs obsolètes
            me.cleanScene();

            //crétion des tables
            tables = [
                {'class':'o:ResourceClass','nom':'Tables','rs':classes}
                ,{'class':'o:Property','nom':'Propriétés','rs':properties}
                ,{'class':'o:Item','nom':'Items','rs':items}
            ]
            me.cont.append('h1').html(vocab['o:label']);
            let htmlTable = me.cont.selectAll('table').data(tables).enter()
                .append('table')
                .attr('id',(d,i)=>{
                    //récupère les colonnes 
                    propsForOmekaType[d.class] = getAllCols(d);
                    //propsForOmekaType[d.class] = d3.nest()
                    //    .key(d=> d.k)
                    //    .entries(getAllVals(d.rs[0])).map(d=>{return {k:'titre',v:d.key};});                            
                        //.entries(getColsVals(d.rs[0])).map(d=>{return {k:'titre',v:d.key};});                            
                    //récupère toute les colonnes                    
                    return 'adlnTable'+i;
                })
                .style('height',"100%")
                .style('width',"100%");
            htmlTable.append('thead').append('tr').append('th')
                .attr('colspan',d=>{
                    return propsForOmekaType[d.class].length;
                })
                .html(d=>'<h2>'+d.nom+'</h2>');
            let htmlTableBody = htmlTable.append('tbody');
            let tr = htmlTableBody.selectAll('tr').data(d=>{
                //ajoute une ligne pour l'entête
                d.rs = [{'titres':propsForOmekaType[d.class]}].concat(d.rs);
                return d.rs;
            }).enter().append('tr');
            tr.selectAll('td').data((d,i)=>{
                let rs = d.titres ? d.titres : getColsVals(d, true);//getAllVals(d,true);//
                return rs;
            }).enter().append('td').html(d=>{
                var html = '';
                switch (d.k) {
                    case '@id':
                        html=geyOmkUrls(d);   
                        break;                
                    case 'titre':
                        html='<h3>'+d.v+'</h3>';   
                        break;
                    case 'thumbnail_display_urls':                
                        html='';
                        for (const ima in d.v) {
                            html+= d.v[ima] ? ima+':<img src="'+d.v[ima]+'"></img><br/>' : '';
                        }                            
                        break;
                    default:
                        if(typeof d.v == "object"){
                            html = JSON.stringify(d.v);
                        }else
                            html = d.v;
                        break;
                }
                return html;
            })
            me.hideWait();               
        }


        function getAllCols(d){
            let cols = [];
            d.rs.forEach(r=>{
                for (const p in r) {
                    cols[p]=1;
                }
            })
            let rs = [];
            for (const key in cols) {
                rs.push({k:'titre',v:key});
            }
            return rs;
        }

        function geyOmkUrls(d){
            let urlAdmin = "";
            switch (d.t) {
                case 'o:ResourceClass':
                    urlAdmin = d.v.substr(0,d.v.indexOf('api'))+'admin/vocabulary/15/classes';
                    break;
                case 'o:Property':
                    urlAdmin = d.v.substr(0,d.v.indexOf('api'))+'admin/vocabulary/15/properties';
                    break;
                default:
                    urlAdmin = d.v.replace('api/items', 'admin/item');
                    break;
            }
            return '<a href="'+d.v+'" target="_blank">json</a>'
                +' -> '
                +'<a href="'+urlAdmin+'" target="_blank">admin</a>';   

        }

        this.getUrlItemAdmin = function(){
            return me.apiUrl.replace('api/', 'admin/')+'item/';
        }

        function getTypeVals(d) {
            let vals = [];
            if(d){
                if(Array.isArray(d['@type'])){
                    d['@type'].forEach(t=>{
                        vals = vals.concat(getTypePropertiesVals(d, t));
                    })
                }else{
                    vals = vals.concat(getTypePropertiesVals(d, d['@type']));
                };                    
            }

            return vals; 
        }

        function getTypeData(d) {
            let type = 'o:Item';
            if(d){
                if(Array.isArray(d['@type']))
                    type = d['@type'][0];
                else
                    type = d['@type'];                  
            }
            return type; 
        }

        
        function getColsVals(d, groupe) {
            let vals = [];
            if(d){
                let t = getTypeData(d);
                propsForOmekaType[t].forEach(prop=>{
                    let val = getVals(d, t, prop.v);
                    if(groupe) val = groupeVals(val);
                    vals = vals.concat(val);
                });                    
            }
            return vals; 
        }

        function getAllVals(d,groupe){
            //récupère toutes les propriétés
            let vals=[];
            for (const prop in d) {
                let val = getVals(d, getTypeData(d), prop);
                if(groupe) val = groupeVals(val);
                vals = vals.concat(val);
            }             
            return vals;           
        }

        function groupeVals(val){

            let gVal = false;
            val.forEach((v,i)=>{
                if(i > 0){
                    val[0].v+=','+v.v;
                    gVal = val[0];
                }                        
            })
            val = gVal ? gVal : val;
            return val;                    
        }

        function getTypePropertiesVals(d, t) {
            let vs = [], vals=[];
            //récupère toutes les propriétés défini pour le type
            if(propsForOmekaType[t]){
                propsForOmekaType[t].forEach(p=>{
                    if(p=='properties'){
                        properties.forEach(prop=>{
                            vs = vs.concat(getVals(d, t, prop['o:term']));
                        })
                    }else    
                        vs = vs.concat(getVals(d, t, p));
                })            
                vals = vals.concat(vs);            
            }
            return vals;
        }

        function getVals(d, t, p) {
            let vs=[];
            if(Array.isArray(d[p])){
                if(!d[p].length)vs.push(getVal(d, t, p, '-'));
                d[p].forEach(v=>{
                    vs.push(getVal(d, t, p, v));
                })
            }else
                vs.push(getVal(d, t, p, d[p]));
            return vs;
        }

        function isItemSet(d){
            let is =false;
            if(Array.isArray(d['@type'])){
                d['@type'].forEach(t=>{
                    if(t=="o:ItemSet")is=true;
                })
            }else{
                if(d['@type']=="o:ItemSet")is=true;
            };                
            return is;
        }

        function getVal(d, t, p, v) {
            let vs;
            if(!v)return {t:t,k:p,v:'-'};
            if(v['@id'] && p!='o:owner'){
                let o = getJsonSynchrone(v['@id']);
                //if(isItemSet(o)){
                if(false){
                    //récupère les items de la collection
                    let items = getJsonSynchrone(o['o:items']['@id']);
                    let rs = items.map(i=>{
                        return {'id':i['o:id'],'title':i['o:title']};
                    })
                    vs = {t:t,k:o['o:title'],v:rs};
                }else{
                    switch (p) {
                        case 'o:media':
                            vs = {t:t,k:p,v:{'@id':o['@id'],'o:original_url':o['o:original_url'],'o:media_type':o['o:media_type'],}};                                
                            break;                    
                        default:
                            let lbl = o['o:label'] ? o['o:label'] : o['o:title'];
                            //lbl += ' ('+o['o:id']+')';
                            vs = {t:t,k:p,v:lbl};    
                            break;
                    }
                }
            }else if(v['@value']){
                let val = v['@value'];
                try {
                    if(p=='gfg:requirements' || p=='gfg:finalStates' || p=='gfg:sequence' || p=='gfg:branchs')
                        val=JSON.parse(val); 
                } catch (err) {
                    if(err)console.error(err);
                    console.log('json mal formaté : '+val);
                    console.log('item à corriger : '+d[['@id']].replace('api/items', 'admin/item'));                    
                }finally {
                    vs = {t:t,k:p,v:val,p:v['property_label']};
                }                  
            }else   
                vs = {t:t,k:p,v:v};
            return vs;
        }


        function fctExecute(p) {
            switch (p.data.fct) {
                case 'showData':
                  break;
                default:
                  console.log(p);
            }            
        }   

        this.chargeSVG = function(url, idCont, nom, callback){
            d3.xml(url)
                .then(data => {
                    d3.select("#"+idCont).node().append(data.documentElement);
                    let cont = d3.select("#"+idCont).node();
                    let svg = d3.select("#"+idCont+" svg");
                    let bb = svg.node().getBBox();
                    svg.attr('height',cont.offsetHeight)
                        .attr('width',cont.offsetWidth)        
                        //.attr('viewBox','0 0 '+bb.width+' '+bb.height)
                        .attr('preserveAspectRatio','xMinYMin meet');
                    me.scenes.push({'nom':nom,'svg':svg});
                    if(callback)callback(svg);
            });
        }

        this.showWait = function (){
            if(!me.cont.empty())divWait.style('display','block');
        }
        this.hideWait = function (){
            if(!me.cont.empty())divWait.style('display','none');
        }

        function getJsonSynchrone(url){
            let json;
            if(omekaQuery[url])return omekaQuery[url];
            var request = new XMLHttpRequest();
            request.open('GET', url, false);  // `false` makes the request synchronous
            request.send(null);                    
            if (request.status === 200) {
                omekaQuery[url]=JSON.parse(request.responseText);
                return omekaQuery[url];
            }else{
                throw "Erreur dans la récupération des données : "+url;
            }                    
        }

        //création du svg d'attente
        if(this.waitUrl && !me.cont.empty()){
            divWait = this.cont.append("div").attr('id','adln-svg-wait').style('display','none');
            me.chargeSVG(this.waitUrl,'adln-svg-wait','wait',null);    
        }
    }
}

  





