import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class SteelLLBB extends Steel {
    constructor({ method, Fy, section, Lu, Lx, Ly,Kx = 1, Ky = 1}) {
        super({ method, Fy })
        this.LLBB = section
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
    
    //-----------------------------------------------------------
    //FLEXURE
    //-----------------------------------------------------------
    fMnx(){
        return 1
    }
    fMny(){
        return 1
    }
    flexureParams(){
		return{
			
		}
	}//FLEXURAL PARAMS
    //-----------------------------------------------------------
    //AXIAL
    //-----------------------------------------------------------
    fPn(){
        return 1
    }
    axialParams(){
		return {
			
		}
	}//AXIAL PARAMS
    //-----------------------------------------------------------
    //SHEAR - X
    //-----------------------------------------------------------
    fVnx(){
        return 1
    }
    //-----------------------------------------------------------
    //SHEAR - Y
    //-----------------------------------------------------------
    fVny(){
        return 1
    }
    shearParams(){
		return{
			A : this.LLBB.A,
			phiV : this.phiV(),
		}
	}//SHEAR PARAMS

    //-----------------------------------------------------------
    //TENSION
    //-----------------------------------------------------------
    fTn(){
        return 1
    }
    tensionParams(){
		return{
			A : this.LLBB.A,
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
			J : this.LLBB.J,
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