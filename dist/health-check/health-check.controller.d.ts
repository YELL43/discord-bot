export declare class HealthCheckController {
    findAll(): {
        status: string;
        mode: string;
    };
    getEnv(): {
        status: NodeJS.ProcessEnv;
    };
}
