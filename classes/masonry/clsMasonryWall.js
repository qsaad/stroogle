import * as CMU_4 from '@/data/CMU_4'
import * as CMU_6 from '@/data/CMU_6'
import * as CMU_8 from '@/data/CMU_8'
import * as CMU_10 from '@/data/CMU_10'
import * as CMU_12 from '@/data/CMU_12'
import {rebar} from '@/data/CON_Rebar'
import {find,toString} from 'lodash'
import Masonry from '@/classes/masonry/clsMasonry'

export default class MasonryWall extends Masonry {
    constructor({ fm, Fy,thickness = 8, h = 12 , rebarSize = "#5",  rebarSpa = 32 , rebarLoc = "centered" }) {
      super({fm, Fy})

        this.b = Math.min(72, rebarSpa, 6*thickness)
        this.h = h
        this.thickness = thickness
        this.rebarSize = rebarSize
        this.rebarSpa = rebarSpa
        this.rebarLoc = rebarLoc
        this.t = this.thickness - 0.375
        
        this.prop = this.getPropData()
        this.tf = this.thickness <= 6 ? 1 : 1.25
        this.FST = this.tf
        this.tw = 0.75
        this.bw = 8.25
        this.Ag = this.prop.A * (this.rebarSpa/12)
        this.Ig = this.prop.I * (this.rebarSpa/12)
        this.S = this.prop.S * (this.rebarSpa/12)
        this.r = this.prop.r
        this.wt = this.prop.wt

    } // CONSTRUCTOR

    Asmin(){
      return 0.0018*this.b*this.h
    }

    getPropData(){
      switch(this.thickness){
          case (4) :
              return find(CMU_4.List, {'Grout': toString(this.rebarSpa)})
              break
          case (6) :
                  return find(CMU_6.List, {'Grout': toString(this.rebarSpa)})
                  break
          case (8) :
              return find(CMU_8.List, {'Grout': toString(this.rebarSpa)})
              break
          case (10) :
              return find(CMU_10.List, {'Grout': toString(this.rebarSpa)})
              break
          case (12) :
              return find(CMU_12.List, {'Grout': toString(this.rebarSpa)})
              break
      }
  }

  db(){
      return rebar(this.rebarSize).d
  }//db
  
  Ab(){
      return rebar(this.rebarSize).A
  }//Ab

  d(){
      if(this.rebarLoc == "Center"){
          return this.t /2
      }
      else{
          return this.t - this.tf - 0.5 - rebar(this.rebarSize).d/2
      }
  }//d

  propsParams(){
      return{
          t : this.t,
          db : this.db(),
          Ab : this.Ab(),
          b : this.b,
          d : this.d(),
          tf : this.tf,
          tw : this.tw,
          bw : this.bw,
          Em : this.Em,
          n : this.n,
          Ag : this.Ag,
          Ig : this.Ig,
          S : this.S,
          r : this.r,
          wt : this.wt
      }
  }

  //------------------------------------------------
  //FLEXURE
  //------------------------------------------------
  e(){
    return this.t/6
  }
  Ast(){
    return rebar(this.rebarSize).A 
  }
  rho(){
      return this.Ast()/(this.b*this.d());
  }
  h_t(){
    return this.h*12/this.thickness
  }

  //k FACTOR
  k(){
      let m = this.rho()*this.n;
      return Math.pow(2*m+m*m,0.5)-m;
  }
  j(){
    return 1-this.k()/3;
  }

  kd(){
      return this.k()*this.d()
  }


  kt(){
      let rnb = this.rho()*this.n*this.b
      return (Math.pow(Math.pow(rnb,2)+2*rnb*this.bw,0.5)- rnb)/this.bw
  }

  ktd(){
    return this.kt()*this.d()
  }

  //FLANGE COMPRESSION
  Cf(){
    return (this.b*this.tf*this.Fb())/2*((2*this.ktd()-this.tf)/this.ktd())
  }//Cf
  Zf(){
    return (3*this.ktd()-2*this.tf)/(2*this.ktd()-this.tf)*(this.tf/3)
  }
  jfd(){
    return this.d()-this.Zf()
  }
  //WEB COMPRESSION
  Cw(){
    return (this.bw*this.Fb())/(2*this.ktd())*Math.pow(this.ktd()-this.tf,2)
  }
  jwd(){
    return this.d()-(2*this.tf+this.ktd())/3
  }

  fs1(){
      let k1 = this.kd() < this.FST ? this.k() : this.kt()
      let f =  this.n*this.Fb()*((1-k1)/k1)
      if(f > this.Fs()){
          return this.Fs()
      }
      else{
          return f
      }
  }

  // Ig(){
  //   let k1 = this.b*Math.pow(this.tf,3)/12 + this.b*this.tf*Math.pow(this.t/2 - this.tf/2,2)
  //   let k2 = this.bw*Math.pow(this.t-2*this.tf,3)/12
  //   return 2*k1 + k2
  // }

  Mcr(){
    return (this.Fr()*this.Ig)/(12*this.t/2)
  }

  Icr(){
    if(this.kd() < this.FST){
      return this.b*Math.pow(this.kd(),3)/3 + this.n*this.Ast()*Math.pow(this.d()-this.kd(),2)
    }
    else{
      let k1 = this.b*this.tf*Math.pow(this.d()-this.tf/2,2)
      let k2 = this.bw*(this.ktd()-this.tf)*Math.pow((this.d()-this.ktd())+(this.ktd()-this.tf)/2,2)
      let k3 = this.n*this.Ast()*Math.pow(this.d()-this.ktd(),2)

      return k1 + k2 + k3
    }
  }


  //MASONRY CAPACITY
  Mm(){
    if(this.kd()<this.FST){
      return this.Fb()*this.k()*this.j()*this.b*Math.pow(this.d(),2)/(2*12)
    }
    else{
      return this.Cf()*this.jfd()/12 + this.Cw()*this.jwd()/12
    }
      
  }//Mm

  //REBAR CAPACITY
  Ms(){
    if(this.kd()< this.FST){
      return this.Ast()*this.Fs()*this.j()*this.d()/12
    }
    else{
      return this.Ast()*this.Fs()*this.jfd()/12
    }
      
  }

  fMn(){
      return this.rho() <= this.rho_b() ? this.Ms() : this.Mm()
  }

  flexureParams(){
    let basicProp = {
          b : this.b,
          d : this.d(),
          rho : this.rho(),
          rho_b : this.rho_b(),
          n : this.n,
          h_t : this.h_t(),
          Ig : this.Ig,
          Icr : this.Icr(),
          Mcr : this.Mcr(),
          Fs : this.Fs(),
          fs1 : this.fs1(),
          Fb : this.Fb(),
          Mm : this.Mm(),
          Ms : this.Ms()
        }
    let rectProp = {
      k : this.k(),
      j : this.j(),
      kd : this.kd(),
    }
    let teeProp = {
      kt : this.kt(),
      Cf : this.Cf(),
      Zf : this.Zf(),
      jfd : this.jfd(),
      Cw : this.Cw(),
      jwd : this.jwd(),
    }
     if(this.kd() < this.FST){
      return {...basicProp, ...rectProp}
     }
     else{
      return {...basicProp, ...teeProp}
     }
  }//FLEXURE PARAMS

  //------------------------------------------------
  //AXIAL
  //------------------------------------------------

  SR(){
      return this.h*12/this.r 
  }

  Fa(){
      if(this.SR() < 99){
          return (0.25*this.fm)*(1-Math.pow((this.h*12)/(140*this.r),2))
      }
      else{
          return (0.25*this.fm)*(Math.pow((70*this.r)/(this.h*12),2))
      }
  }

  fPn(){
      return this.Fa()*this.Ag
  }

  axialParams(){
      return{
          Ag : this.Ag,
          SR : this.SR(),
          Fa : this.Fa(),
      } 
  }

  //------------------------------------------------
  //SHEAR
  //------------------------------------------------
  //ALLOWABLE SHEAR STRESS
  Fv(){
      return Math.min(1.5*Math.pow(this.fm,0.5),120);
  }

  fVn(){
      return this.Fv()*this.b*this.d()
  }

  shearParams(){
      return {
          Fv : this.Fv()
      }
  }

  } //CLASS