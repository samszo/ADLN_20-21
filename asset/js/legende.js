class legende {
    constructor() {
        var me = this;
        let svg, global, margin=6;

        this.init = function(){
            /*
            svg = this.cont.append("svg")
                .attr("id", me.idCont+'_Story')
                .attr("width",me.width+'px').attr("height", me.height+'px')
                .style("margin",margin+"px");            
            global = svg.append("g").attr("id",me.idCont+'_Story_Global');
            */

        }

        this.afficheMenuLegende = function(q, gen, fct){
            //affiche les composants du monde en vertical
            //avec d3
            let menu = d3.select(q).append('ul').attr('class','nav flex-column');
            let compo = menu.selectAll('li').data(gen.getMonde()).enter().append('li')
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

        me.init();

    }
}

  





