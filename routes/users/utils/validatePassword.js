export const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        throw new Error('Provide a strong password: at least one uppercase, one lowercase, one number, one special character');
    }
}
