import { TestService } from './test.service';
import { LoginTestDto } from './dto/login-test.dto';
export declare class TestController {
    private readonly testService;
    constructor(testService: TestService);
    findAll(): {
        user: number;
    }[];
    login(body: LoginTestDto): Promise<{
        token: string;
    }>;
    verify(req: Request): Promise<any>;
    create(req: Request, id: string, q: any, body: any): Promise<{
        payloadHeader: any;
        pathParams: {
            id: string;
        };
        queryParams: any;
        bodyRequest: any;
    }>;
    createUuid(uuid: any): any;
    findOne(id: string): string;
    update(id: string, updateTestDto: any): string;
    remove(id: string): string;
}
