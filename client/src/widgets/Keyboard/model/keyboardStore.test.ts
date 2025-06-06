import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useKeyboardStore } from '@/widgets/Keyboard/model/keyboardStore';
import type { KeyboardKey } from '@/shared/types';

describe('keyboardStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('sets hinted key', () => {
        const store = useKeyboardStore();
        store.setHintedKey('KeyA');
        expect(store.hintedKeyCode).toBe('KeyA');
    });

    it('handles correct key press', () => {
        const store = useKeyboardStore();
        store.setHintedKey('KeyA');
        store.onKeyDown('KeyA');
        expect(store.pressedKeyCode).toBe('KeyA');
        expect(store.lastCorrectKeyCode).toBe('KeyA');
        expect(store.wasErrorRecently).toBe(false);
    });

    it('handles incorrect key press and error timeout', async () => {
        vi.useFakeTimers();
        const store = useKeyboardStore();
        store.setHintedKey('KeyA');
        store.onKeyDown('KeyB');
        expect(store.wasErrorRecently).toBe(true);
        vi.advanceTimersByTime(200);
        expect(store.wasErrorRecently).toBe(false);
    });

    it('handles shift press and release', () => {
        const store = useKeyboardStore();
        store.onKeyDown('ShiftLeft');
        expect(store.isShiftPressed).toBe(true);
        store.onKeyUp('ShiftLeft');
        expect(store.isShiftPressed).toBe(false);
    });

    it('resets store state', () => {
        const store = useKeyboardStore();
        store.setHintedKey('KeyA');
        store.onKeyDown('KeyA');
        store.onKeyUp('KeyA');
        store.isShiftRequired = true;
        store.isShiftPressed = true;
        store.reset();
        expect(store.hintedKeyCode).toBe('');
        expect(store.pressedKeyCode).toBe('');
        expect(store.lastCorrectKeyCode).toBe('');
        expect(store.wasErrorRecently).toBe(false);
        expect(store.isShiftPressed).toBe(false);
        expect(store.isShiftRequired).toBe(false);
    });

    it('builds and uses key maps', () => {
        const store = useKeyboardStore();
        const key: KeyboardKey = {
            code: 'KeyA',
            lower: 'a',
            upper: 'A',
            finger: 'left-pinky',
        };
        store.buildKeyMaps([[key]]);
        expect(store.getSymbolByCode('KeyA')).toBe('a');
        store.isShiftPressed = true;
        expect(store.getSymbolByCode('KeyA')).toBe('A');
        expect(store.getKeyBySymbol('A')).toEqual(key);
        expect(store.getFingerByCode('KeyA')).toBe('left-pinky');
    });
});
