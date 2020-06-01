import {PagesList} from '@/data/pages'
import _ from 'lodash'

export const strict = false

export const state = () => ({
  pagesList : PagesList,
 
})
//STATE
export const getters = {
  getPagesList : state => state.pagesList,
}//GETTER

export const mutations = {
  ANALYSIS_COUNT(state,payload){
    state.analysisCount += payload
  },
 

}//MUTATIONS

export const actions = {
  analysisCount : (context,payload) => {context.commit("ANALYSIS_COUNT",payload)},
}//ACTIONS
