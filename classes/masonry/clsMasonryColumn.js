import {rebar} from '@/data/CON_Rebar'
import MasonryWall from '@/classes/masonry/clsMasonryWall' 

export default class MasonryColumn extends MasonryWall {
    constructor({ fm, Fy,thickness, h , rebarSize,  rebarSpa, rebarLoc, rebarQty = 2, shearReinf = false, stirrupSize = "#3", stirrupSpa = 12, stirrupGrade = 40, b = 15.625, L = 12 }) {
      super({fm, Fy, thickness, h, rebarSize, rebarSpa, rebarLoc})
        this.b = b
        this.h = h
        this.L = L
        this.Ag = this.b * this.h
        this.Ig = this.b * Math.pow(this.h,3)/12
        this.r = Math.pow(this.Ig/this.Ag,0.5)
        this.Sm = this.b * Math.pow(this.h,2)/6
        this.rebarQty = rebarQty
        this.shearReinf = shearReinf
        this.stirrupSize = stirrupSize
        this.stirrupSpa = stirrupSpa
        this.Fyv = stirrupGrade
        this.wt = this.b * 10.5 * this.h/12

        this.FST = this.h
        
    } // CONSTRUCTOR

    Asmin(){
      return 0.005*this.b*this.h
    }

    Asmax(){
        return 0.04*this.b*this.h
      }

    dbv(){
        return rebar(this.stirrupSize).d
    }//db

    Asv(){
        return this.shearReinf ? 0 : 2*rebar(this.stirrupSize).A
    }//Ab

    //TOTAL AREA OF TENSILE STEEL
    Ast(){
        return rebar(this.rebarSize).A * (this.rebarQty/4 + 1)
    }//Ast

    Asc(){
        return this.shearReinf ? rebar(this.rebarSize).A * this.rebarQty : 0
    }//Ast

    Fsc(){
        return 0.4*this.Fy * 1000
    }

    //EFFECTIVE DEPTH
    d(){
        if(this.shearReinf){
            return this.h - this.tf - 0.5 - this.dbv() -rebar(this.rebarSize).d/2
        }
        else{
            return this.h - this.tf - 0.5 - rebar(this.rebarSize).d/2
        }
    }//d

    h_t(){
        return this.L*12/this.h
    }

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
          b : this.b,
          d : this.d(),
          tf : this.tf,
          Em : this.Em,
          n : this.n,
          Ag : this.Ag,
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

   //------------------------------------------------
  //AXIAL
  //------------------------------------------------

    SR(){
        return this.L*12/this.r 
    }

    RF(){
        if(this.SR() < 99){
            return 1-Math.pow((this.L*12)/(140*this.r),2)
        }
        else{
            return Math.pow((70*this.r)/(this.L*12),2)
        }
    }

    fPn(){
        return (0.25*this.fm*this.Ag + 0.65*this.Asc()*this.Fsc())*this.RF()
    }

    // fPn(){
    //     return this.Fa()*this.Ag
    // }

    axialParams(){
        return{
            Ag : this.Ag,
            SR : this.SR(),
            RF : this.RF(),
            //nFa : this.Fa(),
            Asc : this.Asc(),
            Fsc : this.Fsc()
        } 
    }


  } //CLASS