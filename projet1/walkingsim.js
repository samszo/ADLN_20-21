//This is where all the game logic occurs
function change_image(clicked_id){
    if(clicked_id=="ChairMom"){
        
       document.getElementById("Line1").innerHTML=gen.Monde[1].values[1].Description;
        document.getElementById("ChairImage").src=gen.Monde[1].values[1].media;
        document.getElementById("FamilyImage").src=gen.Monde[1].values[11].media;
        document.getElementById("FamilyImage").style.display="block";
    }

    else if(clicked_id=="ChairStreet"){
      document.getElementById("Line1").innerHTML=gen.Monde[1].values[0].Description;
       document.getElementById("ChairImage").src=gen.Monde[1].values[0].media;
       document.getElementById("FamilyImage").src=gen.Monde[1].values[11].media;
       document.getElementById("FamilyImage").style.display="none";
    }

    else if(clicked_id=="ChairShop"){
     document.getElementById("Line1").innerHTML=gen.Monde[1].values[2].Description;
      document.getElementById("ChairImage").src=gen.Monde[1].values[2].media;
      document.getElementById("FamilyImage").src=gen.Monde[1].values[11].media;
      document.getElementById("FamilyImage").style.display="none";
    }

    if(clicked_id=="FloorLampMom"){
      document.getElementById("Line2").innerHTML=gen.Monde[1].values[4].Description;
      document.getElementById("FloorLampImage").src=gen.Monde[1].values[4].media;
    } 

        else if(clicked_id=="FloorLampThrift"){
        document.getElementById("Line2").innerHTML=gen.Monde[1].values[3].Description;
        document.getElementById("FloorLampImage").src=gen.Monde[1].values[3].media;
    }
     else if(clicked_id=="FloorLampIkea"){
        document.getElementById("Line2").innerHTML=gen.Monde[1].values[5].Description;
        document.getElementById("FloorLampImage").src=gen.Monde[1].values[5].media;
    }

    if(clicked_id=="FlowerPotLover"){
        document.getElementById("Line3").innerHTML=gen.Monde[1].values[7].Description;
        document.getElementById("FlowerPotImage").src=gen.Monde[1].values[7].media;
    }
     else if(clicked_id=="FlowerPotField"){
        document.getElementById("Line3").innerHTML=gen.Monde[1].values[6].Description;
        document.getElementById("FlowerPotImage").src=gen.Monde[1].values[6].media;
    }
     else if(clicked_id=="FlowerPotShop"){
        document.getElementById("Line3").innerHTML=gen.Monde[1].values[8].Description;
        document.getElementById("FlowerPotImage").src=gen.Monde[1].values[8].media;
    }
    if(clicked_id=="LampOn"){
        document.getElementById("Line4").innerHTML=gen.Monde[1].values[9].Description;
        document.getElementById("LampImage").src=gen.Monde[1].values[9].media;
    }
     else if(clicked_id=="LampOff"){
        document.getElementById("Line4").innerHTML=gen.Monde[1].values[10].Description;
        document.getElementById("LampImage").src=gen.Monde[1].values[10].media;
    }
    if(clicked_id=="IkeaUse"){
        document.getElementById("Line5").innerHTML=gen.Monde[1].values[21].Description;
        document.getElementById("CoffeeTableImage").src=gen.Monde[1].values[23].media;
      
    }
     else if(clicked_id=="IkeaGive"){
        document.getElementById("Line5").innerHTML=gen.Monde[1].values[10].Description;
    }
     if(clicked_id=="CabinetSell"){
        
        document.getElementById("Line6").innerHTML=gen.Monde[1].values[15].Description;
        
     }
     else if(clicked_id=="CabinetMom"){
        
        document.getElementById("Line6").innerHTML=gen.Monde[1].values[16].Description;
        
     }
     else if(clicked_id=="CabinetKeep"){
        
        document.getElementById("Line6").innerHTML=gen.Monde[1].values[17].Description;
        document.getElementById("CabinetImage").src=gen.Monde[1].values[17].media;
        
     }
     
} 


function visible_Button(){
    console.log(document.getElementById("test").getElementsByClassName("MenuItemHidden"));
    getdiv=document.getElementById("test");
    lenarrray=getdiv.getElementsByClassName("MenuItemHidden").length;
    console.log(lenarrray);
    random=Math.floor(Math.random() * Math.floor(lenarrray));
    getdiv.getElementsByClassName("MenuItemHidden")[random].style.display="block";
    getdiv.getElementsByClassName("MenuItemHidden")[random].classList.remove("MenuItemHidden");
}
