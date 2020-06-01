import * as BoltSizeList  from '@/data/SteelBoltSize'
import * as BoltGradeList  from '@/data/SteelBoltGrade'
import * as AnchorGradeList  from '@/data/SteelAnchorGrade'

import _ from 'lodash'

export const steel =  {
    data(){
        return{
            boltSizeList :[],
            boltSize : '3/4',
            boltGradeList : [],
            boltGrade : 'A325N',

            methodList : ['ASD','LRFD'],
            method : 'ASD',
            E : 29000,
            anchorSizeList : ['1/2','5/8','3/4','7/8','1','1 1/8','1 1/4', '1 1/2'],
            anchorSize : '3/4',
            anchorGradeList : [],
            anchorGrade : 'F1554 GR 36-X',
            anchorGradeData : [],
            axisList : ['Strong','Weak'],
            axis : 'Strong',
            plateGradeList : [36,50],
            plateGrade : 36,
        }//RETURN
    },//DATA
    created(){
        this.boltSizeList = _.map(BoltSizeList.List,"Size")
        this.boltGradeList = _.map(BoltGradeList.List,"Grade")
        this.anchorGradeList = _.map(AnchorGradeList.List,"Grade")
        this.anchorGradeData = AnchorGradeList.List

    },//CREATED
    computed:{
       
    },//COMPUTED
    methods:{
       
    }//METHODS
}//EXPORT