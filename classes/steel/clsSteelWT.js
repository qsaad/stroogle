import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class SteelWT extends Steel {
    constructor({ method, Fy, section, Lu, Lx, Ly,Kx = 1, Ky = 1, web = 'Tension'}) {
        super({ method, Fy })
        this.WT = section
        this.c = 1
        this.cb = 1
        this.Lu = Lu*12
        this.Lx = Lx*12
        this.Ly = Ly*12
        this.Kx = Kx
        this.Ky = Ky

        this.A = section.A
        this.BF = section.BF
        this.D = section.D
        this.TF = section.TF
        this.TW = section.TW
        this.IX = section.IX
        this.IY = section.IY

        this.web = web
        this.SXW = this.WT.IX/(this.WT.D-this.WT.Y)
    	this.SXF = this.WT.IX/this.WT.Y
      } // CONSTRUCTOR

      propParams(){
        return {
          A : this.A,
          BF : this.BF,
          D : this.D,
          TF : this.TF,
          TW : this.TW,
          IX : this.IX,
          IY : this.IY,
        }
      }

    //---------------------------------------------------------
//LIMITING WIDTH-THICKNESS RATIO
//----------------------------------------------------------
	lf(){
		return this.WT.BF_2TF
	}
	
	lpf(){
		return 0.38*Math.pow(this.E/this.Fy,0.5)
	}
	
	lrf(){
		return Math.pow(this.E/this.Fy,0.5)
	}
	
	FlangeFlexure(){
		return this.WT.BF_2TF < this.lpf() ? "Compact": (this.WT.BF_2TF < this.lrf() ? "Non-Compact": "Slender") 
	}//FlangeFlexure
	
	lw(){
		return this.WT.D_T
	}
	
	lrw(){
		return 0.75*Math.pow(this.E/this.Fy,0.5);
	}
	
	WebCompression(){
		return this.WT.D_T < this.lrw() ? "Compact": "Slender" 
	}//WebCompression

    //-----------------------------------------------------------
    //FLEXURE
    //-----------------------------------------------------------
    //YIELD
	Mpx(){
		if(this.web == "Tension"){
			return Math.min(this.Fy*this.WT.ZX,1.6*this.Fy*this.SXW);
		}
		else{
			return Math.min(this.Fy*this.WT.Zx,this.Fy*this.SXF);
		}
	}//Mpx
	
    //LATERAL TORSIONAL BUCKLING
	B(){
		if(this.Lu == 0){
			return 0
		}
		else{
			let val = 2.3*(this.WT.D/this.Lu)*Math.pow(this.WT.IY/this.WT.J,0.5);
			return (this.web == "Tension")? val : -val
		}
	}
	
	Mltb(){
		if(this.Lu == 0){
			return 0
		}
		else{
			return Math.PI*Math.pow(this.E*this.WT.IY*this.G*this.WT.J,0.5)/this.Lu*(this.B()+Math.pow(1+Math.pow(this.B(),2),0.5))
		}
	}
	
    //FLANGE LOCAL BUCKLING
	Fcrf(){
		if(this.FlangeFlexure() == "Compact"){
			return 0;	
		}
		if(this.FlangeFlexure() == "Non-Compact"){
			return this.Fy*(1.19-0.5*this.WT.BF_2TF*Math.pow(this.Fy/this.E,0.5));		
		}
		else{
			return (0.69*this.E)/Math.pow(this.WT.BF_2TF,0.5);
		}
	}
	
	Sxc(){
		return (this.web == "Tension") ? this.SXF : this.SXW;
	}
	
	Mflb(){
		return this.Fcrf()*this.Sxc();
	}
	
	//STRONG AXIS
	fMnx(){
		return this.phiF()*ArrayMin(this.Mpx(),this.Mltb(),this.Mflb())/12;
	}
	
	//WEAK AXIS
	Mpy(){
		return Math.min(this.Fy*this.WT.ZY,1.6*this.Fy*this.WT.SY);
	}//Mpy
	
	fMny(){
		return this.phiF()*this.Mpy()/12;
    }

    flexureParams(){
        return{
            Flange : this.FlangeFlexure(),
            //Lp : this.Lp()/12,
            //Lr : this.Lr()/12,
            //bracing : this.bracedLength(),
            Mpx : this.Mpx()/12,
            Fcrf : this.Fcrf(),
            B : this.B(),
            Mltb : this.Mltb()/12,
            Sxc : this.Sxc(),
            Mflb : this.Mflb()/12,
            Mpy : this.Mpy()/12,
        }
      }//FLEXURAL PARAMS
    
    //-----------------------------------------------------------
    //AXIAL
    //-----------------------------------------------------------
    //SLENDERNESS RATIO	
    SRx(){
        return this.Kx*this.Lx/this.WT.RX
    }//SRx

    SRy(){
        return this.Ky*this.Ly/this.WT.RY
    }//SRy

    SR(){
        return Math.max(this.SRx(),this.SRy())
    }//SR

    //FLEXURAL BUCKLING STRESS
    Fef(){
        return Math.pow(Math.PI,2)*this.E/Math.pow(this.SR(),2)
    }//Fef

    Fcrf(){
        if(this.SR() <= 4.71*Math.pow(this.E/this.Fy,0.5)){
            return Math.pow(0.658,this.Fy/this.Fef())*this.Fy
        }
        else{
            return 0.877*this.Fef()
        }
    }//Fcrf

    //FLEXURAL-TORSIONAL AND BUCKLING STRESS
    // CORRECT PER EQUATION E4-2
    Fez(){
        return (this.G*this.WT.J)/(this.WT.A*Math.pow(this.WT.RO,2))
    }//Fez

    Fey(){
        return Math.pow(Math.PI,2)*this.E/Math.pow(this.SRy(),2)
    }//Fey

    Fet(){
        return (this.Fey()+this.Fez())/(2*this.WT.H)*(1-Math.pow(1-(4*this.Fey()*this.Fez()*this.WT.H)/(Math.pow(this.Fey()+this.Fez(),2)),0.5))
    }//Fet

    Fe(){
        return Math.min(this.Fef(),this.Fet())
    }//Fe

    Fcrz(){
        return (this.G*this.WT.J)/(this.WT.A*this.WT.RO*this.WT.RO)
    }//Fcrz

    Fcry(){
        if(this.SRy() <= 4.71*Math.pow(this.E/this.Fy,0.5)){
            return Math.pow(0.658,this.Fy/this.Fey())*this.Fy
        }
        else{
            return 0.877*this.Fey()
        }
    }//Fcry

    Fcrt(){
        return (this.Fcry()+this.Fcrz())/(2*this.WT.H)*(1-Math.pow(1-(4*this.Fcry()*this.Fcrz()*this.WT.H)/(Math.pow(this.Fcry()+this.Fcrz(),2)),0.5))
    }//Fcrt

    //UNSTIFFENED ELEMENT REDUCTION FACTOR
    Qs(){
        if(this.WT.D_T<=0.75*Math.pow(this.E/this.Fy,0.5)){
            return 1;
        }
        else if(this.WT.D_T<1.03*Math.pow(this.E/this.Fy,0.5)){
            return 1.908-1.22*this.WT.D_T*Math.pow(this.Fy/this.E,0.5);
        }
        else{
            return (0.69*this.E)/(this.Fy*Math.pow(this.WT.D_T,2)); 
        }
    }//Qs

    //STIFFENED ELEMENT REDUCTION FACTOR
    Qa(){
        let f
        if(this.SR() <= 4.71*Math.pow(this.E/this.Fy,0.5)){
            f = Math.pow(0.658,this.Fy/this.Fe())*this.Fy
        }
        else{
            f = 0.877*this.Fe()
        }
    
        if(this.WT.D_T>=1.49*Math.pow(this.E/f,0.5)){
            var be = 1.92*this.WT.TW*Math.pow(this.E/f)*(1-0.34/this.WT.BF_2TF*Math.pow(this.E/f,0.5))
            var Aeff = be*this.WT.TW+this.WT.BF*this.WT.TF
            return Aeff/this.WT.A
        }
        else{
            return 1
        }
    }//Qa

    Q(){
        return this.Qs()*this.Qa()
    }//Q

    Fcra = function(){
        if(this.SR() <= 4.71*Math.pow(this.E/(this.Q()*this.Fy),0.5)){
            return this.Q()*Math.pow(0.658,(this.Q()*this.Fy)/this.Fe())*this.Fy
        }
        else{
            return 0.877*this.Fe()
        }
    }//Fcra

    Fcr(){
        if(this.WebCompression() == "Compact"){
            return Math.min(this.Fcrf(),this.Fcrt())
        }
        else{
            return this.Fcra()
        }
    }//Fcr

    fPn(){
        return this.phiP()*this.Fcr()*this.WT.A
    }//fPn

    axialParams(){
        return {
            Web : this.WebCompression(),
            SRx : this.SRx(),
            SRy : this.SRy(),
            SR : this.SR(),
            Fef : this.Fef(),
            Fcrf : this.Fcrf(),
            Fez : this.Fez(),
            Fey : this.Fey(),
            Fet : this.Fet(),
            Fe : this.Fe(),
            Fcrz : this.Fcrz(),
            Fcry : this.Fcry(),
            Fcrt : this.Fcrt(),
            Qa : this.Qa(),
            Qs : this.Qs(),
            Q : this.Q(),
            Fcra : this.Fcra()
        }
    }//AXIAL PARAMS

    //-----------------------------------------------------------
    //SHEAR - X
    //-----------------------------------------------------------
    Af(){
		return this.WT.BF*this.WT.TF;
    }
    Cvx(){
        return 1
    }

    fVnx(){
        return this.phiV()*this.Fy*this.Af()*this.Cvx()
    }

    //-----------------------------------------------------------
    //SHEAR - Y
    //-----------------------------------------------------------
    Aw(){
		return this.WT.D*this.WT.TW;
    }
    Cvy(){
		if(this.WT.D_T<=2.24*Math.pow(this.E/this.Fy,0.5)){
			return 1
		}
		else{
			let kv = (this.WT.D_T < 260) ? 5: 1.2
			
			if(this.WT.D_T<=1.1*Math.pow(kv*this.E/this.Fy,0.5)){
				return 1
			}
			if(this.WT.D_T<=1.37*Math.pow(kv*this.E/this.Fy,0.5)){
				return 1.1*Math.pow(kv*this.E/this.Fy,0.5)/this.WT.D_T
			}
			else{
				return (1.51*this.E*kv)/(Math.pow(this.WT.D_T,2)*this.Fy)
			}
		}
	}//Cv
    fVny(){
        return this.phiV()*this.Fy*this.Aw()*this.Cvy()
    }

    shearParams(){
        return{
            Cvx : this.Cvx(),
            Aw : this.Aw(),
            Cvy : this.Cvy(),
            Af : this.Af()
        }
      }//SHEAR PARAMS

    //-----------------------------------------------------------
    //TENSION
    //-----------------------------------------------------------
    fTn(){
        return this.phiT()*this.Fy*this.WT.A
    }

    tensionParams(){
        return{
            A : this.WT.A,
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
            J : this.WT.J,
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