import { describe, it, expect } from 'vitest';
import { computed } from 'vue';
import { CHARS_PER_LINE, SHOWED_LINES } from '@/shared/config/training';

function createCharDisplayHelpers(props: {
    sequence: string[];
    input: (string | undefined)[];
    currentIndex: number;
}) {
    const totalLines = computed(() =>
        Math.ceil(props.sequence.length / CHARS_PER_LINE),
    );

    const completedLines = computed(() =>
        Math.floor(props.input.length / CHARS_PER_LINE),
    );

    const offset = computed(() => {
        const lastWindowStartLine = totalLines.value - SHOWED_LINES;

        if (totalLines.value <= SHOWED_LINES) return 0;

        if (completedLines.value < lastWindowStartLine + 1) {
            return Math.max(0, (completedLines.value - 1) * CHARS_PER_LINE);
        }

        return lastWindowStartLine * CHARS_PER_LINE;
    });

    const rows = computed(() => {
        const result: string[][] = [];
        for (let i = 0; i < props.sequence.length; i += CHARS_PER_LINE) {
            result.push(props.sequence.slice(i, i + CHARS_PER_LINE));
        }

        const startLine = offset.value / CHARS_PER_LINE;
        return result.slice(startLine, startLine + SHOWED_LINES);
    });

    const getCharClass = (globalIndex: number): Record<string, boolean> => {
        const expected = props.sequence[globalIndex];
        const actual = props.input[globalIndex];

        return {
            correct: actual === expected && actual !== undefined,
            incorrect: actual !== expected && actual !== undefined,
            untyped: actual === undefined,
        };
    };

    return {
        totalLines,
        completedLines,
        offset,
        rows,
        getCharClass,
    };
}

describe('CharDisplay logic', () => {
    it('calculates totalLines correctly', () => {
        const props = {
            sequence: Array(300).fill('a'),
            input: [],
            currentIndex: 0,
        };
        const { totalLines } = createCharDisplayHelpers(props);
        expect(totalLines.value).toBe(Math.ceil(300 / CHARS_PER_LINE));
    });

    it('calculates completedLines correctly', () => {
        const props = {
            sequence: [],
            input: Array(50).fill('a'),
            currentIndex: 0,
        };
        const { completedLines } = createCharDisplayHelpers(props);
        expect(completedLines.value).toBe(Math.floor(50 / CHARS_PER_LINE));
    });

    it('calculates offset correctly when totalLines <= SHOWED_LINES', () => {
        const length = CHARS_PER_LINE * (SHOWED_LINES - 1);
        const props = {
            sequence: Array(length).fill('a'),
            input: Array(length).fill('a'),
            currentIndex: 0,
        };
        const { offset } = createCharDisplayHelpers(props);
        expect(offset.value).toBe(0);
    });

    it('calculates offset correctly when completedLines < lastWindowStartLine + 1', () => {
        const totalLength = CHARS_PER_LINE * (SHOWED_LINES + 3);
        const inputLength = CHARS_PER_LINE * 2;

        const props = {
            sequence: Array(totalLength).fill('a'),
            input: Array(inputLength).fill('a'),
            currentIndex: 0,
        };
        const { offset, totalLines, completedLines } =
            createCharDisplayHelpers(props);
        const lastWindowStartLine = totalLines.value - SHOWED_LINES;

        expect(completedLines.value).toBe(2);
        expect(completedLines.value).toBeLessThan(lastWindowStartLine + 1);
        expect(offset.value).toBe(
            Math.max(0, (completedLines.value - 1) * CHARS_PER_LINE),
        );
    });

    it('calculates offset correctly when completedLines >= lastWindowStartLine + 1', () => {
        const totalLength = CHARS_PER_LINE * (SHOWED_LINES + 3);
        const inputLength = CHARS_PER_LINE * (SHOWED_LINES + 3);

        const props = {
            sequence: Array(totalLength).fill('a'),
            input: Array(inputLength).fill('a'),
            currentIndex: 0,
        };
        const { offset, totalLines } = createCharDisplayHelpers(props);
        const lastWindowStartLine = totalLines.value - SHOWED_LINES;

        expect(offset.value).toBe(lastWindowStartLine * CHARS_PER_LINE);
    });

    it('rows returns correct slices of sequence', () => {
        const sequence = Array(CHARS_PER_LINE * (SHOWED_LINES + 2))
            .fill(null)
            .map((_, i) => String.fromCharCode(65 + (i % 26)));
        const input = sequence.slice(0, CHARS_PER_LINE * 3);

        const props = { sequence, input, currentIndex: 0 };
        const { rows } = createCharDisplayHelpers(props);

        expect(rows.value.length).toBe(SHOWED_LINES);

        for (const row of rows.value) {
            expect(row.length).toBeLessThanOrEqual(CHARS_PER_LINE);
        }
    });

    it('getCharClass returns correct class for correct, incorrect, and untyped chars', () => {
        const sequence = ['a', 'b', 'c', 'd', 'e'];
        const inputCorrect = ['a', 'b', 'c', 'd', 'e'];
        const inputIncorrect = ['a', 'x', 'c', undefined, 'e'];

        const propsCorrect = { sequence, input: inputCorrect, currentIndex: 0 };
        const propsIncorrect = {
            sequence,
            input: inputIncorrect,
            currentIndex: 0,
        };

        const { getCharClass: getCharClassCorrect } =
            createCharDisplayHelpers(propsCorrect);
        const { getCharClass: getCharClassIncorrect } =
            createCharDisplayHelpers(propsIncorrect);

        expect(getCharClassCorrect(0)).toEqual({
            correct: true,
            incorrect: false,
            untyped: false,
        });
        expect(getCharClassIncorrect(1)).toEqual({
            correct: false,
            incorrect: true,
            untyped: false,
        });
        expect(getCharClassIncorrect(3)).toEqual({
            correct: false,
            incorrect: false,
            untyped: true,
        });
    });
});
