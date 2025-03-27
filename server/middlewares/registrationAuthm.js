const { body, validationResult } = require('express-validator');

const validateRegistration = [
    // Check if userName is not empty
    body('userName')
        .notEmpty()
        .withMessage('User Name is required')
        .trim()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Username cannot contain numbers'),


    body('userEmployeeId')
        .notEmpty()
        .withMessage('Employee ID is required')
        .trim(),

    // Check if userRole is not empty
    body('userRole')
        .notEmpty()
        .withMessage('User Role is required')
        .trim(),


    body('userPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[@$!%*?&]/)
        .withMessage('Password must contain at least one special character'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateRegistration };
