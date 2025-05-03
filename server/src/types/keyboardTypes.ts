export const enum Layout {
    QWERTY = 'QWERTY',
    YCUKEN = 'YCUKEN',
}

export const enum Lang {
    RU = 'RU',
    EN = 'EN',
}

export const LayoutLangMap = {
    [Layout.QWERTY]: Lang.EN,
    [Layout.YCUKEN]: Lang.RU,
};
