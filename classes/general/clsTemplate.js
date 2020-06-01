
import _ from 'lodash'

export default class TemplateClass {
    constructor({A1=1,A2=3,A3=4}){
        this.A1 = A1
        this.A2 = A2
        this.A3 = A3
       
    }//CONSTRUCTOR
    
    Mu(){
        return this.A1 * this.A2
    }
    
    fMn(){
        return this.A1 + this.A2 * this.A3
    }

   
    oneParams(){
        return[
            {name : '&phi;M<sub>n</sub>', value:this.fMn(), decimal:2, unit:'k-ft'},
            {name : 'one', value:this.A1, decimal:2, unit:'k'},
            {name : 'two', value:this.A2, decimal:0, unit:''},
        ]
    }//STUD PARAMS

    twoParams(){
        return[
            {name : '&phi;M<sub>n</sub>', value:this.fMn(), decimal:2, unit:'k-ft'},
            {name : 'one', value:this.A1, decimal:2, unit:'k'},
            {name : 'two', value:this.A2, decimal:0, unit:''},
        ]
    }//STUD PARAMS

    threeParams(){
        return[
            {name : '&phi;M<sub>n</sub>', value:this.fMn(), decimal:2, unit:'k-ft'},
            {name : 'one', value:this.A1, decimal:2, unit:'k'},
            {name : 'two', value:this.A2, decimal:0, unit:''},
        ]
    }//STUD PARAMS

    

    



    

    

    
    
   
  } //CLASS