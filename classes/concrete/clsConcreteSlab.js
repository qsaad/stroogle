import {rebar} from '@/data/CON_Rebar'
import Concrete from '@/classes/concrete/clsConcrete'

export default class ConcreteSlab extends Concrete {
    constructor({ b, h, rebarQty, rebarSize, fc, Fy, cov, rebarSpa}) {
      super({ b, h, rebarQty, rebarSize, fc, Fy, cov, rebarSpa})
    } // CONSTRUCTOR

    
    d(){
        return this.h - this.cov - rebar(this.rebarSize).d/2
    }//d

    Ast(){
      return rebar(this.rebarSize).A * (12 / this.rebarSpa)
    }//AREA OF TENSILE REINFORCING

    Asmin(){
      return 0.0018*this.b*this.h
    }

    shearCapacity(){
        return this.phi_v * this.Vc({b: this.b, d: this.d(), fc: this.fc})
    }
  
    flexuralCapacity() {
      return this.fMn1({b: this.b, d: this.d(), Ast: this.Ast(), fc: this.fc})
    } // FLEXURAL CAPACITY
  } //CLASS