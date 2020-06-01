import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class SteelHSR extends Steel {
    constructor({ method, Fy, section, Lu, Lx, Ly,Kx = 1, Ky = 1}) {
        super({ method, Fy })
        this.HSR = section
        this.c = 1
        this.cb = 1
		this.Lu = Lu*12
        this.Lx = Lx*12
        this.Ly = Ly*12
        this.Kx = Kx
		this.Ky = Ky

		this.A = section.A
		this.IX = section.IX
      	this.IY = section.IY
	  } // CONSTRUCTOR
	  
	  propParams(){
        return {
          A : this.A,
          IX : this.IX,
          IY : this.IY,
        }
      }

    //-----------------------------------------------------------
    //WIDTH-THICKNESS RATIO
    //-----------------------------------------------------------
	WallFlexure(){
		return this.HSR.D_T < 0.07*this.E/this.Fy ? "Compact": (this.HSR.D_T < 0.31*this.E/this.Fy ? "Non-Compact": "Slender") ;
	}//WallFlexure
	
	WallCompression(){
		return this.HSR.D_T < 0.11*this.E/this.Fy ? "Compact": "Slender" ;
	}//WallCompression

    //-----------------------------------------------------------
    //FLEXURE
    //-----------------------------------------------------------
	Mpx(){
		return this.Fy*this.HSR.ZX;
	}//YIELDING
	
	Mflb(){
		if(this.WallFlexure()=="Compact"){
    	    return 0
        }
        if(this.WallFlexure()=="Non-Compact"){
    	    return (0.021*this.E/this.HSR.D_T+this.Fy)*this.HSR.SX
        }
		else{
			let Fcr = 0.33*this.E/this.HSR.D_T
			return Fcr*Sx
		}
	}//WALL LOCAL BUCKLING
	
	fMnx(){
		return this.phiF()*ArrayMin(this.Mpx(),this.Mflb())/12;
	}
	
	fMny(){
		return this.phiF()*ArrayMin(this.Mpx(),this.Mflb())/12;
	}
	
	flexureParams(){
		return{
			Wall: this.WallFlexure(),
			Mp : this.Mpx()/12,
			Mflb : this.Mflb()/12,
			
		}
	}//FLEXURAL PARAMS
    
    //-----------------------------------------------------------
    //AXIAL
    //-----------------------------------------------------------
	//SLENDERNESS RATIO	
	SRx(){
		return this.Kx*this.Lx/this.HSR.RX
	}//SRx
	
	SRy(){
		return this.Ky*this.Ly/this.HSR.RY;
	}//SRy
	
	SR(){
		return Math.max(this.SRx(),this.SRy());
	}//SR
	
	//FLEXURAL BUCKLING STRESS
	Fex(){
		return Math.pow(Math.PI,2)*this.E/Math.pow(this.SRx(),2);
	}//Fex
	
	Fey(){
		return Math.pow(Math.PI,2)*this.E/Math.pow(this.SRy(),2);
	}//Fey
	
	Fef(){
		return Math.min(this.Fex(),this.Fey());
	}//Fef
	
//FLEXURAL-TORSIONAL AND BUCKLING STRESS
	Fet(){
		return ((Math.pow(Math.PI,2)*this.E*this.HSR.C)/Math.pow(this.Kx*this.Ly,2)+this.G*this.HSR.J)*(1/(this.HSR.IX+this.HSR.IY));
	}//Fet
	
	Fe(){
		return Math.min(this.Fef(),this.Fet());
	}//Fe

//UNSTIFFENED ELEMENT REDUCTION FACTOR
	Qs(){
		//No unstiffned elements
		return 1;
	}//Qs
	
//STIFFENED ELEMENT REDUCTION FACTOR
	Qa(){
		if(this.WallCompression()== "Slender"){
			return 0.038*this.E/(this.Fy*this.HSR.D_T)+2/3
		}
		else{
			return 1;
		}
	}//Qa
	
//COMBINED REDUCTION FACTOR
	Q(){
		return this.Qs()*this.Qa()
	}//Q
	

//AXIAL STRESS
	Fcra(){
		if(this.SR() <= 4.71*Math.pow(this.E/(this.Q()*this.Fy),0.5)){
			return this.Q()*Math.pow(0.658,(this.Q()*this.Fy)/this.Fe())*this.Fy
		}
		else{
			return 0.877*this.Fe()
		}	
	}//Fcra
	
    //AXIAL CAPACITY
	fPn(){
		return this.phiP()*this.Fcra()*this.HSR.A
	}//fPn
	
	axialParams(){
		return {
			Wall : this.WallCompression(),
			SRx : this.SRx(),
			SRy : this.SRy(),
			SR : this.SR(),
			Fex : this.Fex(),
			Fey : this.Fey(),
			Fef : this.Fef(),
			Fet : this.Fet(),
			Fe : this.Fe(),
			Qa : this.Qa(),
			Qs : this.Qs(),
			Q : this.Q(),
			Fcra : this.Fcra()
		}
	}//AXIAL PARAMS
    
    //-----------------------------------------------------------
    //SHEAR
    //-----------------------------------------------------------
	Fcrv(){
		return 0.78*this.E/Math.pow(this.HSR.D_T,3/2);
	}
	fVnx(){
		return this.phiV()*this.Fcrv()*this.HSR.A/2;
    }
    fVny(){
		return this.phiV()*this.Fcrv()*this.HSR.A/2;
	}
	
	shearParams(){
		return{
			Fcrv : this.Fcrv(),
			A : this.HSR.A,
			phiV : this.phiV(),
		}
	  }//SHEAR PARAMS
    
    //-----------------------------------------------------------
    //TENSION
    //-----------------------------------------------------------
    fTn(){
        return this.phiV()*this.Fy*this.HSR.A
	}
	
	tensionParams(){
		return{
			A : this.HSR.A,
			phiT : this.phiT(),
		}
	  }//TENSION PARAMS

    //-----------------------------------------------------------
    //TORSION
    //-----------------------------------------------------------
    fTrn(){
        return 1
	}
	torsionParams(){
		return {
			J : this.HSR.J,
			phiTr : this.phiTr()
		}
	  }//TORSION PARAMS

    Lp(){
        return 1
    }
    Lr(){
        return 1
    }



}//CLASS