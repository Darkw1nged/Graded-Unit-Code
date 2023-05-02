import Profile from './profile';

export default class Corporate extends Profile {

    name: string;

    constructor(
        name: string,
        email: string,
        password: string,
        roleID: number,
        telephone: string,
        addressID?: number
    ) {
        super(email, password, roleID, telephone, addressID);
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }
    
    async findByEmail(email: string): Promise<Profile> {
        const profile = await super.findByEmail(email);
        if (profile instanceof Corporate) {
            return profile;
        }
        throw new Error('Profile is not a corporate.');
    }

    async updatePassword(password: string): Promise<void> {
        await super.updatePassword(password);
    }

}