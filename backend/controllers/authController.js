const User = require('../Models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

//Registration => /api/v1/register
exports.registerUser = catchAsyncErrors( async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        avatar: {
            public_id: 'dummy',
            url: 'dummy'
        }
    });

   sendToken(user, 200, res);
});

//Login => /api/v1/login
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorHandler('Please enter E-Mail and Password', 400))
    };

    const user = await User.findOne({ email: email }).select('+password');

    if(!user) {
        return next(new ErrorHandler('User does not exist with this E-Mail Address', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('This Users password does not match entered password.', 401));
    }

    sendToken(user, 200, res);
});

//Logout => /api/v1/logout
exports.logout = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token', null, { 
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User is logged out.'
    })
});

//Forgot Password - Recover Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorHandler('User not found with this E-Mail.', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //Create Resest Password URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password Token is as follows:\n\n${resetUrl}\n\nIf you have not requeste a password reset then ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subjcet: 'E_Commerce Password Reset',
            message: message
        });
        res.status(200).json({
            success: true,
            message: `Reset token has been sent to ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password - Link from Mail => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
    // Hash Token that we receive from req
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired.', 400));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }

    // Set up a new Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
});