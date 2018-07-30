import Vue from 'vue'
import CxltToastr from 'cxlt-vue2-toastr'

const toastrConfigs = {
  position: 'top right',
  timeOut: 7000
}
Vue.use(CxltToastr, toastrConfigs);
