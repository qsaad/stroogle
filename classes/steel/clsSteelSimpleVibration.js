import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'

export default class SteelSimpleVibration extends Steel {
    constructor({ method, Fy, section, Lg=30,Sg=40,Lj=30,Sj=30,DL=45,wTL=284}) {
      super({ method, Fy })
        this.W = section
        this.Ig = section.IX
        this.Lg = Lg
        this.Sg = Sg
        this.Lj = Lj
        this.Sj = Sj
        this.wTL = wTL
        this.DL = DL
    } // CONSTRUCTOR

    Wj(){
        return (this.DL*this.Sj/12)/1000
    }
    Wg(){
        return this.DL *this.Sg/1000
    }
    
    Ij(){
        return 26.767*this.wTL*Math.pow(this.Lj,3)/1000000
    }
    
    Dj(){
            return (5*this.Wj()*Math.pow(this.Lj,4)*1728)/(384*this.E*this.Ij())
    }
    
    Dg(){
            return (5*this.Wg()*Math.pow(this.Lg,4)*1728)/(384*this.E*this.Ig)
    }

    fg(){
        return 0.18*Math.pow(386/this.Dg(),0.5)
    }

    fj(){
        return 0.18*Math.pow(386/this.Dj(),0.5)
    }
    
    f(){
        return 0.18*Math.pow(386/(this.Dj() + this.Dg()),0.5)
    }
    
  
    beamParams(){
      return[
        {name : 'w<sub>g</sub>', value:this.Wg().toFixed(2), unit:'k/ft'},
        {name : 'D<sub>g</sub>', value:this.Dg().toFixed(2), unit:'in'},
        {name : 'f<sub>q</sub>', value:this.fg().toFixed(2), unit:'Hz'},
      ]
    }

    joistParams(){
      return[
        {name : 'w<sub>j</sub>', value:this.Wj().toFixed(2), unit:'k/ft'},
        {name : 'I<sub>j</sub>', value:this.Ij().toFixed(2), unit:'in<sup>4</sup>'},
        {name : 'D<sub>j</sub>', value:this.Dj().toFixed(2), unit:'in'},
        {name : 'f<sub>j</sub>', value:this.fj().toFixed(2), unit:'Hz'},
      ]
    }

    
  } //CLASS