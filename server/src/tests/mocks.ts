import { InputEventRecord } from '@/types/trainingTypes';
import { type UserDoc } from '@/types/userTypes';

export const mockUser = {
    username: 'user',
    password: 'pass',
    email: 'a@b.com',
    createdAt: new Date(),
    isBlocked: false,
    isVerified: true,
    level: 1,
    exp: 90,
    role: 'user',
    lastSeen: new Date(),
} as unknown as UserDoc;

export const mockEvents: InputEventRecord[] = [
    {
        type: 'input',
        expected: 'a',
        actual: 'a',
        time: 150,
        finger: 'left-pinky',
        timestamp: Date.now(),
    },
    {
        type: 'input',
        expected: 's',
        actual: 'f',
        time: 200,
        finger: 'left-ring',
        timestamp: Date.now() + 150,
    },
    {
        type: 'input',
        expected: 'd',
        actual: 'd',
        time: 100,
        finger: 'left-middle',
        timestamp: Date.now() + 350,
    },
    {
        type: 'backspace',
        expected: '',
        actual: '',
        time: 50,
        finger: null,
        timestamp: Date.now() + 450,
    },
];

export const mockInput = ['a', 'f', 'd'];
export const mockSequence = ['a', 's', 'd'];
