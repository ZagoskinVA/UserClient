import AccountModel from "./AccountModel";
import ProfileModel from "./ProfileModel";
import Department from "./Department"

interface User{
    id: number;
    account: AccountModel;
    profile: ProfileModel;
    department: Department
}

export default User;