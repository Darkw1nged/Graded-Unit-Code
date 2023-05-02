import Profile from './profile'

export default class User extends Profile {

    forename: string;
    lastname: string;

    constructor(
        forename: string,
        lastname: string,
        email: string,
        password: string,
        roleID: number,
        telephone: string,
        addressID?: number
    ) {
        super(email, password, roleID, telephone, addressID);
        this.forename = forename;
        this.lastname = lastname;
    }

    getForename(): string {
        return this.forename;
    }

    setForename(forename: string) {
        this.forename = forename;
    }

    getLastname(): string {
        return this.lastname;
    }

    setLastname(lastname: string) {
        this.lastname = lastname;
    }

    getFullName(): string {
        return `${this.forename} ${this.lastname}`;
    }

    async findByEmail(email: string): Promise<Profile> {
        const profile = await super.findByEmail(email);
        if (profile instanceof User) {
            return profile;
        }
        throw new Error('Profile is not a user.');
    }

    async updatePassword(password: string): Promise<void> {
        await super.updatePassword(password);
    }

}
