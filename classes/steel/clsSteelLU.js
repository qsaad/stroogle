import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin,rtd,dtr,I1,I2,tan_inv,sin,cos} from '@/library/functions'

export default class SteelLU extends Steel {
    constructor({ method, Fy, section, Lu, Lx, Ly,Kx = 1, Ky = 1}) {
        super({ method, Fy })
        this.LU = section
        this.c = 1
        this.cb = 1
        this.Lu = Lu*12
        this.Lx = Lx*12
        this.Ly = Ly*12
        this.Kx = Kx
        this.Ky = Ky
        this.toe = "Compression"
        this.orientation = "LLV"
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
    bw(){
        switch(true){
            case (_.startsWith(this.LU.Shape, 'L8X6')):
                return 3.31
                break
            case (_.startsWith(this.LU.Shape, 'L8X4')):
                return 5.48
                break
            case (_.startsWith(this.LU.Shape, 'L7X4')):
                return 4.37
                break
            case (_.startsWith(this.LU.Shape, 'L6X4')):
                return 3.14
                break
            case (_.startsWith(this.LU.Shape, 'L6X3-1/2')):
                return 3.69
                break
            case (_.startsWith(this.LU.Shape, 'L5X3-1/2')):
                return 2.4
                break
            case (_.startsWith(this.LU.Shape, 'L5X3')):
                return 2.99
                break
            case (_.startsWith(this.LU.Shape, 'L4X3-1/2')):
                return 0.87
                break
            case (_.startsWith(this.LU.Shape, 'L4X3')):
                return 1.65
                break
            case (_.startsWith(this.LU.Shape, 'L3-1/2X3')):
                return 0.87
                break
            case (_.startsWith(this.LU.Shape, 'L3-1/2X2-1/2')):
                return 1.62
                break
            case (_.startsWith(this.LU.Shape, 'L3X2-1/2')):
                return 0.86
                break
            case (_.startsWith(this.LU.Shape, 'L3X2')):
                return 1.56
                break
            case (_.startsWith(this.LU.Shape, 'L2-1/2X2')):
                return 0.85
                break
        }

    }//bw

    // bwx(){
    //     return this.orientation = "LLV" ? -this.bw() : this.bw()
    // }
    // bwy(){
    //     return this.orientation = "LLV" ? -this.bw() : this.bw()
    // }

    //-----------------------------------------------------------
    //PRINCIPAL AXIS PROPERTIES
    //-----------------------------------------------------------
    alpha(){
        return tan_inv(this.LU.tan_alpha)
    }
    sin_alpha(){
        return sin(this.alpha())
    }
    cos_alpha(){
        return cos(this.alpha())
    }
    IZ(){
        return Math.pow(this.LU.RZ,2)*this.LU.A
    }
    Zb(){
        return this.LU.X/this.cos_alpha()
    }
    Zt1(){
        return (this.LU.LL-this.LU.Y)*this.sin_alpha() - this.LU.X*this.cos_alpha()
    }
    Zt2(){
        return this.LU.Y/this.sin_alpha() - this.LU.Y*this.sin_alpha()
    }
    SZ(){
        return this.LU.SX
    }
    IXY(){
        let X1 = -this.LU.X + this.LU.T/2
        let Y1 = this.LU.LL/2
        let A1 = this.LU.LL*this.LU.T
        let X2 = (this.LU.SL - this.LU.T)/2 + this.LU.T - this.LU.X
        let Y2 = -this.LU.Y + this.LU.T/2
        let A2 = (this.LU.SL-this.LU.T)*this.LU.T
        return X1*Y1*A1 + X2*Y2*A2
    }
    IW(){
        return I1(this.alpha(),this.LU.IX,this.LU.IY,this.IXY())
    }
    IZ1(){
        return I2(this.alpha(),this.LU.IX,this.LU.IY,this.IXY())
    }
    SW(){
        return this.LU.SY
    }
    //-------------------------------------------------
    //COMPACTNESS
    //-------------------------------------------------
    FlexureCompactness(){
        return this.LU.LL/this.LU.T < 0.54*Math.pow(this.E/this.Fy,0.5) ? "Compact": (this.LU.LL/this.LU.T <= 0.91*Math.pow(this.E/this.Fy,0.5) ? "Non-Compact": "Slender") ;
      }//FlangeFlexure

    CompressionCompactness(){
        return this.LU.LL/this.LU.T < 0.45*Math.pow(this.E/this.Fy,0.5) ? "Compact": (this.LU.LL/this.LU.T <= 0.91*Math.pow(this.E/this.Fy,0.5) ? "Non-Compact": "Slender") ;
      }//FlangeCompression

    //-----------------------------------------------------------
    //FLEXURE 
    //-----------------------------------------------------------
    Myx(){
        return 0.8*this.Fy*this.LU.ZX
    }
    Myy(){
        return 0.8*this.Fy*this.LU.ZY
    }
    Mnyx(){
        return 1.5*this.Myx()
    }
    Mnyy(){
        return 1.5*this.Myy()
    }
    Fcr(){
        if(this.FlexureCompactness() =="Slender"){
            return (0.71*this.E)/Math.pow(this.LU.LL/this.LU.T,2)
        }
        else{
            return 0
        }
    }//Fcr
    Mllbx(){
        let Sc = 0.8*this.LU.SX
        if(this.FlexureCompactness() =="Compact"){
            return 0;
        }
        if(this.FlexureCompactness() =="Non-Compact"){
            return this.Fy*Sc*(2.43-1.72*(this.LU.LL/this.LU.T)*Math.pow(this.Fy/this.E,0.5))
        }
        else{
            return this.Fcrz()*Sc
        }
    }//Mllbx

    Mllby(){
        let Sc = 0.8*this.LU.SY
        if(this.FlexureCompactness() =="Compact"){
            return 0;
        }
        if(this.FlexureCompactness() =="Non-Compact"){
            return this.Fy*Sc*(2.43-1.72*(this.LU.LL/this.LU.T)*Math.pow(this.Fy/this.E,0.5))
        }
        else{
            return this.Fcrz()*Sc
        }
    }//Mllby

    Me(){
        if(this.LU.LL == this.LU.SL){
            return 0.46*this.E*Math.pow(this.LU.LL,2)*Math.pow(this.LU.T,2)*this.cb/this.Lu

        }
        else{
            let b = (this.orientation == "LLV") ? -this.bw() : this.bw()

            let m1 = 4.9*this.E*this.IZ()*this.cb/Math.pow(this.Lu,2)
            let m2 = Math.pow(Math.pow(b,2)+0.052*Math.pow(this.Lu*this.LU.T/this.LU.RZ,2),0.5)

            return m1*(m2+b)
        }
    }//Me
    Mltbx(){
        if(this.Me() <= this.Mnyx()){
            return (0.92-0.17*this.Me()/this.Mnyx())*this.Me()
        }
        else{
            return Math.min((0.92-1.17*Math.pow(this.Me()/this.Mnyx(),0.5))*this.Me(),1.5*this.Mnyx())
        }
    }//Mltbx
    Mltby(){
        if(this.Me() <= this.Mnyy()){
            return (0.92-0.17*this.Me()/this.Mnyy())*this.Me()
        }
        else{
            return Math.min((0.92-1.17*Math.pow(this.Me()/this.Mnyy(),0.5))*this.Me(),1.5*this.Mnyy())
        }
    }//Mltby
   
    fMnx(){
        return ArrayMin(this.Mnyx(),this.Mltbx(),this.Mllbx())*this.phiF()/12
    }//fMnx
    fMny(){
        return ArrayMin(this.Mnyy(),this.Mltby(),this.Mllby())*this.phiF()/12
    }//fMny
    flexureParams(){
		return{
            Leg : this.FlexureCompactness(),
            bw : this.bw(),
            tan_alpha : this.LU.tan_alpha,
            alpha : this.alpha(),
            Fcr : this.Fcr(),
            Me : this.Me()/12,
            Mnyx : this.Mnyx()/12,
            Mltbx : this.Mltbx()/12,
            Mllbx : this.Mllbx()/12,
            Mnyy : this.Mnyy()/12,
            Mltby : this.Mltby()/12,
            Mllby : this.Mllby()/12,
            phiF : this.phiF()
		}
	}//FLEXURAL PARAMS
    //-----------------------------------------------------------
    //AXIAL
    //-----------------------------------------------------------
    //SLENDERNESS RATIO	
    SRx(){
        return this.Kx*this.Lx/this.LU.RZ
        // if(this.Kx*this.Lx/this.LU.RX <= 80){
        //     return 72 + 0.75*this.Kx*this.Lx/this.LU.RX
        // }
        // else{
        //     return Math.max(32 + 1.25*this.Kx*this.Lx/this.LU.RX,200)
        // }
    }//SRx
      
    SRy(){
        return this.Ky*this.Ly/this.LU.RZ
        // if(this.Ky*this.Ly/this.LU.RY <= 80){
        //     return 72 + 0.75*this.Ky*this.Ly/this.LU.RY
        // }
        // else{
        //     return Math.max(32 + 1.25*this.Ky*this.Ly/this.LU.RY,200)
        // }
    }//SRy
      
    SR(){
        return Math.max(this.SRx(),this.SRy());
    }//SR

    Q(){
        //Qa = 1
        return this.LU.QS
    }

    Fe(){
        return Math.pow(Math.PI,2)*this.E/Math.pow(this.SR(),2)
    }//Fe

    Fcra(){
        if(this.SR() <= 4.71*Math.pow(this.E/(this.Q()*this.Fy),0.5)){
          return this.Q()*Math.pow(0.658,(this.Q()*this.Fy)/this.Fe())*this.Fy
        }
        else{
          return 0.877*this.Fe();
        }
      }//Fcra
  
      fPn(){
        return this.phiP()*this.Fcra()*this.LU.A
      }//fPn
    axialParams(){
		return {
            Leg : this.CompressionCompactness(),
            RZ : this.LU.RZ,
            Q : this.Q(),
            SRx : this.SRx(),
            SRy : this.SRy(),
            SR : this.SR(),
            Fe : this.Fe(),
            Fcra : this.Fcra(),
            phiP : this.phiP()
		}
	}//AXIAL PARAMS
    //-----------------------------------------------------------
    //SHEAR - X
    //-----------------------------------------------------------
    Ax(){
        return this.LU.SL*this.LU.T
    }
    Cvx(){
        return 1
    }
    fVnx(){
        return 0.6*this.Fy*this.Ax()*this.Cvx()
    }
    //-----------------------------------------------------------
    //SHEAR - Y
    //-----------------------------------------------------------
    Ay(){
        return this.LU.LL*this.LU.T
    }
    Cvy(){
        return 1
    }
    fVny(){
        return 0.6*this.Fy*this.Ay()*this.Cvy()
    }
    shearParams(){
		return{
            Ax : this.Ax(),
            Cvx : this.Cvx(),
            Ay : this.Ay(),
            Cvy : this.Cvy(),
			phiV : this.phiV(),
		}
	}//SHEAR PARAMS

    //-----------------------------------------------------------
    //TENSION
    //-----------------------------------------------------------
    fTn(){
        return this.phiT()*this.Fy*this.LU.A
    }
    tensionParams(){
		return{
			A : this.LU.A,
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
			J : this.LU.J,
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