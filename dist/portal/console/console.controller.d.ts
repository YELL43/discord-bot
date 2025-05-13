import { ConsoleService } from './console.service';
import { IUserAuth0Jwt } from '../../commons/types';
export declare class ConsoleController {
    private readonly consoleService;
    constructor(consoleService: ConsoleService);
    findApplications(user: IUserAuth0Jwt, query: any): Promise<any[]>;
    findOne(user: IUserAuth0Jwt, id: string): Promise<any>;
}
