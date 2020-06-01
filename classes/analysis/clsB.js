import Apple from '@/classes/analysis/clsA'

export default class Bee extends Apple{
    constructor({param_a, param_b = 12}){
        super({param_a})
        this.param_b = param_b
    }

    method_B(){
        return "B : " + this.param_b
    }

}