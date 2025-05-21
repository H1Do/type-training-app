export const en = {
    networkError: 'Network error',

    main: {
        description:
            'is an app for learning and improving touch typing skills.',
        benefits: {
            stats: 'Live statistics during training',
            lessons: 'Lessons for beginners and advanced users',
            leveling: 'Leveling system, experience, and leaderboard',
            difficulty: '4 difficulty settings to master blind typing',
            syntax: 'Typing exercises for programming languages',
        },
        callToAction: 'Start now — register or log in!',
        login: 'Log In / Register',
        tryWithoutAuth: 'Or start training without an account!',
        startTraining: 'Start Training',
        welcome: 'Welcome',
        cards: {
            starsTitle: 'Progress by lessons',
            starsDescription: 'Received',
            statsTitle: 'Statistics',
            statsDescription: 'View your training results',
            training: 'Training',
            trainingDescription: 'Training for speed and accuracy',
        },
    },

    training: {
        accuracy: 'Accuracy',
        cpm: 'CPM',
        reaction: 'Average reaction',
        undo: 'Undo',
        time: 'Time',
        startNotice: 'Start typing to begin training',
        settingsNotice: 'Custom mode must be configured',
        press: 'Press',
        toRestart: 'to restart training',
        close: 'Close',
        s: 's',
        ms: 'ms',
        configuration: 'Configuration',
        save: 'Save',
        customConfiguration: 'Custom configuration',
        words: 'Words',
        keyboardBlurredHint: 'Keyboard is blurred due to selected difficulty',
        toStats: 'Go to stats...',

        modes: {
            letters: 'Letters',
            symbols: 'Symbols',
            numbers: 'Numbers',
            '100PopularWords': '100 Popular Words',
            '1000PopularWords': '1000 Popular Words',
            programming: 'Programming',
            custom: 'Custom',
        },

        labels: {
            mode: 'Mode',
            length: 'Number of characters/words',
            layout: 'Layout',
        },

        errors: {
            lengthRange: 'Count must be between 10 and 1000 characters',
            layoutQwerty: 'Text must contain only QWERTY characters',
            layoutYcuken: 'Text must contain only ЙЦУКЕН characters',
            symbolSpacing: 'Each symbol must be separated by a space',
        },

        placeholder: {
            customInput: 'Enter symbols/words separated by space',
        },
    },

    header: {
        main: 'Main',
        training: 'Training',
        settings: 'Settings',
        stats: 'Stats',
        lessons: 'Lessons',
        'login/register': 'Login/Register',
        logoutConfirm: 'Are you sure you want to logout?',
        logout: 'Logout',
        cancel: 'Cancel',
        admin: 'Admin panel',
        authRequired: 'Authentication required',
    },

    footer: {
        credits: 'Made with ❤️ by Hido (Latypov Niaz)',
    },

    notFound: {
        thereIsNothingHere: 'There is nothing here...',
        goToMain: 'Go to main page',
    },

    auth: {
        loginSuccess: 'Login successful',
        registrationSuccess: 'Registration successful',
        logoutSuccess: 'Logout successful',
        passwordChangeSuccess: 'Password changed successfully',
        invalidCredentials: 'Invalid email or password',
        registrationFailed: 'Registration failed',
        logoutFailed: 'Logout failed',
        changePasswordFailed: 'Change password failed',
        checkAuthFailed: 'Check auth failed',
        login: 'Login',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password',
        registration: 'Registration',
        switch: 'Switch to',
        toRegistration: 'registration',
        toLogin: 'login',
        passwordWeak:
            'Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.',
        passwordTooShort: 'Password must be at least 8 characters',
        allFieldsRequired: 'All fields are required',
        passwordsDoNotMatch: 'Passwords do not match',
        forgotPassword: 'Forgot password?',
        resetPasswordTitle: 'Reset password',
        resetPassword: 'Reset password',
        reset: 'Reset',
        setNewPassword: 'New password',
        set: 'Apply',
        verificationSent: 'Verification email sent to your email',
        verificationFailed: 'Verification email sending failed',
        passwordResetSuccess: 'Password reset successfully',
        passwordResetFailed: 'Password reset failed',
        resetRequestSent: 'Password reset email sent to your email',
        resetRequestFailed: 'Password reset email sending failed',
        emailVerified: 'Email verified successfully',
        emailVerificationFailed: 'Email verification failed',
        emailNotVerified: 'Your email is not verified',
        emailVerifying: 'Email verifying...',
        verifyNow: 'Verify now',
    },

    profile: {
        profileData: 'Profile data',
        username: 'Username',
        email: 'Email',
        registeredAt: 'Registered at',
        changePassword: 'Change password',
        logout: 'Logout',
        oldPassword: 'Old password',
        newPassword: 'New password',
        confirmPassword: 'Confirm password',
    },

    settings: {
        theme: 'Theme',
        layout: 'Layout',
        localization: 'Localization',
        difficulty: 'Difficulty',
        toggleTheme: 'Toggle theme',

        difficulties: {
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
            expert: 'Expert',

            hints: {
                easy: 'Highlight finger zones and hints',
                medium: 'Only hints',
                hard: 'No hints',
                expert: 'Keyboard is fully hidden',
            },
        },
    },

    stats: {
        trainingResult: 'Training result',
        space: 'Space',
        notCounted: {
            base: 'Result will not be included in the statistics',
            notAuth: 'due to not being logged in',
            custom: 'because custom mode was selected',
            lowAccuracy: 'due to low accuracy (less than 80%)',
            tooManyTextErrors: 'due to too many text errors (more than 10)',
        },
        leaderboardDisqualified: {
            base: 'Result will not count towards the leaderboard',
            lowAccuracy: 'due to low accuracy (less than 90%)',
            tooManyCorrections: 'due to too many corrections (more than 10)',
        },
        metrics: {
            accuracy: 'Accuracy',
            cpm: 'CPM',
            reaction: 'Average reaction',
            time: 'Duration',
            errorsCount: 'Errors clicks (total)',
            textErrorsCount: 'Text errors (total)',
            corrections: 'Corrections (total)',
            key: 'Key',
            keyCount: 'Pressed (total)',
            errorsRate: 'Errors rate',
            lesson: 'Lesson',
            layout: 'Layout',
        },
        finger: 'Finger',
        fingers: {
            'left-pinky': 'Left pinky',
            'left-ring': 'Left ring',
            'left-middle': 'Left middle',
            'left-index': 'Left index',
            thumb: 'Thumb',
            'right-index': 'Right index',
            'right-middle': 'Right middle',
            'right-ring': 'Right ring',
            'right-pinky': 'Right pinky',
        },
        period: {
            day: 'Day',
            week: 'Week',
            month: 'Month',
            all: 'All time',
        },
        fetchStatsFailed: 'Failed to fetch stats',
        leaderboard: {
            title: 'Leaderboard',
        },
        chart: {
            title: 'Session statistics',
        },
        sessions: {
            title: 'Click map',
        },
        bestUsers: 'Top users',
    },

    lessons: {
        title: 'Lessons',
        layout: 'Layout',
        prevLessons: 'Previous lessons',
        nextLessons: 'Next lessons',
        prevLesson: 'Previous lesson',
        nextLesson: 'Next lesson',
        press: 'Press',
        toRestart: 'to restart lesson',
        toLessons: 'Back to all lessons',
    },

    ui: {
        noData: 'No data',
    },

    level: {
        levelUp: 'Congratulations, you have leveled up!',
        level: 'Level',
        lvl: 'Lvl.',
    },

    admin: {
        title: 'Administration panel',

        errors: {
            failed_to_load_users: 'Failed to load users',
            failed_to_load_lessons: 'Failed to load lessons',
            failed_to_load_user_stats: 'Failed to load user stats',
            failed_to_block: 'Failed to block user',
            failed_to_unblock: 'Failed to unblock user',
            failed_to_create_lesson: 'Failed to create lesson',
            failed_to_update_lesson: 'Failed to update lesson',
            failed_to_delete_lesson: 'Failed to delete lesson',
        },

        messages: {
            user_blocked: 'User has been blocked',
            user_unblocked: 'User has been unblocked',
            lesson_created: 'Lesson created successfully',
            lesson_updated: 'Lesson updated successfully',
            lesson_deleted: 'Lesson deleted successfully',
        },

        cards: {
            lessons: 'Lesson Management',
            users: 'Users Management',
        },

        charts: {
            registrations: 'Registrations',
        },

        stats: {
            totalUsers: 'Total users',
            activeUsersToday: 'Active users today',
            activeUsersWeek: 'Active users this week',
            totalTrainings: 'Total trainings',
            totalLessonsCompleted: 'Completed lessons',
            mostPopularMode: 'Most popular mode',
            avgAccuracy: 'Average accuracy',
            avgCpm: 'Average speed (CPM)',
        },

        searchPlaceholder: 'Поиск по пользователям...',

        actions: {
            view_stats: 'Статистика',
            block: 'Заблокировать',
            unblock: 'Разблокировать',
        },

        goBack: 'Go back',
        selectedUser: 'Selected user',
        selectedUserStats: 'User stats',

        lessons: {
            title: 'Lesson title (EN)',
            titleRu: 'Lesson title (RU)',
            allowedChars: 'Allowed characters',
            minAccuracy: 'Minimum accuracy (%)',
            cpmFor1: 'CPM for 1 star',
            cpmFor2: 'CPM for 2 stars',
            cpmFor3: 'CPM for 3 stars',
            order: 'Order',
            layout: 'Layout',
            description: 'Hold and ',
            prevLessons: 'Previous lessons',
            nextLessons: 'Next lessons',
            prevLesson: 'Previous lesson',
            nextLesson: 'Next lesson',
            press: 'Press',
            toRestart: 'to restart the lesson',
            toLessons: 'Back to all lessons',
            length: 'Symbols count',
        },

        buttons: {
            save: 'Save',
            cancel: 'Cancel',
            edit: 'Edit',
            create: 'Create',
            delete: 'Delete',
        },

        users: 'Users',

        confirmDelete: 'Delete lesson',
        confirmDeleteMessage: 'Are you sure you want to delete this lesson?',

        chars: 'chars',
    },
};
