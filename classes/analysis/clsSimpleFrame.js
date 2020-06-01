export default class SimpleFrame {
    constructor({ H = 12, L = 22, support = "Pinned", Ib = 100, Ic = 100, E = 29000, method="ASD", w = 1, F = 1}) {
        this.H = H
        this.L = L
        this.support = support
        this.Ib = Ib
        this.Ic = Ic
        this.E = E
        this.method = method
        this.w = w
        this.F = F
    } // CONSTRUCTOR

    beamForces(){
        let ML = 0
        let MR = 0
        let VL = 0
        let VR = 0
        let P = 0
        if(this.support == "Pinned"){
            ML = -this.w*this.L*this.L/12 + this.F/2 *this.H
            MR = -this.w*this.L*this.L/12 - this.F/2 *this.H
        }
        else{
            ML = -this.w*this.L*this.L/12 + this.F/2 *this.H/2
            MR = -this.w*this.L*this.L/12 - this.F/2 *this.H/2
            
        }
        VL = this.w*this.L/2 - this.F*this.H/this.L
        VR = this.w*this.L/2 - this.F*this.H/this.L
        P = this.F

        return [
            {name : "M<sub>L</sub>" , value : ML, unit: 'k-ft'},
            {name : "M<sub>R</sub>" , value : MR, unit: 'k-ft'},
            {name : "V<sub>L</sub>" , value : VL, unit: 'k'},
            {name : "V<sub>R</sub>" , value : VR, unit: 'k'},
            {name : "P" , value : P, unit: 'k'}
        ]
    }//BEAM FORCES

    leftColumnForces(){
        let MB = 0
        let MT = 0
        let VB = 0
        let VT = 0
        let P = 0
        if(this.support == "Pinned"){
            MB = 0
            MT = this.F/2 *this.H
        }
        else{
            MB = this.F/2 *this.H/2
            MT = -this.F/2 *this.H/2
            
        }
        VB = this.F/2
        VT = this.F/2
        P = -this.F*this.H/this.L

        return [
            {name : "M<sub>B</sub>" , value : MB, unit: 'k-ft'},
            {name : "M<sub>T</sub>" , value : MT, unit: 'k-ft'},
            {name : "V<sub>B</sub>" , value : VB, unit: 'k'},
            {name : "V<sub>T</sub>" , value : VT, unit: 'k'},
            {name : "P" , value : P, unit: 'k'}
        ]
    }//LEFT COLUMN FORCES

    rightColumnForces(){
        let MB = 0
        let MT = 0
        let VB = 0
        let VT = 0
        let P = 0
        if(this.support == "Pinned"){
            MB = 0
            MT = -this.F/2 *this.H
        }
        else{
            MB = this.F/2 *this.H/2
            MT = -this.F/2 *this.H/2
            
        }
        VB = this.F/2
        VT = this.F/2
        P =  this.F*this.H/this.L

        return [
            {name : "M<sub>B</sub>" , value : MB, unit: 'k-ft'},
            {name : "M<sub>T</sub>" , value : MT, unit: 'k-ft'},
            {name : "V<sub>B</sub>" , value : VB, unit: 'k'},
            {name : "V<sub>T</sub>" , value : VT, unit: 'k'},
            {name : "P" , value : P, unit: 'k'}
        ]

    }//RIGHT COLUMN FORCES

    leftSupportReactions(){
        let RX = 0
        let RY = 0
        let M = 0

        if(this.support == "Pinned"){
            M = 0
        }
        else{
            M = this.F/2 *this.H/2
        }

        RX = -this.F/2
        RY = - this.F*this.H/this.L

        return [
            {name : "R<sub>X</sub>" , value : RX, unit: 'k'},
            {name : "R<sub>Y</sub>" , value : RY, unit: 'k'},
            {name : "M" , value : M, unit: 'k-ft'},
        ]

    }//LEFT SUPPORT REACTIONS

    rightSupportReactions(){
        let RX = 0
        let RY = 0
        let M = 0

        if(this.support == "Pinned"){
            M = 0
        }
        else{
            M = this.F/2 *this.H/2
        }

        RX = -this.F/2
        RY = this.F*this.H/this.L

        return [
            {name : "R<sub>C</sub>" , value : RX, unit: 'k'},
            {name : "R<sub>Y</sub>" , value : RY, unit: 'k'},
            {name : "M" , value : M, unit: 'k-ft'},
        ]

    }//RIGHT SUPPORT REACTIONS

}//CLASS
