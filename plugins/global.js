import Vue from 'vue'

import ModuleCard from '@/components/ModuleCard.vue'
import ValueNumber from '@/components/ValueNumber.vue'
import ValueParameter from '@/components/ValueParameter.vue'
import ValueCheck from '@/components/ValueCheck.vue'
import ValueComputed from '@/components/ValueComputed.vue'
import ValueInteraction from '@/components/ValueInteraction.vue'

import ParamsList from '@/components/ParamsList.vue'
import MessageList from '@/components/MessageList.vue'

Vue.component('module-card', ModuleCard)
Vue.component('value-number', ValueNumber)
Vue.component('value-parameter', ValueParameter)
Vue.component('value-check', ValueCheck)
Vue.component('value-computed', ValueComputed)
Vue.component('value-interaction', ValueInteraction)
Vue.component('param-list', ParamsList)
Vue.component('message-list', MessageList)