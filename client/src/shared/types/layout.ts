export type Finger =
    | 'left-pinky'
    | 'left-ring'
    | 'left-middle'
    | 'left-index'
    | 'right-index'
    | 'right-middle'
    | 'right-ring'
    | 'right-pinky'
    | 'thumb';

export interface KeyboardKey {
    code: KeyCode;
    lower: string;
    upper: string;
    finger: Finger;
}

export type KeyCode =
    | 'Backquote'
    | 'Digit1'
    | 'Digit2'
    | 'Digit3'
    | 'Digit4'
    | 'Digit5'
    | 'Digit6'
    | 'Digit7'
    | 'Digit8'
    | 'Digit9'
    | 'Digit0'
    | 'Minus'
    | 'Equal'
    | 'KeyQ'
    | 'KeyW'
    | 'KeyE'
    | 'KeyR'
    | 'KeyT'
    | 'KeyY'
    | 'KeyU'
    | 'KeyI'
    | 'KeyO'
    | 'KeyP'
    | 'BracketLeft'
    | 'BracketRight'
    | 'Backslash'
    | 'KeyA'
    | 'KeyS'
    | 'KeyD'
    | 'KeyF'
    | 'KeyG'
    | 'KeyH'
    | 'KeyJ'
    | 'KeyK'
    | 'KeyL'
    | 'Semicolon'
    | 'Quote'
    | 'KeyZ'
    | 'KeyX'
    | 'KeyC'
    | 'KeyV'
    | 'KeyB'
    | 'KeyN'
    | 'KeyM'
    | 'Comma'
    | 'Period'
    | 'Slash'
    | 'Space'
    | 'ShiftLeft'
    | 'ShiftRight'
    | 'Backspace';

export type LayoutKeys = KeyboardKey[][];

export const enum Layout {
    QWERTY = 'QWERTY',
    YCUKEN = 'YCUKEN',
}
