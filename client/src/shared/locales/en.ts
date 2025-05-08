export const en = {
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
        restart: 'Restart',
        s: 's',
        ms: 'ms',
        configuration: 'Configuration',
        save: 'Save',
        customConfiguration: 'Custom configuration',
        words: 'Words',
        keyboardBlurredHint: 'Keyboard is blurred due to selected difficulty',

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
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password',
        registration: 'Registration',
        switch: 'Switch to',
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
        allFieldsRequired: 'All fields are required',
        passwordsDoNotMatch: 'Passwords do not match',
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
        title: 'Your Stats',
        notCounted: {
            base: 'Result will not be included in the statistics',
            custom: 'because custom mode was selected',
            lowAccuracy: 'due to low accuracy (less than 80%)',
            tooManyCorrections: 'due to too many corrections (more than 10)',
        },
        leaderboardDisqualified: {
            base: 'Result will not count towards the leaderboard',
            lowAccuracy: 'due to low accuracy (less than 90%)',
        },
        metrics: {
            accuracy: 'Accuracy',
            cpm: 'CPM',
            reaction: 'Average reaction',
            time: 'Duration',
            errors: 'Errors (total)',
            corrections: 'Corrections (total)',
            key: 'Key',
            keyCount: 'Pressed (total)',
        },
    },
};
