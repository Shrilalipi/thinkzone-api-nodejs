import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        console.error(e);
        return null;
    }
}