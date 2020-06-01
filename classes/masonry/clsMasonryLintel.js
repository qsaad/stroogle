import {rebar} from '@/data/CON_Rebar'
import MasonryWall from '@/classes/masonry/clsMasonryWall' 

export default class MasonryLintel extends MasonryWall {
    constructor({ fm, Fy,thickness, h , rebarSize,  rebarSpa, rebarLoc, rebarQty = 2, shearReinf = false, stirrupSize = "#3", stirrupSpa = 12, stirrupGrade = 40, Lbrg = 8 }) {
      super({fm, Fy, thickness, h, rebarSize, rebarSpa, rebarLoc})
        this.b = this.t
        this.A = this.b * this.h
        this.Ig = this.b * Math.pow(this.h,3)/12
        this.Sm = this.b * Math.pow(this.h,2)/6
        this.rebarQty = rebarQty
        this.shearReinf = shearReinf
        this.stirrupSize = stirrupSize
        this.stirrupSpa = stirrupSpa
        this.Fyv = stirrupGrade
        this.Lbrg = Lbrg
        this.wt = this.thickness * 10.5 * this.h/12

        this.FST = this.h
        
    } // CONSTRUCTOR

    Asmin(){
      return 0.0018*this.b*this.h
    }

    dbv(){
        return rebar(this.stirrupSize).d
    }//db

    Asv(){
        return this.rebarQty == 1 ? rebar(this.stirrupSize).A : 2*rebar(this.stirrupSize).A
    }//Ab

    //TOTAL AREA OF TENSILE STEEL
    Ast(){
        return rebar(this.rebarSize).A * this.rebarQty
    }//Ast

    //EFFECTIVE DEPTH
    d(){
        if(this.shearReinf){
            return this.h - this.tf - 0.5 - this.dbv() -rebar(this.rebarSize).d/2
        }
        else{
            return this.h - this.tf - 0.5 - rebar(this.rebarSize).d/2
        }
    }//d

    //CRACKED MOMENT
    Mcr(){
        return (this.Fr()*this.Ig)/(12*this.h/2)
    }//Mcr

    //CRACKED MOMENT OF INERTIA
    Icr(){
        return this.b*Math.pow(this.kd(),3)/3 + this.n*this.Ast()*Math.pow(this.d()-this.kd(),2)
    }

    //SECTION PROPERY PARAMETERS
    propsParams(){
      return{
          db : this.db(),
          Ab : this.Ab(),
          b : this.t,
          d : this.d(),
          tf : this.tf,
          Em : this.Em,
          n : this.n,
          A : this.A,
          Ig : this.Ig,
          S : this.S,
          Icr : this.Icr(),
          Mcr : this.Mcr(),
          wt : this.wt 
      }
    }//PROPSPARAMS

    flexureParams(){
        return {
            b : this.b,
            d : this.d(),
            rho : this.rho(),
            rho_b : this.rho_b(),
            k : this.k(),
            j : this.j(),
            kd : this.kd(),
            n : this.n,
            Fs : this.Fs(),
            fs1 : this.fs1(),
            Fb : this.Fb(),
            Mm : this.Mm(),
            Ms : this.Ms(),
        }
    }//FLEXURE PARAMS

    //------------------------------------------------
    //SHEAR
    //------------------------------------------------
    //ALLOWABLE SHEAR STRESS
    Fv(){
        return this.shearReinf ? Math.min(3*Math.pow(this.fm,0.5),150) : Math.min(Math.pow(this.fm,0.5),50)
    }//Fv
    //ALLOWABLE STIRRUP YIELD STRESS
    Fsv(){
        if(this.Fyv == 60){
            return 32000
        }
        else{
            return 20000
        }
    }//Fsv
    //SHEAR CAPACITY
    fVn(){
        if(this.shearReinf){
            return this.Fsv()*this.Asv()*this.d()/this.stirrupSpa
        }
        else{
            return this.Fv()*this.b*this.d()
        }
    }
    //SHEAR PARAMETERS
    shearParams(){
        if(this.shearReinf){
            return {
                Fv : this.Fv(),
                Fsv : this.Fsv(),
                Asv : this.Asv()
            }
        }
        else{
            return {
                Fv : this.Fv(),
            }
        }
    }//SHEAR PARAMS

    //BEARING CAPACITY
    fRn(){
        return 0.25*this.fm*this.b*this.Lbrg
    }

  } //CLASS