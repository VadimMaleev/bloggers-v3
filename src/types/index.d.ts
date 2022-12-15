import {DeviceClass, UserClass} from "./types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserClass | null
            device: DeviceClass | null
        }
    }
}