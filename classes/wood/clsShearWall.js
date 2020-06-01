
import * as ShearwallWind from '@/data/wood/ShearwallWind'
import * as ShearwallSeismic from '@/data/wood/ShearwallSeismic'

export default class Shearwall {
    constructor({method="ASD",load="Wind",panel,nailSpacing='6'}){
        this.method = method
        this.load = load
        this.nailSpacing = nailSpacing
        this.panel = panel
        this.sizeList = this.load == "Wind" ? ShearwallWind.List : ShearwallSeismic.List
        this.data = _.find(this.sizeList, {'Panel': panel})
    }//CONSTRUCTOR

    nominalShearCapacity(){
        switch(this.nailSpacing){
            case ('6'):
               return this.data.Nail_6 
                break
            case ('4'):
                return this.data.Nail_4
                break
            case ('3'):
                return this.data.Nail_3
                break
            case ('2'):
                return this.data.Nail_2
                break
        }//SWITCH
    }//NOMINAL SHEAR CAPACITY

    phi(){
        return this.method == "ASD" ? 0.5 : 0.8
    }

    shearCapacity(){
        return this.phi()*this.nominalShearCapacity()
    }//SHEAR CAPACITY


    //--------------------------------------
    //PARAMETERS
    //--------------------------------------
    params(){
        return {
            Vn : (this.nominalShearCapacity()).toFixed(0),
            phi : (this.phi()).toFixed(2)
        }
    }

}//CLASS
