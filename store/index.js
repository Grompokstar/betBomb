import axios from 'axios';
import _ from 'lodash';
import { filterFunctions } from '../libraries/filter_functions';

const STAGE_URL = '185.193.143.78';
const TEST_URL = '185.193.143.156';
let API_APIARY = 'https://private-464b9d-boodet.apiary-mock.com';
let API_USERS = 'http://' + STAGE_URL + '/api/users/v1';
let API_PRODUCTS = 'http://' + STAGE_URL + '/api/products/v1';
let API_RESOURCES = 'http://' + STAGE_URL + '/api/resources/v1';
let API_ACCOUNTING = 'http://' + STAGE_URL + '/api/accounting/v1';
let API_PAYMENT = 'http://' + STAGE_URL + '/api/pay/v1';
let API_ZAMMAD = 'http://185.193.143.72/api/v1';
let API_MONGO = 'http://localhost:8088';

let instance = axios.create({
  timeout: 20000,
  headers: {'Content-Type': 'application/json'}
});

let zammadInstance = axios.create({
  timeout: 20000,
  headers: {'Authorization': 'Token DMP7_8qX2iLy9wCtIpJ7FbXy05lyNvMCivIWoJeVPxV4Xrn48guEl3tbsAWd0nAl'}
});


export const state = () => ({
  events: [],
  locales: ['en', 'ru'],
  locale: 'ru',
  showApp: true,
  token: '',
  user: {
    id: null,
    email: '',
    phone: '',
    first_name: '',
    last_name: ''
  },
  zammadUser: {
    id: null,
    email: '',
    firstname: '',
    lastname: ''
  },
  client: {
    id: null,
    name: '',
    state: ''
  },
  clients: [],
  writeoffs: [],
  currentWriteoffs: [],
  sidebar: false,
  productTemplates: [],
  products: [],
  cloudSpaces: [],
  currentProduct: {
    product_id: null,
    client_id: null,
    name: "",
    created_at: "",
    price: "",
    ip: "",
    state: '',
    machine: {
      boot_disk_size: '',
      client_id: '',
      cloud_id: '',
      cloud_space_id: '',
      cloud_space_name: '',
      cloud_space: {
        name: ''
      },
      created_at: "",
      deleted_at: '',
      id: '',
      image_id: '',
      memory: '',
      name: '',
      product_id: '',
      product_instance_id: '',
      state: "",
      status: "",
      type: "",
      updated_at: "",
      vcpus: '',
    }
  },
  currentMachine: {
    location_id: '',
    boot_disk_size: '',
    client_id: '',
    cloud_id: '',
    cloud_space_id: '',
    created_at: "",
    deleted_at: '',
    id: '',
    image_id: '',
    memory: '',
    name: '',
    partner_id: '',
    product_id: '',
    product_instance_id: '',
    state: "",
    status: "",
    type: "",
    updated_at: "",
    vcpus: '',
  },

  activeProductPage: 'index',
  activeProfilePage: 'settings',
  paymentData: {},
  currentProductPorts: [],
  libraries: {
    locations: [],
    images: []
  },
  tickets: [],
  zammadUser: {
    email: ''
  },
  currentTicket: {
    id: null,
    state_id: 1,
    title: '',
    customer_id: null,
  },
  currentTicketArticles: []
})

export const mutations = {
  setEvents (state, payload) {
    let filterData = payload.data;

    filterData = _.filter(filterData, filterFunctions.startTB);
    filterData = _.filter(filterData, filterFunctions.attacksBot2);
    filterData = _.filter(filterData, filterFunctions.leagueName);
    filterData = _.filter(filterData, filterFunctions.startResultOdd);
    //filterData = _.filter(filterData, filterFunctions.currentTB1stHalf);
    filterData = _.sortBy(filterData, 'time');
    state.events = filterData;
  },

  setProducts (state, payload) {
    state.products = payload;
  },

  setProduct (state, payload) {
    payload.machine = _.find(payload.resources, function(item) {
      return item.type === 'machine'
    });

    payload.machine.cloud_space = {name: ''};
    state.currentProduct = payload;
  },
  setMachine (state, payload) {
    payload.cloud_space = {name: ''};
    state.currentProduct.machine = payload;
  },

  setCurrentMachineCloudSpace (state, payload) {
    state.currentProduct.machine.cloud_space = payload;
  },

  setProductName (state, payload) {
    state.currentProduct.name = payload;
  },

  setProductTemplates (state, payload) {
    state.productTemplates = payload;
  },

  setActiveProductPage (state, payload) {
    state.activeProductPage = payload;
  },

  setToken (state, payload) {
    state.token = payload.token;
    this.$cookies.set('boodet-token', payload.token, {expires: new Date(payload.expired_at)});
    instance.defaults.headers.common['X-Session-Token'] = payload.token;

  },

  setTokenToStore (state, payload) {
    state.token = payload;
    instance.defaults.headers.common['X-Session-Token'] = payload;
  },

  deleteToken (state) {
    state.token = '';
    this.$cookies.remove('boodet-token');
    instance.defaults.headers.common['X-Session-Token'] = '';
  },

  setUser (state, payload) {
    state.user = payload.user;
  },

  setClient (state, payload) {
    state.client = payload.clients[0];
    state.clients = payload.clients.map(function(item) {
      item.created_at = new Date(item.created_at).toLocaleString("ru");
      return item
    }.bind(this));
  },

  setProfile (state, payload) {
    if (payload.status === 200) {
      state.user = payload.data.profile;
      state.client = payload.data.profile.clients[0];
      state.clients = payload.data.profile.clients.map(function(item) {
        item.created_at = new Date(item.created_at).toLocaleString("ru", {day:'numeric', month:'short', year:'numeric'});
        return item
      }.bind(this));
    } else {
      this.$router.push('/authorize');
    }

  },

  updateUser (state, payload) {
    state.user.first_name = payload.profile.first_name;
    state.user.last_name = payload.profile.last_name;
    state.user.phone = payload.profile.phone;
  },

  setActiveProfilePage (state, payload) {
    state.activeProfilePage = payload;
  },

  setImages (state, payload) {
    state.libraries.images = payload.data.images
  },

  setLocations (state, payload) {
    state.libraries.locations = payload.data.locations
  },

  setWriteoffs (state, payload) {
    state.writeoffs = payload.writeoffs;
  },

  setCurrentWriteoffs (state, payload) {
    state.currentWriteoffs = payload;
  },

  setCloudSpaces (state, payload) {
    state.cloudSpaces = payload;
  },

  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
      this.$cookies.set('boodet-locale', locale);
    }
  },

  setVisibleApp (state, payload) {
    state.showApp = payload;
  },

  setPaymentData (state, payload) {
    state.paymentData = payload;
  },

  setVMPorts (state, payload) {
    state.currentProductPorts = payload;
  },

  setVM (state, payload) {
    state.currentMachine = payload.data.machine;
  },

  setTickets (state, payload) {
    let mapedResponce = [];
    _.forEach(payload.assets.Ticket, function(item) {
      mapedResponce.push(item);
    })
    state.tickets = mapedResponce;
  },

  setZammadUser (state, payload) {
    state.zammadUser = payload;
  },

  setTicket (state, payload) {
    state.currentTicket = payload;
  },

  setTicketArticles (state, payload) {
    state.currentTicketArticles = payload;
  }
}


export const actions = {
  async getEvents () {
    try {
      return await axios.get(API_MONGO + '/notes');
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getProducts () {
    try {
      return await instance.get(API_PRODUCTS + '/product_instances?search[states][]=active&search[states][]=failed&search[states][]=processing');
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async createProduct (state, data) {
    try {
      return await instance.post(API_PRODUCTS + '/product_instances', data);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getProduct (state, id) {
    try {
      const response = await instance.get(API_PRODUCTS + '/product_instances/' + id);
      return response.data;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async changeProductName (state, data) {
    try {
      const response = await instance.put(API_PRODUCTS + '/product_instances/' + data.id, data.request);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getProductTemplates () {
    try {
      let response = await instance.get(API_PRODUCTS + '/products');
      return response.data.products;
    } catch (error) {
      console.error(error);
    }
  },

  async stopProduct (state, id) {
    try {
      return await instance.post(API_RESOURCES + '/machines/' + id + '/stop');
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async startProduct (state, id) {
    try {
      return await instance.post(API_RESOURCES + '/machines/' + id + '/start');
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async resetProduct (state, id) {
    try {
      return await instance.post(API_RESOURCES + '/machines/' + id + '/reset');
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async registration (state, data) {
    try {
      return await instance.post(API_USERS + '/register', data);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async authorize (state, data) {
    try {
      return await instance.post(API_USERS + '/session', data);
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  async getUserProfile ({commit}) {
    try {
      commit('setProfile', await instance.get(API_USERS + '/profile'));
    } catch (error) {
      console.error(error);
      commit('setTokenToStore', '');
      this.$router.push('/authorize');
    }
  },

  async userUpdate (state, data) {
    try {
      return await instance.put(API_USERS + '/profile', data);
    } catch (error) {
      console.error(error);
    }
  },

  async getLocations ({commit}) {
    try {
      let response = await instance.get(API_RESOURCES + '/locations');
      commit('setLocations', response);
      return response
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getImages ({commit}) {
    try {
      commit('setImages', await instance.get(API_RESOURCES + '/images'));
    } catch (error) {
      console.error(error);
    }
  },

  async getConfiguratorImages () {
    try {
      return await instance.get(API_RESOURCES + '/images');
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async productInstanceResize (state, data) {
    try {
      return await instance.post(API_PRODUCTS + '/product_instances/' + data.product_id + '/manage', data);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async productInstanceDelete (state, productId) {
    try {
      return await instance.delete(API_PRODUCTS + '/product_instances/' + productId );
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getWriteoffs (state, clientId) {
    try {
      return await instance.get(API_ACCOUNTING + '/writeoffs?client_id=' + clientId);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getCurrentWriteoffs (state, data) {
    try {
      return await instance.get(API_ACCOUNTING + '/writeoffs/show?client_id=' + data.clientId + '&date=' + data.date + '&per_page=99999');
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getConsoleUrl (state, productId) {
    try {
      return await instance.get(API_RESOURCES + '/machines/' + productId + '/console');
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getCloudSpaces (state, data) {
    try {
      return await instance.get(API_RESOURCES + '/cloud_spaces?search[client_ids][]=' + data.clientId + '&search[state][]' + data.state);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getCloudSpace (state, cloudSpaceId) {
    try {
      return await instance.get(API_RESOURCES + '/cloud_spaces/' + cloudSpaceId);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async createPayment (state, data) {
    try {
      return await instance.post(API_PAYMENT + '/payments', data);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getVMPorts (state, machineId) {
    try {
      return await instance.get(API_RESOURCES + '/ports?search[machine_id]=' + machineId);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async createVMPort (state, data) {
    try {
      return await instance.post(API_RESOURCES + '/ports', data);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async updateVMPort (state, data) {
    try {
      return await instance.put(API_RESOURCES + '/ports/' + data.portId, data.requestData);
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  async deleteVMPort (state, data) {
    try {
      return await instance.delete(API_RESOURCES + '/ports/' + data.id);
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  async getVM (state, machineId) {
    try {
      let response = await instance.get(API_RESOURCES + '/machines/' + machineId);
      state.commit('setVM', response);
      return response
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getTickets (state, customerId) {
    try {
      return await zammadInstance.get(API_ZAMMAD + '/tickets/search?query=customer_id:' + customerId);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getZammadUser (state, email) {
    try {
      return await zammadInstance.get(API_ZAMMAD + '/users/search?query=email:"' + email + '"');
    } catch (error) {
      console.error(error);
      return error;
    }
  },


  async createZammadUser (state, data) {
    try {
      return await zammadInstance.post(API_ZAMMAD + '/users', data);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async createTicket (state, data) {
    try {
      return await axios({
        method: 'post',
        url: API_ZAMMAD + '/tickets',
        headers: {
          'Authorization': 'Basic ' + btoa(data.customer + ':boodet_online')
        },
        data: data
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getTicket (state, ticketId) {
    try {
      return await zammadInstance.get(API_ZAMMAD + '/tickets/' + ticketId);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async getTicketArticles (state, ticketId) {
    try {
      return await zammadInstance.get(API_ZAMMAD + '/ticket_articles/by_ticket/' + ticketId);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async createArticle (state, data) {
    try {
      return await axios({
        method: 'post',
        url: API_ZAMMAD + '/ticket_articles',
        headers: {
          'Authorization': 'Basic ' + btoa(data.customer + ':boodet_online')
        },
        data: data
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  }


}

