import {rebar} from '@/data/CON_Rebar'
//import multi from '@/classes/clsMultipleExtends'
//import mixin from 'mixin'
import {aggregation} from '@/library/multiClassInheritance'
import Concrete from '@/classes/concrete/clsConcrete'
import BasePressure from '@/classes/analysis/clsBasePressure'

//export default class SquareFooting extends multi.inherit(Concrete, BasePressure){
//export default class SquareFooting extends mixin(Concrete, BasePressure) {
//export default class SquareFooting extends (Concrete, BasePressure) {
export default class SquareFooting extends aggregation(Concrete, BasePressure) {
  constructor({ b , h , rebarQty , rebarSize , fc, Fy , cov, rebarSpa, C, L, B, H, P, M, V}) {
  //constructor({ b , h , rebarQty , rebarSize , fc, Fy , cov, rebarSpa, C, P = 0, M = 0 }, BasePressure) {
      super({ b , h , rebarQty , rebarSize , fc, Fy , cov, rebarSpa, L, B,H, P, M, V })
      //super({ b , h , rebarQty , rebarSize , fc, Fy , cov, rebarSpa })
      //this.L = b/12
      this.C = C //COLUMN SIZE
      //this.BP = BasePressure //INJECTED INSTANCE OF BASE PRESSURE CLASS
      //this.P = P
      //this.M = M

    } // CONSTRUCTOR

    d(){
      return this.h - this.cov - rebar(this.rebarSize).d/2
    }//d

    Ast(){
      return rebar(this.rebarSize).A * this.rebarQty
    }//AREA OF TENSILE REINFORCING

    Asmin(){
      return 0.0018*this.b*this.h
    }

    flexureCapacity() {
      return this.fMn1({b: this.b, d: this.d(), Ast: this.Ast(), fc: this.fc})
    } // FLEXURAL CAPACITY

    onewayShearCapacity(){
      return this.phi_v * this.Vc({b: this.b, d: this.d(), fc: this.fc})
    }

    punchingShearCapacity(){
      return this.fVnp1({C: this.C,d: this.d(),fc: this.fc})
    }

    Lda(){
      return (this.b-this.C)/2 - this.cov
    }

    Ld(){

    }

    hookedDevelopmentLength(){
      return this.Ldh({fc:this.fc, rebarSize:this.rebarSize, cov:1.5})
    }

    qmax(){
      return 1
      //return this.BP.qmax()
    }

    qmin(){
      return 1
      //return this.BP.qmin()
    }

    Xf(){
      return 1
			//return this.L/2 - this.C/24
		}
		
		Xv(){
      return 1
			//return this.L/2-this.C/24-this.d()/12
		}
		
		Ma(){
      return 1
			// let x = this.Xf()
			// let S = (this.qmax()-this.qmin())/this.L
			// let qx = this.qmax()-S*x;
			// return ((2*this.qmax()+qx)*x*x/6)
    }
    
		
		V1a(){
      return 1
			// let x = this.Xv()
			// let S = (this.qmax()-this.qmin())/this.L
			// let qx = this.qmax()-S*x;
			// return ((this.qmax()+qx)*x/2)
    }
    
    Vpa(){
      return 1
    }
  } //CLASS