import * as ScrewList  from '@/data/CFM_Screw'
import * as SheetList  from '@/data/CFM_Sheet'

import _ from 'lodash'

export const coldform =  {
    data(){
        return{
            screwSizeList :[],
            screwSize : '#10',
            sheetThicknessList : [],
            t1 : '20',
            t2 : '20',
            methodList : ['ASD','LRFD'],
            method : 'ASD',
            weldGradeList : [60, 70],
            weldGrade : 60,
            grooveWeldTypeList : ['Bevel', 'V'],
            grooveWeldType : 'Bevel'
        }
    },//DATA
    created(){
        this.screwSizeList = _.map(ScrewList.List,"Size")
        this.sheetThicknessList = _.map(SheetList.List,"Size")
    },
    computed:{
       
        
    },
    methods:{
       
    }//METHODS
}//EXPORT