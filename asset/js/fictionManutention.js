class fictionManutention {
    constructor(gen) {
        var me = this;
        this.gen = gen;
        let svg, global, margin=6, dataMonde, dataEvents, dataFiltre, keyType, noMedia='asset/svg/wait-pacman.svg'
        ,color = d3.scaleSequential().interpolator(d3.interpolateWarm);

        this.init = function(){
            dataMonde = getLigneMonde(me.gen.getMonde());
            dataEvents = me.gen.getEvents();
            //récupère les type d'objets
            dataFiltre = getDataFiltre(dataMonde.concat(dataEvents));
            //définition de la onction de colorisation
            color.domain([0,dataFiltre.length]);
            keyType = [];
            dataFiltre.forEach((f,i) => {keyType[f.text]=i});            
        }

        function getDataFiltre(data){
            let filtres = [], vals=[];
            data.forEach(d=>{
                if(!d.type)d.type='-';
                let infos = Object.entries(d).filter(f=>
                    f[0]!='Title' && f[0]!='media' && f[0]!='id' && f[0]!='type'
                    )
                infos.forEach(i=>{
                    if(Array.isArray(i[1])){
                        i[1].forEach(v=>{
                            vals.push({'type':d.type,'k':i[0],'v':v,'id':d.id});
                        })                      
                    }else
                        vals.push({'type':d.type,'k':i[0],'v':i[1],'id':d.id});
                })
            })
            //groupe les données par type
            filtres = Array.from(d3.group(vals, d => d.type));
            filtres.forEach((f,i)=>{
                f.inputs = Array.from(d3.group(f[1], d => d.k));
                f.text = f[0];
                f.color = color(keyType[f[0]]);
                delete f[0];
                delete f[1];
                f.inputs.forEach((inpt,j)=>{
                    inpt.vals = Array.from(d3.group(inpt[1], d => d.v));
                    inpt.class = 'form-check-inline';
                    inpt.text = inpt[0];
                    inpt.id='f'+i+'-'+j;
                    delete inpt[0];
                    delete inpt[1];
                })

            })
            return filtres;
        }


        function creaInput(d){
            let e = d3.select(this).append('div').attr('class',"dropdown-item");
            switch (d.class) {
                case 'form-check':
                  e.append('input').attr('type',"checkbox").attr('class',"form-check-input").attr('id',d.id)
                  e.append('label').attr('class',"form-check-label").attr('for',d.id).text(d.text)
                  break;
                case 'form-check-inline':
                    e.append('h6').text(d.text);
                    let cheks = e.selectAll('div').data(inpt=>inpt.vals).enter().append('div')
                        .attr('class',"form-check form-check-inline");
                    cheks.append('input').attr('type',"checkbox").attr('class',"form-check-input")
                        .attr('id',(v,i)=>'cki-'+d.id+'-'+i)
                        .attr('checked',true)
                        .on('click',filtreChangeInput);
                    cheks.append('label').attr('class',"form-check-label")
                        .attr('for',(v,i)=>'cki-'+d.id+'-'+i)
                        .text(v=>v[0]);
            }
            //ajoute un séparateur
            d3.select(this).append('hr').attr('class',"dropdown-divider");            
        }

        function getObjetHtml(item, niv=0) { 
            var s = ''; 
            switch (typeof item) {
                case 'object':
                    for (const [k, v] of Object.entries(item)) {
                        s+='<p><span style="font-style: italic;">'+" - ".repeat(niv)+k+' : </span>';
                        s+=getObjetHtml(v, niv+1); 
                        s+='</p>'; 
                    }
                    break;
                default:
                    s+=item;
            }
            return s; 
        } 

        function filtreChangeInput(e,d){
            //filtre les objets affiché
            d[1].forEach(o=>{
                d3.select('#'+'oem'+o.id).style('display',this.checked ? 'block' : 'none');
            })
        }

        this.afficheEventsCartes = function(q,fcts){
            d3.select(q[0]).selectAll('.lstObjets').remove();
            let lstOE = d3.select(q[0])
                .append('div').attr('class','lstObjets')
                //.append('div').attr('class','row row-cols-1 row-cols-md-3 g-4');
                .append('div').attr('class','row row-cols-1 row-cols-md-3 d-flex align-items-stretch');
                
            //création d'une card pour chaque event
            if(!dataEvents)dataEvents = me.gen.getEvents();

            let oe = lstOE.selectAll('div').data(dataEvents).enter().append('div')
                .attr('id',(d,i)=>'oe'+d.id)
                .attr('class','col')
                .append('div').attr('class','card')
                ;//    .on('click',(d,i)=>fcts['clickCard']?fcts['clickCard'](e,d):false);
            //création d'un header
            oe.append('div')
                .style('background-color',d=>color(keyType[d.type]))
                .attr('class','card-header').text(d=>d.type)
                .on('click',(e,d)=>{
                    let bodyCard = d3.select('#cardBody'+d.id);
                    let voir = bodyCard.style('display');
                    bodyCard.style('display',voir == 'none' ? 'block' : 'none');
                });
            
            //création du body chaque card
            let oeBody = oe.append('div')
                .attr('class','card-body')
                .style('display','none')//on masque les cartes à l'init 
                .attr('id',(d,i)=>'cardBody'+d.id)
                ;//.on('click',(d,i)=>{if(fcts['clickImg'])fcts['clickCard'](e,d);});
            oeBody.append('h5')
                .attr('class',"card-title").text(d=>d.Title);
            oeBody.selectAll('.card-text').data(d=>Object.entries(d).filter(f=>
                f[0]!='Title' && f[0]!='media' && f[0]!='id' && f[0]!='type'
                )).enter().append('p')
                .attr('class',"card-text").html(d=>{
                    let h = '<p><span style="font-weight: bold;" >'+d[0]+' : </span>';
                    if(typeof d[1] == 'object') {
                        h+='</p>'
                        h+=getObjetHtml(d[1]);
                    }else h+=''+d[1]+'</p>';
                    return h;//d[0]+' = '+d[1];
                });
            oeBody.append('a')
                .attr('href',d=>me.gen.oOmk.getUrlItemAdmin()+d.id)
                .attr('target',"_blanck")
                .attr('class',"btn btn-primary")
                .text('voir dans OMK');

            oe.append('div').attr('class',"card-footer")
                .append('small').attr('class',"muted-footer")
                .text(d=>d.Title);//{let x = new Date();return 'Généré le : '+x.toString();});

            me.afficheFiltres(q[1],dataEvents,fcts);
                
        }

        this.afficheEtatMondeCartes = function(q,fcts){
            /*affiche les objets par ligne de type
                //.append('div').attr('class','row-fluid');
                //.attr('class','col-lg-4')
            */
            d3.select(q[0]).selectAll('.lstObjets').remove();
            let lstOEM = d3.select(q[0])
                .append('div').attr('class','lstObjets')
                .append('div').attr('class','row row-cols-1 row-cols-md-6 g-4');
            //création d'une card pour chaque objet

            if(!dataMonde)dataMonde = getLigneMonde(me.gen.getMonde());

            let oem = lstOEM.selectAll('div').data(dataMonde).enter().append('div')
                .attr('id',(d,i)=>'oem'+d.id)
                .attr('class','col')
                .append('div').attr('class','card h-100')
                ;//    .on('click',(d,i)=>fcts['clickCard']?fcts['clickCard'](e,d):false);
            //création d'un header
            oem.append('div')
                .style('background-color',d=>color(keyType[d.type]))
                .attr('class','card-header').text(d=>d.type)
                .on('click',(e,d)=>{
                    let bodyCard = d3.select('#cardBody'+d.id);
                    let voir = bodyCard.style('display');
                    bodyCard.style('display',voir == 'none' ? 'block' : 'none');
                });
            /*creation des images
            oem.selectAll('img').data(d=>d.media).enter().append('img')
                .attr('src',d=>d)
                .attr('class','card-img-top');
            */
            
            //création du body chaque card
            let oemBody = oem.append('div')
                .attr('class','card-body')
                .style('display','none')//on masque les cartes à l'init 
                .attr('id',(d,i)=>'cardBody'+d.id)
                ;//.on('click',(d,i)=>{if(fcts['clickImg'])fcts['clickCard'](e,d);});
            oemBody.append('h5')
                .attr('class',"card-title").text(d=>d.Title);
            //création du carousel
            getCarousel(oemBody);
            oemBody.selectAll('.card-text').data(d=>Object.entries(d).filter(f=>
                f[0]!='Title' && f[0]!='media' && f[0]!='id' && f[0]!='type' && f[0]!='numType'
                )).enter().append('p')
                .attr('class',"card-text").text(d=>{
                    return d[0]+' = '+d[1];
                });
            oemBody.append('a')
                .attr('href',d=>me.gen.oOmk.getUrlItemAdmin()+d.id)
                .attr('target',"_blanck")
                .attr('class',"btn btn-primary")
                .text('voir dans OMK');
    
            oem.append('div').attr('class',"card-footer")
                .append('small').attr('class',"muted-footer")
                .text(d=>d.Title);//{let x = new Date();return 'Généré le : '+x.toString();});

            me.afficheFiltres(q[1],dataMonde,fcts);

        }

        this.afficheFiltres = function(q,data,fcts){
            d3.select(q).selectAll('#navFiltresList').remove();
            //création de la liste
            let lst = d3.select(q)
                .append('ul').attr('class','navbar-nav').attr('id','navFiltresList')
                ;//.append('div').attr('class','row row-cols-1 row-cols-md-3 g-4');
            //création des boutons
            dataFiltre = getDataFiltre(data);            
            let lstBtn = lst.selectAll('li').data(dataFiltre).enter().append('li').attr('class',"nav-item dropdown")
                .append('div').attr('class',"btn-group");
            lstBtn.append('button').attr('class',"btn").attr('type',"button")
                .style('background-color',d=>d.color)
                .text(d=>d.text);
            lstBtn.append('button').attr('class',"btn dropdown-toggle dropdown-toggle-split").attr('type',"button")
                .style('background-color',d=>d.color)
                .attr('data-bs-toggle',"dropdown").attr('aria-expanded',"false")
                .append('span').attr('class',"visually-hidden").text('Toggle Dropdown');
            //création des items dans le menu
            let lstBtnMenuItem = lstBtn.append('ul').attr('class',"dropdown-menu");                
            //création des inputs dans le munu
            lstBtnMenuItem.selectAll('li').data(d=>d.inputs).enter().append('li')
                .each(creaInput)
        }

        this.afficheMenuMonde = function(q, gen, fct){
            //affiche le menu des mondes
            d3.select(q).style('display','block');
            /*
            //avec d3
            let menu = d3.select(q).append('ul').attr('class','nav flex-column');
            let compo = menu.selectAll('li').data(me.gen.getMonde()).enter().append('li')
                .attr('id',(d,i)=>'compoMonde'+i)
                .attr('class','nav-item')
                .append('a').attr('class','nav-link').attr('href','#')
                    .html(d=>d.key)
                    .on('click',fct);
            compo.selectAll('button').data(d=>d.values).enter().append('button')
                .attr('type','button')
                .attr('class','btn')
                .attr('data-bs-toggle','popover')
                .attr('title',d=>d.Title)
                .html(d=>d.Title)
                .on('click', function(e,d){
                    $(this).attr('data-bs-content','Cannot proceed with Save while Editing a row.');
                    $(this).popover('show');
                });
            */      

            //
            /*avec W2ui
            $(q).w2sidebar({
                name : 'mnuLegende',
                nodes: getTreeMonde(gen.getMonde()),
                onFocus: function (event) {
                    console.log('focus', event);
                },
                onBlur: function (event) {
                    console.log('blur', event);
                }
            });
            */
           /*avec bootstrap tree
           $(q).treeview({
               data: getTreeMonde(gen.getMonde())
               ,onNodeSelected: function(event, data) {
                    fct(event, data);
              }               
            });
            */       
        }

        function getTreeMonde(monde){
            let mNodes = [];
            monde.forEach((m,i) => {
                let nChild = [];
                m.values.forEach(v=>{
                    nChild.push({ id: v.id, text: v.Title, icon: 'fa fa-home', dt:v });
                });
                mNodes.push({ id: i, text: m.key, dt:m , img: 'icon-folder', expanded: true, group: true, nodes: nChild
                    ,color: "white"
                    ,backColor: "black"
                })
            });            
            return mNodes;
        }

        function getLigneMonde(monde){
            let mNodes = [];
            monde.forEach((m,i) => {
                let nChild = [];
                m.values.forEach(v=>{
                    v.type=m.key;
                    if(!v.media)v.media=[noMedia]
                    else if(!Array.isArray(v.media))v.media=[v.media];
                    mNodes.push(v);
                });
            });            
            return mNodes;
        }

        function getCarousel(slt){
            let carousel = slt.selectAll("div").data(d=>[{'id':d.id,'m':d.media}]).enter().append('div')
                .attr('id',(d,i)=>"id-"+d.id+'-'+i)
                .style('background-color','#00000040')
                .attr('class',"carousel slide")
                .attr('data-bs-ride',"carousel");
            let carouselInner = carousel.append('div').attr('class',"carousel-inner");
            carouselInner.selectAll('div').data(d=>d.m).enter().append('div')
                .attr('class',(d,i)=>i==0 ? "carousel-item active" : "carousel-item")
                .append('img').attr('class',"d-block w-100").attr('src',d=>d);
            let prev = carousel.append('a')
                .attr('class',"carousel-control-prev")
                .attr('href',(d,i)=>'#id-'+d.id+'-'+i)
                .attr('role',"button")
                .attr('data-bs-slide',"prev");
            prev.append('span').attr('class',"carousel-control-prev-icon").attr('aria-hidden','true');
            prev.append('span').attr('class',"visually-hidden").text('avant');
            let next = carousel.append('a')
                .attr('class',"carousel-control-next")
                .attr('href',(d,i)=>'#id-'+d.id+'-'+i)
                .attr('role',"button")
                .attr('data-bs-slide',"next");
            next.append('span').attr('class',"carousel-control-next-icon").attr('aria-hidden','true');
            next.append('span').attr('class',"visually-hidden").text('après');
            /*
            <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="..." class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item">
                <img src="..." class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item">
                <img src="..." class="d-block w-100" alt="...">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </a>
          </div> 
          */       

        }

        me.init();

    }
}

  





