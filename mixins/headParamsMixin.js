import nuxtend from 'nuxtend'

const m = {
  async asyncData ({store,params,route}) {
    let arr = _.split(route.path, '/')
    return{
        title : _.get(_.find(store.state.pagesList,{'category':arr[1],'link':arr[2]}),'title'),
        description : _.get(_.find(store.state.pagesList,{'category':arr[1],'link':arr[2]}),'description'),
        root : '/' + arr[1]  
    }//return
  }//async
}//m

export default nuxtend({
  mixins: [m],
  async asyncData (context) {
    return {}
  }
})