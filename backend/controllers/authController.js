const User = require('../Models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

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