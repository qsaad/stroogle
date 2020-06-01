import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'

export default class CopedBeamCapacity extends Steel {
    constructor({ method, Fy, section, Lc = 1, Dc = 1, c = 0.5,copedFlange = "Top", R = 20}) {
        super({ method, Fy })
        this.W = section
        this.Lc = _.toNumber(Lc)
        this.Dc = _.toNumber(Dc)
        this.c = _.toNumber(c)
        this.copedFlange = copedFlange
        this.R = _.toNumber(R)
        this.Fu = (this.Fy == 36 )? 58: 65;
       
    } // CONSTRUCTOR

    e(){
        return this.Lc + this.c;
    }
    
    M(){
        return this.R*this.e();
    }
    
    Snet(){
        if(this.copedFlange == "Top"){
            return this.W.SX //<-- TO BE CORRECTED : REDUCE SX FOR COPED TOP FLANGE
        }
        else{
            let LW = this.W.D - 2*this.Dc
            return this.W.TW*Math.pow(LW,2)/6
        }
    }//S NET

    //FLEXURAL RUPTURE STRENGTH
	Mfr(){
		let M = this.Fu*this.Snet()/12;
		return (this.method == "ASD") ? M/2 : 0.75*M
    }
    
    //FLEXURAL LOCAL BUCKLING STRENGTH	
	Fcr_lb(){
		let ho =  (this.copedFlange == "Top") ? this.W.D - this.Dc : this.W.D - 2*this.Dc ;
		let k = (this.Dc/ho <= 1) ? 2.2*Math.pow(this.W.HO/this.Dc,1.65) : 2.2*(this.W.HO/this.Dc);
        let f = (this.Dc/this.W.D <= 1) ? 2*this.Dc/this.W.D : 1+this.Dc/this.W.D
			
		return Math.min(26210*Math.pow(this.W.TW/this.W.HO,2)*f*k,this.Fy)
    }
    
    Mlb(){
        let M = this.Fcr_lb()*this.Snet()/12;
        return (this.method == "ASD") ? M/2 : 0.75*M
    }

    //FLEXURAL LATERAL TORSIONAL STRENGTH	
	Mlt(){
		let M = this.Fu*this.Snet()/12;
		return (this.method == "ASD") ? M/2 : 0.75*M;
    }
    
    momentCapacity(){
        return Math.min(this.Mfr(),this.Mlb(),this.Mlt());
    }

    shearCapacity(){
        return 0
    }
   
}//CLASS