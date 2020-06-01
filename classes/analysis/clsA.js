export default class Apple{
    constructor({param_a = 10}){
        this.param_a = param_a
    }

    method_A(){
        return "A  : " + this.param_a
    }

}