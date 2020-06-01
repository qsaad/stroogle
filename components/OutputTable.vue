<template>
    <table>
        <thead>
            <tr>
                <th>SYMBOL</th>
                <th>VALUE</th>
                <th>UNIT</th>
                <th>COMMENT</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item,i) in items" :key="i">
                <td v-html="item.name"></td>
                <td v-html="item.value" class="font-weight-bold red--text" ></td>
                <td v-html="item.unit"></td>
                <td v-html="item.comment" valign="left"></td>
            </tr>
        </tbody>
        <tfoot>

        </tfoot>
    </table>
</template>

<script>
export default {
    name:'OutputTable',
    components:{
        
    },//COMPONENTS
    props:{
        items:{type:Array,default:[]},
    },
    data(){
        return{
           
        }//RETURN
    },//DATA
    created(){
       
    },//CREATED
    mounted(){
    },//MOUNTED
    computed:{
       
      
    },//COMPUTED
    methods:{
     
    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>
table{
    width : 100%
}
th {
  text-align: center;
}

th, td {
  border-bottom: 1px solid #ddd;
}

</style>


