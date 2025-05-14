import { Request } from 'express';
import {
    FinishSessionRequest,
    StartSessionRequest,
    TrainingMode,
} from './trainingTypes';
import { Layout } from './keyboardTypes';
import { StatsPeriod } from './statsTypes';
import { FinishLessonRequest } from './lessonsTypes';

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
    FinishLessonRequest,
    { id: string }
>;

export type LessonGetByIdRequest = RequestWithUser<undefined, { id: string }>;

export type LessonGetAllRequest = RequestWithUser;

export interface ResetPasswordRequest
    extends RequestWithUser<{
        token: string;
        newPassword: string;
    }> {}

export type TopUsersByLevelRequest = RequestWithUser<undefined, {}, {}>;

export type AdminGetUsersRequest = RequestWithUser<
    undefined,
    {},
    {
        q?: string;
        limit?: string;
        offset?: string;
    }
>;

export type AdminUserIdRequest = RequestWithUser<undefined, { id: string }>;

export type AdminCreateLessonRequest = RequestWithUser<{
    title: string;
    allowedChars: string;
    length: number;
    layout: string;
    order: number;
    cpmFor1: number;
    cpmFor2: number;
    cpmFor3: number;
    minAccuracy: number;
    prevLessonId?: string;
    nextLessonId?: string;
}>;

export type AdminUpdateLessonRequest = RequestWithUser<
    Partial<{
        title: string;
        allowedChars: string;
        length: number;
        layout: string;
        order: number;
        cpmFor1: number;
        cpmFor2: number;
        cpmFor3: number;
        minAccuracy: number;
        prevLessonId: string;
        nextLessonId: string;
    }>,
    { id: string }
>;

export type AdminDeleteLessonRequest = RequestWithUser<
    undefined,
    { id: string }
>;

export type AdminGetLessonsRequest = RequestWithUser<undefined, {}, {}>;

export type AdminUserStatsRequest = Request<
    { id: string },
    unknown,
    unknown,
    {
        since?: StatsPeriod;
        mode?: TrainingMode;
        layout?: Layout;
    }
>;
