export default class Wood{
    constructor({method="ASD",duration="DL",moisture="Dry",temperature="<100"}){
        this.method = method
        this.duration = duration
        this.moisture = moisture
		this.temperature = temperature
    }//CONSTRUCTOR

    phi(){
		if(this.method == "ASD"){
			return {Fb:0,Ft:0,Fv:0,Fc:0,Fcp:0,E:0,Emin:0,Z:0}
		}
		else{
			return {Fb:0.85,Ft:0.80,Fv:0.75,Fc:0.9,Fcp:0.9,E:0,Emin:0.85,Z:3.32}
		}
	}//PHI
	//FORMAT CONVERSION FACTOR
	KF(){
		if(this.method == "ASD"){
			return {Fb:0,Ft:0,Fv:0,Fc:0,Fcp:0,E:0,Emin:0,Z:0}
		}
		else{
			return {Fb:2.54,Ft:2.70,Fv:2.88,Fc:2.40,Fcp:1.67,E:0,Emin:1.76,Z:0.65}
		}
	}//KF
	//TIME EFFECT FACTOR
	TE(){
		if(this.method == "ASD"){
			return {Fb:0,Ft:0,Fv:0,Fc:0,Fcp:0,E:0,Emin:0,Z:0}
		}
		else{
			switch(this.duration){
				case ('DL'):
					return {Fb:0.8,Ft:0.8,Fv:0.8,Fc:0.8,Fcp:0,E:0,Emin:0,Z:1}
					break
				case ('LL'):
					return {Fb:0.8,Ft:0.8,Fv:0.8,Fc:0.8,Fcp:0,E:0,Emin:0,Z:1}
					break
				case ('SL'):
					return {Fb:0.8,Ft:0.8,Fv:0.8,Fc:0.8,Fcp:0,E:0,Emin:0,Z:1}
					break
				case ('Const'):
					return {Fb:1,Ft:1,Fv:1,Fc:1,Fcp:0,E:0,Emin:0,Z:1}
					break
				case ('WL'):
					return {Fb:1,Ft:1,Fv:1,Fc:1,Fcp:0,E:0,Emin:0,Z:1}
					break
				case ('EL'):
					return {Fb:1,Ft:1,Fv:1,Fc:1,Fcp:0,E:0,Emin:0,Z:1}
					break
				case ('Impact'):
					return {Fb:1.25,Ft:1.25,Fv:1.25,Fc:1.25,Fcp:0,E:0,Emin:0,Z:1}
					break
			}//SWITCH
		}
    }//TIME EFFECT FACTOR
	
	//---------------------------------------------------
    // MODIFICATION FACTORS
    //---------------------------------------------------
    //DURATION FACTOR
	CD(){
		switch(this.duration){
			case ('DL'):
				return 0.9
				break
			case ('LL'):
				return 1
				break
			case ('SL'):
				return 1.15
				break
			case ('Const'):
				return 1.25
				break
			case ('WL'):
				return 1.6
				break
			case ('EL'):
				return 1.6
				break
			case ('Impact'):
				return 2
				break
		}//SWITCH
	}//CD
    //MOISTURE FACTOR
	CM(){
		if(this.moisture == "Dry"){
			return {Fb:1,Ft:1,Fv:1,Fcp:1,Fc:1,E:1,Emin:1,Z:1}
		}
		else{
			return {Fb:0.85,Ft:1,Fv:0.97,Fcp:0.67,Fc:0.8,E:0.9,Emin:0.9,Z:0.7}
		}
    }//CM
    // TEMPERATURE FACTOR 
	Ct(){
		if(this.temperature<="<100"){
			return {Fb:1,Ft:1,Fv:1,Fcp:1,Fc:1,E:1,Emin:1,Z:1}
		}
		if(this.temperature<="<125"){
			if(this.moisture=="Dry"){
				return {Fb:0.8,Ft:0.9,Fv:0.8,Fcp:0.8,Fc:0.8,E:0.9,Emin:0.9,Z:0.8}
			}
			else{
				return {Fb:0.7,Ft:0.9,Fv:0.7,Fcp:0.7,Fc:0.7,E:0.9,Emin:0.9,Z:0.7}
			}
		}
		if(this.temperature<="<150"){
			if(this.moisture=="Dry"){
				return {Fb:0.7,Ft:0.9,Fv:0.7,Fcp:0.7,Fc:0.7,E:0.9,Emin:0.9,Z:0.7}
			}
			else{
				return {Fb:0.5,Ft:0.9,Fv:0.5,Fcp:0.5,Fc:0.5,E:0.9,Emin:0.9,Z:0.5}
			}
		}
    }//Ct
}//CLASS