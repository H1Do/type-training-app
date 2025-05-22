export function isPasswordStrong(password: string): boolean {
    return (
        password.length >= 8 &&
        password.length <= 32 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );
}
