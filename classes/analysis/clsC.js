import Bee from '@/classes/analysis/clsB'

export default class Cat extends Bee {
    constructor({param_a,param_b}){
        super({param_a, param_b})
    }

    method_C_A(){
        return this.method_A()
    }

    method_C_B(){
        return this.method_B()
    }

}