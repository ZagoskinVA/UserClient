import Departmen from "./Department";

interface ProfileModel{
    id: number;
    firstName: string;
    lastName: string;
    department: Departmen
    accountId: number
}

export default ProfileModel;