import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class SteelCompositeCapacity extends Steel {
    constructor({ method, Fy, section, L=30,S=10,tc=5,hd=3,fc=3,wc=150,NS=24,ds=0.75,hs=4.5,studLocation="Strong"}) {
      super({ method, Fy })
      this.L = L
      this.S = S
      this.tc = tc
      this.hd = hd
      this.ts = this.tc + this.hd
      this.fc = fc/1000
      this.Fy = 50
      this.wc = wc
      this.NS = NS
      this.ds = ds
      this.hs = hs
      this.studLocation = studLocation
      this.Fu = 58

      this.W = section
      this.As = _.toNumber(section.A)
      this.bf = _.toNumber(section.BF)
      this.d = _.toNumber(section.D)
      this.tf = _.toNumber(section.TF)
      this.tw = _.toNumber(section.TW)
      this.Ix = _.toNumber(section.IX)
      this.Zx = _.toNumber(section.ZX)
    } // CONSTRUCTOR

    //EFFECTION COMPRESSION WITH OF CONCRETE SLAB
    be(){
      return Math.min(this.L/4,this.S)*12
    }
    
    //TOTAL COMPRESSIVE FORCE DUE TO CONCRETE SLAB
    Vc(){
      return 0.85*this.fc*this.be()*this.tc
    }
    
    //TOTAL YIELD FORCE OF STEEL SECTION
    Vs(){
      return this.Fy*this.As
    }

    //COMPRESSIVE FORCE IN WEB OF STEEL SECTION
    Vsw(){
      return (this.d-2*this.tf)*this.tw*this.Fy
    }
    
    //AREA OF HEADED STUD
    Ast(){
      return 3.14*Math.pow(this.ds,2)/4
    }
    
    //CONCRETE MODULUS OF ELASTICITY
    Ec(){
      return Math.pow(this.wc,1.5)*Math.pow(this.fc,0.5)
    }
    
    //MODIFICATION FACTOR
    Rp(){
      return this.studLocation == "Strong" ? 0.75 : 0.6
    }
    
    //MODIFICATION FACTOR
    Rg(){
      return 1
    }
    
    //SHEAR CAPACITY OF HEADED STUD
    Qn(){
      let k1= 0.5*this.Ast()*Math.pow(this.fc*this.Ec(),0.5)
      let k2 = this.Rp()*this.Rg()*this.Ast()*this.Fu
      return Math.min(k1,k2)
    }
    
    //TOTAL SHEAR FORCE DEVELOPED BY HEADED STUDS
    Vq(){
      return this.NS * this.Qn()
    }
    
    //MINIMUM SHEAR FORCE
    V1(){
      return Math.min(this.Vc(), this.Vs(), this.Vq())
    }
    
    //EFFECTIVE THICKNESS OF CONCRETE SLAB COMPRESSION BLOCK
    a(){
      if( this.Vq() < Math.min(this.Vc(), this.Vs()) ){
        return this.V1()/(0.85*this.fc*this.be())
      }
      else{
        return this.tc
      }
    }

    //LOCATION OF PLASTIC NEUTRAL AXIS
    PNA(){
      switch(true){
        case ( this.Vc() >= Math.max(this.Vs(), this.Vq()) ) :
          return "Slab"
          break
        case (_.inRange(this.V1(),this.Vsw(), this.Vs())) :
          return "Flange"
          break
          case (this.V1() < this.Vsw()) :
            return "Web"
            break
      }
    }
    
    //COMPOSITE ACTION MODE
    mode(){
      return this.Vq() < Math.min(this.Vc(),this.Vs()) ? "Partial" : "Full"
    }
    
    //AREA OF STEEL IN COMPRESSION
    Asc(){
      return this.mode() == "Partial" ? (this.Vs()-this.V1())/(2 * this.Fy) : 0
    }

    //FLANGE THICKNESS OF STEEL SECTION IN COMPRESSION
    yf(){
      return this.PNA() == "Flange" ? this.Asc()/this.bf : 0
    }

    //WEB THICKNESS OF STEEL SECTION IN COMPRESSION
    yw(){
      return this.PNA() == "Web" ? this.V1()/(2*this.Fy*this.tw) : 0
    }
    
    //NUMBER OF STUDS FOR FULL COMPOSITE ACTION
    Nfull(){
      return Math.min(this.Vc(), this.Vs())/this.Qn()
    }
    
    //MINIMUM NUMBER OF STUDS REQUIRED FOR COMPOSITE ACTION
    Nmin(){
      return (0.25*this.Vs())/this.Qn()
    }
    
    //PERCENTAGE OF COMPOSITE ACTION
    composite(){
      return Math.min(this.NS/this.Nfull(),1).toFixed(2)*100 + '%'
    }

    //NOMINAL FLEXURAL MOMENT CAPACITY OF COMPOSITE SECTION
    Mn(){
      switch(this.PNA()){
        case "Slab" : 
          return (this.As*this.Fy)*(this.d/2 + this.ts - this.a()/2)/12
          break
        case "Flange" : 
          let M1f = this.V1()*(this.d/2 + this.ts - this.a()/2)
          let M2f = (this.Vs()-this.V1())*(this.d/2-this.yf()/2)

          return (M1f + M2f)/12
          break
        case "Web" : 
          let M1w = this.V1()*(this.d/2 + this.d/2 + this.ts - this.a()/2)
          let Mp = this.Zx*this.Fy
          let M2w = 2*this.Fy*this.tw*this.yw()*this.yw()/2

          return (M1w + Mp - M2w)/12
          break
      }//SWITCH
      
    }//Mn
    
    //ULTIMATE FLEXURAL MOMENT CAPACITY OF COMPOSITE SECTION
    fMn(){
      return this.phiF()*this.Mn()
    }
    
  
    beamParams(){
      return[
        {name : 'V<sub>c</sub>', value:this.Vc().toFixed(2), unit:'k'},
        {name : 'V<sub>s</sub>', value:this.Vs().toFixed(2), unit:'k'},
        {name : 'V<sub>q</sub>', value:this.Vq().toFixed(2), unit:'k'},
        {name : 'V<sup>1</sup>', value:this.V1().toFixed(2), unit:'k'},
        //{name : 'M<sub>n</sub>', value:this.Mn().toFixed(2), unit:'k-ft'},
        {name : '&phi;M<sub>n</sub>', value:this.fMn().toFixed(2), unit:'k-ft'},
        {name : 'Mode', value:this.mode(), unit:''},
        //{name : 'PNA', value:this.mode().PNA, unit:''},
        {name : 'Composite', value:this.composite(), unit:''},
        {name : 'b<sub>f</sub>', value:(this.bf).toFixed(3), unit:'in'},
        {name : 't<sub>f</sub>', value:(this.tf).toFixed(3), unit:'in'},
        {name : 't<sub>w</sub>', value:(this.tw).toFixed(3), unit:'in'},
        {name : 'I<sub>x</sub>', value:(this.Ix).toFixed(3), unit:'in'},
        {name : 'Z<sub>x</sub>', value:(this.Zx).toFixed(3), unit:'in'},
        {name : 'y<sub>f</sub>', value:this.yf().toFixed(2), unit:'in'},
        {name : 'y<sub>w</sub>', value:this.yw().toFixed(2), unit:'in'},
        {name : 'A<sub>sc</sub>', value:this.Asc().toFixed(2), unit:'in<sup>4</sup>'},
      ]
    }

    slabParams(){
      return[
        {name : 'b<sub>e</sub>', value:this.be().toFixed(2), unit:'in'},
        {name : 'V<sub>c</sub>', value:this.Vc().toFixed(2), unit:'k'},
        {name : 'a', value:this.a().toFixed(2), unit:'in'},
       
      ]
    }

    studParams(){
      return[
        {name : 'A<sub>st</sub>', value:this.Ast().toFixed(2), unit:'in<sup>4</sup>'},
        {name : 'F<sub>u</sub>', value:this.Fu, unit:'ksi'},
        {name : 'Ec<sub>s</sub>', value:this.Ec().toFixed(0), unit:'ksi'},
        {name : 'Q<sub>n</sub>', value:this.Qn().toFixed(2), unit:'k'},
        {name : 'R<sub>p</sub>', value:this.Rp().toFixed(2), unit:''},
        {name : 'R<sub>g</sub>', value:this.Rg().toFixed(2), unit:''},
        {name : 'V<sub>q</sub>', value:this.Vq().toFixed(2), unit:'k'},
        {name : 'N<sub>min</sub>', value:this.Nmin().toFixed(0), unit:''},
        {name : 'N<sub>full</sub>', value:this.Nfull().toFixed(0), unit:''},
      ]
    }
    

    
  } //CLASS