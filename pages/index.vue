<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md4>

      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12 class="text-xs-center font-weight-bold display-3 red--text">
            <!-- <v-img src="/name.svg" max-width="500" class="logoImage"></v-img> -->
            STRUCTURAL ZONE
          </v-flex>
          <v-flex xs12 class="text-xs-center ">
            <v-img src="/logo.svg" max-width="75" class="logoImage"></v-img>
          </v-flex>

          <v-flex xs12 class="headline text-xs-center red--text pb-2">
            Design with confidence
          </v-flex>
        </v-layout>
      </v-container>
     
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs6 sm4 md4>
            <v-card hover>
                <v-card-text class="title text-xs-center">
                  <span >Minimalistic</span>
                </v-card-text>
              </v-card>
          </v-flex>
          <v-flex xs6 sm4 md4>
            <v-card hover>
                <v-card-text class="title text-xs-center">
                  <span>Simplistic</span>
                </v-card-text>
              </v-card>
          </v-flex>
          <v-flex xs6 sm4 md4>
            <v-card hover>
                <v-card-text class="title text-xs-center">
                  <span>Modular</span>
                </v-card-text>
              </v-card>
          </v-flex>
          <v-flex xs6 sm4 md4>
            <v-card hover>
                <v-card-text class="title text-xs-center">
                  <span>Graphical</span>
                </v-card-text>
              </v-card>
          </v-flex>
          <v-flex xs6 sm4 md4>
            <v-card hover>
                <v-card-text class="title text-xs-center">
                  <span>Intuitive</span>
                </v-card-text>
              </v-card>
          </v-flex>
          <v-flex xs6 sm4 md4>
            <v-card hover>
                <v-card-text class="title text-xs-center">
                  <span>Practical</span>
                </v-card-text>
              </v-card>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
                  <v-avatar color="red" size="56">
                    <span class="white--text headline">{{activeModuleCount}}</span>
                  </v-avatar>
                  <p class="caption teal--text">Active Design Modules</p>

                  <v-avatar color="red" size="56">
                    <span class="white--text headline">{{futureModuleCount}}</span>
                  </v-avatar>
                  <p class="caption teal--text">Future Modules</p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'

export default {
     middleware: ['auth'],
        components:{
            
        },//COMPONENTS
        data(){
            return{
              
            }//RETURN
        },//DATA
        head(){
            return {
                title: 'Stroogle',
                meta: [
                    { hid: 'description', name: 'description', content: 'Structural Analysis and Design Modules for Concrete, Steel, Coldform, Wood and Masonry' }
                ]
            }
        },//HEAD
        asyncData({store,params,route}){
            return {pagesList : store.state.pagesList}
        },//ASYNCDATA
        created(){

        },//CREATED
        mounted(){
            
            
        },//MOUNTED
        computed:{
          activeModuleCount(){
            return _.filter(this.pagesList,{'active':true}).length
          },
          futureModuleCount(){
            return _.filter(this.pagesList,{'active':false}).length
          }
        },//COMPUTED
        methods:{

        }//METHODS

}//EXPORT DEFAULT
</script>


<style scoped>
.logoImage{
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

