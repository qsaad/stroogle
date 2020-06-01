import BasePressure from '@/classes/analysis/clsBasePressure'

export default class BaseLength extends BasePressure {
    constructor({ L, B, P, M, SBC = 3}) {
        super({ L, B, SBC, P, M})
        this.SBC = SBC
        this.Y = 0
        this.qi = 0
        this.kern = 0
      
    } // CONSTRUCTOR

    e(){
        return this.M/this.P
    }

    Lmin(){
        let Li = 0.5
        let Bi = this.B
        //let qi = 0
        let Ai = 0
        //let Si = 0

        do {
            Ai = Li*Bi
            //Si = Bi*Li*Li/6

            //qi = this.P/Ai + this.M/Si

            if(this.e() > Li/2){
                this.qi = this.SBC + 1
            }
            else{
                this.Y = (this.e() < Li/6) ? 0 : Li/2 - this.e()
                this.qi = (this.e() < Li/6) ? this.P/Ai*(1 + 6*this.e()/Li) : (2*this.P)/(3*Bi*this.Y)
            }
            
            console.log('Li = ' + Li.toFixed(2)  + ' qi = ' + this.qi.toFixed(2) + ' e = ' + this.e())

            Li = Li + 0.1
        }
        while (this.qi > this.SBC); 

        this.kern = Li/6

        return Li
    }


  } //CLASS