import {injectable} from "inversify";
import bcrypt from "bcrypt"

@injectable()
export class AuthService {
    constructor(

    ) {
    }

    async generateHash (password: string) {
        return await bcrypt.hash(password, 10)
    }
}