export default class Snow {
    constructor({Pg = 20, exposure = "Full", terrain = "B", thermal = "Others", category = "II", slope = 2.25, Lul = 25, Luh = 25, h = 5}){
        this.Pg = Pg
        this.exposure = exposure
        this.terrain = terrain
        this.thermal = thermal
        this.category = category
        this.slope = slope
        this.Lul = Lul
        this.Luh = Luh
        this.h = h
    }//CONSTRUCTOR

    Ce() {
        if(this.exposure == "Full"){
              switch(this.terrain){
                     case "B":
                         return 0.9;
                         break;
                     case "C":
                         return 0.9;
                         break;
                     case "D":
                         return 0.8;
                         break;
              }
          }
         if(this.exposure == "Partial"){
              switch(this.terrain){
                     case "B":
                         return 1;
                         break;
                     case "C":
                         return 1;
                         break;
                     case "D":
                         return 0.9;
                         break;
             }
         }
         else{
             switch(this.terrain){
                     case "B":
                         return 1.2;
                         break;
                     case "C":
                         return 1.1;
                         break;
                     case "D":
                         return 1;
                         break;
             }
         }
    }//Ce

    Ct() {
        switch(this.thermal){
                case "Others":
                    return 1;
                    break;
                case "Above Freezing":
                    return 1.1;
                    break;
                case "Unheated":
                    return 1.2;
                    break;
                case "Below Freezing":
                    return 1.3;
                    break;
                case "Greenhouses":
                    return 0.85;
                    break;
            }
    }//Ct

    I(){
		switch(this.category){
			case "I":
				return 0.8;
				break;
			case "II":
				return 1;
				break;
			case "III":
				return 1.1;
				break;
			case "IV":
				return 1.2;
				break;
		}
    }//I

    gamma() {
        return 0.13*this.Pg + 14
    }//GAMMA

    Pf() {
    return 0.7*this.Ce()*this.Ct()*this.I()*this.Pg
    }//PF

    Pm() {
        if(this.Pg <=20){
            return this.I()*this.Pg
        }
        else{
            return this.I()*20
        }
    }//PM

    RainOnSnow() {
		if(this.Pg <= 20 && this.slope <= 2.39){
			return "Yes";
		}
		else{
			return "No";
		}
    }//RAINONSNOW CHECK

    Prs(){
        if(this.RainOnSnow() == "Yes"){
                if(this.Pf()+5 > this.Pm()){
                    return this.Pf()+5
                }
                else{
                    return 0
                }
            }
            else{
                return 0
            }
    }//PRS

    //Balances Snow height
	hb(){
		return this.Pf()/this.gamma()
	}
		
	//Remaining Height
	hc(){
		return this.h-this.hb();
    }
    
    //Windward Drift height (Due to lower roof fetch)
	hdw(){
		return 0.75*0.43*Math.pow(this.Lul,1/3)*Math.pow(this.Pg+10,1/4)-1.5;
    }
    
    //Leeward Drift height (Due to high roof fetch)
	hdl(){
		return 0.43*Math.pow(this.Luh,1/3)*Math.pow(this.Pg+10,1/4)-1.5;
    }
    
    //Maximum Drift Height
	hd(){
		return Math.max(this.hdw(),this.hdl()) <= this.hc() ? Math.max(this.hdw(),this.hdl()) : this.hc();
    }
    
    //Maximum Drift Length
	wd(){
		let w =  Math.max(this.hdw(),this.hdl()) <= this.hc() ? 4*this.hd() : 4*Math.pow(this.hd(),2)/this.hc();
		return Math.min(w,8*this.hc());
    }
    
    //Drift Intensity
	Pd(){
		return this.hd()*this.gamma();
	}



    

}//CLASS