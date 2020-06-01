import Coldform from '@/classes/coldform/clsColdform'
import * as SheetList  from '@/data/CFM_Sheet'
import _ from 'lodash'

export default class PuddleWeldCapacity extends Coldform {
    constructor({ method, weldSize, weldGrade, t1, t2}) {
        super({ method })
        //SCREW PROPERTIES
        this.d = _.toNumber(weldSize)
        this.Fxx = _.toNumber(weldGrade)
        //SHEET t1 PROPERTIES
        this.t1 = _.map(_.filter(SheetList.List,{"Size" : t1}),'t')
        this.Fy1 = _.map(_.filter(SheetList.List,{"Size" : t1}),'Fy')
        this.Fu1 = _.map(_.filter(SheetList.List,{"Size" : t1}),'Fu')
        //SHEET t2 PROPERTIES
        this.t2 = _.map(_.filter(SheetList.List,{"Size" : t2}),'t')
        this.Fy2 = _.map(_.filter(SheetList.List,{"Size" : t2}),'Fy')
        this.Fu2 = _.map(_.filter(SheetList.List,{"Size" : t2}),'Fu')
        this.t = _.toNumber(this.t1) + _.toNumber(this.t2)
		this.Fu = Math.min(this.Fu1, this.Fu2);
    }//CONSTRUCTOR

    //EFFECTIVE DIAMETER OF FUSED AREA
	de(){
		return Math.min(0.7*this.d-1.5*this.t,0.55*this.d);
	}
		
	da(){
		return this.d - this.t;
    }
        
    //SHEAR CAPACITY FOR SHEETS WELDED TO THICKER SUPPORTING MEMBER
	Pn(){
		let P1 = 3.14*Math.pow(this.de(),2)*0.75*this.Fxx*1000/4;	
        let fPn1 = (this.method == "ASD") ? P1/2.55 : 0.6*P1
        let P2 = 0
        let fPn2 = 0
	
		if(this.da()/this.t <= 0.815*Math.pow(this.E/this.Fu,0.5)){
			P2 = 2.2*this.t*this.da()*this.Fu*1000;
			fPn2 = (this.method == "ASD") ? P2/2.2 : 0.7*P2;
		}
		if(this.da()/this.t < 1.397*Math.pow(this.E/this.Fu,0.5)){
			P2 = 0.28*(1+5.59*(Math.pow(this.E/this.Fu,0.5))/(this.da()/this.t))*this.t*this.da()*this.Fu*1000;
			fPn2 = (this.method == "ASD") ? P2/2.8 : 0.55*P2;
		}
		else{
			P2 = 1.4*this.t*this.da()*this.Fu*1000;
			fPn2 = (this.method == "ASD") ? P2/3.05 : 0.5*P2;
		}
	
		return Math.min(fPn1,fPn2);
	}//Pn
		
}//CLASS