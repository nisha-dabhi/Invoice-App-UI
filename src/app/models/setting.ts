export interface UserSettings {
    id?: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;

    oldPassword?: string;
    newPassword?: string;
}

export interface CompanySettings {
    id?: number;
    companyName: string;
    phone: string;
    email: string;
    address: string;
}