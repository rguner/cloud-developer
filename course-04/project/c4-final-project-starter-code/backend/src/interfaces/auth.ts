
import { JwtHeader } from 'jsonwebtoken';

interface Jwt {
    header: JwtHeader;
    payload: JwtPayload;
}

interface JwtPayload {
    iss: string;
    sub: string;
    iat: number;
    exp: number;
}

export {
    Jwt,
    JwtPayload
};
