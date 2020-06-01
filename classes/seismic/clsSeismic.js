import {interpolate} from '@/library/functions'

export default class Seismic {
    constructor({ Ss = 0.345, S1 = 1.234, siteClass = 'D', category = 'II', TL = 10, type = 'Concrete SMF', h = 30, R = 3, W = 100 }) {
        this.Ss = Ss
        this.S1 = S1
        this.siteClass = siteClass
        this.category = category
        this.TL = TL
        this.type = type
        this.h = h
        this.R = R
        this.W = W
    } // CONSTRUCTOR

    Fa(){
        if(this.Ss <=0.25){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return 1.2;
                    break;
                case "D":
                    return 1.6;
                    break;
                case "E":
                    return 2.5;
                    break;
            }//switch 
        }//Ss
        if(this.Ss <=0.5){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return 1.2;
                    break;
                case "D":
                    return interpolate(0.25,1.6,0.5,1.4,this.Ss);
                    break;
                case "E":
                    return interpolate(0.25,2.5,0.5,1.7,this.Ss);
                    break;
            }//switch 
        }//Ss
         if(this.Ss <=0.75){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return interpolate(0.5,1.2,0.75,1.1,this.Ss);
                    break;
                case "D":
                    return interpolate(0.5,1.4,0.75,1.2,this.Ss);
                    break;
                case "E":
                    return interpolate(0.5,1.7,0.75,1.2,this.Ss);
                    break;
            }//switch 
        }//Ss
             if(this.Ss <=1.0){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return interpolate(0.75,1.1,1.0,1,this.Ss);
                    break;
                case "D":
                    return interpolate(0.75,1.2,1.0,1.1,this.Ss);
                    break;
                case "E":
                    return interpolate(0.75,1.2,1.0,0.9,this.Ss);
                    break;
            }//switch 
        }//Ss
         if(this.Ss <=1.25){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return 1;
                    break;
                case "D":
                    return interpolate(1,1.1,1.25,1,this.Ss);
                    break;
                case "E":
                    return 0.9;
                    break;
            }//switch 
        }//Ss
         if(this.Ss >=1.25){
            switch (this.siteClass){
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return 1;
                    break;
                case "D":
                    return 1;
                    break;
                case "E":
                    return 0.9;
                    break;
            }//switch 
        }//Ss
    }//FA

    Fv(){
        if(this.S1 <=0.1){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return 1.7;
                    break;
                case "D":
                    return 2.4;
                    break;
                case "E":
                    return 3.5;
                    break;
            }//switch 
        }//Ss
         if(this.S1 <=0.2){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return interpolate(0.1,1.7,0.2,1.6,this.S1);
                    break;
                case "D":
                    return interpolate(0.1,2.4,0.2,2,this.S1);
                    break;
                case "E":
                    return interpolate(0.1,3.5,0.2,3.2,this.S1);
                    break;
            }//switch 
        }//Ss
         if(this.S1 <=0.3){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return interpolate(0.2,1.6,0.3,1.5,this.S1);
                    break;
                case "D":
                    return interpolate(0.2,2,0.3,1.8,this.S1);
                    break;
                case "E":
                    return interpolate(0.2,3.2,0.3,2.8,this.S1);
                    break;
            }//switch 
        }//Ss
            if(this.S1 <=0.4){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return interpolate(0.3,1.5,0.4,1.4,this.S1);
                    break;
                case "D":
                    return interpolate(0.3,1.8,0.4,1.6,this.S1);
                    break;
                case "E":
                    return interpolate(0.3,2.8,0.4,2.4,this.S1);
                    break;
            }//switch 
        }//Ss
         if(this.S1 <0.5){
            switch (this.siteClass) {
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return interpolate(0.4,1.4,0.5,1.3,this.S1);
                    break;
                case "D":
                    return interpolate(0.4,1.6,0.5,1.5,this.S1);
                    break;
                case "E":
                    return 2.4;
                    break;
            }//switch 
        }//Ss
         if(this.S1 >=0.5){
            switch (this.siteClass){
                  case "A":
                    return 0.8;
                    break;
                case "B":
                    return 1;
                    break;
                case "C":
                    return 1.3;
                    break;
                case "D":
                    return 1.5;
                    break;
                case "E":
                    return 2.4;
                    break;
            }//switch 
        }//S1
    }//FV

    Sms(){
        return this.Fa()*this.Ss
    }//SMS

    Sm1(){
        return this.Fv()*this.S1
    }//SM1

    Sds(){
        return (2/3)*this.Sms()
    }//SDS

    Sd1(){
        return (2/3)*this.Sm1()
    }//SD1

    T0(){
        return 0.2*this.Sd1()/this.Sds()
    }//TO

    Ts(){
        return this.Sd1()/this.Sds()
    }//TS

    Ct(){
		if(this.type == "Steel SMF"){
			return 0.028
		}
		if(this.type == "Concrete SMF"){
			return 0.016
		}
		if(this.type == "Steel EBF"){
			return 0.030
		}
		if(this.type == "Masonry SW"){
			return 0.030
		}
	    if(this.type == "Others"){
			return 0.020
		}
    }//CT

    x(){
		if(this.type == "Steel SMF"){
			return 0.8
		}
		if(this.type == "Concrete SMF"){
			return 0.9
		}
		if(this.type == "Steel EBF"){
			return 0.75
		}
		if(this.type == "Steel BRBF"){
			return 0.75
		}
	    if(this.type == "Others"){
			return 0.75
		}
    }//X

    T(){
        return this.Ct()*Math.pow(this.h,this.x());
    }//T
    
    Ie(){
        if(this.category == "I"){
            return 1
        }
        if(this.category == "II"){
            return 1
        }
        if(this.category == "III"){
            return 1.15
        }
        if(this.category == "IV"){
            return 1.15
        }
    }//IE

    Csmin(){
        if(this.S1>=0.6){
            return (0.5*this.S1)/(this.R/this.Ie());
        }
        else{
            return 0.01
        }
    }//CS MIN

    Csmax(){
        if(this.T()<=this.TL){
            return this.Sd1()/(this.T()*(this.R/this.Ie()));
        }
        else{
            return (this.Sd1()*this.TL)/(Math.pow(this.T(),2)*(this.R/this.Ie()))
        }
    }//CS MAX

    Cs(){
        
        let C = this.Sds()/(this.R/this.Ie());
        //return this.T()
    
        if(C<=this.Csmin()){
            return this.Csmin()
        }
        if(C>=this.Csmax()){
            return this.Csmax()
        }
        else{
            return C
        }
    }//CS

    Vb(){
        return (this.Cs()*this.W).toFixed(0)
    }//VB

    SDC(){
        let sdc1
        switch(true) {
            case (this.Sds() < 0.167):
                sdc1 = (this.category == 'IV') ? 'A' : 'A'
                break;
            case (this.Sds() < 0.33):
                sdc1 = (this.category == 'IV') ? 'C' : 'B'
                break;
            case (this.Sds() < 0.5):
                sdc1 = (this.category == 'IV') ? 'D' : 'C'
                break;
            case (this.Sds() >= 0.5):
                sdc1 = (this.category == 'IV') ? 'D' : 'D'
                break;
        }//Switch

        let sdc2
        switch(true) {
            case (this.Sd1() < 0.167):
                sdc2 = this.category == 'IV' ? 'A' : 'A'
                break;
            case (this.Sd1() < 0.33):
                sdc2 = this.category == 'IV' ? 'C' : 'B'
                break;
            case (this.Sd1() < 0.5):
                sdc2 = this.category == 'IV' ? 'D' : 'C'
                break;
            case (this.Sd1() >= 0.5):
                sdc2 = this.category == 'IV' ? 'D' : 'D'
                break;
        }//Switch

        return sdc1 > sdc2 ? sdc1 : sdc2

    }//SDC
  
    
  } //CLASS