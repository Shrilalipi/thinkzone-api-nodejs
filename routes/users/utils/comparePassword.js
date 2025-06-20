import bcrypt from 'bcryptjs';

export const comparePassword = async (password, hashedPreviousPassword) => {
    try {
        const salt = bcrypt.getSalt(hashedPreviousPassword);
        const hashedCurrentPassword = await bcrypt.hash(password, salt);
        console.log(hashedCurrentPassword);
        console.log(hashedPreviousPassword);
        if (hashedCurrentPassword === hashedPreviousPassword) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}