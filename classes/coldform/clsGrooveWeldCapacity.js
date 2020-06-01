import Coldform from '@/classes/coldform/clsColdform'
import * as SheetList  from '@/data/CFM_Sheet'
import _ from 'lodash'

export default class GrooveWeldCapacity extends Coldform {
    constructor({ method, weldLength, weldGrade, weldType, t}) {
        super({ method })
        //WELD PROPERTIES
        this.L = _.toNumber(weldLength)
        this.Fxx = _.toNumber(weldGrade)
        this.type = weldType
        //SHEET t1 PROPERTIES
        this.t = _.map(_.filter(SheetList.List,{"Size" : t}),'t')
        this.Fy = _.map(_.filter(SheetList.List,{"Size" : t}),'Fy')
        this.Fu = _.map(_.filter(SheetList.List,{"Size" : t}),'Fu')
        this.R = 2*_.toNumber(this.t)
       
    }//CONSTRUCTOR

    tw(){
		if(this.type == "Bevel"){
			return 5*this.R/16;
		}
		else{
			return (this.R <= 0.5) ? this.R/2: 3*this.R/8 ;
		}
	}
	Pmax(){
		let P = 0.75*this.tw()*this.L*this.Fxx*1000;
		return (this.method == "ASD")? P/2.55: 0.6*P;
	}//Pmax
	
	PL(){
        let P = 0
		if(this.tw() < 2*this.t){
			P = 0.75*this.t*this.L*this.Fu*1000;
			return (this.method == "ASD")? P/2.8: 0.55*P;
		}
		else{
		    P = 1.5*this.t*this.L*this.Fu*1000;
			return (this.method == "ASD")? P/2.8: 0.55*P;
		}
	}//PL
	
	PT(){
		let P = 0.833*this.L*this.t*this.Fu*1000;
		return (this.method == "ASD")? P/2.55: 0.6*P;
	}//PT
	
	fPL(){
		if(this.t <= 0.1){
			return this.PL();
		}
		else{
			return Math.min(this.PL(), this.Pmax());
		}
	}//fPL
	
	fPT(){
		if(this.t <= 0.1){
			return this.PT();
		}
		else{
			return Math.min(this.PT(), this.Pmax());
		}
	}//fPL
	
	t1(){
		return t;
	}
	R1(){
		return R;
	}
		
}//CLASS