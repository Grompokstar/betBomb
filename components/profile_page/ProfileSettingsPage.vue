<template>
  <div class="product-page-content">
    <div class="link sans-pro absolute-right-top" @click.stop="editProfile">{{$t('profilePage.edit')}}</div>
    <div class="font-xxl mmb-1 sans-pro">{{ userName }}</div>
    <div class="mmb-1">{{ user.email }}</div>
    <div class="mmb-3">{{ user.phone }}</div>
    <!--<button class="boodet-btn">Удалить аккаунт</button>-->
    <v-dialog v-model="editProfileDialog" max-width="670px">
      <div class="close-btn"
           @click.stop="editProfileDialog = !editProfileDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
          <path class="cross" fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" d="M5.5 5.5L10 10 5.5 5.5 1 10l4.5-4.5zm0 0L1 1l4.5 4.5L10 1 5.5 5.5z"/>
        </svg>
      </div>
      <div class="dialog-title mmb-2">
        {{$t('profilePage.editProfileForm.title')}}
      </div>
      <v-form v-model="valid" ref="form" lazy-validation>
        <div class="bordered-block__15-20">
        <div class="font-xl bold mmb-3">
          {{$t('profilePage.editProfileForm.account')}}
        </div>

        <v-layout>
          <v-flex xs12 md6 class="form-group">
            <v-text-field
              class="mmt-3"
              label="E-mail"
              v-model="profileForm.email"
              :rules="emailRules"
              disabled
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6 class="form-group">
            <v-text-field
              class="mmt-3 phone-field"
              :label="$t('profilePage.editProfileForm.phone')"
              v-model="profileForm.phone"
              :rules="phoneRules"
              mask="+#(###)-###-##-##"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout class="mmt-4">
          <v-flex xs12 md6 class="form-group">
            <v-text-field
              :label="$t('profilePage.editProfileForm.name')"
              v-model="profileForm.first_name"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6 class="form-group">
            <v-text-field
              :label="$t('profilePage.editProfileForm.surname')"
              v-model="profileForm.last_name"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
      </div>
      </v-form>

      <div class="text-xs-center">
        <button class="boodet-btn width-170 mmt-4"
                @click="submit"
                :disabled="!valid">{{$t('button.save')}}</button>
      </div>

    </v-dialog>


  </div>
</template>

<script>
  import { validationFunctions } from '../../libraries/validation_functions'

  export default {
    props: ['user'],

    data () {
      return {
        valid: true,
        editProfileDialog: false,
        profileForm: {
          email: '',
          phone: '',
          first_name: '',
          last_name: ''
        },

        emailRules: [
          validationFunctions.require.bind(this),
          validationFunctions.testEmail.bind(this)
        ],
        phoneRules: [
          validationFunctions.testPhone.bind(this)
        ],
        nameRules: [
          validationFunctions.require.bind(this),
          validationFunctions.minLength3.bind(this)
        ],
      }
    },

    computed: {
      userName() {
        let result = this.user.last_name + ' ' + this.user.first_name;

        if (result === ' ' || this.$store.state.client.business_entity_type === 'legal') {
          result = this.$store.state.client.name;
        }

        return result;
      }

    },

    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('userUpdate', {profile: this.profileForm} ).then(response => {
            this.$store.commit('updateUser', response.data);
            this.editProfileDialog = false;
          })
        }
      },

      editProfile() {
        this.profileForm.phone = this.user.phone;
        this.profileForm.email = this.user.email;
        this.profileForm.first_name = this.user.first_name;
        this.profileForm.last_name = this.user.last_name;

        this.editProfileDialog = true;
      }
    }
  }

</script>

<style lang="stylus">

  .absolute-right-top {
    position absolute
    top 25px
    right 30px
  }

</style>
