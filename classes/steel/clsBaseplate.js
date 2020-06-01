import {anchor} from '@/data/CON_Anchor'
import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class Baseplate extends Steel {
    constructor({ method, Fy, Pr=50, Vr=0, Mr=0, type="W",section,axis="Strong",NP=14,BP=14,Fyp=36,anchorSize="3/4",Nb=2,de=1.5,anchorGrade={},NC=16,BC=16,fc=3000}) {
        super({ method, Fy })
        //LOAD
        this.Pr = Pr
        this.Mr = Mr
        this.Vr = Vr
        //SECTION
        this.type = type
        this.W = section
        this.axis = axis
        //PLATE
        this.NP = NP
        this.BP = BP
        this.Fyp = Fyp
        //ANCHOR
        this.anchorSize = anchorSize
        this.Nb = Nb
        this.de = de
        this.Fu = anchorGrade[0].Fu
        this.Fnt = anchorGrade[0].Fnt
        this.Fnv = anchorGrade[0].Fnv
        //PIER
        this.NC = NC
        this.BC = BC
        this.fc = fc

        switch(this.type){
            case ("W") : 
                this.NS = axis == "Strong" ? section.D : section.BF
                this.BS = axis == "Strong" ? section.BF : section.D
                this.m = (this.NP - 0.95*this.NS)/2
                this.n = (this.BP - 0.80*this.BS)/2
                break
            case ("HSS") : 
                this.NS = axis == "Strong" ? section.HT : section.B
                this.BS = axis == "Strong" ? section.B : section.HT
                this.m = (this.NP - 0.95*this.NS)/2
                this.n = (this.BP - 0.95*this.BS)/2
                break
            case ("Pipe") : 
                this.NS = section.OD
                this.BS = section.OD
                this.m = (this.NP - 0.95*this.NS)/2
                this.n = (this.BP - 0.95*this.BS)/2
                break
            case ("HSR") : 
                this.NS = section.OD
                this.BS = section.OD
                this.m = (this.NP - 0.95*this.NS)/2
                this.n = (this.BP - 0.95*this.BS)/2
                break
        }//SWITCH

    } // CONSTRUCTOR

   

    A1(){
        return this.NP * this.BP
    }//BASE PLATE AREA

    A2(){
        return this.NC * this.BC
    }//PIER AREA


    //STEP 1 - MAXIMUM BEARING STRESS
    fpmax(){
        return this.phiBrg()*0.85*(this.fc/1000)*Math.min(Math.pow(this.A2()/this.A1(),0.5),2);
    }

    //STEP 2 - MAXIMUM PRESSURE
    qmax(){
        return this.fpmax()*this.BP
     }

    //STEP 3 - ACTUAL ECCENTRICITY
    e(){
        return this.Mr*12/this.Pr
    }

    //STEP 4 - CRITICAL ECCENTRICITY
    ec(){
        return this.NP/2 - this.Pr/(2*this.qmax())
    }

    //STEP 5 - ACTUAL CONTACT LENGTH
    Y(){
        if(this.ec() == 0){
          return this.NP
      }
      else{
          if(this.e() < this.ec()){
            return this.NP - 2*this.e()
          }
          else{
            let f = this.NP/2 - this.de
            let k1 = f + this.NP/2
            let k2 = Math.pow(k1,2)
            let k3 = 2*this.Pr*(this.e() + f)/this.qmax()
            if(k2 > k3){
                let x1 = k1 + Math.pow(k2-k3,0.5)
              let x2 = k1 - Math.pow(k2-k3,0.5)
                return Math.min(x1,x2)
            }
            else{
                return 0
            }
          }
      }
    }//Y

    //STEP 6 - MAXIMUM PLATE PROJECTION BEYOND COLUMN
    Yp(){
        return Math.max(this.m, this.n)
    }

    //STEP 7 - ACTUAL BEARING STRESS
    fp(){
        return this.Pr/(this.BP*this.Y())
    }

    //STEP 8 - MOMENT IN PLATE AT FACE OF COLUMN
    Mp(){
        let f = this.e() > this.ec() ? this.fpmax() : this.fp()
        
        if(this.Y() >= this.Yp()){
            return f*Math.pow(this.Yp(),2)/2
        }
        else{
            return f*this.Y()*(this.Yp()-this.Y()/2)
        }
   }

   Mt(){
        let f = this.NP/2 - this.de
        let x = f - this.NS/2

        return this.Tr()*x/this.BS
   }

    //STEP 9 - BASE PLATE THICKNESS
    tp(){
        let M = Math.max(this.Mp(), this.Mt())
        
        return Math.pow((4*M)/(this.phiF()*this.Fyp), 0.5)
    }

    //STEP 10 - MAXIMUM TENSION FORCE
    Tr(){
        return this.e() > this.ec() ? this.qmax()*this.Y()-this.Pr : 0
    }
    
    baseplateParams(){
        return[
            {name : 'A<sub>1</sub>', value:this.A1(), decimal:2, unit:'in<sup>2</sup>'},
            {name : 'm', value:this.m, decimal:2, unit:'in'},
            {name : 'n', value:this.n, decimal:2, unit:'in'},
            {name : 'e', value:this.e(), decimal:2, unit:'in'},
            {name : 'e<sub>c</sub>', value:this.ec(), decimal:2, unit:'in'},
            {name : 'f<sub>p</sub>', value:this.fp(), decimal:2, unit:'psi'},
            {name : 'f<sub>pmax</sub>', value:this.ec(), decimal:2, unit:'psi'},
            {name : 'q<sub>max</sub>', value:this.qmax(), decimal:2, unit:'psi'},
            {name : 'Y', value:this.Y(), decimal:2, unit:'in'},
            {name : 'Y<sub>p</sub>', value:this.Yp(), decimal:2, unit:'in'},
            {name : 'M<sub>p</sub>', value:this.Mp(), decimal:2, unit:'k-in'},
            {name : 'M<sub>t</sub>', value:this.Mt(), decimal:2, unit:'k-in'},
            {name : 'T<sub>r</sub>', value:this.Tr(), decimal:2, unit:'k'},
        ]
    }//BASEPLATE PARAMS
    
    //-------------------------------------------------
    //ANCHOR 
    //-------------------------------------------------
    db(){
        return anchor(this.anchorSize).d   
    }//DIAMETER OF REBAR

    Ab(){
        return anchor(this.anchorSize).A 
    }
    fTbn(){
        return this.phiTb()*this.Fnt*this.Ab()
    }

    fVbn(){
        return this.phiVb()*this.Fnv*this.Ab()
    }

    fTn(){
        return this.fTbn()*this.Nb
    }

    fVn(){
        return this.fVbn()*this.Nb*2
    }

    anchorParams(){
        return [
            {name : 'A<sub>b</sub>', value:this.Ab(), decimal:2, unit:'in<sup>2</sup>'},
            {name : 'F<sub>u</sub>', value:this.Fu, decimal:2, unit:'ksi'},
            {name : 'F<sub>nt</sub>', value:this.Fnt, decimal:2, unit:'ksi'},
            {name : 'F<sub>nv</sub>', value:this.Fnv, decimal:2, unit:'ksi'},
            {name : '&phi;T<sub>bn</sub>', value:this.fTbn(), decimal:2, unit:'k'},
            {name : '&phi;V<sub>bn</sub>', value:this.fVbn(), decimal:2, unit:'k'},
        ]
    }//BASEPLATE PARAMS

    //-------------------------------------------------
    //PIER
    //-------------------------------------------------
    pierParams(){
        return [
            {name : 'A<sub>2</sub>', value:this.A2(), decimal:2, unit:'in<sup>2</sup>'},
        ]
    }//PIER PARAMS
   
   
  } //CLASS