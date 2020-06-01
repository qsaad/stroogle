import * as WoodEngineeredSize from '@/data/WoodEngineeredSize'
import * as WoodEngineeredSpecies from '@/data/WoodEngineeredSpecies'
import SawnLumber from '@/classes/wood/clsSawnLumber'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class Engineered extends SawnLumber{
    constructor({size="1-3/4 x 11-7/8", species="2.0E Microllam LVL", Lu, Lx, Ly, method, duration,moisture,temperature,spacing,bearing,incision,flat,L=21}){
		super({ method, Lu, Lx, Ly, duration, moisture, temperature, spacing, bearing, incision, flat})
		this.L = L*12
        this.size = _.find(WoodEngineeredSize.List, {'size': size})
        this.b = this.size.b 
		this.d = this.size.d
		this.name = species
        this.species = _.find(WoodEngineeredSpecies.List, {'species': species})
        this.Fbx = this.species.Fb
        this.Ft = this.species.Ft
        this.Fvx = this.species.Fv
        this.Fvy = this.species.Fv
		this.Fc = this.species.Fc
		this.Fcp = this.species.Fcp
		this.E = this.species.E
        this.Emin = this.species.Emin
		this.G = this.species.SG
        this.c = 0.9
    }//CONSTRUCTOR
    
    //NOT APPLICABLE TO GLULAM
    CF(){
		let str = this.name
		let k = 0
		switch(true){
			case (str.includes('Microllam LVL')):
				k = 0.092
				break
			case (str.includes('Parallam PSL')):
				k = 0.136
				break
			case (str.includes('Timberstrand LSL')):
				k = 0.111
				break
		}//SWITCH

		return {
			Fb : this.d <= 12 ? 1 : Math.pow(12/this.d,k),
			Ft : 1,
			Fc : 1
		}
    }//CF
    //NOT APPLICABLE TO GLULAM
    Cr(){
        return this.spacing <= 24 ? 1.04 : 1
    }//Cr
    //NOT APPLICABLE TO GLULAM
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
	CTB(){
		return 1
	}
    //VOLUME FACTOR
	CV(){
        let CV1 = Math.pow(21/this.L,1/10)*Math.pow(12/this.d,1/10)*Math.pow(5.125/this.b,1/10)
        return Math.min(CV1,1)
	}//CV 
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
				CF : this.CF().Fb,
                CL : this.CL(),
                CV : this.CV(),
				Cr : this.Cr(),
				CP : 0,
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
				CF : 0,
                CL : 0,
                CV : 0,
				Cr : 0,
				CP : 0,
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
				CF : 0,
				CL : 0,
				CV : 0,
				Cr : 0,
				CP : 0,
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
				CF : 0,
				CL : 0,
				CV : 0,
				Cr : 0,
				CP : this.CP(),
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
				CF : 0,
				CL : 0,
				CV : 0,
				Cr: 0,
				CP : 0,
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
				CF : 0,
				CL : 0,
				CV : 0,
				Cr : 0,
				CP : 0,
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
				CF : 0,
				CL : 0,
				CV : 0,
				Cr : 0,
				CP : 0,
				Cb : 0,
				KF : this.KF().Emin,
				phi : this.phi().Emin,
				TE : 0
			},//STABILITY
		]
	}
	flexureParams(){
		//let obj = super.flexureParams()
		return _.merge(super.flexureParams(), {Fb : this.CF().Fb})
	}
    //Fbx'
	Fbx1(){
		return this.Fbx*this.CD()*this.CM().Fb*this.Ct().Fb*this.CF().Fb*Math.min(this.CL(),this.CV())*this.Cfu()*this.Ci().Fb*this.CF().Fb*this.Cr()
	}
	Fbnx1(){
		return this.Fbx*this.KF().Fb*this.phi().Fb*this.TE().Fb*this.CM().Fb*this.Ct().Fb*this.CF().Fb*Math.min(this.CL(),this.CV())*this.Cfu()*this.Ci().Fb*this.CF().Fb*this.Cr()
	}

}//CLASS