<template>
<div style="font-weight:  bolder; font-size: 20px">Users</div>
<user-table @reloadTable="this.reloadTable = false" @addUser="add" @editUser="edit" :reload="this.reloadTable"></user-table>
<modal-form @closeModal="closeModal" :accountModel="this.accountModel" :profileModel="this.profileModel" :departments="this.departments" :showModal="this.isShow" :options="this.options"></modal-form>
</template>

<script lang="ts">

import ModalForm  from './components/ModalForm.vue'
import { defineComponent } from 'vue'
import UserTable from '@/components/UsersTable.vue'
import User from './models/User'
import ProfileModel from './models/ProfileModel';
import AccountModel from './models/AccountModel';
import Departmen from './models/Department';
export default defineComponent({
  components: { ModalForm, UserTable },
  name: 'App',
  data()
  {
    return {
      isShow: false as boolean,
      profileModel: { id: 0, firstName: '', lastName: '', department: {id: 0, name: ''}, accountId: 0 } as ProfileModel,
      accountModel: { id: 0, name: '', email: '' } as AccountModel,
      departments: [] as Departmen[],
      options: [{value: 0, text: ''}],
      reloadTable: false
    }
  },
  methods:{
    show(){
      this.isShow = true;  
    },
    cancel(){
      this.isShow = false;
    },
    add(departments: Departmen[]){
      this.departments = departments;
      this.options = (this.departments as Departmen[]).map(x => {
                return {
                    value: x.id,
                    text: x.name
                }
            });
      this.options.unshift({value: 0, text: ''});
      this.accountModel = { id: 0, name: '', email: '' };
      this.profileModel = { id: 0, firstName: '', lastName: '', department: {id: 0, name: ''}, accountId: 0 };
      this.isShow = true;
    },
    edit(user: User, departments: Departmen[]){
      if(!user || Object.keys(user).length == 0 || !user.account || !user.profile){
        return;
      }
      this.departments = departments;
      this.options = (this.departments as Departmen[]).map(x => {
                return {
                    value: x.id,
                    text: x.name
                }
            });
      this.options.unshift({value: 0, text: ''});
      this.accountModel = user.account;
      this.profileModel = user.profile;
      this.isShow = true;
    },
    closeModal(){
      this.isShow = false;
      this.reloadTable = true;
    }
  }
});
</script>
<style scoped>
  
</style>

