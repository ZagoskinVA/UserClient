<template>
    <b-modal v-model="profileShow" title="User" hide-footer class="modal-form">
        <div>
            <div>        
                <div class="title">Account</div>
                <br/>
                <b-form>
                    <b-form-group label="Name">              
                        <b-form-input  placeholder="Name" v-model="account.name" />
                    </b-form-group>

                    <b-form-group label="Email">              
                        <b-form-input  placeholder="Email" v-model="account.email" />
                    </b-form-group>

                    <b-container>
                        <b-row align-v="right">
                        <b-button @click="saveAccount(this.account)" variant="success" :disabled="dissableButtons">Save</b-button>
                        </b-row>
                    </b-container>
                </b-form>
            </div>

            <div>
                <div class="title">Profile</div>
                <br/>
                    <b-form>
                        <b-form-group label="First Name">              
                            <b-form-input  placeholder="First Name" v-model="profile.firstName" />
                        </b-form-group>

                        <b-form-group label="Last Name">              
                            <b-form-input  placeholder="Last Name" v-model="profile.lastName" />
                        </b-form-group>

                        <b-form-group label="Departmen">
                            <b-form-select v-model="currentDepartment" :options="departmentOptions"></b-form-select>
                        </b-form-group>
                        <b-container>
                            <b-row align-v="right">
                                <b-button @click="saveProfile(this.profile)" variant="success" :disabled="dissableButtons">Save</b-button>  
                            </b-row>
                        </b-container>                                        
                 </b-form>
            </div>
        </div>
    </b-modal>
</template>

<script lang="ts">
import AccountModel from '@/models/AccountModel'
import ProfileModel from '@/models/ProfileModel'
import Departmen from '@/models/Department'
import { defineComponent } from 'vue'

export default defineComponent ({
    name: "ModalForm",
    emits: ['closeModal'],
    setup() {
    },
    props: ['profileModel', 'accountModel', 'showModal', 'departments', 'options'],
    data(){
        return {
            account: this.accountModel! as AccountModel,
            profile: this.profileModel! as ProfileModel,
            profileShow: this.showModal as boolean,
            departmentOptions: this.options,
            currentDepartment: 0,
            dissableButtons: false
        }
    },
    methods:{
        closeModal(){
            this.$emit('closeModal');
        },
        async saveProfile(profile: ProfileModel): Promise<void>{          
             
            if(this.account.id == 0 || !this.account.id || this.currentDepartment == 0){
                alert('Аккаунт и/или департамент должен быть сохранен');
                return;
            }
            this.dissableButtons = true;
            const response = await fetch('/profile/Profile', {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({id: profile.id, firstName: profile.firstName, lastName: profile.lastName, accountId: this.account.id, departmentId: this.currentDepartment})
            });
            this.dissableButtons = false;
            if(!response.ok){
                let data = await response.json() as any;
                if(data?.value?.errorMessage)
                    alert(`Errors: ${(data.value.errorMessages as string[]).map(x => x + '\n')}  `);
                else
                    alert(`Errors: ${Object.keys(data.errors).map(x => {
                        return data.errors[x]
                    })}`)
                return;
            }
            alert('ok');
            let data = await response.json()
            console.log(data.value.data)
            this.profile = data.value.data as ProfileModel;
        },

        async saveAccount(account: AccountModel){
            this.dissableButtons = true;
            const response = await fetch('/save/Account', {
                headers:{
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                method: 'POST',
                body: JSON.stringify(account)
            })
            this.dissableButtons = false;
            if(response.ok){
                alert('ok')
                let data = await response.json();
                this.account = data.value.data;
            }
            else{
                
                let data = await response.json() as any;
                alert(`Errors: ${(data.value.errorMessages as string[]).map(x => x + '\n')}`);
                return;
            }
        }
    },
    watch:{
        showModal(newValue, oldValue){
            this.profileShow = newValue;
        },
        profileShow(newValue, oldValue){
            if(!newValue && oldValue){
                this.closeModal();
            }
        },
        options(newValue){
            this.departmentOptions = newValue;
        },
        profileModel(newValue: ProfileModel){
            this.profile = newValue;
            this.currentDepartment = newValue.department.id;
        },
        accountModel(newValue: AccountModel){
            this.account = newValue;
        }
    }
});
</script>
<style scoped>
.title{
    font-weight: bolder;
    font-size: 20px;
}
</style>
