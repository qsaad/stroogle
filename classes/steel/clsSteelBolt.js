import Steel from '@/classes/steel/clsSteel'
import * as SizeList  from '@/data/SteelBoltSize'
import * as GradeList  from '@/data/SteelBoltGrade'
import _ from 'lodash'


export default class SteelBolt extends Steel {
    constructor({ method, Fy,size, grade}) {
      super({ method, Fy })
      this.size = size
      this.grade = grade
      
      this.Fnv  = _.map(_.filter(GradeList.List,{"Grade":this.grade}),'Fnv')
      this.Fnt = _.map(_.filter(GradeList.List,{"Grade":this.grade}),'Fnt')
      this.A = _.map(_.filter(SizeList.List,{"Size":this.size}),'A')
    }//CONSTRUCTOR

    shearStressCapacity(){
        return this.Fnv
    }
    tensionStressCapacity(){
        return this.Fnt
    }
    shearCapacity(){
        return this.Fnv*this.A*this.phiV()
    }

    tensionCapacity(){
        return this.Fnt*this.A*this.phiV()
    }
}//CLASS