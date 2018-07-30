<template>
  <v-container>
    <v-layout mmt-3 mmb-3>
      <v-flex xs12 class="font-xxl display-1 bold text-xs-center">
        {{ $t('registrationPage.signUp') }}
      </v-flex>
    </v-layout>


    <v-form v-model="valid" ref="form" lazy-validation>
      <div class="bordered-block__15-20 mmb-2">
        <div class="font-xl bold mmb-3">
          {{ $t('registrationPage.account') }}
        </div>

        <v-layout>
          <v-flex xs12 md3 class="form-group">
            <v-text-field
              class="mmt-3"
              label="E-mail"
              v-model="registrationForm.email"
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
              v-model="registrationForm.password"
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
              v-model="registrationForm.first_name"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md3 class="form-group">
            <v-text-field
              :label="$t('registrationPage.secondName')"
              v-model="registrationForm.last_name"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout v-if="clientForm.business_entity_type === 'legal'">
          <v-flex xs12 md5 class="form-group">
            <v-text-field
              label="Наименование юридического лица"
              v-model="registrationForm.company_name"
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

    <div class="text-xs-center">
      <button class="boodet-btn width-270 mmt-4"
              @click="submit"
              :disabled="!valid || !isAgreeContractOffer">{{ $t('registrationPage.signUp') }}</button>
    </div>

  </v-container>

</template>


<script>
  import { validationFunctions } from '../libraries/validation_functions'
  import { makeErrorObject } from '../libraries/helpers'

  export default {
    data () {
      return {
        valid: true,
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
        ]
      }
    },
    computed: {
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
      submit () {
        if (this.$refs.form.validate() && this.isAgreeContractOffer) {
          this.$store.dispatch('registration', {
            user: this.registrationForm,
            client: Object.assign({}, this.clientForm, {name: this.clientName})
          }).then(response => {
            if (response.status === 201) {
              this.$store.commit('setUser', response.data);
              this.$store.commit('setClient', response.data);
              this.$store.commit('setToken', response.data.session);
              this.$router.push({ path: '/profile' })
            } else {
              this.$toast.error(makeErrorObject(response))
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .container.registration-page {
    max-width 670px
  }

</style>
