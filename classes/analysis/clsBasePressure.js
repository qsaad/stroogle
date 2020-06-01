import _ from 'lodash'

export default class BasePressure {
    constructor({ L = 3, B = 3, H = 0,  P = 1, M = 5, V = 0}) {
        this.L = L //BASE LENGTH
        this.B = B //BASE WIDTH
        this.H = H //BASE DEPTH
        this.P = P //AXIAL LOAD
        this.V = V //SHEAR LOAD
        this.M = M + (this.V * this.H)  //MOMENT LOAD
    } // CONSTRUCTOR

    A(){
        return this.L*this.B
    }//BASE AREA

    S(){
        return this.B*this.L*this.L/6
    }//BASE SECTION MODULUS

    e(){
        return this.M/this.P
    }//ECCENTRICITY

    Y(){
        if(this.e() < this.L/6){
            return 0
        }
        else{
            return this.L/2 - this.e()
        }
    }
  
    qmax() {
        if(this.e() < this.L/6){
            return this.P/this.A()*(1 + 6*this.e()/this.L)
        }
        else{
            return (2*this.P)/(3*this.B*this.Y())
            //return 4*this.P/(3*this.B*(this.L - 2*this.e()))
        }
    } //QMAX

    qmin() {
        if(this.e() < this.L/6){
            return this.P/this.A()*(1 - 6*this.e()/this.L)
        }
        else{
            return 0
        }
    } //QMIN

  } //CLASS