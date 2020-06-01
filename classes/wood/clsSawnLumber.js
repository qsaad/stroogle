import Wood from '@/classes/wood/clsWood'
import * as WoodSawnBeam from '@/data/WoodSawnBeam'
import * as WoodSawnSpecies from '@/data/WoodSawnSpecies'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class SawnLumber extends Wood {
    constructor({size="2x4",noPly = 1, species="DFL#2",Lu = 12,Lx = 12, Ly = 12, method="ASD",duration="DL",moisture="Dry",temperature="<100",spacing=30,bearing=1.5,incision=false,flat=false}){
		super({ method, duration, moisture, temperature})
		//this.method = method
		this.size = _.find(WoodSawnBeam.List, {'size': size})
		this.noPly = noPly
        this.b = this.size.b 
		this.d = this.size.d
		this.Lu = Lu * 12
		this.Lx = Lx *12
		this.Ly = Ly * 12
        this.spacing = spacing
        this.bearing = bearing
        this.incision = incision
        this.flat = flat
        this.species = _.find(WoodSawnSpecies.List, {'species': species})
		this.Fbx = this.species.Fb
		this.Fby = this.species.Fb
        this.Ft = this.species.Ft
		this.Fvx = this.species.Fv
		this.Fvy = this.species.Fv
		this.Fc = this.species.Fc
		this.Fcp = this.species.Fcp
		this.E = this.species.E
		this.Emin = this.species.Emin
		this.G = this.species.G
		this.c = 0.8
		this.MC = 19
	}//CONSTRUCTOR

	//---------------------------------------------------
    // LOAD FACTOR
    //---------------------------------------------------
	DLF(){
		return (this.method == "ASD") ? 1 : 1.2;
	}//DEAD LOAD

	LLF(){
		return (this.method == "ASD") ? 1 : 1.6;
	}//DEAD LOAD

	wt(){
		return 62.4*(this.G/(1+0.009*this.G*this.MC))*(1+ this.MC/100)
	}

	//---------------------------------------------------
    // SECTION PROPERTIES
    //---------------------------------------------------
	A(){
		return (this.b*this.noPly)*this.d
	}
	Ix(){
		return (this.b*this.noPly)*Math.pow(this.d,3)/12
	}
	Sx(){
		return this.Ix()/(this.d/2)
	}
	Iy(){
		return this.d*Math.pow(this.b*this.noPly,3)/12
	}
	Sy(){
		return this.Iy()/(this.b*this.noPly/2)
	}
    //SIZE FACTOR
	CF(){
		if(this.b<=4){
			if(this.d<=4){
				return{Fb:1.5,Ft:1.5,Fc:1.15};
			}
			if(this.d<=5){
				return{Fb:1.4,Ft:1.4,Fc:1.1};
			}
			if(this.d<=6){
				return{Fb:1.3,Ft:1.3,Fc:1.1};
			}
			if(this.d<=8){
				var val = (this.b<=3) ? 1.2 : 1.3;
				return{Fb:val,Ft:1.2,Fc:1.05};
			}
			if(this.d<=10){
				var val = (this.b<=3) ? 1.1 : 1.2;
				return{Fb:val,Ft:1.1,Fc:1};
			}
			if(this.d<14){
				var val = (this.b<=3) ? 1 : 1.1;
				return{Fb:val,Ft:1,Fc:1};
			}
			if(this.d>=14){
				let val = (this.b<=3) ? 0.9 : 1;
				return{Fb:val,Ft:0.9,Fc:0.9};
			}
		}
		else{
			let k = (this.d<12) ? 1 : Math.pow(12/this.d,1/9);
			return{Fb:1*k,Ft:1,Fc:1};
		}
    }//CF
    //REPETITIVE FACTOR
    Cr(){
        if(this.spacing<=24){
            return 1.15
        }
        else{
            return 1
        }
    }//Cr
    //BEARING FACTOR
	Cb(){
		if(this.bearing < 6){
			return (this.bearing + 0.375)/this.bearing;
		}
		else{
			return 1
		}
    }
    //INCISION FACTOR
	Ci(){
		if(this.incision){
			return {Fb:0.8,Ft:0.9,Fv:0.8,Fcp:1,Fc:0.8,E:0.95,Emin:0.95}
		}
		else{
			return {Fb:1,Ft:1,Fv:1,Fcp:1,Fc:1,E:1,Emin:1}
		}
    }//Ci
    //FLAT USE FACTOR
	Cfu(){
		if(this.flat){
			if(this.d<=3){
				return (this.b <= 3) ? 1:1
			}
			if(this.d<=4){
				return (this.b <= 3) ? 1.1:1
			}
			if(this.d<=5){
				return (this.b <= 3) ? 1.1:1.05
			}
			if(this.d<=10){
				return (this.b <= 3) ? 1.15:1.05
			}
			if(this.d>=10){
				return (this.b <= 3) ? 1.2:1.1
			}
		}
		else{
			return 1
		}
	}//Cfu
	//EFFECTIVE LENGTH
	Le(){
		if(this.Lu/this.d < 7){
			return 2.06*this.Lu
		}
		if(this.Lu/this.d <= 14.3){
			return 1.63*this.Lu+3*this.d
		}
		else{
			return 1.84*this.Lu
		}
	}//Le
	//BUCKLING STIFFNESS FACTOR
	CTB(){
		let l = 0;
		let COVe = 0.59;
		let KM = 2300;
		let KT = 1-1.645*COVe;
		if(this.Le() <96){
			l = this.Le();
		}
		else{
			l = 96;
		}
	
		return Math.min(1+(KM*l)/(KT*this.E),1);
	}//CT
	//Fb*
	Fb_1(){
		let F = this.method == "ASD" ? this.Fbx*this.CD() : this.Fbx*this.KF().Fb*this.phi().Fb*this.TE().Fb
		return F*this.CM().Fb*this.Ct().Fb*this.CF().Fb*this.Cr()
	}
	//Fb**
	Fb_2(){
		let F = this.method == "ASD" ? this.Fbx*this.CD() : this.Fbx * this.KF().Fb*this.phi().Fb*this.TE().Fb
		return F*this.CM().Fb*this.Ct().Fb*this.CL()*this.CF().Fb*this.Cr()
	}
	//Fc*
	Fc_1(){
		let F = this.method == "ASD" ? this.Fc*this.CD() : this.Fc * this.KF().Fc*this.phi().Fc*this.TE().Fc
		return F*this.CM().Fc*this.Ct().Fc*this.CF().Fc*this.Ci().Fc
	}
	Rb(){
		return Math.pow(this.Le()*this.d/Math.pow(this.noPly*this.b,2),0.5);
	}
	//FbE
	FbE(){
		let E = this.method == "ASD" ? this.Emin1() : this.Eminn1()
		return 1.2*E/Math.pow(this.Rb(),2);
	}
	SRx(){
		return this.Lx/this.d
	}
	SRy(){
		return this.Ly/(this.b*this.noPly)
	}
	SR(){
		return Math.max(this.SRx(),this.SRy())
	}
	//FcE
	FcE(){
		let E = this.method == "ASD" ? this.Emin1() : this.Eminn1()
		return (0.822*E)/Math.pow(this.SR(),2);
	}
	FcEx(){
		let E = this.method == "ASD" ? this.Emin1() : this.Eminn1()
		return (0.822*E)/Math.pow(this.SRx(),2);
	}
	FcEy(){
		let E = this.method == "ASD" ? this.Emin1() : this.Eminn1()
		return (0.822*E)/Math.pow(this.SRy(),2);
	}
	//BEAM STABILITY FACTOR
	CL(){
		let k1 = 0;
		let k2 = 0;

		k1 = (1 + this.FbE()/this.Fb_1())/1.9;
		k2 = (this.FbE()/this.Fb_1())/0.95;
	
		return k1 - Math.pow(k1*k1 - k2,0.5);
	}//CL
	//BUILT UP FACTOR
	Kf(){
		if(this.SRy() > this.SRx() && this.noPly > 1){
			return 0.6
		}
		else{
			return 1
		}
	}
	CP(){
		let k1x = 0
		let k2x = 0

		let k1y = 0
		let k2y = 0
		
		k1x = (1 + this.FcEx()/this.Fc_1())/(2*this.c)
		k2x = (this.FcEx()/this.Fc_1())/this.c

		k1y = (1 + this.FcEy()/this.Fc_1())/(2*this.c)
		k2y = (this.FcEy()/this.Fc_1())/this.c
		
		return Math.min(k1x - Math.pow(k1x*k1x-k2x,0.5), this.Kf()*(k1y - Math.pow(k1y*k1y-k2y,0.5)))
	}//CP
	//---------------------------------------------------
    // ADJUSTMENT FACTOR
    //---------------------------------------------------
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
				CF : this.CF().Fb,
				Cfu : this.Cfu(),
				Ci : this.Ci().Fb,
				Cr : this.Cr(),
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
				CF : this.CF().Fb,
				Cfu : 0,
				Ci : this.Ci().Ft,
				Cr : 0,
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
				CF : 0,
				Cfu : 0,
				Ci : this.Ci().Ft,
				Cr : 0,
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
				CF : this.CF().Fc,
				Cfu : 0,
				Ci : this.Ci().Fc,
				Cr : 0,
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
				CF : 0,
				Cfu : 0,
				Ci : this.Ci().Fcp,
				Cr : 0,
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
				CF : 0,
				Cfu : 0,
				Ci : this.Ci().E,
				Cr : 0,
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
				CF : 0,
				Cfu : 0,
				Ci : this.Ci().Emin,
				Cr : 0,
				CP : 0,
				CTB : this.CTB(),
				Cb : 0,
				KF : this.KF().Emin,
				phi : this.phi().Emin,
				TE : 0
			},//STABILITY
		]
	}
	//---------------------------------------------------
    // NOMINAL STRESSES
    //---------------------------------------------------
	//Fbx'
	Fbx1(){
		return this.Fbx*this.CD()*this.CM().Fb*this.Ct().Fb*this.CL()*this.Cfu()*this.Ci().Fb*this.CF().Fb*this.Cr()
	}
	Fbnx1(){
		return this.Fbx*this.KF().Fb*this.phi().Fb*this.TE().Fb*this.CM().Fb*this.Ct().Fb*this.CL()*this.Cfu()*this.Ci().Fb*this.CF().Fb*this.Cr()
	}
	//Fby'
	Fby1(){
		return this.Fby*this.CD()*this.CM().Fb*this.Ct().Fb*this.CF().Fb*this.Cfu()
	}
	Fbny1(){
		return this.Fby*this.KF().Fb*this.phi().Fb*this.TE().Fb*this.CM().Fb*this.Ct().Fb*this.CF().Fb*this.Cfu()
	}
	//Ft'
	Ft1(){
		return this.Ft*this.CD()*this.CM().Ft*this.Ct().Ft*this.CF().Ft*this.Ci().Ft
	}
	Ftn1(){
		return this.Ft*this.KF().Ft*this.phi().Ft*this.TE().Ft*this.CM().Ft*this.Ct().Ft*this.CF().Ft*this.Ci().Ft
	}
	//Fv'
	Fv1(){
		return this.Fvx*this.CD()*this.CM().Fv*this.Ct().Fv*this.Ci().Fv
	}
	Fvn1(){
		return this.Fvy*this.KF().Fv*this.phi().Fv*this.TE().Fv*this.CM().Fv*this.Ct().Fv*this.Ci().Fv
	}
	//Fc'
	Fc1(){
		return this.Fc*this.CD()*this.CM().Fc*this.Ct().Fc*this.CF().Fc*this.Ci().Fc*this.CP()
	}
	Fcn1(){
		return this.Fc*this.KF().Fc*this.phi().Fc*this.TE().Fc*this.CM().Fc*this.Ct().Fc*this.CF().Fc*this.Ci().Fc*this.CP()
	}
	//Fcp'
	Fcp1(){
		return this.Fcp*this.CM().Fcp*this.Ct().Fcp*this.Ci().Fcp*this.Cb()
	}
	Fcpn1(){
		return this.Fcp*this.KF().Fcp*this.phi().Fcp*this.CM().Fcp*this.Ct().Fcp*this.Ci().Fcp*this.Cb()
	}
	//E'
	E1(){
		return this.E*this.CM().E*this.Ct().E*this.Ci().E
	}
	En1(){
		return this.E*this.CM().E*this.Ct().E*this.Ci().E
	}
	//E'
	Emin1(){
		return this.Emin*this.CM().E*this.Ct().E*this.Ci().E*this.CTB()
	}
	Eminn1(){
		return this.Emin*this.KF().Emin*this.phi().Emin*this.CM().E*this.Ct().E*this.Ci().E*this.CTB()
	}
    //---------------------------------------------------
    // FLEXURE CAPACITY
    //---------------------------------------------------
    fMnx(){
		let M = this.method == "ASD" ? this.Fbx1() : this.Fbnx1()
        return M*this.Sx()/12
    }
    fMny(){
		let M = this.method == "ASD" ? this.Fby1() : this.Fbny1()
        return M*this.Sy()/12
    }
    flexureParams(){
        return{
			Ix : this.Ix(),
			Sx : this.Sx(),
			Iy : this.Iy(),
			Sy : this.Sy(),
			Le : this.Le(),
			Rb : this.Rb(),
			Fb_1 : this.Fb_1(),
			FbE : this.FbE(),
			Emin1 : this.method == "ASD" ? this.Emin1() : this.Eminn1(),
			Fbx : this.Fbx,
			Fbx1 : this.method == "ASD" ? this.Fbx1() : this.Fbnx1(),
			CD : this.method == "ASD" ? this.CD() : 0, 
			CM : this.CM().Fb,
			Ct : this.Ct().Fb,
			CL : this.CL(),
			CF : this.CF().Fb,
			Cfu : this.Cfu(),
			Ci : this.Ci().Fb,
			Cr : this.Cr(),
			KF : this.KF().Fb,
			phi : this.phi().Fb,
			TE : this.TE().Fb
        }
    }
    //---------------------------------------------------
    // SHEAR CAPACITY
    //---------------------------------------------------
    fVnx(){
		let V = this.method == "ASD" ? this.Fv1() : this.Fvn1()
        return 2/3*V*this.A()
    }
    fVny(){
		let V = this.method == "ASD" ? this.Fv1() : this.Fvn1()
        return 2/3*V*this.A()
    }
    shearParams(){
        return{
			A : this.A(),
			Fv1 : this.method == "ASD" ? this.Fv1() : this.Fvn1(),
			Fv : this.Fvx,
			CD : this.method == "ASD" ? this.CD() : 0,  
			CM : this.CM().Fv,
			Ct : this.Ct().Fv,
			Ci : this.Ci().Ft,
			KF : this.KF().Fv,
			phi : this.phi().Fv,
			TE : this.TE().Fv
        }
    }
    //---------------------------------------------------
    // AXIAL CAPACITY
    //---------------------------------------------------
    fPn(){
		let P = this.method == "ASD" ? this.Fc1() : this.Fcn1()
        return P*this.A()
    }
    axialParams(){
        return{
			A : this.A(),
			Emin1 : this.Emin1(),
			Fc_1 : this.Fc_1(),
			FcE : this.FcE(),
			FcEx : this.FcEx(),
			FcEy : this.FcEy(),
			c : this.c,
			SRx : this.SRx(),
			SRy : this.SRy(),
			SR : this.SR(),
			Rb : this.Rb(),
			Kf : this.Kf(),
			Fc1 : this.method == "ASD" ? this.Fc1() : this.Fcn1(),
			Fc : this.Fc,
			CD : this.method == "ASD" ? this.CD() : 0,  
			CM : this.CM().Fc,
			Ct : this.Ct().Fc,
			CF : this.CF().Fc,
			Ci : this.Ci().Fc,
			CP : this.CP(),
			KF : this.KF().Fc,
			phi : this.phi().Fc,
			TE : this.TE().Fc
        }
	}
	
	//---------------------------------------------------
    // BEARING CAPACITY
    //---------------------------------------------------
    fRn(){
		let CP = this.method == "ASD" ? this.Fcp1() : this.Fcpn1()
        return CP*this.bearing
    }
    bearingParams(){
        return{
			Lb : this.bearing,
			Fcp1 : this.method == "ASD" ? this.Fcp1() : this.Fcpn1(),
			Fcp : this.Fcp,
			CD : 0, 
			CM : this.CM().Fcp,
			Ct : this.Ct().Fcp,
			Ci : this.Ci().Fcp,
			Cb : this.Cb(),
			KF : this.KF().Fcp,
			phi : this.phi().Fcp,
        }
	}
	
    //---------------------------------------------------
    // TENSION
    //---------------------------------------------------
    fTn(){
		let T = this.method == "ASD" ? this.Ft1() : this.Ftn1()
        return T*this.A()
    }
    tensionParams(){
        return{
			A : this.A(),
			Ft1 : this.method == "ASD" ? this.Ft1() : this.Ftn1(),
			Ft : this.Ft,
			CD : this.method == "ASD" ? this.CD() : 0,  
			CM : this.CM().Ft,
			Ct : this.Ct().Ft,
			CF : this.CF().Fb,
			Ci : this.Ci().Ft,
			KF : this.KF().Ft,
			phi : this.phi().Ft,
			TE : this.TE().Ft
        }
    }
   
    
}//CLASS