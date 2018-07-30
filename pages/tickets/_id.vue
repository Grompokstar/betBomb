<template>
  <v-container>
    <div class="back-btn mmt-1">
      <img src="~assets/images/red_arrow.png" class="back-icon">
      <span class="link sans-pro" @click="windowBack">{{ $t('tickets.articlesPage.ticketsList') }}</span>
    </div>

    <div class="ticket-title-row mmt-1 mmb-3">
      <div class="ticket-info mmb-2">
        <div class="font-xxl bold mmb-1">
          {{ ticket.title }}
        </div>
        <div class="ticket-params">
          <div>{{$t('tickets.statuses[' + ticket.state_id + ']')}}</div>
          <div class="blue-circle-divider"></div>
          <div>{{ ticket.id }}</div>
        </div>
      </div>
      <div class="boodet-btn" @click="createArticleDialog = true">{{$t('tickets.articlesPage.newMessage')}}</div>
    </div>

    <div class="mmb-2">
      <span class="mmr-1 sans-pro">{{$t('tickets.articlesPage.newMessages')}}:</span>
      <v-menu offset-y bottom>
        <div class="menu-activator bold" slot="activator">{{ articlesOrderTitle }}</div>
        <ul class="menu-list">
          <li @click="setOrder('bottom')">{{$t('tickets.articlesPage.bottom')}}</li>
          <li @click="setOrder('top')">{{$t('tickets.articlesPage.top')}}</li>
        </ul>
      </v-menu>
    </div>

    <div class="ticket-articles">
      <div class="article__item" v-for="(item, index) in articles">
        <div class="author">
          <span class="bold font-sm mmr-2">{{ getAuthor(item) }}</span>
          <span class="small-label-font-style">{{ new Date(item.created_at).toLocaleString($i18n.locale, {day:'numeric', month:'short', year:'numeric', hour:'numeric', minute:'numeric'}) }}</span>
        </div>
        <div class="text-body sans-pro">
          {{ item.body }}
        </div>
      </div>
    </div>

    <div class="send-ticket">
      <div>
        <v-form v-model="validCreateArticleForm" ref="form">
          <v-textarea
            class="mmt-2"
            :label="$t('tickets.articlesPage.message')"
            auto-grow
            v-model="articleBody"
            :rules="requireRules"
            required
          ></v-textarea>
        </v-form>
      </div>

      <div class="width-170 mmt-1 text-xs-center d-inline" v-if="articlePreloader">
        <img width=45px height=45px src="~assets/images/preloader.svg">
      </div>
      <template v-else>
        <button  class="boodet-btn width-170 mmt-1"
                 @click="sendArticle"
                 :disabled="!validCreateArticleForm">
          {{$t('button.send')}}
        </button>
      </template>

    </div>

    <v-dialog v-model="createArticleDialog" max-width="670px">
      <div class="close-btn"
           @click.stop="createArticleDialog = !createArticleDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
          <path class="cross" fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" d="M5.5 5.5L10 10 5.5 5.5 1 10l4.5-4.5zm0 0L1 1l4.5 4.5L10 1 5.5 5.5z"/>
        </svg>
      </div>
      <div class="dialog-title mmb-5">
        {{$t('tickets.articlesPage.newMessages')}}
      </div>

      <div>
        <v-form v-model="validCreateArticleForm" ref="form">
          <v-textarea
            class="mmt-2"
            :label="$t('tickets.articlesPage.message')"
            auto-grow
            v-model="articleBody"
            :rules="requireRules"
            required
          ></v-textarea>
        </v-form>
      </div>

      <div class="width-270 mmt-3 text-xs-center" v-if="articlePreloader">
        <img width=45px height=45px src="~assets/images/preloader.svg">
      </div>

      <div class="text-xs-center" v-else>
        <button  class="boodet-btn width-270 mmt-4"
                 @click="sendArticle"
                 :disabled="!validCreateArticleForm">{{$t('button.send')}}</button>
      </div>

    </v-dialog>

  </v-container>
</template>

<script>
  import { validationFunctions } from '../../libraries/validation_functions';

  export default {
    components: {

    },

    validate ({ params }) {
      return /^\d+$/.test(params.id)
    },

    beforeCreate() {
      this.$store.dispatch('getTicket', this.$route.params.id).then(response => {
        if (response.status === 200) {
          this.$store.commit('setTicket', response.data);
        } else {
          this.$toast.error(makeErrorObject(response))
        }
      });

      this.$store.dispatch('getTicketArticles', this.$route.params.id).then(response => {
        if (response.status === 200) {
          this.$store.commit('setTicketArticles', response.data);
        } else {
          this.$toast.error(makeErrorObject(response))
        }
      })
    },

    data () {
      return {
        createArticleDialog: false,
        articlePreloader: false,
        articleBody: '',
        requireRules: [
          validationFunctions.require.bind(this)
        ],
        validCreateArticleForm: false,
        articleOrder: 'bottom',
        timeoutId: null
      }
    },

    computed: {
      ticket() {
        return this.$store.state.currentTicket
      },

      articles() {
        let sortedList = this.$store.state.currentTicketArticles.slice();

        if (this.articleOrder === 'top') {
          return sortedList.reverse();
        } else {
          return sortedList;
        }
      },

      articlesOrderTitle() {
        return this.$t('tickets.articlesPage["' + this.articleOrder + '"]');
      }

    },

    methods: {
      windowBack() {
        this.$router.go(-1);
      },

      getAuthor(article) {
        if (article.sender === 'Customer') {
          return this.userName();

        } else {
          return 'Support'
        }

      },

      userName() {
        let resultName = '';
        if (this.$store.state.user.last_name) {
          resultName += this.$store.state.user.last_name;
        }

        if (this.$store.state.user.first_name) {
          resultName += ' ' + this.$store.state.user.first_name.substring(0,1) + '.'
        }

        if (resultName) {
          return resultName
        } else {
          return this.$store.state.user.email
        }

      },

      sendArticle () {
        this.articlePreloader = true;
        if (this.$refs.form.validate()) {
          let requestData = {
            ticket_id: this.$route.params.id,
            type: 'note',
            body: this.articleBody,
            customer: this.$store.state.user.email
          };

          this.$store.dispatch('createArticle', requestData )
            .then(response => {
              if (response.status === 201) {
                setTimeout(function() {
                  this.articlePreloader = false;
                  this.createArticleDialog = false;
                  this.articleBody = '';
                  this.$toast.success({title: '', message: this.$t('tickets.notifications.createNote')});
                  this.updateArticleList();
                }.bind(this), 3000)
              } else {
                this.articlePreloader = false;
                this.$toast.error(makeErrorObject(response))
              }
            });
        }
      },

      updateArticleList() {
        this.$store.dispatch('getTicketArticles', this.$route.params.id).then(response => {
          if (response.status === 200) {
            this.$store.commit('setTicketArticles', response.data);
          }
        })
      },

      setOrder(order) {
        this.articleOrder = order;
      }
    },

    mounted() {
      this.timeoutId = setTimeout(function getArticles() {
        this.$store.dispatch('getTicketArticles', this.$route.params.id).then(response => {
          if (response.status === 200) {
            this.$store.commit('setTicketArticles', response.data);
          }
        })

        this.timeoutId = setTimeout(getArticles.bind(this), 30000)
      }.bind(this), 30000)
    },

    beforeDestroy() {
      clearTimeout(this.timeoutId)
    }


  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables"

  .ticket-title-row {
    display: flex
    align-items flex-start
    flex-wrap wrap
    max-width 870px

    .ticket-info {
      margin-right auto
    }
  }

  .ticket-params {
    >div {
      display inline-block
    }
  }

  .ticket-articles {
    border 1px solid rgba(0,0,0,0.05)
    padding 25px 30px 30px
    max-width 870px
    margin-bottom 60px

    .article__item {
      margin-bottom 30px

      &:last-of-type {
        margin-bottom 0
      }

      .author {
        margin-bottom 12px
      }

      .text-body {
      }
    }
  }

  .send-ticket {
    max-width 870px
  }

</style>