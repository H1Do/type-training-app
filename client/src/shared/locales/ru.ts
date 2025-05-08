export const ru = {
    training: {
        accuracy: 'Точность',
        cpm: 'СВМ',
        reaction: 'Средняя реакция',
        undo: 'Отмены',
        time: 'Время',
        startNotice: 'Начните печатать, чтобы начать тренировку',
        settingsNotice:
            'Конфигурация пользовательского режима должна быть задана',
        press: 'Нажмите',
        toRestart: 'для перезапуска тренировки',
        restart: 'Перезапустить',
        s: 'с',
        ms: 'мс',
        configuration: 'Конфигурация',
        save: 'Сохранить',
        customConfiguration: 'Конфигурация пользовательского режима',
        words: 'Слова',
        keyboardBlurredHint: 'Клавиатура скрыта из-за выбранной сложности',

        modes: {
            letters: 'Буквы',
            symbols: 'Символы',
            numbers: 'Цифры',
            '100PopularWords': '100 Часто используемых слов',
            '1000PopularWords': '1000 Часто используемых слов',
            programming: 'Программирование',
            custom: 'Пользовательский',
        },

        labels: {
            mode: 'Режим',
            length: 'Количество символов/слов',
            layout: 'Раскладка',
        },

        errors: {
            lengthRange: 'Количество должно быть от 10 до 1000 символов',
            layoutQwerty: 'Текст должен содержать только символы QWERTY',
            layoutYcuken: 'Текст должен содержать только символы ЙЦУКЕН',
            symbolSpacing: 'Каждый символ должен быть разделён пробелом',
        },

        placeholder: {
            customInput: 'Введите символы/слова через пробел',
        },
    },

    header: {
        main: 'Главная',
        training: 'Тренировка',
        settings: 'Настройки',
        stats: 'Статистика',
        lessons: 'Уроки',
        'login/register': 'Вход/Регистрация',
        logoutConfirm: 'Вы уверены, что хотите выйти?',
        logout: 'Выйти',
        cancel: 'Отмена',
    },

    footer: {
        credits: 'Сделано с ❤️ H1Do (Латыпов Нияз)',
    },

    notFound: {
        thereIsNothingHere: 'Здесь ничего нет...',
        goToMain: 'Перейти на главную',
    },

    auth: {
        loginSuccess: 'Вход выполнен',
        registrationSuccess: 'Регистрация успешна',
        logoutSuccess: 'Выход выполнен',
        passwordChangeSuccess: 'Пароль успешно изменён',
        invalidCredentials: 'Неверный email или пароль',
        registrationFailed: 'Ошибка регистрации',
        logoutFailed: 'Ошибка выхода',
        changePasswordFailed: 'Ошибка смены пароля',
        checkAuthFailed: 'Ошибка авторизации',
        login: 'Вход',
        email: 'Email',
        password: 'Пароль',
        confirmPassword: 'Подтверждение пароля',
        registration: 'Регистрация',
        switch: 'Переключиться на',
    },

    profile: {
        profileData: 'Профиль',
        username: 'Имя пользователя',
        email: 'Email',
        registeredAt: 'Зарегистрирован',
        changePassword: 'Сменить пароль',
        logout: 'Выйти',
        oldPassword: 'Старый пароль',
        newPassword: 'Новый пароль',
        confirmPassword: 'Подтверждение пароля',
        allFieldsRequired: 'Все поля обязательны',
        passwordsDoNotMatch: 'Пароли не совпадают',
    },

    settings: {
        theme: 'Тема',
        layout: 'Раскладка',
        localization: 'Язык',
        difficulty: 'Сложность',
        toggleTheme: 'Переключить тему',

        difficulties: {
            easy: 'Легко',
            medium: 'Средне',
            hard: 'Сложно',
            expert: 'Эксперт',

            hints: {
                easy: 'Подсветка зон для пальцев и подсказки',
                medium: 'Только подсказки',
                hard: 'Без подсказок',
                expert: 'Клавиатура полностью скрыта',
            },
        },
    },

    stats: {
        title: 'Ваша статистика',
        notCounted: {
            base: 'Результат не попадёт в статистику',
            custom: 'так как выбран пользовательский режим',
            lowAccuracy: 'из-за слишком низкой точности (меньше 80%)',
            tooManyCorrections:
                'из-за большого количества исправлений (больше 10)',
        },
        leaderboardDisqualified: {
            base: 'Результат не будет учитываться в таблице лидеров',
            lowAccuracy: 'из-за низкой точности (меньше 90%)',
        },
        metrics: {
            accuracy: 'Точность',
            cpm: 'СВМ',
            reaction: 'Средняя реакция',
            time: 'Время',
            errorsCount: 'Кол-во ошибок',
            corrections: 'Кол-во исправлений',
            key: 'Клавиша',
            keyCount: 'Кол-во нажатий',
        },
    },
};
