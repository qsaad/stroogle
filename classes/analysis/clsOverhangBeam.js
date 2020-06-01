import _ from 'lodash'

export default class OverhangBeam{
    constructor({L=12,a=2,w=1,E=29000,I=100,P=0,ws=0,wc=0}){
        this.L = L
        this.a = a
        this.w = w
        this.E = E
        this.I = I
        this.P = P
        this.ws = ws
        this.wc = wc
    }//CONSTRUCTOR

    Lx(){
        let L1 = _.concat(_.range(0, this.L , 0.1),this.L )
        let L2 = _.concat(_.range(this.L, this.L + this.a, 0.1),this.L + this.a)
        
        return _.concat(L1,L2)
        //return _.concat(_.range(0, this.L + this.a, 0.1),this.L + this.a)
    }

    NoSeg(){
        return this.Lx().length
    }

    X(){
        return this.L/2*(1- Math.pow(this.a,2)/Math.pow(this.L,2))
    }

    Li(){
        return [ {x:0, y:0}, {x:this.L+this.a, y:0}]
    }

    Mi(){
        let M = []
        let Mw,Mp,Mws,Mwc = 0
        M = _.map(this.Lx(), x =>{
            if(x < this.L){
                Mw = this.w*x*(Math.pow(this.L,2)-Math.pow(this.a,2)-x*this.L)/(2*this.L)
                Mp = this.P*this.a*x/this.L
                Mws = this.ws*x*(this.L-x)/2
                Mwc = this.wc*Math.pow(this.a,2)*x/(2*this.L)
                return {
                    x : x,
                    y : Mw - Mp + Mws - Mwc
                }
            }
            else{
                let x1 = x - this.L
                Mw = this.w*Math.pow(this.a-x1,2)/2
                Mp = this.P*(this.a-x1)
                Mws = 0
                Mwc = this.wc*Math.pow(this.a-x1,2)/2
                return {
                    x : x,
                    y : -Mw - Mp - Mws - Mwc
                }
            }
        })
        return M
    }

    Vi(){
        let V = []
        V = _.map(this.Lx(), x =>{
            if(x < this.L){
                return {
                    x : x,
                    y : this.RL() - this.w*x
                }
            }
            else{
                let x1 = x - this.L
                return {
                    x : x,
                    y : this.w*(this.a-x1)
                }
            }
        })
        return V
    }

    Di(){
        let D = []
        let Dw = 0
        D = _.map(this.Lx(), x =>{
            if(x < this.L){
                Dw = this.w*x*(Math.pow(this.L,4)-2*Math.pow(this.L,2)*Math.pow(x,2)+this.L*Math.pow(x,3)-2*Math.pow(this.a,2)*Math.pow(this.L,2)+2*Math.pow(this.a,2)*Math.pow(x,2))*1728/(24*this.E*this.I*this.L)
                return {
                    x : x,
                    y : Dw
                }
            }
            else{
                let x1 = x - this.L
                Dw = this.w*x1*(4*Math.pow(this.a,2)*this.L-Math.pow(this.L,3)+6*Math.pow(this.a,2).x1-4*this.a*Math.pow(x1,2)+Math.pow(x1,2))*1728/(24*this.E*this.I)
                return {
                    x : x,
                    y : Dw
                }
            }
        })
        return D
    }
    
    //MOMENT SPAN
    MS(){
        let MSw = (this.w/(8*Math.pow(this.L,2)))*Math.pow(this.L+this.a,2)*Math.pow(this.L-this.a,2)
        let MSp = this.P*this.a/2
        let MSws = this.ws*Math.pow(this.L,2)/8
        let MSwc = this.wc*Math.pow(this.a,2)/(2*2)
        return MSw - MSp + MSws - MSwc 
    }
    
    //MOMENT CANTILEVER
    MC(){
        let MCw = this.w*Math.pow(this.a,2)/2
        let MCp = this.P*this.a
        let MCws = 0
        let MCwc = this.wc*Math.pow(this.a,2)/2
        return MCw + MCp + MCws + MCwc 
    }
    
    //LEFT REACTION
    RL(){
        let RLw = (this.w/(2*this.L))*(Math.pow(this.L,2) - Math.pow(this.a,2))
        let RLp = this.P*this.a/this.L
        let RLws = this.ws*this.L/2
        let RLwc = (this.wc*Math.pow(this.a,2))/(2*this.L)
        return RLw + RLp + RLws + RLwc
    }
    
    //RIGHT REACTION
    RR(){
        let RRw = (this.w/(2*this.L))*Math.pow(this.L + this.a, 2)
        let RRp = this.P*(this.L + this.a)/this.L
        let RRws = this.ws*this.L/2
        let RRwc = (this.wc*this.a)*(2*this.L + this.a)/(2*this.L)
        return RRw + RRp + RRws + RRwc
    }
    
    //DEFLECTION CENTER
    DS(){
        let x = this.X()
        let k1 = (this.w*x)/(24*this.E*this.I*this.L)
        let k2 = Math.pow(this.L,4)
        let k3 = 2*Math.pow(this.L,2)*Math.pow(x,2)
        let k4 = this.L*Math.pow(x,3)
        let k5 = 2*Math.pow(this.a,2)*Math.pow(this.L,2)
        let k6 = 2*Math.pow(this.a,2)*Math.pow(x,2)
      
        let DSw = k1*(k2-k3+k4-k5+k6)*1728
        let DSp = 0.0642*this.P*this.a*Math.pow(this.L,2)*1728/(this.E*this.I)
        let DSws = (5*this.ws*Math.pow(this.L,4)*1728)/(384*this.E*this.I)
        let DSwc = 0.0321*this.wc*Math.pow(this.a,2)*Math.pow(this.L,2)*1728/(this.E*this.I)
      
        return DSw - DSp + DSws - DSwc
    }


    //DEFLECTION CANTILEVER
    DC(){
        let x = this.a
        let k1 = (this.w*x)/(24*this.E*this.I)
        let k2 = 4*Math.pow(this.a,2)*this.L
        let k3 = Math.pow(this.L,3)
        let k4 = 6*Math.pow(this.a,2)*x
        let k5 = 4*this.a*Math.pow(x,2)
        let k6 = Math.pow(x,3)
      
        let DCw = k1*(k2-k3+k4-k5+k6)*1728
        let DCp = this.P*Math.pow(this.a,2)*1728*(this.L+this.a)/(3*this.E*this.I)
        let DCws = (this.ws*Math.pow(this.L,3)*this.a*1728)/(24*this.E*this.I)
        let DCwc = (this.wc*this.a)*(4*Math.pow(this.a,2)*this.L + 3*Math.pow(this.a,3))*1728/(24*this.E*this.I)
      
        return DCw + DCp + DCws + DCwc
    }


}//CLASS