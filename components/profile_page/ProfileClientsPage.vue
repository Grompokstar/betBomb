<template>
  <div class="product-page-content">
    <v-layout row>
      <v-flex xs6 mmr-2 class="d-flex" align-center justify-start>
        <div class="font-xl bold mmr-3">Список клиентов</div>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex class="text-xs-right sans-pro">
        <nuxt-link to="profile">Пригласить</nuxt-link>
        <div class="blue-circle-divider"></div>
        <nuxt-link to="profile">Создать</nuxt-link>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="clients"
      hide-actions
      class="width-100 de-table without-border mmt-2"
    >
      <template slot="items" slot-scope="props">
        <td class="font-lg">{{ props.item.name }}</td>
        <td class="text-xs-center">...</td>
        <td class="text-xs-center">...</td>
        <td class="text-xs-center">...</td>
        <td class="text-xs-center">{{ props.item.created_at }}</td>
        <td>
          <v-menu offset-y bottom>
            <div class="menu-activator blue-color" slot="activator">Опции</div>
            <ul class="menu-list">
              <li v-for="item in clientActions" :key="item" @click="">
                {{ item }}
              </li>
            </ul>
          </v-menu>
        </td>
      </template>
    </v-data-table>
  </div>

</template>

<script>
  export default {

    data () {
      return {
        headers: [
          { text: 'Имя', align: 'left',  value: 'name'},
          { text: 'Продуктов', align: 'center', value: ''},
          { text: 'Ролей', align: 'center', value: ''},
          { text: 'Пользователей', align: 'center', value: ''},
          { text: 'Дата создания', align: 'center', value: 'created_at'},
          { text: '', sortable: false }
        ],
        clientActions: [
          'Отключить/Удалить', 'Редактировать', 'Добавить роль', 'Пригласить пользователя'
        ]

      }
    },

    computed: {
      clients() {
        return this.$store.state.clients
      }
    },

    methods: {
      showSearchInput() {
        this.isShowSearchInput = true
      }
    },
  }

</script>

<style lang="stylus">

</style>
