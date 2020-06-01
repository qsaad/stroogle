import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class SteelHSS extends Steel {
    constructor({ method, Fy, section, Lu, Lx, Ly,Kx = 1, Ky = 1}) {
        super({ method, Fy })
        this.HSS = section
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

    //---------------------------------------------------------
    //GENERAL
    //----------------------------------------------------------
    k(){
        return Math.pow(this.E/this.Fy,0.5)
    }
    Lp(){
        return 1.12*this.k()
    }
    Lr(){
        return 1.4*this.k()
    }
    //---------------------------------------------------------
    //COMPACTNESS
    //----------------------------------------------------------
    FlangeCompression(){
        return this.HSS.B_T < 1.12*this.k() ? "Compact": (this.HSS.B_T < 1.4*this.k() ? "Non-Compact": "Slender") 
    }
    FlangeCompressionX(){
        return this.HSS.B_T < 1.12*this.k() ? "Compact": (this.HSS.B_T < 1.4*this.k() ? "Non-Compact": "Slender") 
    }
    WebFlexureX(){
        return this.HSS.H_T < 2.42*this.k() ? "Compact": (this.HSS.H_T < 5.7*this.k() ? "Non-Compact": "Slender") 
    }
    FlangeCompressionY(){
        return this.HSS.H_T < 1.12*this.k() ? "Compact": (this.HSS.H_T < 1.4*this.k() ? "Non-Compact": "Slender") 
    }
    WebFlexureY(){
        return this.HSS.B_T < 2.42*this.k() ? "Compact": (this.HSS.B_T < 5.7*this.k() ? "Non-Compact": "Slender") 
    }


    FlangeFlexureX(){
        return this.HSS.B_T < 1.12*this.k() ? "Compact": (this.HSS.B_T < 1.4*this.k() ? "Non-Compact": "Slender") 
    }
    WebFlexureX(){
        return this.HSS.H_T < 2.42*this.k() ? "Compact": (this.HSS.H_T < 5.7*this.k() ? "Non-Compact": "Slender") 
    }
    FlangeFlexureY(){
        return this.HSS.H_T < 1.12*this.k() ? "Compact": (this.HSS.H_T < 1.4*this.k() ? "Non-Compact": "Slender") 
    }
    WebFlexureY(){
        return this.HSS.B_T < 2.42*this.k() ? "Compact": (this.HSS.B_T < 5.7*this.k() ? "Non-Compact": "Slender") 
    }
    CompressionCompactness(){
        return this.HSS.H_T < 1.12*this.k() ? "Compact": (this.HSS.H_T < 1.4*this.k() ? "Non-Compact": "Slender")
    }
    //---------------------------------------------------------
    //FLEXURE - X
    //----------------------------------------------------------
    Mpx(){
        return this.Fy*this.HSS.ZX
    }
    beX(){
        if(this.FlangeFlexureX() == "Slender"){
            let b1 = 1.92*this.HSS.TDES*Math.pow(this.E/this.Fy,0.5)*(1-(0.38/this.HSS.B_T)*Math.pow(this.E/this.Fy,0.5));
            return Math.min(b1,this.HSS.B);
        }
        else{
            return this.HSS.B
        }
    }//be
    Ieffx(){
        if(this.FlangeFlexureX() == "Slender"){
            let b = this.HSS.B - 3*this.HSS.TDES
            let b1 = b - this.beX()
            return this.HSS.IX - 2*(b1*Math.pow(this.HSS.TDES,3)/12 + b1*this.HSS.TDES*Math.pow(this.HSS.HT/2-this.HSS.TDES/2,2))
        }
        else{
            this.HSS.IX
        }
    }
    Seffx(){
        return this.Ieffx()/(this.HSS.HT/2)
    }
    Mflbx(){
        if(this.FlangeFlexureX() == "Compact"){
            return 0;
        }
        if(this.FlangeFlexureX() == "Non-Compact"){
            let M = this.Mpx() - (this.Mpx()-this.Fy*this.HSS.SX)*(3.57*this.HSS.B_T*Math.pow(this.Fy/this.E,0.5)-4);
            return Math.min(M,this.Mpx());
        }
        else{
           return this.Fy*this.Seffx()
        }
    }//Mflbx
    Mwlbx(){
        if(this.WebFlexureX() == "Compact"){
           return 0;
       }
       else{
        let M = this.Mpx() - (this.Mpx()-this.Fy*this.HSS.SX)*(0.305*this.HSS.H_T*Math.pow(this.Fy/this.E,0.5)-0.738);
        return Math.min(M,this.Mpx());
       }
    }//Mwlbx
    
    fMnx(){
        return ArrayMin(this.Mpx(),this.Mflbx(),this.Mwlbx())*this.phiF()/12
    }
    //---------------------------------------------------------
    //FLEXURE - Y
    //----------------------------------------------------------
    Mpy(){
        return this.Fy*this.HSS.ZY
    }
    beY(){
        if(this.FlangeFlexureY() == "Slender"){
            let b1 = 1.92*this.HSS.TDES*Math.pow(this.E/this.Fy,0.5)*(1-(0.38/this.HSS.H_T)*Math.pow(this.E/this.Fy,0.5));
            return Math.min(b1,this.HSS.HT)
        }
        else{
            return this.HSS.HT
        }
    }//be
    Ieffy(){
        if(this.FlangeFlexureY() == "Slender"){
            let h = this.HSS.HT - 3*this.HSS.TDES
            let h1 = h - this.beY()
            return this.HSS.IY - 2*(h1*Math.pow(this.HSS.TDES,3)/12 + h1*this.HSS.TDES*Math.pow(this.HSS.B/2-this.HSS.TDES/2,2))
        }
        else{
            this.HSS.IY
        }
    }
    Seffy(){
        return this.Ieffy()/(this.HSS.B/2)
    }
    Mflby(){
        if(this.FlangeFlexureY() == "Compact"){
            return 0;
        }
        if(this.FlangeFlexureY() == "Non-Compact"){
            let M = this.Mpy() - (this.Mpy()-this.Fy*this.HSS.SY)*(3.57*this.HSS.H_T*Math.pow(this.Fy/this.E)-4);
            return Math.min(M,this.Mpy());
        }
        else{
           return this.Fy*this.Seffy()
        }
    }//Mflby
    Mwlby(){
        if(this.WebFlexureY() == "Compact"){
           return 0;
       }
       else{
            let M = this.Mpy() - (this.Mpy()-this.Fy*this.HSS.SY)*(0.305*this.HSS.B_T*Math.pow(this.Fy/this.E)-0.738);
            return Math.min(M,this.Mpy());
       }
      
    }//Mwlby
    fMny(){
        return ArrayMin(this.Mpy(),this.Mflby(),this.Mwlby())*this.phiF()/12
    }
    flexureParams(){
        return{
            FlangeX : this.FlangeFlexureX(),
            WebX : this.WebFlexureX(),
            phiF : this.phiF(),
            Mpx : this.Mpx()/12,
            b_t : this.HSS.B_T,
            beX : this.beX(),
            IX : this.HSS.IX,
            SX : this.HSS.SX,
            ZX : this.HSS.ZX,
            Ieffx : this.Ieffx(),
            Seffx : this.Seffx(),
            Mflbx : this.Mflbx()/12,
            Mwlbx : this.Mwlbx()/12,
            FlangeY : this.FlangeFlexureY(),
            WebY : this.WebFlexureY(),
            Mpy : this.Mpx()/12,
            beY : this.beX(),
            IY : this.HSS.IY,
            SY : this.HSS.SY,
            ZY : this.HSS.ZY,
            Ieffy : this.Ieffy(),
            Seffy : this.Seffy(),
            Mflby : this.Mflbx()/12,
            Mwlby : this.Mwlbx()/12,
        }
    }
    //---------------------------------------------------------
    //AXIAL
    //----------------------------------------------------------
    //SLENDERNESS RATIO	
    SRx(){
        return this.Kx*this.Lx/this.HSS.RX
    }//SRx
      
    SRy(){
        return this.Ky*this.Ly/this.HSS.RY
    }//SRy
      
    SR(){
        return Math.max(this.SRx(),this.SRy())
    }//SR
    //FLEXURAL BUCKLING STRESS
	Fex(){
        return Math.pow(Math.PI,2)*this.E/Math.pow(this.SRx(),2)
    }//Fex
    Fey(){
        return Math.pow(Math.PI,2)*this.E/Math.pow(this.SRy(),2)
    }//Fey
    Fef(){
        return Math.min(this.Fex(),this.Fey());
    }//Fef
    Fet(){
        return ((Math.pow(Math.PI,2)*this.E*this.HSS.C)/Math.pow(this.Ky*this.Ly,2)+this.G*this.HSS.J)*1/(this.HSS.IX+this.HSS.IY);
    }//Fet
    Fe(){
        return Math.min(this.Fef(),this.Fet())
    }//Fef
    Qs(){
        return 1
    }//Qs
    be(){
        return Math.min(1.92*this.HSS.TDES*Math.pow(this.E/this.Fy,0.5)*(1-(0.38/this.HSS.B_T)*Math.pow(this.E/this.Fy,0.5)),this.HSS.B);
    }
    he(){
       return Math.min(1.92*this.HSS.TDES*Math.pow(this.E/this.Fy,0.5)*(1-(0.38/this.HSS.H_T)*Math.pow(this.E/this.Fy,0.5)),this.HSS.HT); 
    }
    Aeff(){
        let b = this.HSS.B - 3*this.HSS.TDES
        let h = this.HSS.HT - 3*this.HSS.TDES
        return this.HSS.A - 2*this.HSS.TDES*(b-this.be())-2*this.HSS.TDES*(h-this.he());
    }
    Qa(){
        if(Math.max(this.HSS.B_T,this.HSS.H_T) >= 1.4*Math.pow(this.E/this.Fy,0.5)){
			return Math.min(this.Aeff()/this.HSS.A,1)
		}
		else{
			return 1
		}
    }//Qa
    Q(){
        return this.Qs()*this.Qa()
    }//Qs
    Fcr(){
        if(this.SR() <= 4.71*Math.pow(this.E/(this.Q()*this.Fy),0.5)){
            return this.Q()*Math.pow(0.658,(this.Q()*this.Fy)/this.Fe())*this.Fy;
        }
        else{
            return 0.877*this.Fe()
        }
    }//Fcr
    fPn(){
        //return this.Fcr()
        return this.phiP()*this.Fcr()*this.HSS.A
      }//fPn

    axialParams(){
        return {
            Flange : this.FlangeCompressionX(),
            Web : this.FlangeCompressionY(),
            SRx : this.SRx(),
            SRy : this.SRy(),
            SR : this.SR(),
            Fex : this.Fex(),
            Fey : this.Fey(),
            Fef : this.Fef(),
            Fet : this.Fet(),
            Fe : this.Fe(),
            Qs : this.Qs(),
            be : this.be(),
            he : this.he(),
            Aeff : this.Aeff(),
            Qa : this.Qa(),
            Q : this.Q(),
            Fcr : this.Fcr()
        }
    }//AXIAL PARAMS
    //---------------------------------------------------------
    //SHEAR - Y
    //----------------------------------------------------------
    Cvy(){
		let kv = 5
 
    if(this.HSS.H_T <= 1.1*Math.pow(kv*this.E/this.Fy,0.5)){
			return 1;
		}
		else{
			if(this.HSS.H_T <= 1.37*Math.pow(kv*this.E/this.Fy,0.5)){
		 		return 1.1*Math.pow(kv*this.E/this.Fy,0.5)/this.HSS.H_T
			}
			else{
				return (1.51*this.E*kv)/(Math.pow(this.HSS.H_T,2)*this.Fy)
			}
		}	  
	}//Cv
										 	
	Aw(){
		return 2*(this.HSS.HT-3*this.HSS.TDES)*this.HSS.TDES
	}//Aw
	
	fVny(){
		return 0.6*this.Fy*this.Aw()*this.Cvy()*this.phiV()
	}//fVn
    //---------------------------------------------------------
    //SHEAR - X
    //----------------------------------------------------------
    Cvx(){
		let kv = 5
 
    if(this.HSS.B_T <= 1.1*Math.pow(kv*this.E/this.Fy,0.5)){
			return 1;
		}
		else{
			if(this.HSS.B_T <= 1.37*Math.pow(kv*this.E/this.Fy,0.5)){
		 		return 1.1*Math.pow(kv*this.E/this.Fy,0.5)/this.HSS.B_T;
			}
			else{
				return (1.51*this.E*kv)/(Math.pow(this.HSS.B_T,2)*this.Fy);
			}
		}	  
	}//Cv
										 	
	Af(){
		return 2*(this.HSS.B-3*this.HSS.TDES)*this.HSS.TDES;
	}//Aw
	
	fVnx(){
		return 0.6*this.Fy*this.Af()*this.Cvx()*this.phiV();
    }//fVn
    
    shearParams(){
        return{
            Cvx : this.Cvx(),
            Aw : this.Aw(),
            Cvy : this.Cvy(),
            Af : this.Af()
        }
    }
    
    //---------------------------------------------------------
    //TENSION
    //----------------------------------------------------------
    fTn(){
        return this.phiT()*this.Fy*this.HSS.A
    }

    tensionParams(){
        return{
            A : this.HSS.A,
            phiT : this.phiT(),
        }
    }
    //---------------------------------------------------------
    //TORSION
    //----------------------------------------------------------
    Fcrt(){
		if(this.HSS.H_T <= 2.45*Math.pow(this.E/this.Fy,0.5)){
			return 0.6*this.Fy;
		}
		if(this.HSS.H_T <= 3.07*Math.pow(this.E/this.Fy,0.5)){
			return 0.6*this.Fy*(2.45*Math.pow(this.E/this.Fy,0.5))/this.HSS.H_T
		}
		else{
			return 0.458*Math.pow(3.14,2)*this.E/Math.pow(this.HSS.H_T,2)
		}
	}//Fcrt
    fTrn(){
        return this.phiTr()*this.Fcrt()*this.HSS.C/12
    }

    torsionParams(){
        return {
            Fcrt : this.Fcrt(),
            C : this.HSS.C,
            phiTr : this.phiTr()
        }
    }



}//CLASS