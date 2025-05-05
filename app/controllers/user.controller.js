// VALIDATE RESET PASSWORD TOKEN
export async function validateResetToken(req, res) {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        
        // Find user with valid token
        const user = await User.findOne({ 
            where: { 
                resetToken: token,
                resetTokenExpiry: { 
                    [Sequelize.Op.gt]: new Date() // Token not expired
                }
            } 
        });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token", valid: false });
        }
        
        res.status(200).json({ message: "Token is valid", valid: true });
    } catch (error) {
        res.status(400).json({ error: error.message, valid: false });
    }
} 