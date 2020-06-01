import * as WoodGlulamWesternSize from '@/data/WoodGlulamWesternSize'
import * as WoodGlulamSouthernSize from '@/data/WoodGlulamSouthernSize'
import * as WoodGlulamSpecies from '@/data/WoodGlulamSpecies'
import * as WoodGlulamHardwoodSpecies from '@/data/WoodGlulamHardwoodSpecies'
import SawnLumber from '@/classes/wood/clsSawnLumber'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class Glulam extends SawnLumber{
    constructor({size="5-1/8 x 24", species="24F-1.7E", Lu, Lx, Ly, method, duration,moisture,temperature,bearing,incision,flat,radius=0,L=21,type="Western",grade="Softwood"}){
		super({ method, Lu, Lx, Ly, duration, moisture, temperature, bearing, incision, flat})
		this.L = L
		this.type = type
		this.grade = grade
		this.sizeList = this.type == "Western" ? WoodGlulamWesternSize.List : WoodGlulamSouthernSize.List
        this.size = _.find(this.sizeList, {'size': size})
        this.b = this.size.b 
		this.d = this.size.d
		this.speciesList = this.grade == "Softwood" ? WoodGlulamSpecies.List :  WoodGlulamHardwoodSpecies.List
        this.species = _.find(this.speciesList, {'species': species})
        this.Fbx = this.species.Fbx_bot
        this.Fby = this.species.Fby
        this.Ft = this.species.Ft
        this.Fvx = this.species.Fvx
        this.Fvy = this.species.Fvy
		this.Fc = this.species.Fc
		this.Fcp = this.species.Fcpx
        this.E = this.species.Ex
        this.Ex = this.species.Ex
        this.Ey = this.species.Ey
        this.Emin = this.species.Ex_min
        this.Ex_min = this.species.Ex_min
        this.Ey_min = this.species.Ey_min
		this.G = this.species.G
        this.c = 0.9
		this.tapered = false
		this.radius = radius
		this.t = this.type == "Western" ? 1.5 : 1.375
    }//CONSTRUCTOR
    
    //CF
    CF(){
        return {Fb:1,Ft:1,Fc:1}
    }//CF
    //Cr
    Cr(){
        return 1
    }//Cr
    //Ci
    Ci(){
        return {Fb:1,Ft:1,Fv:1,Fcp:1,Fc:1,E:1,Emin:1}
    }//Ci
    //SHEAR REDUCTION FACTOR
    Cvr(){
        if(this.incision || this.duration == "Impact"){
            return 0.72
        }
        else{
            return 1
        }
    }//Cvr
    //STRESS INCISION FACTOR
    CS(){
        if(this.tapered){
            return 1
        }
        else{
            return 1
        }
	}//CS
	//CURVATTURE
	Cc(){
		return this.radius > 0 ? 1 - 2000 * Math.pow(this.t/this.radius,2) : 1
	}//Cc
    //MOISTURE
    CM(){
		if(this.moisture == "Dry"){
			return {Fb:1,Ft:1,Fv:1,Fcp:1,Fc:1,E:1,Emin:1};
		}
		else{
			return {Fb:0.8,Ft:0.8,Fv:0.875,Fcp:0.53,Fc:0.73,E:0.833,Emin:0.833};
		}
    }//CM
      //FLAT USE FACTOR
	Cfu(){
		if(this.flat){
			return Math.pow(12/this.b,1/9)
		}
		else{
			return 1
		}
	}//Cfu
    //VOLUME FACTOR
	CV(){
        let CV1 = Math.pow(21/this.L,1/10)*Math.pow(12/this.d,1/10)*Math.pow(5.125/this.b,1/10)
        return Math.min(CV1,1)
    }//CV
    FbE(){
		let E = this.method == "ASD" ? this.Ey_min1() : this.Ey_minn1()
		return 1.2*E/Math.pow(this.Rb(),2);
    }
    //FcE
	FcE(){
		let E = this.method == "ASD" ? this.Ey_min1() : this.Ey_minn1()
		return (0.822*E)/Math.pow(this.SR(),2);
	}
	FcEx(){
		let E = this.method == "ASD" ? this.Ex_min1() : this.Ex_minn1()
		return (0.822*E)/Math.pow(this.SR(),2);
	}
	FcEy(){
		let E = this.method == "ASD" ? this.Ey_min1() : this.Ey_minn1()
		return (0.822*E)/Math.pow(this.SR(),2);
	}
	Kf(){
		return 1
	}
    
    
    adjustmentFactors(){
		return [
			{	
				name : this.method == "ASD" ? "F<sup>'</sup><sub>b</sub>" : "F<sup>'</sup><sub>bn</sub>" ,
				adjusted : this.method == "ASD" ? this.Fbx1() : this.Fbnx1(),
				actual : this.Fbx, 
				CD : this.method == "ASD" ? this.CD() : 0, 
				CM : this.CM().Fb,
				Ct : this.Ct().Fb,
                CL : this.CL(),
                CV : this.CV(),
				Cfu : this.Cfu(),
				CP : 0,
				CTB : 0,
				Cb : 0,
				KF : this.KF().Fb,
				phi : this.phi().Fb,
				TE : this.TE().Fb
			},//FLEXURE
			{	
				name : this.method == "ASD" ? "F<sup>'</sup><sub>t</sub>" : "F<sup>'</sup><sub>tn</sub>",
				adjusted : this.method == "ASD" ? this.Ft1() : this.Ftn1(),
				actual : this.Ft, 
				CD : this.method == "ASD" ? this.CD() : 0,  
				CM : this.CM().Ft,
				Ct : this.Ct().Ft,
                CL : 0,
                CV : 0,
				Cfu : 0,
				CP : 0,
				CTB : 0,
				Cb : 0,
				KF : this.KF().Ft,
				phi : this.phi().Ft,
				TE : this.TE().Ft
			},//TENSION
			{	
				name : this.method == "ASD" ? "F<sup>'</sup><sub>v</sub>" : "F<sup>'</sup><sub>vn</sub>",
				adjusted : this.method == "ASD" ? this.Fv1() : this.Fvn1(),
				actual : this.Fvx, 
				CD : this.method == "ASD" ? this.CD() : 0,  
				CM : this.CM().Fv,
				Ct : this.Ct().Fv,
				CL : 0,
				CV : 0,
				Cfu : 0,
				CP : 0,
				CTB : 0,
				Cb : 0,
				KF : this.KF().Fv,
				phi : this.phi().Fv,
				TE : this.TE().Fv
			},//SHEAR
			{	
				name : this.method == "ASD" ? "F<sup>'</sup><sub>c</sub>" : "F<sup>'</sup><sub>cn</sub>",
				adjusted : this.method == "ASD" ? this.Fc1() : this.Fcn1(),
				actual : this.Fc, 
				CD : this.method == "ASD" ? this.CD() : 0,  
				CM : this.CM().Fc,
				Ct : this.Ct().Fc,
				CL : 0,
				CV : 0,
				Cfu : 0,
				CP : this.CP(),
				CTB : 0,
				Cb : 0,
				KF : this.KF().Fc,
				phi : this.phi().Fc,
				TE : this.TE().Fc
			},//AXIAL
			{	
				name : this.method == "ASD" ? "F<sup>'</sup><sub>cp</sub>" : "F<sup>'</sup><sub>cpn</sub>",
				adjusted : this.method == "ASD" ? this.Fcp1() : this.Fcpn1(),
				actual : this.Fcp, 
				CD : 0, 
				CM : this.CM().Fcp,
				Ct : this.Ct().Fcp,
				CL : 0,
				CV : 0,
				Cfu : 0,
				CP : 0,
				CTB : 0,
				Cb : this.Cb(),
				KF : this.KF().Fcp,
				phi : this.phi().Fcp,
				TE : 0
			},//BEARING
			{	
				name : this.method == "ASD" ? "E<sup>'</sup>" : "E<sup>'</sup><sub>n</sub>",
				adjusted : this.method == "ASD" ? this.E1() : this.En1(),
				actual : this.E, 
				CD : 0, 
				CM : this.CM().E,
				Ct : this.Ct().E,
				CL : 0,
				CV : 0,
				Cfu : 0,
				CP : 0,
				CTB : 0,
				Cb : 0,
				KF : this.KF().E,
				phi : this.phi().E,
				TE : 0
			},//MODULUS
			{	
				name : this.method == "ASD" ? "E<sup>'</sup><sub>min</sub>" : "E<sup>'</sup><sub>min n</sub>",
				adjusted : this.method == "ASD" ? this.Emin1() : this.Eminn1(),
				actual : this.Emin, 
				CD : 0, 
				CM : this.CM().Emin,
				Ct : this.Ct().Emin,
				CL : 0,
				CV : 0,
				Cfu : 0,
				CP : 0,
				CTB : this.CTB(),
				Cb : 0,
				KF : this.KF().Emin,
				phi : this.phi().Emin,
				TE : 0
			},//STABILITY
		]
	}
    //Fbx'
	Fbx1(){
		return this.Fbx*this.CD()*this.CM().Fb*this.Ct().Fb*Math.min(this.CL(),this.CV())*this.Cfu()*this.Ci().Fb*this.CF().Fb*this.Cr()
	}
	Fbnx1(){
		return this.Fbx*this.KF().Fb*this.phi().Fb*this.TE().Fb*this.CM().Fb*this.Ct().Fb*Math.min(this.CL(),this.CV())*this.Cfu()*this.Ci().Fb*this.CF().Fb*this.Cr()
	}
    //E'
    Ex1(){
		return this.Ex*this.CM().E*this.Ct().E*this.Ci().E
	}
	Exn1(){
		return this.Ex*this.CM().E*this.Ct().E*this.Ci().E
    }
    Ey1(){
		return this.Ey*this.CM().E*this.Ct().E*this.Ci().E
	}
	Eyn1(){
		return this.Ey*this.CM().E*this.Ct().E*this.Ci().E
	}
	Ex_min1(){
		return this.Ex_min*this.CM().E*this.Ct().E*this.Ci().E*this.CTB()
	}
	Ex_minn1(){
		return this.Ex_min*this.KF().Emin*this.phi().Emin*this.CM().E*this.Ct().E*this.Ci().E*this.CTB()
    }
    Ey_min1(){
		return this.Ey_min*this.CM().E*this.Ct().E*this.Ci().E*this.CTB()
	}
	Ey_minn1(){
		return this.Ey_min*this.KF().Emin*this.phi().Emin*this.CM().E*this.Ct().E*this.Ci().E*this.CTB()
	}
	
	flexureParams(){
		return{
			...super.flexureParams(),...{CV:this.CV()}
		}
	}
    
    


}//CLASS