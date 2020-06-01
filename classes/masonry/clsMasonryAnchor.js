
import {anchor} from '@/data/CON_Anchor'
import {find,toString} from 'lodash'
import Masonry from '@/classes/masonry/clsMasonry'

export default class MasonryAnchor extends Masonry {
    constructor({ fm, Fy,thickness = 8,  anchorSize = "#5",  anchorGrade = 60 , Lb = 6, Le = 3.81 }) {
        console.log("Anchor Class")
        super({fm, Fy})
        this.thickness = thickness
        this.Fyb = anchorGrade*1000
        this.anchorSize = anchorSize
        this.Lb = Lb
        this.Le = Le

        this.t = this.thickness - 0.375
    } // CONSTRUCTOR

    db(){
        return anchor(this.anchorSize).d
    }//db

    Ab(){
        return anchor(this.anchorSize).A
    }

    anchorParams(){
        console.log("Anchor Params Class")
        return {
            db : this.db(),
            Ab : this.Ab()
        }
    }

    Ap(){
        return Math.min(Math.PI*Math.pow(this.Lb,2), Math.PI*Math.pow(this.Le,2))
    }

    Apt(){
        console.log("Apt Function")
        return Math.PI*Math.pow(this.Lb,2)
    }

    Apv(){
        console.log("Apv Function")
        return Math.PI*Math.pow(this.Le,2)
    }

    Ba(){
   //return Math.min(0.5*this.Ap()*Math.pow(this.fm,0.5), 0.2*this.Ab()*this.Fyb)
        let k1 = 1.25*this.Apt()*Math.pow(this.fm,0.5)
        let k2 = 0.6*this.Ab()*this.Fyb
        return Math.min(k1,k2)
    }

    tensionParams(){
        console.log("Tension Params Class")
        return{
            //Ap : this.Ap(),
            k1 : 1.25*this.Apt()*Math.pow(this.fm,0.5),
            k2 : 0.6*this.Ab()*this.Fyb,
            Apt : this.Apt(),
            Ba : this.Ba()
        }
    }

    R(){
        if(this.Le < 12*this.db()){
            return (this.Le-1)/(12*this.db()-1)
        }
        else{
            return 1
        }
    }

    Bv(){
        //return Math.min(350*Math.pow(this.fm*this.Ab(),0.25), 0.12*this.Ab()*this.Fyb)*this.R()
        let k1 = 1.25*this.Apv()*Math.pow(this.fm,0.5)
        let k2 = 350*Math.pow(this.fm*this.Ab(),0.25)
        let k3 = 2.5*this.Apt()*Math.pow(this.fm,0.5)
        let k4 = 0.36*this.Ab()*this.Fyb

        return Math.min(k1,k2,k3,k4)
    }

    

    shearParams(){
        console.log("Shear Params Class")
        return{
            //R: this.R(),
            Apv : this.Apv(),
            k1 : 1.25*this.Apv()*Math.pow(this.fm,0.5),
            k2 : 350*Math.pow(this.fm*this.Ab(),0.25),
            k3 : 2.5*this.Apt()*Math.pow(this.fm,0.5),
            k4 : 0.36*this.Ab()*this.Fyb,
            Bv : this.Bv()
        }
    }


    anchorParams(){
        return{
            db : this.db(),
            Ab : this.Ab(),
            
        }
    }

  //------------------------------------------------
  //TENSION
  //------------------------------------------------

    fTn(){
        return 100
    }

    tensionParams(){
        return{
            t : this.t
        }
    }//TENSION PARAMS

  //------------------------------------------------
  //SHEAR
  //------------------------------------------------

    fVn(){
        return 100
    }//fVn

    shearParams(){
        return {
            t : this.t
        }
    }//SHEAR PARAMS

  } //CLASS