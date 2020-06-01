import Concrete from '@/classes/concrete/clsConcrete'

export default class DevelopmentLength extends Concrete {
    constructor({ b=12 , h=12 , rebarQty=2 , rebarSize="#5" , fc=3000, Fy=60 , cov,spa = 12, location="Top", coating="Uncoated", concreteType="Normal Wt"}) {
        super({ b , h , rebarQty , rebarSize , fc, Fy , cov })
        this.spa = spa
        this.location = location
        this.coating = coating
        this.concreteType = concreteType
        this.Ktr = 0

    } // CONSTRUCTOR

    Cb(){
        console.log(Math.min(this.cov + this.db()/2, this.spa/2))
        return Math.min(this.cov + this.db()/2, this.spa/2)
    }

    sig_t(){
        return this.location == 'Top' ? 1.3 : 1
    }

    sig_e(){
        return this.coationg == 'Coated' ? 1.2 : 1
    }

    sig_s(){
        return this.db() <= 0.625 ? 0.8 : 1
    }

    lambda(){
        return this.concreteType == 'Normal Wt' ? 1 : 1.3
    }

    Ld(){
        let k1 = this.sig_t()*this.sig_e()*this.sig_s()*this.lambda()
        let k2 = (this.Cb()+this.Ktr)/this.db()
        return (3/40)*(this.Fy/Math.pow(this.fc,0.5))*(k1/k2)*this.db()
    }

    Ldc(){
        let k1 = 0.02*this.Fy*this.db()/Math.pow(this.fc,0.5)
        let k2 = 0.0003*this.Fy*this.db()
        return Math.min(k1, k2)
    }

    Ldh(){
        let k1 = 0.02*this.Fy*this.sig_e()*this.lambda()*this.db()/Math.pow(this.fc,0.5)
        let RF1 = this.cov > 2.5 ? 0.7 : 1
        let RF2 = 1

        return Math.max(k1,8*this.db(),6)*RF1*RF2
    }
  
    params(){
        return{
            Cb : this.Cb(),
            db : this.db(),
            fc : this.fc,
            Fy : this.Fy,
            sig_t : this.sig_t(),
            sig_e : this.sig_e(),
            sig_s : this.sig_s(),
            lambda : this.lambda()
        }
    }

    rebarParams(){
        return[
            {name : 'C<sub>b</sub>', value:this.Cb(), decimal:2, unit:''},
            {name : 'd<sub>B</sub>', value:this.db(), decimal:2, unit:'in'},
            {name : 'f<sub>c</sub>', value:this.fc, decimal:0, unit:'psi'},
            {name : 'F<sub>y</sub>', value:this.Fy, decimal:0, unit:'psi'},
            {name : '&psi;<sub>t</sub>', value:this.sig_t(), decimal:2, unit:'k'},
            {name : '&psi;<sub>e</sub>', value:this.sig_e(), decimal:2, unit:'k'},
            {name : '&psi;<sub>s</sub>', value:this.sig_s(), decimal:2, unit:'k'},
            {name : '&lambda;', value:this.lambda(), decimal:2, unit:'k'},
        ]
    }//STUD PARAMS
   

  } //CLASS