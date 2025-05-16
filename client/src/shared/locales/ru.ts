export const ru = {
    main: {
        description:
            'это приложение для обучения и совершенствования навыков слепой печати на клавиатуре.',
        benefits: {
            stats: 'Тренировки с живой статистикой',
            lessons: 'Уроки для начинающих и продвинутых',
            leveling: 'Система уровней, опыта и рейтинга',
            difficulty: '4 настройки сложности для освоения слепой печати',
            syntax: 'Тренировки на синтаксис языков программирования',
        },
        callToAction:
            'Начните прямо сейчас — зарегистрируйтесь или войдите в аккаунт!',
        login: 'Войти/Зарегистрироваться',
        tryWithoutAuth: 'Или начните тренировку без регистрации!',
        startTraining: 'Начать тренировку',
        welcome: 'Добро пожаловать',
        cards: {
            starsTitle: 'Прогресс по урокам',
            starsDescription: 'Получено',
            statsTitle: 'Статистика',
            statsDescription: 'Посмотреть результаты своих тренировок',
            training: 'Тренировка',
            trainingDescription: 'Тренировка на скорость и точность',
        },
    },

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
        close: 'Закрыть',
        s: 'с',
        ms: 'мс',
        configuration: 'Конфигурация',
        save: 'Сохранить',
        customConfiguration: 'Конфигурация пользовательского режима',
        words: 'Слова',
        keyboardBlurredHint: 'Клавиатура скрыта из-за выбранной сложности',
        toStats: 'Перейти к статистике...',

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
        admin: 'Админ панель',
        authRequired: 'Требуется авторизация',
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
        username: 'Имя пользователя',
        email: 'Email',
        password: 'Пароль',
        confirmPassword: 'Подтверждение пароля',
        registration: 'Регистрация',
        switch: 'Переключиться на',
        toRegistration: 'регистрацию',
        toLogin: 'вход',
        passwordWeak:
            'Пароль должен быть не менее 8 символов и содержать заглавные, строчные буквы, цифры и специальные символы.',
        allFieldsRequired: 'Все поля обязательны',
        passwordsDoNotMatch: 'Пароли не совпадают',
        forgotPassword: 'Забыли пароль?',
        resetPasswordTitle: 'Сброс пароля',
        resetPassword: 'Сбросить пароль',
        reset: 'Сбросить',
        setNewPassword: 'Новый пароль',
        set: 'Применить',
        verificationSent: 'Письмо с подтверждением отправлено на вашу почту',
        verificationFailed: 'Ошибка отправки письма с подтверждением',
        passwordResetSuccess: 'Пароль успешно изменён',
        passwordResetFailed: 'Ошибка сброса пароля',
        resetRequestSent: 'Письмо для сброса пароля отправлено на вашу почту',
        resetRequestFailed: 'Ошибка отправки письма для сброса пароля',
        emailVerified: 'Ваш email успешно подтверждён',
        emailVerificationFailed: 'Ошибка подтверждения email',
        emailNotVerified: 'Ваша почта не подтверждена',
        emailVerifying: 'Подтверждение email...',
        verifyNow: 'Подтвердить',
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
        trainingResult: 'Результат тренировки',
        space: 'Пробел',
        notCounted: {
            base: 'Результат не попадёт в статистику',
            notAuth: 'так как вы не авторизованы',
            custom: 'так как выбран пользовательский режим',
            lowAccuracy: 'из-за слишком низкой точности (меньше 80%)',
            tooManyTextErrors:
                'из-за большого количества ошибок в тексте (больше 10)',
        },
        leaderboardDisqualified: {
            base: 'Результат не будет учитываться в таблице лидеров',
            lowAccuracy: 'из-за низкой точности (меньше 90%)',
            tooManyCorrections:
                'из-за большого количества исправлений (больше 10)',
        },
        metrics: {
            accuracy: 'Точность',
            cpm: 'СВМ',
            reaction: 'Средняя реакция',
            time: 'Время',
            errorsCount: 'Кол-во ошибочных нажатий',
            textErrorsCount: 'Кол-во ошибок в тексте',
            corrections: 'Кол-во исправлений',
            key: 'Клавиша',
            keyCount: 'Кол-во нажатий',
            errorsRate: 'Частота ошибок',
            lesson: 'Урок',
            layout: 'Раскладка',
        },
        finger: 'Палец',
        fingers: {
            'left-pinky': 'Левый мизинец',
            'left-ring': 'Левый безымянный',
            'left-middle': 'Левый средний',
            'left-index': 'Левый указательный',
            thumb: 'Большой палец',
            'right-index': 'Правый указательный',
            'right-middle': 'Правый средний',
            'right-ring': 'Правый безымянный',
            'right-pinky': 'Правый мизинец',
        },
        period: {
            day: 'День',
            week: 'Неделя',
            month: 'Месяц',
            all: 'Все время',
        },
        fetchStatsFailed: 'Не удалось загрузить статистику',
        leaderboard: {
            title: 'Таблица лидеров',
        },
        chart: {
            title: 'Статистика сессий',
        },
        sessions: {
            title: 'Карта нажатий',
        },
        bestUsers: 'Топ пользователей',
    },

    lessons: {
        title: 'Уроки',
        layout: 'Раскладка',
        description: 'Зажмите и ',
        prevLessons: 'Предыдущие уроки',
        nextLessons: 'Следующие уроки',
        prevLesson: 'Предыдущий урок',
        nextLesson: 'Следующий урок',
        press: 'Нажмите',
        toRestart: 'для перезапуска урока',
        toLessons: 'Вернуться к всем урокам',
    },

    ui: {
        noData: 'Нет данных',
    },

    level: {
        levelUp: 'Поздравляем, вы повысили уровень!',
        level: 'Уровень',
        lvl: 'Ур.',
    },

    admin: {
        title: 'Панель администратора',
        users: 'Пользователи',

        errors: {
            failed_to_load_users: 'Не удалось загрузить пользователей',
            failed_to_load_lessons: 'Не удалось загрузить уроки',
            failed_to_load_user_stats:
                'Не удалось загрузить статистику пользователя',
            failed_to_block: 'Не удалось заблокировать пользователя',
            failed_to_unblock: 'Не удалось разблокировать пользователя',
            failed_to_create_lesson: 'Не удалось создать урок',
            failed_to_update_lesson: 'Не удалось обновить урок',
            failed_to_delete_lesson: 'Не удалось удалить урок',
        },

        messages: {
            user_blocked: 'Пользователь заблокирован',
            user_unblocked: 'Пользователь разблокирован',
            lesson_created: 'Урок создан',
            lesson_updated: 'Урок обновлён',
            lesson_deleted: 'Урок удалён',
        },

        cards: {
            lessons: 'Редактирование уроков',
            users: 'Управление пользователями',
        },

        charts: {
            registrations: 'Регистраций',
        },

        stats: {
            totalUsers: 'Всего пользователей',
            activeUsersToday: 'Активных пользователей за сегодня',
            activeUsersWeek: 'Активных пользователей за неделю',
            totalTrainings: 'Всего тренировок',
            totalLessonsCompleted: 'Завершённых уроков',
            mostPopularMode: 'Популярный режим',
            avgAccuracy: 'Средняя точность',
            avgCpm: 'Средняя скорость (СВМ)',
        },

        searchPlaceholder: 'Поиск по пользователям...',

        actions: {
            view_stats: 'Статистика',
            block: 'Заблокировать',
            unblock: 'Разблокировать',
        },

        goBack: 'Вернуться назад',
        selectedUser: 'Выбранный пользователь',
        selectedUserStats: 'Статистика пользователя',

        lessons: {
            title: 'Название урока (EN)',
            titleRu: 'Название урока (RU)',
            allowedChars: 'Допустимые символы',
            minAccuracy: 'Минимальная точность (%)',
            cpmFor1: 'СВМ для 1 звезды',
            cpmFor2: 'СВМ для 2 звёзд',
            cpmFor3: 'СВМ для 3 звёзд',
            order: 'Порядок',
            layout: 'Раскладка',
            description: 'Зажмите и ',
            prevLessons: 'Предыдущие уроки',
            nextLessons: 'Следующие уроки',
            prevLesson: 'Предыдущий урок',
            nextLesson: 'Следующий урок',
            press: 'Нажмите',
            toRestart: 'для перезапуска урока',
            toLessons: 'Вернуться к всем урокам',
            length: 'Количество символов',
        },

        buttons: {
            save: 'Сохранить',
            cancel: 'Отмена',
            edit: 'Редактировать',
            create: 'Создать',
            delete: 'Удалить',
        },

        confirmDelete: 'Удаление урока',
        confirmDeleteMessage: 'Вы уверены, что хотите удалить этот урок?',

        chars: 'символов',
    },
};
