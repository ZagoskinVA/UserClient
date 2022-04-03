<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li @click="addUser(this.departments)"  class="nav-item active">
                <div class="nav-link" ><b-icon-plus-circle-fill></b-icon-plus-circle-fill></div>
            </li>
            <li @click="editUser(this.currentUser)" class="nav-item">
                <div class="nav-link" ><b-icon-pencil-square></b-icon-pencil-square></div>
            </li>

            <li @click="removeUser(this.currentUser)" class="nav-item">
                <div class="nav-link" ><b-icon-trash-fill></b-icon-trash-fill></div>
            </li>
            <li class="nav-item">
                <div class="nav-link" >Department:</div>
            </li>
            </ul>
            
            <div><b-form-select v-model="currentDepartment" :options="options"></b-form-select></div>
        </div>
    </nav>

    <table class="table table-bordered">
        <thead>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">FirstName</th>
            <th scope="col">LastName</th>
            <th scope="col">Department</th>
        </thead>
        <tr @click="activateUser(user)" v-for="user in users" :key="user.account.id" :class="[user.account.id == this.currentUser?.account?.id ? 'choosen' : '']">
            <td>{{ user.account.name }}</td>
            <td>{{ user.account.email }}</td>
            <td>{{ user.profile.firstName }}</td>
            <td>{{ user.profile.lastName }}</td>
            <td>{{ user.profile.department.name }}</td>
        </tr>
    </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import User from 'src/models/User'
import Departmen from '@/models/Department';
import { BIconPlusCircleFill, BIconPencilSquare, BIconTrashFill } from 'bootstrap-icons-vue';
export default defineComponent({
    name: 'UserTable',
    props: ['reload'],
    components:{BIconPlusCircleFill, BIconPencilSquare, BIconTrashFill},
    emits: ['addUser', 'editUser', 'reloadTable'],
    async mounted(){
        this.users = await this.getUsers('');
        let response = await fetch('api/Department')
        if(response.ok){
            let data = await response.json();
            this.options = (data.value.data as Departmen[]).map(x => {
                return {
                    value: x.name,
                    text: x.name
                }
            });
            this.departments = data.value.data as Departmen[];
            this.options.unshift({value: '', text: ''})
        }
    },
    data(){
        return{
            users: [] as User[],
            departments: [] as Departmen[],
            currentUser: {} as User,
            options: [] as any,
            currentDepartment: ''
        }
    },
    methods:{
        activateUser(user: User): void{
            this.currentUser = user;
        },
        async getUsers(filters: string): Promise<User[]>{
            let response = await fetch(`api/User?${filters}`);
            if(response.ok){
                let data =  await response.json();
                return data.value.data
            }
            return [];
        },
        addUser(departments: Departmen[]): void{
            this.$emit('addUser', departments);
        },
        editUser(user: User):void{
            this.$emit('editUser', user, this.departments);
        },
        async removeUser(user: User){
            let response = await fetch('save/Account', {
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.currentUser.account)

            });
            if(!response.ok){
                alert('Error');
            }
            this.users = await this.getUsers('');
        }
    },
    watch:{
        async currentDepartment(newValue, oldValue){
            if(newValue == oldValue){
                return;
            }
            if(!newValue){
                this.users = await this.getUsers('');
                return;
            }
            this.users = await this.getUsers(`DepartmentName=${newValue}`);
        },
        async reload(newValue: boolean){
            if(newValue){
                this.users = await this.getUsers('');
                this.currentDepartment = '';
                newValue = false;
                this.$emit('reloadTable');
            }
        }
    }
});
</script>
<style scoped>
.table{
    background-color: white;
}
.choosen{
    background-color: rgb(216, 231, 250);
}
</style>