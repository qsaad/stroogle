import * as DiaphragmBlockedWind from '@/data/wood/DiaphragmBlockedWind'
import * as DiaphragmUnblockedWind from '@/data/wood/DiaphragmUnblockedWind'
import * as DiaphragmBlockedSeismic from '@/data/wood/DiaphragmBlockedSeismic'
import * as DiaphragmUnblockedSeismic from '@/data/wood/DiaphragmUnblockedSeismic'

export default class Diaphragm {
    constructor({method="ASD",load="Wind",type="Blocked",width=2,panel,nailSpacing='6'}){
        this.method = method
        this.load = load
        this.type = type
        this.width = width
        this.nailSpacing = nailSpacing
        this.panel = panel
        switch(this.load){
            case ('Wind'):
                this.sizeList = this.type == "Blocked" ? DiaphragmBlockedWind.List  : DiaphragmUnblockedWind.List
                break
            case ('Seismic'):
                this.sizeList = this.type == "Blocked" ?  DiaphragmBlockedSeismic.List : DiaphragmUnblockedSeismic.List
                break
        }//SWITCH
        this.data = _.find(this.sizeList, {'Panel': panel, 'Width' : width})
        
    }//CONSTRUCTOR

    nominalShearCapacity(){
        if(this.type == "Blocked"){
            switch(this.nailSpacing){
                case ('6'):
                   return this.data.CPEP_6_Vs 
                    break
                case ('4'):
                    return this.data.CPEP_4_Vs
                    break
                case ('2-1/2'):
                    return this.data.CPEP_2_1_2_Vs
                    break
                case ('2'):
                    return this.data.CPEP_2_Vs 
                    break
            }//SWITCH
        }
        else{
            return this.data.Case_1 
        }
    }

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