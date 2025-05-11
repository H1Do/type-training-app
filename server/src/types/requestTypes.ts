import { Request } from 'express';
import {
    FinishSessionRequest,
    StartSessionRequest,
    TrainingMode,
} from './trainingTypes';
import { Layout } from './keyboardTypes';
import { StatsPeriod } from './statsTypes';

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

export type StatsQueryRequest = RequestWithUser<
    undefined,
    {},
    {
        since?: StatsPeriod;
        mode?: TrainingMode;
        layout?: Layout;
    }
>;

export type LessonCompleteRequest = RequestWithUser<
    {
        cpm: number;
        accuracy: number;
    },
    { id: string }
>;

export type LessonGetByIdRequest = RequestWithUser<undefined, { id: string }>;

export type LessonGetAllRequest = RequestWithUser;
