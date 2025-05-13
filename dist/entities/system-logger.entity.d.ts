export declare enum ELoggerType {
    success = "success",
    info = "info",
    warning = "warning",
    error = "error"
}
export declare enum ELoggerAction {
    SIGN_IN = "SIGN_IN",
    SIGN_OUT = "SIGN_OUT"
}
export declare class SystemLogger {
    id: number;
    type: ELoggerType;
    action: ELoggerAction;
    unique_id: string;
    username: string;
    data: any;
    created_datetime: string;
    updated_datetime: string;
}
