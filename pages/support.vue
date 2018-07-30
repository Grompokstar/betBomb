<template>
  <div>
    <page-header :text="pageHeader"/>
    <div class="grid-wrapper mmt-3">
      <div class="bordered-box box1">
        <h3 class="block-title">{{$t('supportPage.knowledgeBase')}}</h3>
        <div class="sans-pro mmb-2">{{$t('supportPage.knowledgeDescription')}}</div>
        <nuxt-link class="boodet-btn width-170" to="#">{{$t('supportPage.read')}}</nuxt-link>
      </div>

      <div class="bordered-box box2">
        <h3 class="block-title">{{$t('supportPage.myTickets')}}</h3>
        <div class="sans-pro mmb-2">{{$t('supportPage.ticketsDescription')}}</div>
        <nuxt-link class="boodet-btn width-170" to="/tickets">{{$t('supportPage.view')}}</nuxt-link>
      </div>

      <div>
        <h3 class="block-title">{{$t('supportPage.trends')}}</h3>
        <ul class="simple-list">
          <li>
            Начало работы с системой
          </li>
          <li>
            Что такое облачное хранилище
          </li>
          <li>
            Добавление опций к виртуальному серверу
          </li>
          <li>
            Разграничение доступа
          </li>
          <li>
            Начало работы с системой
          </li>
        </ul>
      </div>

      <div>
        <h3 class="block-title">{{$t('supportPage.announcements')}}</h3>
        <ul class="simple-list">
          <li>
            Новинки! Поддержка новых CMS и CRM
          </li>
          <li>
            Поле описание в карточке Снэпшота
          </li>
          <li>
            Роли
          </li>
          <li>
            Система уведомлений
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '~/components/PageHeader.vue';
import SupportMainContent from '~/components/SupportMainContent.vue';

export default {
  components: {
    PageHeader
  },

  data() {
    return {
      pageHeader: this.$t('supportPage.howCanAssist')
    }
  }
}
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .grid-wrapper {
    display grid
    grid-template-columns 1fr 1fr
    grid-gap 30px

    >div {
      width 370px
      max-width 370px

      &:nth-of-type(2n) {
        justify-self start
      }

      &:nth-of-type(2n + 1) {
        justify-self end
      }
    }

    .block-title {
      font-size 24px
      line-height 32px
      font-weight 400
      margin-bottom 0.5em
    }
  }

  .bordered-box {
    border 1px solid rgba(0,0,0,0.05)
    padding 25px 30px 30px
  }

  .simple-list {
    font-size 14px
    padding-left 0
    margin-top 16px

    li {
      color $blue-brand-color
      margin-bottom 8px
      list-style-type none
    }
  }

</style>
