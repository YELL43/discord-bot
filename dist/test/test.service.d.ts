import { JwtService } from '@nestjs/jwt';
import { LoginTestDto } from './dto/login-test.dto';
export declare class TestService {
    private jwtService;
    constructor(jwtService: JwtService);
    getSecretKey(): string;
    login(body: LoginTestDto): Promise<{
        token: string;
    }>;
    findAll(): {
        user: number;
    }[];
    verifyToken(token: string): Promise<any>;
    create(createTestDto: any): string;
    findOne(id: number): string;
    update(id: number, updateTestDto: any): string;
    remove(id: number): string;
}
