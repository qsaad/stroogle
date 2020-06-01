import Coldform from '@/classes/coldform/clsColdform'
import * as ScrewList  from '@/data/CFM_Screw'
import * as SheetList  from '@/data/CFM_Sheet'
import _ from 'lodash'


export default class ScrewCapacity extends Coldform {
    constructor({ method, screwSize, t1, t2}) {
        super({ method })
        //SCREW PROPERTIES
        this.screwSize = screwSize
        this.d = _.map(_.filter(ScrewList.List,{"Size" : screwSize}),'d')
        this.dh = _.map(_.filter(ScrewList.List,{"Size" : screwSize}),'F')
        //SHEET t1 PROPERTIES
        this.t1 = _.map(_.filter(SheetList.List,{"Size" : t1}),'t')
        this.Fy1 = _.map(_.filter(SheetList.List,{"Size" : t1}),'Fy')
        this.Fu1 = _.map(_.filter(SheetList.List,{"Size" : t1}),'Fu')
        //SHEET t2 PROPERTIES
        this.t2 = _.map(_.filter(SheetList.List,{"Size" : t2}),'t')
        this.Fy2 = _.map(_.filter(SheetList.List,{"Size" : t2}),'Fy')
        this.Fu2 = _.map(_.filter(SheetList.List,{"Size" : t2}),'Fu')
    }//CONSTRUCTOR

    A(){
        return Math.PI*Math.pow(this.d,2)/4
    }

    //SHEAR CAPACITY
	Pns(){
		let Pns1 = 4.2*Math.pow(Math.pow(this.t2,3)*this.d,0.5)*this.Fu2*1000;
		let Pns2 = 2.7*this.t1*this.d*this.Fu1*1000;
        let Pns3 = 2.7*this.t2*this.d*this.Fu2*1000;
        let P = 0
        let P1 = 0
        let P2 = 0
			
			if(this.t2/this.t1<=1){
				P =  Math.min(Pns1,Pns2,Pns3);
			}
			if(this.t2/this.t1>=2.5){
				P =  Math.min(Pns2,Pns3);
			}
			else{
				P1 = Math.min(Pns1,Pns2,Pns3);
				P2 = Math.min(Pns2,Pns3);
				P = ((P2-P1)/(2.5-1))*(this.t2/this.t1-1)+P1;
			}
			
			return (this.method == "ASD") ? P/3 : 0.5*P;
		
	}//SHEAR
		
    //PULL OUT
	Pnot(){
		let tc = this.t2;
		let P = 0.85*tc*this.d*this.Fu2*1000;

		return (this.method == "ASD") ? P/3 : 0.5*P;
	}
	
    //PULL OVER
	Pnov(){
		let dw = this.dh 
		let P = 1.5*this.t1*dw*this.Fu1*1000
		
		return (this.method == "ASD") ? P/3 : 0.5*P;
	}
	
	Pss(){
        let P = 0
		switch(this.screwSize){
      	    case "#6":
				P = 1248;
				break;
			case "#8":
				P = 1483;
				break;
			case "#10":
				P = 1718;
				break;
			case "#12":
				P = 2171;
				break;
            case "1/4":
				P =2970;
				break;
		}
		return (this.method == "ASD") ? P/3 : 0.5*P;
	}//Screw Shear
		
	Pts(){
        let P = 0
		switch(this.screwSize){
      	    case "#6":
				P = 1928;
				break;
			case "#8":
				P = 2291;
				break;
			case "#10":
				P = 2654;
				break;
			case "#12":
				P = 3551;
				break;
            case "1/4":
				P = 4816;
				break;
		}
		return (this.method == "ASD") ? P/3 : 0.5*P;
	}//Screw Shear
		
	shearCapacity(){
		return Math.min(this.Pss(),this.Pns())
	}
		
	tensionCapacity(){
		return Math.min(this.Pts(),this.Pnot(),this.Pnov())
	}
    
}//CLASS