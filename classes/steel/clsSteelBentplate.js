import {rebar} from '@/data/CON_Rebar'
import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class Bentplate extends Steel {
    constructor({ method, Fy, DL=50, LL=80,Fv=0,Fh=0,ev=0,eh=0, Lp=18, tp=0.25,Fyp=36,ts=7,section,hd=3,orientation="Parallel",fc=3000,rebarSize="#5",rebarSpacing=12,cov=0.75}) {
        super({ method, Fy })
        //SECTION
        this.bf = 7.5
        // this.bf = section.BF
        // this.tf = section.TF
        // this.tw = section.TW
        // this.d = section.D
        //LOAD
        this.DL = DL
        this.LL = LL
        this.Fv = Fv
        this.Fh = Fh
        this.ev = ev
        this.eh = eh
        //PLATE
        this.Lp = Lp
        this.tp = tp
        this.Fyp = Fyp
        this.wp = 490
        //SLAB
        this.ts = ts
        this.hd = hd
        this.orientation = orientation
        this.b = this.orientation == "Parallel" ? 12 : 6
        this.fc = fc
        this.wc = 150
        //REBAR
        this.rebarSize = rebarSize
        this.rebarSpacing = rebarSpacing
        this.cov = cov
        this.Fyb = 60

    } // CONSTRUCTOR

    //EFFECTIVE SLAB WIDTH TO RESIST POINT LOAD
    be(){
        return 2*this.Lp
    }
    //ULTIMATE LOADS
    slabWt(){
        return this.ts/12*this.wc
    }
    plateWt(){
        return this.tp/12*this.wp
    }
    wu(){
        return 1.2*(this.DL + this.slabWt() + this.plateWt()) + 1.6*this.LL
    }
    Pu(){
        return 1.2*this.Fv * 12/this.be()
    }
    Tu(){
        return 1.6*this.Fh * 12/this.be()
    }
    //ULTIMATE LOAD ON SLAB
    Mu(){
        let Mw = (this.wu()/1000*Math.pow(this.Loh()/12,2)/2)*12
        let Mp = this.Pu()*(this.Lp + this.ev)
        //return Mw
        return Mp
        return (Mw + Mp)/1000
    }

    //LENGTH OF OVERHANG
    Loh(){
        return this.Lp - this.bf/2
    }
    
    //PLATE SECTION PROPERTIES
    Ip(){
        return 12*Math.pow(this.tp,3)/12
    }
    Sp(){
        return 12*Math.pow(this.tp,2)/6
    }
    Zp(){
        return 12*Math.pow(this.tp,2)/4
    }
   
    //PLATE DEFLECTION
    d1(){
       return this.wc*Math.pow(this.ts/12,3)*12/(6*1000)*Math.pow(this.Loh(),2)/(2*this.E*this.Ip())
    }
   
    d2(){
       return (this.wc/(1000*144))*this.ts*Math.pow(this.Loh(),4)/(8*this.E*this.Ip())
    }
   
    d3(){
       return (this.wp/1000)*this.tp*Math.pow(this.Loh(),4)/(8*this.E*this.Ip()*144)
    }
   
    d4(){
        return (this.wp/1000)*this.tp*this.ts*Math.pow(this.Loh(),3)/(3*this.E*this.Ip()*144)
    }
   
    Dp(){
        return this.d1() + this.d2() + this.d3() + this.d4()
    }

    //BENT PLATE FLEXURE CAPACITY
    fMnp(){
        return this.phiF() * this.Fy * this.Zp()
    }

    //------------------------------------------------------------
    //SLAB CAPACITY
    //------------------------------------------------------------
    //REBAR DIAMETER
    db(){
        return rebar(this.rebarSize).d   
    }//DIAMETER OF REBAR
    //GROSS REBAR AREA
    Ast(){
        return rebar(this.rebarSize).A * (12/this.rebarSpacing)
    }//AREA OF TENSILE REINFORCING
    //REDUCTION IS REBAR AREA
    Ar(){
        return this.Tu()/(0.9*this.Fyb)
    }
    //EFFECTIVE REBAR AREA
    Ase(){
        return this.Ast() - this.Ar()
    }
    //EFFECTIVE DEPTH
    de(){
        if(this.orientation == "Parallel"){
            return this.ts - this.hd - this.cov - this.db()/2
        }
        else{
            return this.ts - this.cov - this.db()/2
        }
    }
    //DEPTH OF COMPRESSION BLOCK
    a(){
        return (this.Ase()*this.Fyb)/(0.85*(this.fc/1000)*this.b)
    }
    //FLEXURAL CAPACITY OF REINFORCE SLAB
    fMns(){
        return 0.9*this.Ase()*this.Fyb*(this.de() - this.a()/2)
    }

    plateParams(){
        return[
            {name : 'I<sub>p</sub>', value:this.Ip().toFixed(4), unit:'in<sup>4</sup>'},
            {name : 'S<sub>p</sub>', value:this.Sp().toFixed(4), unit:'in<sup>3</sup>'},
            {name : 'Z<sub>p</sub>', value:this.Zp().toFixed(4), unit:'in<sup>3</sup>'},
            {name : 'L<sub>oh</sub>', value:this.Loh().toFixed(2), unit:'in'},
            {name : '&delta;<sub>1</sub>', value:this.d1().toFixed(4), unit:'in'},
            {name : '&delta;<sub>2</sub>', value:this.d2().toFixed(4), unit:'in'},
            {name : '&delta;<sub>3</sub>', value:this.d3().toFixed(4), unit:'in'},
            {name : '&delta;<sub>4</sub>', value:this.d4().toFixed(4), unit:'in'},
            {name : '&Delta;<sub>p</sub>', value:this.Dp().toFixed(4), unit:'in'},
            {name : '&phi;M<sub>np</sub>', value:this.fMnp().toFixed(4), unit:'k-in'},
      ]
    }//PARAMS

    slabParams(){
        return [
            {name : 'd<sub>b</sub>', value:this.db().toFixed(2), unit:'in'},
            {name : 'A<sub>st</sub>', value:this.Ast().toFixed(2), unit:'in<sup>2</sup>'},
            {name : 'A<sub>r</sub>', value:this.Ar().toFixed(2), unit:'in<sup>2</sup>'},
            {name : 'A<sub>se</sub>', value:this.Ase().toFixed(2), unit:'in<sup>2</sup>'},
            {name : 'd<sub>e</sub>', value:this.de().toFixed(2), unit:'in'},
            {name : 'F<sub>yb</sub>', value:this.Fyb.toFixed(0), unit:'ksi'},
            {name : 'f<sub>c</sub>', value:this.fc.toFixed(0), unit:'psi'},
            {name : 'b', value:this.b.toFixed(2), unit:'in'},
            {name : 'a', value:this.a().toFixed(2), unit:'in'},
            {name : '&phi;M<sub>ns</sub>', value:this.fMns().toFixed(2), unit:'k-in'},
        ]
    }

    loadParams(){
        return [
            {name : 'b<sub>e</sub>', value:this.be().toFixed(2), unit:'in'},
            {name : 'Slab Wt', value:this.slabWt().toFixed(2), unit:'psf'},
            {name : 'Plate Wt', value:this.plateWt().toFixed(2), unit:'psf'},
            {name : 'w<sub>u</sub>', value:this.wu().toFixed(2), unit:'psf'},
            {name : 'P<sub>u</sub>', value:this.Pu().toFixed(2), unit:'lb'},
            {name : 'T<sub>u</sub>', value:this.Tu().toFixed(2), unit:'lb'},
            {name : 'M<sub>u</sub>', value:this.Mu().toFixed(2), unit:'k-in'},
        ]
    }
   
   
  } //CLASS