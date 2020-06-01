import * as studList  from '@/data/STL_studSize'
import {ArrayMin}  from '@/library/functions'
import _ from 'lodash'

export default class EmbedPlate {
    constructor({Nu=12,Vu=2,ex=0,ey=0,ev=0,NR=2,NC=2,Sx=12,Sy=12,d1=12,d2=12,d3=12,d4=12,studSize="1/2",hef=6,fc=3000,h=12,wc=145,cracked=true,reinforcing="Rebar"}){
        this.Nu = Nu
        this.Vu = Vu
        this.NR = NR
        this.NC = NC
        this.Sx = Sx
        this.Sy = Sy
        this.d1 = d1
        this.d2 = d2
        this.d3 = d3
        this.d4 = d4
        this.studSize = studSize
        this.ds = _.map(_.filter(studList.List,{"Size" : studSize}),'d')[0]
        this.Ase = _.map(_.filter(studList.List,{"Size" : studSize}),'Ase')[0]
        this.Abrg = _.map(_.filter(studList.List,{"Size" : studSize}),'Abrg')[0]
        this.Fut = _.map(_.filter(studList.List,{"Size" : studSize}),'Fut')[0]
        this.Fys = _.map(_.filter(studList.List,{"Size" : studSize}),'Fys')[0]
        this.Grade = _.map(_.filter(studList.List,{"Size" : studSize}),'Grade')[0]
        this.hef = hef
        this.fc = fc
        this.h = h
        this.wc = wc
        this.lambda = this.wc >= 145 ? 1 : 0.85
      //ADDITIONAL PARAMETERS TO ADD 
        this.reinforcing = reinforcing
        this.isCracked = cracked
        this.Ccrb = this.isCracked ? 0.8 : 1
        this.Ccrp = this.isCracked ? 0.7 : 1
        this.ex = ex
        this.ey = ey
        this.ev = ev
        this.X = NC > 1 ? (NC-1)*Sx : 0
        this.Y = NR > 1 ? (NR-1)*Sy : 0
    }//CONSTRUCTOR
    
    phiVs(){
        return 0.65
    }
    
    phiNs(){
        return 0.75
    }

    phiVc(){
        return this.reinforcing == 'None' ? 0.7 : 0.75
    }

    phiNc(){
        return this.reinforcing == 'None' ? 0.7 : 0.75
    }

    NS(){
        return this.NR * this.NC
    }

    //---------------------------------------
    //STUD CAPACITY
    //--------------------------------------
    
    //STUD SHEAR CAPACITY
    fVs(){
        return this.phiVs()*this.NS()*this.Ase*this.Fut*this.NS()
    }
    
    //STUD TENSION CAPACITY
    fNs(){
        return this.phiNs()*this.NS()*this.Ase*this.Fut*this.NS()
    }
    
    //---------------------------------------
    //CONCRETE TENSION CAPACITY
    //--------------------------------------
    //SINGLE STUD CAPACITY
    fNu(){
        return this.phiNc()*30*this.lambda*Math.pow(this.fc,0.5)*Math.pow(this.hef,1.5)/1000
    }

    AN(){
        let LX = Math.min(this.d1,1.5*this.hef) + this.Sx*(this.NC-1) + Math.min(this.d2,1.5*this.hef)
        let LY = Math.min(this.d3,1.5*this.hef) + this.Sy*(this.NR-1) + Math.min(this.d4,1.5*this.hef)
        return LX * LY
    }
    //BREAKOUT STRENGTH COEFFICIENT
    Cbs(){
       return 3.33*this.lambda*Math.pow(this.fc/this.hef,0.5)
    }
    //EDGE DISTANCE FACTOR
    XedN(){
           let dmin = Math.min(this.d1, this.d2, this.d3, this.d4)
      
      return Math.min(0.7 + 0.3*(dmin/(1.5*this.hef)),1)
    }
    //ECCENTRICITY FACTOR
    XecNx(){
      return Math.min(1/(1+(2*this.ex)/(3*this.hef)),1)
    }
    XecNy(){
      return Math.min(1/(1+(2*this.ey)/(3*this.hef)),1)
    }
    Ncb(){
        return this.Cbs()*this.AN()*this.Ccrb*this.XedN()*this.XecNx()*this.XecNy()/1000
    }
    fNcb(){
        return this.phiNc() * this.Ncb()
    }
    //PULLOUT
    Npn(){
        return this.NS()*11.2*this.Abrg*this.fc*this.Ccrp/1000
    }
    fNpn(){
      return this.phiNc() * this.Npn()
    }
    //SIDE-FACE BLOWOUT
    Nsb(){
        let dmin = Math.min(this.d1, this.d2, this.d3, this.d4)
        if(dmin < 0.4*this.hef){
            return this.NS()*160*dmin*Math.pow(this.Abrg,0.5)*Math.pow(this.fc,0.5)*this.XedN()/1000
        }
        else{
            return 0
        }
        
    }
    fNsb(){
        return this.phiNc()*this.Nsb()
    }
    
    //---------------------------------------
    //CONCRETE SHEAR CAPACITY
    //--------------------------------------
    SED(){
        return this.d1 + this.X
    }
    BED(){
        return this.d3 + this.Y
    }
    
    Mode(){
        switch(true){
          case (this.SED()/this.BED() < 0.2):
            return "Side"
          break
       case (this.SED()/this.BED() <= 3):
            return "Corner"
          break
       case (this.SED()/this.BED() > 3):
            return "Front"
          break
      }
    }
    
    //FRONT EDGE BREAKOUT
    Vco3(){
        return 16.5*this.lambda*Math.pow(this.fc,0.5)*Math.pow(this.BED(),1.33)/1000
    }
    Cx3(){
        if(this.NC > 1){
            return Math.min(0.85 + this.X/(3*this.BED()), this.NC)
        }
        else{
            return 1
        }
    }
    Ch3(){
        return this.h > 1.75 * this.BED ? 1 : 0.75*Math.pow(this.h/this.BED(),0.5)
    }
    Cev3(){
        return Math.min(1/(1+0.67*(this.ev/this.BED())),1)
    }

    Cvcr(){
        if(this.isCracked){
            switch(this.reinforcing){
                case 'None' :
                    return 0.7
                    break
                case 'Rebar' :
                    return 0.85
                    break
                case 'Rebar and Stirrups' :
                    return 1
                    break
            }
        }
        else{
            return 1
        }
    }

    Vc3(){
        return this.Vco3()*this.Cx3()*this.Ch3()*this.Cev3()*this.Cvcr()
    }
    
    fVc3(){
        return this.phiVc() * this.Vc3()
    }
    
    //CORNER BREAKOUT
    
    Cc3(){
        return Math.min(0.7*Math.pow(this.SED()/this.BED(),1/3),1)
    }

    Vc3c(){
        return this.Vco3()*this.Cc3()*this.Ch3()*this.Cev3()*this.Cvcr()
    }
    
    fVc3c(){
        return this.phiVc() * this.Vc3c()
    }
   
    //SIDE EDGE BREAKOUT
    Vco1(){
        return 87*this.lambda*Math.pow(this.fc,0.5)*Math.pow(this.d1,1.33)*Math.pow(this.ds,0.75)/1000
    }
    n_sides(){
        if(this.d1 < 1.5*this.hef && this.d2 < 1.5*this.hef){
          return 2
      }
      else{
          return 1
      }
    }
    Cx1(){
        return this.NR == 1 ? 1 : (this.NC*this.Sy)/(2.5*this.d1)+2-this.n_sides()
    }
    Cy1(){
        return this.NC == 1 ? 1 : Math.min(Math.pow(this.NR*this.Y,0.25)/(0.6*this.d1) + 0.15, this.NC)
    }
    Cev1(){
        return Math.min(1 - (this.ev/(4*this.d1)),1)
    }
    Vc1(){
        return this.Vco1()*this.Cx1()*this.Cy1()*this.Cev1()*this.Cvcr()
      }
    fVc1(){
        return this.phiVc()*this.Vc1()
    }
    
    //INFIELD
   
    Xy(){
        return 1
    }

    Vcp0(){
        return 215*this.NS()*this.Xy()*Math.pow(this.fc,0.5)*Math.pow(this.ds,1.5)*Math.pow(this.hef,0.5)/1000
    }
    
    fVcp0(){
        return this.phiVc()*this.Vcp0()
    }

    fNn(){
        return ArrayMin(this.fNs(),this.fNcb(), this.fNsb(), this.Npn())
    }

    fVn(){
        return ArrayMin(this.fVs(), this.fVc1(), this.fVc3(), this.fVc3c())
    }

    tensionDuctility(){
        return this.fNs() < ArrayMin(this.fNcb(), this.fNsb(), this.Npn()) ? 'Ductile' : 'Brittle'
    }

    shearDuctility(){
        return this.fVs() < ArrayMin(this.fVc1(), this.fVc3(), this.fVc3c()) ? 'Ductile' : 'Brittle'
    }
    

    studTensionParams(){
        return[
            {name : '&phi;<sub>NS</sub>', value:this.phiNs(), decimal:2, unit:''},
            {name : '&phi;N<sub>s</sub>', value:this.fNs(), decimal:2, unit:'k'},
            {name : 'n', value:this.NS(), decimal:0, unit:''},
            {name : 'A<sub>se</sub>', value:this.Ase, decimal:2, unit:'in<sup>2</sup>'},
            {name : 'F<sub>ut</sub>', value:this.Fut, decimal:2, unit:'ksi'},
        ]
    }//STUD PARAMS

    studShearParams(){
        return[
            {name : '&phi;<sub>VS</sub>', value:this.phiVs(), decimal:2, unit:''},
            {name : '&phi;V<sub>s</sub>', value:this.fVs(), decimal:2, unit:'k'},
            {name : 'n', value:this.NS(), decimal:0, unit:''},
            {name : 'A<sub>se</sub>', value:this.Ase, decimal:2, unit:'in<sup>2</sup>'},
            {name : 'F<sub>ut</sub>', value:this.Fut, decimal:2, unit:'ksi'},
        ]
    }//STUD PARAMS

    concTensionBreakoutParams(){
        return[
            {name : '&phi;N<sub>cb</sub>', value:this.fNcb(), decimal:2, unit:'k'},
            {name : '&phi;<sub>NC</sub>', value:this.phiNc(), decimal:2, unit:''},
            {name : 'C<sub>bs</sub>', value:this.Cbs(), decimal:2, unit:''},
            {name : 'A<sub>N</sub>', value:this.AN().toFixed(2), unit:'in<sup>2</sup>'},
            {name : 'C<sub>crb</sub>', value:this.Ccrb, decimal:2, unit:''},
            {name : '&psi;<sub>edN</sub>', value:this.XedN(), decimal:2, unit:''},
            {name : '&psi;<sub>ecNx</sub>', value:this.XecNx(), decimal:2, unit:''},
            {name : '&psi;<sub>ecNy</sub>', value:this.XecNy(), decimal:2, unit:''},
        ]
    }//CONC TENSION PARAMS

    concTensionPulloutParams(){
        return[
            {name : '&phi;N<sub>pn</sub>', value:this.fNpn(), decimal:2, unit:'k'},
            {name : '&phi;<sub>NC</sub>', value:this.phiNc(), decimal:2, unit:''},
            {name : 'A<sub>brg</sub>', value:this.Abrg, decimal:2, unit:'in<sup>2</sup>'},
            {name : 'fc', value:this.fc.toFixed(0), unit:'psi'},
            {name : 'C<sub>crp</sub>', value:this.Ccrp, decimal:2, unit:''},
        ]
    }//CONC TENSION PARAMS


    concTensionBlowoutParams(){
        return[
            {name : '&phi;N<sub>sb</sub>', value:this.fNsb(), decimal:2, unit:'k'},
            {name : '&phi;<sub>NC</sub>', value:this.phiNc(), decimal:2, unit:''},
            {name : 'd<sub>1</sub>', value:this.d1, decimal:2, unit:''},
            {name : 'A<sub>brg</sub>', value:this.Abrg, decimal:2, unit:'in<sup>2</sup>'},
            {name : 'fc', value:this.fc.toFixed(0), unit:'psi'},
            {name : '&psi;<sub>edN</sub>', value:this.XedN(), decimal:2, unit:''},
        ]
    }//CONC TENSION PARAMS

    generalParams(){
        return [
            {name : 'SED', value:this.SED(), decimal:2, unit:''},
            {name : 'BED', value:this.BED(), decimal:2, unit:''},
            {name : '&lambda;', value:this.lambda, decimal:2, unit:''},  
            {name : 'X', value:this.X, decimal:2, unit:'in'},
            {name : 'Y', value:this.Y, decimal:2, unit:'in'},
            {name : 'NS', value:this.NS(), decimal:2, unit:''},
        ]
    }

    concShearFrontParams(){
        return[
            {name : 'Mode', value:this.Mode(), decimal:2, unit:''},
            {name : 'SED/BED', value:(this.SED()/this.BED()), decimal:2, unit:''},
            {name : '&phi;V<sub>c3</sub>', value:this.fVc3().toFixed(2), unit:'k'},
            {name : '&phi;<sub>NC</sub>', value:this.phiVc(), decimal:2, unit:''},
            {name : 'V<sub>co3</sub>', value:this.Vco3(), decimal:2, unit:'k'},
            {name : 'C<sub>x3</sub>', value:this.Cx3(), decimal:2, unit:''},
            {name : 'C<sub>h3</sub>', value:this.Ch3(), decimal:2, unit:''},
            {name : 'C<sub>ev3</sub>', value:this.Cev3(), decimal:2, unit:''},
            {name : 'C<sub>vcr</sub>', value:this.Cvcr(), decimal:2, unit:''},
            {name : 'V<sub>c3</sub>', value:this.Vc3().toFixed(2), unit:'k'},
            
        ]
    }//CONC SHEAR PARAMS

    concShearCornerParams(){
        return[
            {name : 'Mode', value:this.Mode(), decimal:2, unit:''},
            {name : 'SED/BED', value:(this.SED()/this.BED()), decimal:2, unit:''},
            {name : '&phi;V<sub>c3c</sub>', value:this.fVc3c(), decimal:2, unit:'k'},
            {name : '&phi;<sub>NC</sub>', value:this.phiVc(), decimal:2, unit:''},
            {name : 'V<sub>co3</sub>', value:this.Vco3(), decimal:2, unit:'k'},
            {name : 'C<sub>c3</sub>', value:this.Cc3(), decimal:2, unit:''},
            {name : 'C<sub>h3</sub>', value:this.Ch3(), decimal:2, unit:''},
            {name : 'C<sub>ev3</sub>', value:this.Cev3(), decimal:2, unit:''},
            {name : 'C<sub>vcr</sub>', value:this.Cvcr(), decimal:2, unit:''},
        ]
    }//CONC SHEAR PARAMS

    concShearSideParams(){
        return[
            {name : 'Mode', value:this.Mode(), decimal:2, unit:''},
            {name : 'SED/BED', value:(this.SED()/this.BED()), decimal:2, unit:''},
            {name : '&phi;V<sub>c1</sub>', value:this.fVc1(), decimal:2, unit:'k'},
            {name : '&phi;<sub>NC</sub>', value:this.phiVc(), decimal:2, unit:''},
            {name : 'V<sub>co1</sub>', value:this.Vco1(), decimal:2, unit:'k'},
            {name : 'C<sub>x1</sub>', value:this.Cx1(), decimal:2, unit:''},
            {name : 'C<sub>y1</sub>', value:this.Cy1(), decimal:2, unit:''},
            {name : 'C<sub>ev1</sub>', value:this.Cev1().toFixed(2), unit:''},
            {name : 'C<sub>vcr</sub>', value:this.Cvcr(), decimal:2, unit:''},
            {name : 'n<sub>sides</sub>', value:this.n_sides().toFixed(2), unit:''},
            {name : 'V<sub>cp0</sub>', value:this.Vcp0(), decimal:2, unit:'k'},
            {name : '&phi;V<sub>cp0</sub>', value:this.fVcp0(), decimal:2, unit:'k'},
        ]
    }//CONC SHEAR PARAMS
    
   
  } //CLASS