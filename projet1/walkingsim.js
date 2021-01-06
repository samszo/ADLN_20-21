//This is where all the game logic occurs
function change_image(clicked_id){
    if(clicked_id=="ChairMom"){
        //document.getElementById("ChairImage").src="images/chair_mom.png";       
        //document.getElementById("Line1").innerHTML="I had moved out and said my goodbyes, although my parents made sure to give me at least a couple keepsakes before I left."
        document.getElementById("Line1").innerHTML=gen.Monde[1].values[1].Description;
        document.getElementById("ChairImage").src=gen.Monde[1].values[1].media;
    }

    else if(clicked_id=="ChairStreet"){
       // document.getElementById("ChairImage").src="images/chair_thrift_store.png";
       // document.getElementById("Line1").innerHTML="I found myself in a new city, and with an empty apartment waiting for me. When I saw this on the side of the road, well, one man’s trash and all that."
       document.getElementById("Line1").innerHTML=gen.Monde[1].values[0].Description;
       document.getElementById("ChairImage").src=gen.Monde[1].values[0].media;
    }

    else if(clicked_id=="ChairShop"){
      //  document.getElementById("ChairImage").src="images/chair_ikea.png";
      //  document.getElementById("Line1").innerHTML="I was living the dream, had a fresh start, in a new city, getting ready to go out in the world and make a name for myself."
      document.getElementById("Line1").innerHTML=gen.Monde[1].values[2].Description;
      document.getElementById("ChairImage").src=gen.Monde[1].values[2].media;
    }

    if(clicked_id=="FloorLampMom"){
      document.getElementById("Line2").innerHTML=gen.Monde[1].values[4].Description;
      document.getElementById("FloorLampImage").src=gen.Monde[1].values[4].media;
    } 

        else if(clicked_id=="FloorLampthrift"){
        document.getElementById("Line2").innerHTML=gen.Monde[1].values[3].Description;
        document.getElementById("FloorLampImage").src=gen.Monde[1].values[3].media;
    }
     else if(clicked_id=="FloorLampIkea"){
        document.getElementById("Line2").innerHTML=gen.Monde[1].values[5].Description;
        document.getElementById("FloorLampImage").src=gen.Monde[1].values[5].media;
    }

    if(clicked_id=="FlowerPotLover"){
        document.getElementById("Line3").innerHTML=gen.Monde[1].values[7].Description;
        document.getElementById("FlowerPotLover").src=gen.Monde[1].values[7].media;
    }
     else if(clicked_id=="FlowerPotField"){
        document.getElementById("Line3").innerHTML=gen.Monde[1].values[6].Description;
        document.getElementById("FlowerPotImage").src=gen.Monde[1].values[6].media;
    }
     else if(clicked_id=="FlowerPotShop"){
        document.getElementById("Line3").innerHTML=gen.Monde[1].values[8].Description;
        document.getElementById("FlowerPotImage").src=gen.Monde[1].values[8].media;
    }
} 
