<template>
  <div>
    <v-container>
      <v-layout mmt-5>
        <v-flex>
          <h1 class="font-xxl">{{$t('configurator.title')}}</h1>
        </v-flex>
        <v-flex class="text-xs-right">
          <span class="total-price"><span class="price-output">{{totalPrice}}</span>&nbsp;<span class="ruble">&#8381;</span></span>
        </v-flex>
      </v-layout>
    </v-container>
    <div id="configurator">
      <v-container>

        <v-tabs
          v-model="active"
          color="grey lighten-3"
        >
          <v-tab :ripple ="false" v-if="!isAuthorized">{{$t('configurator.tabs.signUp')}}</v-tab>
          <v-tab :ripple ="false" @click="goToStep2" v-if="productType !== 'vdc'">{{$t('configurator.tabs.configuration')}}</v-tab>
          <v-tab :ripple ="false" @click="goToStep3" v-if="productType !== 'vdc'">{{$t('configurator.tabs.options')}}</v-tab>
          <v-tab :ripple ="false" v-if="productType === 'vdc'">{{$t('configurator.tabs.configuration')}}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="active">
          <v-tab-item class="mmt-4" v-if="!isAuthorized">
            <v-form v-model="isValidRegistrationForm" ref="accountForm" lazy-validation>
              <div class="bordered-block__15-20 mmb-2">
                <div class="font-xl bold mmb-3">
                  {{ $t('registrationPage.account') }}
                </div>

                <v-layout>
                  <v-flex xs12 md3 class="form-group">
                    <v-text-field
                      class="mmt-3"
                      label="E-mail"
                      v-model.trim="registrationForm.email"
                      :rules="emailRules"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3 class="form-group">
                    <v-text-field
                      class="mmt-3 phone-field"
                      :label="$t('registrationPage.phone')"
                      v-model="registrationForm.phone"
                      :rules="phoneRules"
                      mask="+#(###)-###-##-##"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3 class="form-group">
                    <v-text-field
                      class="mmt-3"
                      :label="$t('registrationPage.password')"
                      type="password"
                      v-model.trim="registrationForm.password"
                      :rules="passwordRules"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex>
                    <v-checkbox class="mmt-1"
                                v-model="isTwoFactor"
                                :label="$t('registrationPage.twoStepVerification')"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
                <v-layout v-if="isTwoFactor">
                  <v-flex xs12 md3 class="form-group">
                    <v-text-field
                      class="mmt-2"
                      :label="$t('registrationPage.code')"
                      v-model="confirmationCode"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </div>

              <div class="bordered-block__15-20 mmb-4">
                <!--<div class="font-xl bold mmb-3">
                  Тип учетной записи
                </div>
                <v-layout>
                  <v-flex xs12 md4 class="mmb-3">
                    <v-radio-group v-model="clientForm.business_entity_type" :column="false">
                      <v-radio
                        label="Физ. лицо"
                        value="individual"
                      ></v-radio>
                      <v-radio
                        label="Юр. лицо"
                        value="legal"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                </v-layout>-->

                <v-layout v-if="clientForm.business_entity_type === 'individual'" class="mmt-4">
                  <v-flex xs12 md3 class="form-group">
                    <v-text-field
                      :label="$t('registrationPage.name')"
                      v-model.trim="registrationForm.first_name"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3 class="form-group">
                    <v-text-field
                      :label="$t('registrationPage.secondName')"
                      v-model.trim="registrationForm.last_name"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout v-if="clientForm.business_entity_type === 'legal'">
                  <v-flex xs12 md5 class="form-group">
                    <v-text-field
                      label="Наименование юридического лица"
                      v-model.trim="registrationForm.company_name"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <!--<div>currency: {{clientForm.currency}}</div>
                <div>writeoff_type: {{clientForm.writeoff_type}}</div>
                <div>writeoff_interval: {{clientForm.writeoff_interval}}</div>-->
              </div>
            </v-form>

            <v-layout>
              <v-flex>
                <v-checkbox v-model="isAgreeContractOffer"
                            :label="$t('registrationPage.agree')"
                ></v-checkbox>
              </v-flex>
            </v-layout>

            <button class="boodet-btn width-170 mmt-2"
                    @click="goToStep2"
                    :disabled="!isValidRegistrationForm || !isAgreeContractOffer">{{$t('configurator.form.nextStep')}}</button>

          </v-tab-item>
          <v-tab-item class="mmt-4 ppl-1" v-if="productType !== 'vdc'">

            <v-form v-model="isValidStep2" ref="step2Form">
              <v-layout>
                <v-flex md6>
                  <v-autocomplete class="mmt-3"
                                  :items="selectVdcLocation"
                                  v-model="selectVdcLocationValue"
                                  :label="$t('configurator.form.location')"
                                  :rules="requireRule"
                                  autocomplete>
                  </v-autocomplete>
                </v-flex>
              </v-layout>

              <v-layout v-if="!selectCloudSpaceValue">
                <v-flex md6>
                  <v-text-field class="mmt-3"
                                v-model.trim="cloudSpaceName"
                                :label="$t('configurator.form.cloudSpaceName')"
                                :rules="vmNameRules"
                                required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout v-else>
                <v-flex md6>
                  <v-autocomplete class="mmt-3"
                                  :items="selectCloudSpace"
                                  v-model="selectCloudSpaceValue"
                                  :label="$t('configurator.form.cloudSpace')"
                                  :rules="requireRule"
                                  autocomplete>
                  </v-autocomplete>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex md6>
                  <v-text-field class="mmt-3"
                                v-model.trim="vmName"
                                :label="$t('configurator.form.vmName')"
                                :rules="vmNameRules"
                                required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md6>
                  <v-text-field class="mmt-3"
                                v-model="vmDescription"
                                :label="$t('configurator.form.vmDescription')"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex md6>
                  <v-autocomplete class="mmt-3"
                                  :items="selectOs"
                                  v-model="selectOsValue"
                                  :label="$t('configurator.form.image')"
                                  item-text="text"
                                  item-value="value"
                                  return-object
                                  :rules="requireRule"
                                  autocomplete>
                  </v-autocomplete>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex md6 class="slider-form-group without-label mmt-3">
                  <v-text-field
                    v-model="computedCPU"
                    label="CPU"
                    disabled
                  ></v-text-field>
                  <v-slider v-model="sliderCPUValue" max="9" @input="changeCPU"></v-slider>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex md6 class="slider-form-group without-label mmt-3">
                  <v-text-field
                    v-model="computedRAM"
                    label="RAM"
                    disabled
                  ></v-text-field>
                  <v-slider v-model="sliderRAMValue" max="13" @input="changeRAM"></v-slider>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex md6 class="slider-form-group without-label mmt-3">
                  <v-text-field
                    v-model="computedBootDisk"
                    :label="$t('configurator.form.bootDiskSize')"
                    disabled
                  ></v-text-field>
                  <v-slider v-model="sliderBootDiskValue" :min="minBootDiskSize" max="7"></v-slider>
                </v-flex>
              </v-layout>

              <!--<v-layout>
                <v-flex md6>
                  <div id="additional-disks">
                    <additional-disk @removeDisk="removeDisk"
                                     @changeDiskSize="changeAdditionalDiskSize"
                                     @changeDiskSpeed="changeAdditionalDiskSpeed"
                                     @changeDiskType="changeAdditionalDiskType"
                                     v-for="item in additionalDisks"
                                     :mainPage="false"
                                     :key="item.key"
                                     :diskIndex="item.id"
                                     :diskType="item.type"
                                     :sliderDiskSizeValue="item.diskSize"
                                     :sliderDiskSpeedValue="item.diskSpeed">

                    </additional-disk>
                  </div>
                </v-flex>
              </v-layout>

              <v-layout mmt2 mmb-5>
                <v-flex md6>
                  <a @click="addDisk" id="add-disk" class="orange-link">Добавить диск</a>
                </v-flex>
              </v-layout>-->
            </v-form>

            <button class="boodet-btn width-170 mmt-2"
                    @click="goToStep3"
                    :disabled="!isValidStep2">{{$t('configurator.form.nextStep')}}</button>

          </v-tab-item>
          <v-tab-item class="mmt-4 ppl-1" v-if="productType !== 'vdc'">
            <v-form v-model="isValidStep3" ref="step3Form">
              <v-layout>
                <v-flex md6 class="slider-form-group without-label mmt-3">
                  <v-text-field
                    v-model="computedBandwidth"
                    :label="$t('configurator.form.bandwidth')"
                    disabled
                  ></v-text-field>
                  <v-slider v-model="sliderBandwidthValue" max="9"></v-slider>
                </v-flex>
              </v-layout>

              <!--<v-layout>
                <v-flex md8 class="mmt-2 mmb-3" >
                  <div class="font-sm mmb-1">Расписание бэкапов</div>
                  <table class="backup-table">
                    <thead>
                    <tr>
                      <th></th>
                      <th>пн</th>
                      <th>вт</th>
                      <th>ср</th>
                      <th>чт</th>
                      <th>пт</th>
                      <th>сб</th>
                      <th>вс</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Full</td>
                      <td>
                        <input id="monday-full" type="radio" name="monday" value="full" hidden v-model="backup.monday"/>
                        <label for="monday-full" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="tuesday-full" type="radio" name="tuesday" value="full" hidden v-model="backup.tuesday"/>
                        <label for="tuesday-full" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="wednesday-full" type="radio" name="wednesday" value="full" hidden v-model="backup.wednesday"/>
                        <label for="wednesday-full" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="thursday-full" type="radio" name="thursday" value="full" hidden v-model="backup.thursday"/>
                        <label for="thursday-full" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="friday-full" type="radio" name="friday" value="full" hidden v-model="backup.friday"/>
                        <label for="friday-full" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="saturday-full" type="radio" name="saturday" value="full" hidden v-model="backup.saturday"/>
                        <label for="saturday-full" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="sunday-full" type="radio" name="sunday" value="full" hidden v-model="backup.sunday"/>
                        <label for="sunday-full" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                    </tr>
                    <tr>
                      <td>Incremental</td>
                      <td>
                        <input id="monday-inc" type="radio" name="monday" value="inc" hidden v-model="backup.monday"/>
                        <label for="monday-inc" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="tuesday-inc" type="radio" name="tuesday" value="inc" hidden v-model="backup.tuesday"/>
                        <label for="tuesday-inc" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="wednesday-inc" type="radio" name="wednesday" value="inc" hidden v-model="backup.wednesday"/>
                        <label for="wednesday-inc" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="thursday-inc" type="radio" name="thursday" value="inc" hidden v-model="backup.thursday"/>
                        <label for="thursday-inc" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="friday-inc" type="radio" name="friday" value="inc" hidden v-model="backup.friday"/>
                        <label for="friday-inc" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="saturday-inc" type="radio" name="saturday" value="inc" hidden v-model="backup.saturday"/>
                        <label for="saturday-inc" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="sunday-inc" type="radio" name="sunday" value="inc" hidden v-model="backup.sunday"/>
                        <label for="sunday-inc" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                    </tr>
                    <tr>
                      <td>Differential</td>
                      <td>
                        <input id="monday-dif" type="radio" name="monday" value="dif" hidden v-model="backup.monday"/>
                        <label for="monday-dif" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="tuesday-dif" type="radio" name="tuesday" value="dif" hidden v-model="backup.tuesday"/>
                        <label for="tuesday-dif" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="wednesday-dif" type="radio" name="wednesday" value="dif" hidden v-model="backup.wednesday"/>
                        <label for="wednesday-dif" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="thursday-dif" type="radio" name="thursday" value="dif" hidden v-model="backup.thursday"/>
                        <label for="thursday-dif" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="friday-dif" type="radio" name="friday" value="dif" hidden v-model="backup.friday"/>
                        <label for="friday-dif" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="saturday-dif" type="radio" name="saturday" value="dif" hidden v-model="backup.saturday"/>
                        <label for="saturday-dif" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                      <td>
                        <input id="sunday-dif" type="radio" name="sunday" value="dif" hidden v-model="backup.sunday"/>
                        <label for="sunday-dif" class="radio-as-checkbox" @click="reverseValue($event)"></label>
                      </td>
                    </tr>
                    </tbody>

                  </table>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex md3 class="mmt-3 form-group">
                  <v-autocomplete :items="selectTime"
                            v-model="selectTimeValue"
                            label="Время старта сессии"
                            autocomplete>
                  </v-autocomplete>
                </v-flex>
                <v-flex md3 class="mmt-3 form-group">
                  <v-autocomplete :items="selectTimeRange"
                            v-model="selectTimeRangeValue"
                            label="Длительность хранения бэкапа"
                            autocomplete>
                  </v-autocomplete>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex md6 class="mmt-3" >
                  <div class="font-sm mmb-1">Папка бэкапа</div>
                  <v-radio-group
                    v-model="isCustomBackupFolder"
                    :column="false"
                    class="mmb-2">
                    <v-radio
                      label="Стандартная"
                      :value="false">
                    </v-radio>
                    <v-radio
                      label="Кастомная"
                      :value="true">
                    </v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>

              <v-layout v-if="isCustomBackupFolder">
                <v-flex md6>
                  <v-text-field
                    v-model="customBackupFolderPath"
                    label="Путь к папке"
                  ></v-text-field>
                </v-flex>
              </v-layout>-->
            </v-form>

            <button class="boodet-btn width-170 mmt-2"
                    @click="sendConfiguration"
                    :disabled="!isValidStep3">{{ $t('button.save') }}</button>

          </v-tab-item>
          <v-tab-item class="mmt-4 ppl-1" v-if="productType === 'vdc'">

            <v-form v-model="isValidStep2" ref="step2Form">
              <v-layout>
                <v-flex md6>
                  <v-autocomplete class="mmt-3"
                                  :items="selectVdcLocation"
                                  v-model="selectVdcLocationValue"
                                  :label="$t('configurator.form.location')"
                                  :rules="requireRule"
                                  autocomplete>
                  </v-autocomplete>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex md6>
                  <v-text-field class="mmt-3"
                                v-model.trim="vmName"
                                :label="$t('configurator.form.vdcName')"
                                :rules="vmNameRules"
                                required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md6>
                  <v-text-field class="mmt-3"
                                v-model="vmDescription"
                                :label="$t('configurator.form.vdcDescription')"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>

            <button class="boodet-btn width-170 mmt-2"
                    @click="sendConfiguration"
                    :disabled="!isValidStep2">{{ $t('button.save') }}</button>

          </v-tab-item>
        </v-tabs-items>

      </v-container>
    </div>
  </div>

</template>

<script>

  import AdditionalDisk from '~/components/AdditionalDisk.vue';
  import _ from 'lodash';
  import { vdcLocation, osLibrary } from '../libraries/configurator_library.js';
  import { validationFunctions } from '../libraries/validation_functions';
  import { makeErrorObject } from '../libraries/helpers'

  export default {

    components: {
      AdditionalDisk
    },

    created() {
      let productTemplate = _.find(this.$store.state.productTemplates, function(item) {
        return item.id === parseInt(this.$route.query.product_id);
      }.bind(this));

      if (productTemplate) {
        this.productType = productTemplate.type
      }

      this.$store.dispatch('getLocations').then(response => {
        this.selectVdcLocation = response.data.locations.map(function(location) {
          let newLocation = {};
          newLocation.text = location.code;
          newLocation.value = location.id;
          return newLocation
        })

        this.selectVdcLocationValue = response.data.locations[0].id;

        this.$store.dispatch('getConfiguratorImages').then(response => {
          let filteredImages = _.filter(response.data.images, function(item) {
            return item.location_id === this.selectVdcLocationValue
          }.bind(this));

          this.selectOs = filteredImages.map(function(image) {
            let newImage = {};
            newImage.text = image.name;
            newImage.value = image.id;
            return newImage
          });

          this.selectOsValue = this.selectOs[0];

        });
      });

      if (this.isAuthorized) {
        this.$store.dispatch('getUserProfile')
          .then(()=> {
            this.$store.dispatch('getCloudSpaces', {clientId: this.$store.state.client.id, state: 'active'})
              .then(response => {
                if (response.status === 200) {
                  this.$store.commit('setCloudSpaces', response.data.cloud_spaces);

                  let filteredCloudSpaces = _.filter(response.data.cloud_spaces, function(item) {
                    return item.location_id === this.selectVdcLocationValue
                  }.bind(this));

                  this.selectCloudSpace = filteredCloudSpaces.map(function(cloudSpace) {
                    let cloudSpaceSelectItem = {};
                    cloudSpaceSelectItem.text = cloudSpace.name;
                    cloudSpaceSelectItem.value = cloudSpace.id;
                    return cloudSpaceSelectItem
                  })

                  if  (this.selectCloudSpace.length > 0) {
                    this.selectCloudSpaceValue = this.selectCloudSpace[0].value;
                  } else {
                    this.selectCloudSpaceValue = '';
                  }
                } else {
                  this.$toast.error(makeErrorObject(response))
                }
              });
          })
      }






      /*if (this.$store.state.token) {
        this.$store.dispatch('getProducts')
          .then(response => {
            if (response.status === 200) {
              let vdcData = _.find(response.data.product_instances, function(item) {
                let cloudSpace = _.find(item.resources, function(item) {
                  return item.type === 'cloud_space' && item.state === 'active';
                });
                return item.state === 'active' && cloudSpace;
              });



              if (vdcData) {
                this.cloudSpaceId = _.find(vdcData.resources, function(item) {
                  return item.type === 'cloud_space';
                }).id;
              }

            } else {
              this.$toast.error(makeErrorObject(response))
            }
          });
      }*/

      if (this.$route.query.vcpus) {
        this.selectOsValue = parseInt(this.$route.query.os);
        this.sliderCPUValue = parseInt(this.$route.query.vcpus);
        this.sliderRAMValue = parseInt(this.$route.query.memory);
        this.sliderBootDiskValue = parseInt(this.$route.query.bootDiskSize);
        this.sliderBandwidthValue = parseInt(this.$route.query.bandwidth);
      }
    },

    mounted() {
      $('input[required], textarea[required]').prev().addClass('require');
    },

    data() {
      return {
        productType: 'vm',
        isValidRegistrationForm: false,
        isValidStep1: false,
        isValidStep2: false,
        isValidStep3: false,
        isAgreeContractOffer: false,
        registrationForm: {
          email: '',
          phone: '',
          first_name: '',
          last_name: '',
          password: '',
          company_name: ''
        },
        clientForm: {
          business_entity_type: 'individual',
          name: '',
          currency: 'rub',
          writeoff_type: 'prepaid',
          writeoff_interval: 0
        },

        isTwoFactor: false,
        confirmationCode: '',
        emailRules: [
          validationFunctions.require.bind(this),
          validationFunctions.testEmail.bind(this)
        ],
        phoneRules: [
          validationFunctions.testPhone.bind(this)
        ],
        passwordRules: [
          validationFunctions.require.bind(this),
          validationFunctions.minLength6.bind(this)
        ],
        nameRules: [
          validationFunctions.require.bind(this),
          validationFunctions.minLength3.bind(this),
          validationFunctions.testName.bind(this)
        ],
        vmNameRules: [
          validationFunctions.require.bind(this),
          validationFunctions.minLength3.bind(this),
          validationFunctions.testVmName.bind(this)
        ],
        requireRule: [
          validationFunctions.require.bind(this)
        ],
        active: 0,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        selectOs: [],
        selectOsValue: {value: 12},
        selectTime: [
          {text: '00:01', value: '00:01'},
          {text: '01:00', value: '01:00'},
          {text: '02:00', value: '02:00'},
          {text: '03:00', value: '03:00'},
          {text: '04:00', value: '04:00'},
          {text: '05:00', value: '05:00'},
          {text: '06:00', value: '06:00'},
          {text: '07:00', value: '07:00'},
          {text: '08:00', value: '08:00'},
          {text: '09:00', value: '09:00'},
          {text: '10:00', value: '10:00'},
          {text: '11:00', value: '11:00'},
          {text: '12:00', value: '12:00'},
          {text: '13:00', value: '13:00'},
          {text: '14:00', value: '14:00'},
          {text: '15:00', value: '15:00'},
          {text: '16:00', value: '16:00'},
          {text: '17:00', value: '17:00'},
          {text: '18:00', value: '18:00'},
          {text: '19:00', value: '19:00'},
          {text: '20:00', value: '20:00'},
          {text: '21:00', value: '21:00'},
          {text: '22:00', value: '22:00'},
          {text: '23:00', value: '23:00'}
        ],
        selectTimeValue: '00:01',
        selectTimeRange: [
          {
            text: '30 дней',
            value: '30'
          },
          {
            text: '60 дней',
            value: '60'
          },
          {
            text: '90 дней',
            value: '90'
          }
        ],
        selectTimeRangeValue: '30',
        selectVdcLocation: [],
        selectVdcLocationValue: 1,
        cloudSpaceName: '',
        selectCloudSpace: [],
        selectCloudSpaceValue: '',
        cpuArray: [1, 2, 4, 6, 8, 12, 16, 24, 32, 48],
        ramArray: [512, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 224],
        bootDiskArray: [10, 20, 60, 100, 250, 500, 1000, 2000],
        bandwidthArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        sliderCPUValue: 0,
        sliderRAMValue: 1,
        sliderBootDiskValue: 0,
        sliderBandwidthValue: 0,
        externalIpValue: false,
        vdcName: '',
        vdcDescription: '',
        vmName: '',
        vmDescription: '',
        isCustomBackupFolder: false,
        customBackupFolderPath: '',
        backup: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        },
        emailValue: '',
        additionalDiskCount: 0,
        additionalDisks: [],
        showPreloader: false,
        cloudSpaceId: null,
      }

    },

    watch: {
      selectVdcLocationValue (val) {
        let filteredImages = _.filter(this.$store.state.libraries.images, function(item) {
          return item.location_id === val
        }.bind(this));

        let filteredCloudSpaces = _.filter(this.$store.state.cloudSpaces, function(item) {
          return item.location_id === val
        }.bind(this));

        let UbuntuOsId = null;

        this.selectOs = filteredImages.map(function(image) {
          let newImage = {};
          newImage.text = image.name;
          newImage.value = image.id;
          return newImage
        });

        this.selectCloudSpace = filteredCloudSpaces.map(function(cloudSpace) {
          let cloudSpaceSelectItem = {};
          cloudSpaceSelectItem.text = cloudSpace.name;
          cloudSpaceSelectItem.value = cloudSpace.id;
          return cloudSpaceSelectItem
        })

        this.selectOsValue = this.selectOs[0];

        if  (this.selectCloudSpace.length > 0) {
          this.selectCloudSpaceValue = this.selectCloudSpace[0].value;
        } else {
          this.selectCloudSpaceValue = '';
        }

      }
    },

    computed: {
      computedCPU: function() {
        return this.cpuArray[this.sliderCPUValue];
      },
      computedRAM: function() {
        if (this.sliderRAMValue === 0 ) {
          return this.ramArray[this.sliderRAMValue] + ' MB';
        } else {
          return this.ramArray[this.sliderRAMValue] + ' GB';
        }
      },
      computedBootDisk: function() {
        return this.bootDiskArray[this.sliderBootDiskValue] + ' GB';
      },
      computedBandwidth: function() {
        return this.bandwidthArray[this.sliderBandwidthValue] + ' Мбит/с';
      },

      isConfigBackup: function() {
        let result = false;

        for (let key in this.backup) {
          if (this.backup[key]) {
            result = true;
          }
        }

        return result;
      },

      minBootDiskSize: function() {
        if (this.selectOsValue.text && this.selectOsValue.text.indexOf('Windows') !== -1) {
          return 2;
        } else {
          return 0;
        }
      },

      totalPrice: function () {
        let price = 0;

        if (this.productType === 'vdc') {
          return 90;
        }

        price = this.cpuArray[this.sliderCPUValue] * 280 + this.bootDiskArray[this.sliderBootDiskValue] * 5.74;

        if (this.sliderRAMValue === 0) {
          price += 0.5 * 210;
        } else {
          price += this.ramArray[this.sliderRAMValue] * 210;
        }

        if (this.sliderBandwidthValue) {
          price += (this.bandwidthArray[this.sliderBandwidthValue] - 10) * 7.5;
        }

        if (this.selectOsValue.text && this.selectOsValue.text.indexOf('Windows') !== -1) {
          if (this.cpuArray[this.sliderCPUValue] <= 8) {
            price += 800;
          } else {
            price += 800 + Math.round((this.cpuArray[this.sliderCPUValue] - 8)/2)*350;
          }

        }

        if(this.externalIpValue) {
          price += 90;
        }

        let additionalDisksPrice = 0;

        if (this.additionalDisks.length > 0) {
          this.additionalDisks.forEach(function(disk) {
            if (disk.type === 'standart') {
              additionalDisksPrice += disk.diskSize * 5.74;
            } else if (disk.type === 'archive') {
              additionalDisksPrice += disk.diskSize * 1.54;
            } else if (disk.type === 'custom') {
              additionalDisksPrice += (disk.diskSize * 7.39 + disk.diskSpeed * 3.87);
            }
          })
        }

        price += additionalDisksPrice;

        if (this.isConfigBackup) {
          let baseVMPrice = this.cpuArray[this.sliderCPUValue] * 280 + this.ramArray[this.sliderRAMValue] * 210 +
            this.bootDiskArray[this.sliderBootDiskValue] * 5.74 + additionalDisksPrice;
          price += baseVMPrice*0.3*(this.selectTimeRangeValue/30);
        }

        return Math.round(price).toLocaleString('ru-RU');
      },

      isAuthorized() {
        return this.$store.state.token
      },

      clientName() {
        let clientName = '';
        if (this.clientForm.business_entity_type === 'individual') {
          clientName = this.registrationForm.first_name + '_' + this.registrationForm.last_name;
        } else if (this.clientForm.business_entity_type === 'legal') {
          clientName = this.registrationForm.company_name;
        }

        return clientName;
      }
    },

    methods: {
      goToStep2() {
        if (this.isAuthorized) {
          this.active = 0
        } else if (this.$refs.accountForm.validate()  && this.isAgreeContractOffer) {
          this.$store.dispatch('registration', {
            user: this.registrationForm,
            client: Object.assign({}, this.clientForm, {name: this.clientName})
          }).then(response => {
            if (response.status === 201) {
              this.$store.commit('setUser', response.data);
              this.$store.commit('setClient', response.data);
              this.$store.commit('setToken', response.data.session);
              this.active = 0
            } else {
              this.$toast.error(makeErrorObject(response))
            }
          })
        } else {
          setTimeout(function() {
            this.active = 0
          }.bind(this), 20)
        }
      },
      goToStep3() {
        if (this.isAuthorized) {
          if (this.$refs.step2Form.validate()) {
            this.active = 1
          } else {
            setTimeout(function() {
              this.active = 0
            }.bind(this), 20)
          }
        } else {
          if (this.$refs.accountForm.validate()  && this.isAgreeContractOffer) {
            if (this.$refs.step2Form.validate()) {
              this.active = 2
            } else {
              setTimeout(function() {
                this.active = 1
              }.bind(this), 20)
            }
          } else {
            setTimeout(function() {
              this.active = 0
            }.bind(this), 20)
          }
        }
      },
      changeCPU: function () {
        if (this.sliderCPUValue === 0) {
          if (this.sliderRAMValue !== 0) {
            this.sliderRAMValue = 0;
          }
        } else if (this.sliderCPUValue > 0 && this.sliderCPUValue <= 2) {
          if (this.sliderRAMValue < 1  || this.sliderRAMValue > 4) {
            this.sliderRAMValue = 1;
          }
        } else if (this.sliderCPUValue > 2 && this.sliderCPUValue <= 38) {
          if (this.ramArray[this.sliderRAMValue] !== this.cpuArray[this.sliderCPUValue]*2) {
            this.sliderRAMValue = this.ramArray.indexOf(this.cpuArray[this.sliderCPUValue]*2)
          }
        } else if (this.sliderCPUValue > 8) {
          if (this.sliderRAMValue < 11) {
            this.sliderRAMValue = 11;
          }
        }
      },

      changeRAM: function () {
        if (this.sliderRAMValue === 0) {
          if (this.sliderCPUValue !== 0) {
            this.sliderCPUValue = 0;
          }
        } else if (this.sliderRAMValue <= 4) {
          if (this.sliderCPUValue > 2) {
            this.sliderCPUValue = 1;
          }
        } else if (this.sliderRAMValue > 4 && this.sliderRAMValue <= 10) {
          if (this.cpuArray[this.sliderCPUValue] !== this.ramArray[this.sliderRAMValue]/2) {
            this.sliderCPUValue = this.cpuArray.indexOf(this.ramArray[this.sliderRAMValue]/2)
          }
        } else if (this.sliderRAMValue > 10) {
          if (this.sliderCPUValue < 9) {
            this.sliderCPUValue = 9;
          }
        }
      },

      addDisk: function() {
        let newDisk = {
          key: this.additionalDiskCount,
          id: this.additionalDiskCount,
          type: 'standart',
          diskSize: 10,
          diskSpeed: 1000
        };

        this.additionalDisks.push(newDisk);
        this.additionalDiskCount++;
      },

      removeDisk: function(diskId) {
        let newArray = _.filter(this.additionalDisks, function(disk) {
          return disk.id !== diskId;
        });

        this.additionalDisks = newArray;
      },

      changeAdditionalDiskSize: function(index, value) {
        let diskIndex = _.findIndex(this.additionalDisks, function(disk) {
          return disk.id === index;
        });

        this.additionalDisks[diskIndex].diskSize = value;
      },

      changeAdditionalDiskSpeed: function(index, value) {
        let diskIndex = _.findIndex(this.additionalDisks, function(disk) {
          return disk.id === index;
        });

        this.additionalDisks[diskIndex].diskSpeed = value;
      },

      changeAdditionalDiskType: function(index, value) {
        let diskIndex = _.findIndex(this.additionalDisks, function(disk) {
          return disk.id === index;
        });

        this.additionalDisks[diskIndex].type = value;
      },

      reverseValue(event) {
        let day = event.target.getAttribute('for').split('-')[0];
        if (this.backup[day]) {
          this.backup[day] = false;
        }
      },

      sendConfiguration: function() {
        let requestData;

        if (this.productType === 'vdc') {
          requestData = {
            product_instance: {
              client_id: this.$store.state.client.id,
              product_id: this.$route.query.product_id,
              name: this.vmName,
              description: this.vmDescription,
              action_params: {
                location_id: parseInt(this.selectVdcLocationValue),
              }
            }
          };
        } else {
          requestData = {
            product_instance: {
              client_id: this.$store.state.client.id,
              product_id: this.$route.query.product_id,
              name: this.vmName,
              description: this.vmDescription,
              action_params: {
                location_id: parseInt(this.selectVdcLocationValue),
                cloud_space_id: this.selectCloudSpaceValue,
                cloud_space_name: this.cloudSpaceName,
                image_id: parseInt(this.selectOsValue.value),
                vcpus: this.computedCPU,
                memory: (parseInt(this.computedRAM) === 512 ? 0.5 : parseInt(this.computedRAM)) * 1024,
                boot_disk_size: parseInt(this.computedBootDisk),
                vm_description: this.vmDescription,
                additional_disks: this.additionalDisks,
                bandwidth: parseInt(this.computedBandwidth),
                is_config_backup: this.isConfigBackup,
                session_start_time: this.selectTimeValue,
                sessions: this.backup,
                retention_time: this.selectTimeRangeValue,
                use_custom_folder: this.isCustomBackupFolder,
                custom_folder: this.customBackupFolderPath,
              }
            }
          };
        }



        this.$store.dispatch('createProduct', requestData).then(response => {
          if (response.status === 201) {
            this.$router.push({ path: '/products' })
          } else {
            this.$toast.error(this.$toast.error(makeErrorObject(response)))
          }
        })


      },

    },

  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  #choose-product, #configurator {

    .tabs-row {
      background-color: $light-gray-bg;
      padding: 20px 0;
    }

    .nav-pills {
      display: flex;

      .nav-link {
        color: $font-color;
        padding: 0;
        margin-right: 50px;

        &.active {
          background-color: inherit;
          font-family: Proxima_Nova_Bold, sans-serif;

        }

        .product-count {
          display: inline-block;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: #fff;
          text-align: center;
          font-family: "Proxima_Nova_Regular", Helvetica, Arial, sans-serif;
          margin-right: 12px;
          padding-top: 2px;
        }

      }
    }

    .tab-pane {
      padding: 57px 30px 90px;
    }

    #email-output {
      font-size: 18px;
      color: #454545;
      opacity: 0.5;
    }

    .preloader-container {
      display: flex;
      align-items: center;
    }

    .preloader {
      margin-left: 10px;
      width: 50px;
      height: 50px;
      background: url('http://s018.radikal.ru/i527/1607/3d/2dd8353d01b2.gif') no-repeat;
      background-size: contain;
    }
  }

  .confirm-text {
    font-size: 22px;
  }

  .total-price {
    font-size: 26px;
    margin-left: 15px;
  }

  .price-output {
    font-weight: 700;
  }


  .ruble {
    font-size: 23px;
    font-weight 600
  }




</style>
