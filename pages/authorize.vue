<template>
  <v-container class="registration-page">
    <v-layout mmt-3 mmb-3>
      <v-flex xs12 class="font-xxl display-1 bold text-xs-center">
        {{ $t('authorizePage.signIn') }}
      </v-flex>
    </v-layout>

    <div class="register-block">
      <div class="font-xl bold mmb-3">
        {{ $t('authorizePage.account') }}
      </div>

      <v-form v-model="valid" ref="form" lazy-validation>
        <v-layout>
          <v-flex xs12 md6 class="ppr-3">
            <v-text-field
              class="mmt-3"
              label="E-mail"
              v-model="authorizeForm.email"
              :rules="emailRules"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field
              class="mmt-3"
              :label="$t('authorizePage.password')"
              type="password"
              v-model="authorizeForm.password"
              :rules="passwordRules"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>

      </v-form>
    </div>
    <div class="text-xs-center mmb-3">
      <button class="boodet-btn width-270 mmt-4"
              @click="submit"
              :disabled="!valid">{{ $t('authorizePage.signIn') }}</button>
    </div>

    <div>
      {{ $t('authorizePage.notAccount') }}
      <nuxt-link to="/registration">{{ $t('authorizePage.registration') }}</nuxt-link>.
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
        authorizeForm: {
          email: '',
          password: ''
        },
        emailRules: [
          validationFunctions.require.bind(this),
          validationFunctions.testEmail.bind(this)
        ],
        passwordRules: [
          validationFunctions.require.bind(this),
          validationFunctions.minLength6.bind(this)
        ]
      }
    },

    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('authorize', { user: this.authorizeForm }).then(response => {
            if (response.status === 201) {
              this.$store.commit('setUser', response.data);
              this.$store.commit('setClient', response.data);
              this.$store.commit('setToken', response.data.session);
              this.$router.push({ path: '/profile' })
            } else {
              this.$toast.error(this.$toast.error(makeErrorObject(response)))
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

  .register-block {
    border 1px solid rgba(0,0,0,0.05)
    padding 15px 20px 20px
  }

</style>
