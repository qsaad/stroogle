import {rebar} from '@/data/CON_Rebar'
import Concrete from '@/classes/concrete/clsConcrete'

export default class ConcreteBeam extends Concrete {
    constructor({ b=12 , h=12 , rebarQty=2 , rebarSize="#5" , fc=3000, Fy=60 , cov,  stirrupSize="#3", stirrupSpa=12,stirrupLegs = 2}) {
      super({ b , h , rebarQty , rebarSize , fc, Fy , cov })
      this.stirrupSize = stirrupSize
      this.stirrupSpa = stirrupSpa
      this.stirrupLegs = stirrupLegs
    } // CONSTRUCTOR

    db(){
      return rebar(this.rebarSize).d   
    }//DIAMETER OF REBAR

    ds(){
      return rebar(this.stirrupSize).d   
    }//DIAMETER OF STIRRUP

    d(){
      return this.h - this.cov- this.ds()- this.db()/2  
    }//EFFECTIVE DEPTH

    Ast(){
      return rebar(this.rebarSize).A * this.rebarQty
    }//AREA OF TENSILE REINFORCING

    Asv(){
      return rebar(this.stirrupSize).A * this.stirrupLegs
    }//AREA OF SHEAR REINFORCING

    // Asmin(){
    //   let k1 = 3*Math.pow(this.fc,0.5)/(this.Fy*1000)
    //   let k2 = 200/(this.Fy*1000)
    //   return Math.min(k1,k2)*this.b*this.d()
    // }//AREA OF MINIMUM FLEXURE REINFORCING

  
    flexuralCapacity() {
      return this.fMn1({b: this.b, d: this.d(), Ast: this.Ast(), fc: this.fc})
    } // FLEXURAL CAPACITY

    shearCapacity(){
      return this.fVn1({b: this.b, d: this.d(), fc: this.fc, Asv: this.Asv(), S: this.stirrupSpa})
    }

    developmentLength(){
      let noRebar = this.rebarQty
      let clrCov = this.cov + this.ds()+ this.db()/2
      let clrSpa=  this.clearRebarSpacing({b: this.b,cov: this.cov,db: this.db(),ds: this.ds(),rebarQty: noRebar})
      return this.Ld({fc:this.fc,rebarSize: this.rebarSize, cov: Math.min(clrSpa, clrCov)})
    }

    hookedDevelopmentLength(){
      return this.Ldh({fc:this.fc, rebarSize:this.rebarSize, cov:this.cov})
    }

    clearSpacing(){
      return this.clearRebarSpacing({b: this.b,cov: this.cov, db: this.db(),ds: this.ds(),rebarQty: this.rebarQty})
    }

    AsminFlexure(){
      return this.Asmin({b:this.b,d:this.d(),fc:this.fc,Fy:this.Fy})
    }

  } //CLASS