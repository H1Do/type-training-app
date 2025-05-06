export function isQwertyOnly(str: string): boolean {
    const allowed = new Set<string>([
        ' ',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        ')',
        '!',
        '@',
        '#',
        '$',
        '%',
        '^',
        '&',
        '*',
        '(',
        ...'abcdefghijklmnopqrstuvwxyz'.split(''),
        ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        '`',
        '-',
        '=',
        '[',
        ']',
        '\\',
        ';',
        "'",
        ',',
        '.',
        '/',
        '~',
        '_',
        '+',
        '{',
        '}',
        '|',
        ':',
        '"',
        '<',
        '>',
        '?',
    ]);

    for (const ch of str) {
        if (!allowed.has(ch)) {
            return false;
        }
    }
    return true;
}

export function isYcukenOnly(str: string): boolean {
    const rusLower = [
        'й',
        'ц',
        'у',
        'к',
        'е',
        'н',
        'г',
        'ш',
        'щ',
        'з',
        'х',
        'ъ',
        'ф',
        'ы',
        'в',
        'а',
        'п',
        'р',
        'о',
        'л',
        'д',
        'ж',
        'э',
        'я',
        'ч',
        'с',
        'м',
        'и',
        'т',
        'ь',
        'б',
        'ю',
        'ё',
    ];
    const rusUpper = rusLower.map((ch) => ch.toUpperCase());

    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const shiftDigits = ['%', '№', '-', '/', '"', ':', ',', '.', '_', '?'];

    const misc = ['+', '='];

    const punct = ['.', ','];

    const allowed = new Set<string>([
        ' ',
        ...rusLower,
        ...rusUpper,
        ...digits,
        ...shiftDigits,
        ...misc,
        ...punct,
    ]);

    for (const ch of str) {
        if (!allowed.has(ch)) {
            return false;
        }
    }
    return true;
}
