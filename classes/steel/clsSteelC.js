import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class SteelC extends Steel {
    constructor({ method, Fy, section, Lu, Lx, Ly,Kx = 1, Ky = 1, Cb = 1}) {
        super({ method, Fy })
        this.CH = section
        this.Cb = Cb
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
   
    k(){
        return  Math.pow(this.E/this.Fy,0.5)
    }

    BF_2TF(){
        return this.CH.BF/this.CH.TF
    }

    H_TW(){
        return this.CH.D/this.CH.TW
    }

    RTS(){
        return Math.pow(Math.pow(this.CH.IY*this.CH.CW,0.5)/this.CH.SX,0.5)
        //return this.CH.BF/Math.pow(12*(1 + (this.CH.D*this.CH.TW)/(6*this.CH.BF*this.CH.TF)),0.5)
    }

    HO(){
        return this.CH.D - this.CH.TF
    }

    c(){
        return (this.HO()/2)*Math.pow(this.CH.IY/this.CH.CW,0.5)
    }

	FlangeFlexure(){
		return this.BF_2TF() < 0.38*this.k() ? "Compact": (this.BF_2TF() < 1*this.k() ? "Non-Compact": "Slender") ;
	}//FlangeFlexure
	
	WebFlexure(){
		return this.H_TW() < 3.76*this.k() ? "Compact": (this.H_TW() < 5.7*this.k() ? "Non-Compact": "Slender") ;
	}//WwebFlexure
	
	FlangeCompression(){
		return this.BF_2TF() < 0.56*this.k() ? "Compact": "Slender" ;
	}//FlangeCompression
	
	WebCompression(){
		return this.BF_2TF() < 1.49*this.k() ? "Compact": "Slender" ;
    }//WebCompression
    
    //LIMIT BRACE LENGTHS
	Lp(){
		return 1.76*this.CH.RY*Math.pow(this.E/this.Fy,0.5);
	}//Lp
	
	Lr(){
		let v1 = 1.95*this.RTS()*this.E/(0.7*this.Fy);
		let v2 = Math.pow((this.CH.J*this.c())/(this.CH.SX*this.HO()),0.5);
		let v3 = 6.76*Math.pow((0.7*this.Fy*this.CH.SX*this.HO())/(this.E*this.CH.J*this.c()),2);
		return v1*v2*Math.pow(1+Math.pow(1+v3,0.5),0.5);
	}//Lr
	
	bracedLength(){
        if(this.Lu < this.Lp()){
            return "Lb < Lp";
        }
        if(this.Lu < this.Lr()){
            return "Lp < Lb < Lr";
        }
        else{
            return "Lb > Lr";
        }
	}//bracedLength

    //---------------------------------------------------------
    //FLEXURE - X
    //----------------------------------------------------------
    lf(){
		return this.BF_2TF()
	}//lpf
	
	lpf(){
		return 0.38*Math.pow(this.E/this.Fy,0.5);
	}//lpf
	
	lrf(){
		return Math.pow(this.E/this.Fy,0.5);
	}//lpf
	
    //YIELD
	Mpx(){
		return this.Fy*this.CH.ZX
	}//Mpx
	
//Determine Fcr (F2-4)
	Fcr(){
		var v1 = (this.Cb*Math.pow(Math.PI,2)*this.E)/Math.pow(this.Lu/this.RTS(),2);
		var v2 = 0.078*(this.CH.J*this.c())/(this.CH.SX*this.HO())*Math.pow(this.Lu/this.RTS(),2);
		return v1*Math.pow(1+v2,0.5);
	}//Fcr
	
//Determine Lateral Torsional Buckling Strength (F2-2 & F2-3)
	Mltb(){
		
		if(this.Lu <= this.Lp()){
			return 0;
		}
		else if(this.Lu < this.Lr()){
			var v1 = this.Cb*(this.Mpx()-(this.Mpx()-0.7*this.Fy*this.CH.SX)*((this.Lu-this.Lp())/(this.Lr()-this.Lp())));
			return Math.min(v1,this.Mpx());
		}
		else{
			return Math.min(this.Fcr()*this.CH.SX,this.Mpx());
		}
	}//Mltb
	
	//Determine Compression Flange Local Buckling (F3-1 & F3-2)

	Mflb(){
    if(this.FlangeFlexure()=="Compact"){
        return 0;
    }
    if(this.FlangeFlexure()=="Non-Compact"){
        
        return (this.Mpx()-(this.Mpx()-0.7*this.Fy*this.CH.SX())*((this.BF_2TF()-this.lpf())/(this.lrf()-this.lpf())));
    }
    else{
        let k = 4/Math.pow(this.H_TW(),0.5);
        let kc = 0;
        if(k < 0.35){
            kc = 0.35;
        }
        if(k > 0.76){
            kc = 0.76;
        }
        else{
            kc = k;
        }
        return ((0.9*this.E*kc*this.CH.SX)/Math.pow(this.BF_2TF(),2));
    }
	}//Mflb
	
	fMnx(){
		return this.phiF()*ArrayMin(this.Mpx(),this.Mltb(),this.Mflb())/12;
	}//fMnx
    
    //---------------------------------------------------------
    //FLEXURE - Y
    //----------------------------------------------------------
	
	Mpy(){
		return Math.min(this.Fy*this.CH.ZY,1.6*this.Fy*this.CH.SY)
	}//Mpy
	
	//Determine Fcr (F6-4)
	Fcry(){
		return (0.69*this.E)/Math.pow(this.BF_2TF(),2)
	}//Fcry

 	Mflby(){
		if(this.FlangeFlexure()=="Compact"){
  		return 0;
  	}
  	if(this.FlangeFlexure()=="Non-Compact"){
  		return (this.Mpy()-(this.Mpy()-0.7*this.Fy*this.CH.SY)*((this.lf()-this.lpf())/(this.lrf()-this.lpf())));
  	}
  	else{
  		return this.Fcry()*this.CH.SY
  	}
	}//Mflby

    fMny(){
		return this.phiF()*ArrayMin(this.Mpy(),this.Mflby())/12;
    }//fMny

    flexureParams(){
        return{
            Web : this.FlangeFlexure(),
            Flange : this.WebFlexure(),
            Lp : this.Lp()/12,
            Lr : this.Lr()/12,
            bracing : this.bracedLength(),
            rts : this.RTS(),
            c : this.c(),
            Cb : this.Cb,
            ZX : this.CH.ZX,
            SX : this.CH.SX,
            J : this.CH.J,
            HO : this.HO(),
            Mpx : this.Mpx()/12,
            Fcr : this.Fcr(),
            Mltb : this.Mltb()/12,
            Mflb : this.Mflb()/12,
            Mpy : this.Mpx()/12,
            Fcry : this.Fcry(),
            Mflby : this.Mflby()/12,
        }
    }//FLEXURAL PARAMS
    
   //---------------------------------------------------------
    //AXIAL
    //----------------------------------------------------------
    //SLENDERNESS RATIO	
    SRx(){
        return this.Kx*this.Lx/this.CH.RX
    }//SRx

    SRy(){
        return this.Ky*this.Ly/this.CH.RY
    }//SRy

    SR(){
        return Math.max(this.SRx(),this.SRy())
    }//SR

    //FLEXURAL BUCKLING STRESS
    Fef(){
        return Math.pow(Math.PI,2)*this.E/Math.pow(this.SR(),2)
    }//Fef

    //FLEXURAL-TORSIONAL AND BUCKLING STRESS
    Fey(){
        return Math.pow(Math.PI,2)*this.E/Math.pow(this.SRy(),2)
    }//Fey

    Fez(){
        return ((Math.pow(Math.PI,2)*this.E*this.CH.CW)/(Math.pow(this.Ky*this.Ly,2))+this.G*this.CH.J)*(1/(this.CH.A*this.CH.RO*this.CH.RO))
    }//Fez

    Fet(){
        return (this.Fey()+this.Fez())/(2*this.CH.H)*(1-Math.pow(1-(4*this.Fey()*this.Fez()*this.CH.H)/(Math.pow(this.Fey()+this.Fez(),2)),0.5))
    }//Fet

    Fe(){
        return Math.min(this.Fef(),this.Fet())
    }//Fe

    //UNSTIFFENED ELEMENT REDUCTION FACTOR
    Qs(){
        if(this.BF_2TF()<=0.56*Math.pow(this.E/this.Fy,0.5)){
            return 1;
        }
        else if(this.BF_2TF()<1.03*Math.pow(this.E/this.Fy,0.5)){
            return 1.415-0.74*(this.BF_2TF())*Math.pow(this.Fy/this.E,0.5)
        }
        else{
            return (0.69*this.E)/(this.Fy*Math.pow(this.BF_2TF(),2)) 
        }
    }//Qs

    //STIFFENED ELEMENT REDUCTION FACTOR
    Qa(){
        let f;
        if(this.SR() <= 4.71*Math.pow(this.E/this.Fy,0.5)){
            f = Math.pow(0.658,this.Fy/this.Fe())*this.Fy
        }
        else{
            f = 0.877*this.Fe()
        }
        
        if(this.H_TW()>=1.49*Math.pow(this.E/f,0.5)){
            var be = 1.92*this.CH.TW*Math.pow(this.E/f)*(1-0.34/this.BF_2TF()*Math.pow(this.E/f,0.5))
            var Aeff = be*this.CH.TW+2*bf*this.CH.TF
            return Aeff/A
        }
        else{
            return 1; 
        }
    }//Qa

    Q(){
        return this.Qs()*this.Qa()
    }//Q

    Fcra(){
        if(this.SR() <= 4.71*Math.pow(this.E/(this.Q()*this.Fy),0.5)){
            return this.Q()*Math.pow(0.658,(this.Q()*this.Fy)/this.Fe())*this.Fy;
        }
        else{
            return 0.877*this.Fe()
        }
    }//Fcra

    fPn(){
        return this.phiP()*this.Fcra()*this.CH.A
    }//fPn

    axialParams(){
        return {
            Flange : this.FlangeCompression(),
            Web : this.WebCompression(),
            SRx : this.SRx(),
            SRy : this.SRy(),
            SR : this.SR(),
            Fef : this.Fef(),
            Fey : this.Fey(),
            Fez : this.Fez(),
            Fet : this.Fet(),
            Fe : this.Fe(),
            Qs : this.Qs(),
            Qa : this.Qa(),
            Q : this.Q(),
            Fcra : this.Fcra()
        }
    }//AXIAL PARAMS

    //---------------------------------------------------------
    //SHEAR - X
    //----------------------------------------------------------

	Af(){
		return 2*this.CH.BF*this.CH.TF
	}
	
	Cvx(){
        return 1
	}//Cv
	
	fVnx(){
		return this.phiV()*this.Fy*this.Af()*this.Cvx();
    }

    //---------------------------------------------------------
    //SHEAR - Y
    //----------------------------------------------------------

	Aw(){
		return this.CH.D*this.CH.TW
	}
	
	Cvy(){
		if(this.H_TW()<=2.24*Math.pow(this.E/this.Fy,0.5)){
			return 1;
		}
		else{
			var kv = (this.H_TW()<260) ? 5: 1.2;
			
			if(this.H_TW()<=1.1*Math.pow(kv*this.E/this.Fy,0.5)){
				return 1;
			}
			if(this.H_TW()<=1.37*Math.pow(kv*this.E/this.Fy,0.5)){
				return 1.1*Math.pow(kv*this.E/this.Fy,0.5)/this.H_TW();
			}
			else{
				return (1.51*this.E*kv)/(Math.pow(this.H_TW(),2)*this.Fy);
			}
		}
	}//Cv
	
	fVny(){
		return this.phiV()*this.Fy*this.Aw()*this.Cvy();
    }

    shearParams(){
        return{
            Cvx : this.Cvx(),
            Aw : this.Aw(),
            Cvy : this.Cvy(),
            Af : this.Af()
        }
    }//SHEAR PARAMS
    
    //---------------------------------------------------------
    //TENSION
    //----------------------------------------------------------
    fTn(){
        return this.phiT()*this.Fy*this.CH.A
    }
    tensionParams(){
        return{
            A : this.CH.A,
            phiT : this.phiT(),
        }
    }//TENSION PARAMS

    //---------------------------------------------------------
    //TORSION
    //----------------------------------------------------------
    fTrn(){
        return 1
    }

    torsionParams(){
        return {
            CW : this.CH.CW,
            phiTr : this.phiTr()
        }
    }//TORSION PARAMS
   


}//CLASS