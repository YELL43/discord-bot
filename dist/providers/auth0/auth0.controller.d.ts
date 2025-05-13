import { Auth0Service } from './auth0.service';
import { Auth0VerifyTokenDto } from './dto/auth0-verify-token.dto';
export declare class Auth0Controller {
    private readonly auth0Service;
    constructor(auth0Service: Auth0Service);
    verifyToken(body: Auth0VerifyTokenDto): Promise<{
        access_token: string;
        id_token: string;
        session_expire: any;
    }>;
    getRoles(req: Request): any;
}
