import {injectable} from "inversify";
import {TokenType} from "../types/types";
import {TokensModel} from "../schemas/mongoose-schemas";

@injectable()

export class JwtRepository {
    constructor(

    ) {
    }

    async expireRefreshToken(refreshToken: TokenType) {
        const tokenInstance = new TokensModel(refreshToken)
        await tokenInstance.save()

        return tokenInstance
    }
    async findAllExpiredTokens(token: string): Promise<TokenType | null> {
        return TokensModel.findOne({refreshToken: token});
    }

}