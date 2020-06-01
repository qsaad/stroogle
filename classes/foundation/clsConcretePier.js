import {rebar} from '@/data/CON_Rebar'
import Concrete from '@/classes/concrete/clsConcrete'
import _ from 'lodash'

export default class ConcretePier extends Concrete {
  constructor({ b=12 , h=12 , rebarQty=4 , rebarSize="#5" , fc=30000, Fy=60 , cov=1.5, stirrupSpa=12, stirrupSize ="#3"}) {
      super({b , h , rebarQty , rebarSize , fc, Fy , cov})
      this.stirrupSize = stirrupSize
      this.stirrupSpa = stirrupSpa
    
    } // CONSTRUCTOR

    // Asmin(){
    //   return (0.05/100)*this.b*this.h
    // }//AREA OF MINIMUM REINFORCING REQUIRED

    // totalReinforcing(){
    //     return rebar(this.rebarSize).A * this.rebarQty
    // }//AREA OF TOTAL REINFORCING PROVIDED

    Ast(){
        return rebar(this.rebarSize).A * this.rebarQty
        //return rebar(this.rebarSize).A * this.rebarQty/4 + 1
    }//AREA OF TENSILE REINFORCING

    Asv(){
        return rebar(this.stirrupSize).A * 2
    }

    Ag(){
        return this.b * this.h
    }// GROSS AREA OF PIER

    db(){
        return rebar(this.rebarSize).d   
    }//DIAMETER OF REBAR

    ds(){
        return rebar(this.stirrupSize).d   
    }//DIAMETER OF STIRRUP

    d(){
      return this.h - this.cov- this.ds()- this.db()/2  
    }//EFFECTIVE DEPTH

    axialCapacity(){
        return this.fPn1({Ast: this.Ast(), Ag: this.Ag()})
    }

    flexureCapacity(){
        return this.fMn1({b: this.b, d: this.d(), Ast: this.Ast(), fc: this.fc})
    }

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
        return this.clearRebarSpacing({b: this.b,cov:this.cov,db:this.db(),ds:this.ds(),rebarQty:this.rebarQty})
    }// CLEAR SPACING BETWEEN REBAR

    AsminFlexure(){
        return this.Asmin({b:this.b,d:this.d(),fc:this.fc,Fy:this.Fy})
    }

    
  } //CLASS