import { Request } from 'express';
import {
    FinishSessionRequest,
    StartSessionRequest,
    TrainingMode,
} from './trainingTypes';
import { Layout } from './keyboardTypes';

export interface RequestWithUser<
    TBody = unknown,
    TParams = Record<string, string>,
    TQuery = Record<string, string>,
> extends Request<TParams, any, TBody, TQuery> {
    user?: {
        id: string;
    };
}

export interface AuthRequest
    extends RequestWithUser<{
        username?: string;
        password?: string;
        email?: string;
        oldPassword?: string;
        newPassword?: string;
    }> {}

export type TrainingStartRequest = RequestWithUser<StartSessionRequest>;

export type TrainingFinishRequest = RequestWithUser<
    FinishSessionRequest,
    { id: string }
>;

export type TrainingQuery = {
    mode: TrainingMode;
    layout: Layout;
    items?: string;
    length?: number;
    isWords?: boolean;
};

export type TrainingPrepareRequest = RequestWithUser<
    undefined,
    {},
    TrainingQuery
>;
