import {range,map,max,last} from 'lodash'

export default {
    
}

//---------------------------------------------
//P-DELTA EFFECT
//---------------------------------------------
export function PDelta_Deflection({M=1,L=12,Mcr=12,E=29000,Ig=100,Icr=80}){
    if(M < Mcr){
        return (5*M*L*L*1728)/(48*E*Ig)
    }
    else{
        return (5*Mcr*L*L*1728)/(48*E*Ig) + (5*(M-Mcr)*L*L*1728)/(48*E*Icr)
    }
}

//---------------------------------------------
//EFFECTIVE MOMENT OF INTERTIA
//---------------------------------------------
export function I_effective({M=1,Mcr=12,Ig=100,Icr=80}){
    return Mcr > M ? Ig : Math.pow(Mcr/M, 3)*Ig + (1-Math.pow(Mcr/M),3)*Icr
}


//---------------------------------------------
//SIMPLE BEAM ANALYSIS
//---------------------------------------------
export function simpleBeamUniformLoadDeflection({w=1,L=12,E=29000,I=100}){
    return (5*w*Math.pow(L,4)*1728)/(384*E*I)
}
export function simpleBeamPointLoadDeflection({P=0.5,L=12,a=6,b=6,E=29000,I=100}){
    return (P*a*b*(a+2*b)*Math.pow((3*a*(a+2*b)),0.5)*1728)/(27*E*I*L)
}

export function simpleSpanUniformLoad({w=1,L=10,E=29000,I=100}){
    let Mmax = w * Math.pow(L,2)/8
    let RL = w*L/2
    let RR = w*L/2
    let Dmax = (5*w*Math.pow(L,4)*1728)/(384*E*I)
    let Li = range(0,L,0.5)
    Li.push(L)

    let Mi = map(Li, x => {
        return w*L/2*x - w*Math.pow(x,2)/2
    })

    return {
        Mmax : Mmax,
        RL : RL,
        RR : RR,
        Dmax : Dmax,
        Mi : Mi,
        Vi : [],
        Di : [],
        Li : Li
    }
}


export function singleCantileverUniformLoad({w=1,L=10,a=2,E=29000,I=100}){
    let RL = w*(L*L-a*a)/(2*L)
    let RR = w*Math.pow(L+a,2)/(2*L)

    let Ms = w*Math.pow(L+a,2)*Math.pow(L-a,2)/(8*L*L)
    let Mc = w*a*a/2

    let Li = range(0,L + a,0.5)
    Li.push(L + a)

    let Di = map(Li, x => {
        if(x < L){
            return w*x*(Math.pow(L,4)-2*Math.pow(L,2)*Math.pow(x,2)+L*Math.pow(x,3)-2*Math.pow(a,2)*Math.pow(L,2)+2*Math.pow(a,2)*Math.pow(x,2))*1728/(24*E*I*L)
        }
        else{
            let x1 = x-L
           return  w*x1*(4*Math.pow(a,2)*L-Math.pow(L,3)+6*Math.pow(a,2)*x1-4*a*Math.pow(x1,2)+Math.pow(x1,3))*1728/(24*E*I*L)
        }
    })

    let Ds = max(Di)
    let Dc = last(Di)

    let Mi = map(Li, x => {
        return x <= L ? w*x*(L*L-a*a-x*L)/(2*L) : w*Math.pow(a-(x-L),2)/2
    })


    return {Ms,Mc,RL,RR,Mi,Di,Ds,Dc}

}