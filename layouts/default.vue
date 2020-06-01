<template>
  <v-app light>
    <v-navigation-drawer  :clipped="clipped" v-model="drawer" fixed app>
      <v-list>
        <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
          <v-list-tile-action>
            <v-img :src="item.icon" max-width=20></v-img>
            <!-- <v-icon v-html="item.icon"></v-icon> -->
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title >
              <span>{{item.title}}</span>
              <v-avatar color="red" size="20" v-if="moduleCount(item.title) > 0">
                <span class="white--text caption" v-text="moduleCount(item.title)"></span>
              </v-avatar>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
      
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>

      <!-- <v-toolbar-title v-text="title"></v-toolbar-title> -->
     
      <v-img src="/logo.svg" max-width="20"></v-img>
      
      <v-spacer></v-spacer>
      <v-btn icon to="/">
        <v-icon>home</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container grid-list-md fluid class="pa-0 ma-0">
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <v-layout row justify-center>
        <v-flex xs12 class="text-xs-center">
            &copy; {{ new Date().getFullYear() }}
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import {PagesList} from '@/data/pages'

import _ from 'lodash'



export default {
    middleware: [],
    components:{
      
    },//COMPONENTS
    data () {
      return {
        clipped: true,
        drawer: true,
        fixed: true,
        list: [
          //{ icon: 'home', title: 'Home', to: '/' },
          { icon: 'icons/concrete.svg', title: 'Concrete', to: '/concrete' },
          { icon: 'icons/steel.svg', title: 'Steel', to: '/steel' },
          { icon: 'icons/base.svg', title: 'Foundation', to: '/foundation' },
          { icon: 'icons/wood.svg', title: 'Wood', to: '/wood' },
          { icon: 'icons/masonry.svg', title: 'Masonry', to: '/masonry' },
          { icon: 'icons/coldform.svg', title: 'Coldform', to: '/coldform' },
          { icon: 'icons/beam.svg', title: 'Analysis', to: '/analysis' },
          { icon: 'icons/concrete.svg', title: 'General', to: '/general' },
          { icon: 'icons/snow.svg', title: 'Snow', to: '/snow' },
          { icon: 'icons/wind.svg', title: 'Wind', to: '/wind' },
          { icon: 'icons/seismic.svg', title: 'Seismic', to: '/seismic' },
          { icon: 'icons/documents.svg', title: 'Code', to: '/code' },
          { icon: 'icons/specification.svg', title: 'Specification', to: '/specification' },
          { icon: 'icons/specification.svg', title: 'Wiki', to: '/wiki' },
          { icon: 'icons/checkbox.svg', title: 'Checklist', to: '/checklist' },
        ],
        //miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'STROOGLE',
      }//RETURN
    },//DATA
    created(){

    },//CREATED
    mounted(){

    },//MOUNTED
    computed:{
      items(){
        return _.orderBy(this.list,'title')
      },
      
    },//COMPUTED
    methods:{
      moduleCount(title){
        let count =   _.filter(PagesList, {'category':_.lowerCase(title), 'active':true}).length 
        return count > 0 ? count : '' 
      }//MODULE COUNT
      
    }//METHODS
  }//EXPORT
</script>
