const User = require("../models/User");
const Driver = require("../models/Driver");
const { sendEmail } = require("../config/mailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    if (!req.body.role) {
      return res.status(400).json({
        status: 0,
        message: "role Field is required",
      });
    } else if (req.body.role === "driver") {
      if (!req.body.name) {
        return res.status(400).json({
          status: 0,
          message: "Name Field is required",
        });
      } else if (!req.body.email) {
        return res.status(400).json({
          status: 0,
          message: "Email Field is required",
        });
      } else if (!req.body.phoneNumber) {
        return res.status(400).json({
          status: 0,
          message: "Phone Number Field is required",
        });
      } else if (!req.body.identityNumber) {
        return res.status(400).json({
          status: 0,
          message: "CNIC Number Field is required",
        });
      } else if (!req.body.driverLicense) {
        return res.status(400).json({
          status: 0,
          message: "Driver License Number Field is required",
        });
      } else if (!req.body.bikeNumber) {
        return res.status(400).json({
          status: 0,
          message: "Bike Number Field is required",
        });
      } else if (!req.body.password) {
        return res.status(400).json({
          status: 0,
          message: "Password Field is required",
        });
      } else {
        const driver = await Driver.find({ email: req.body.email });
        if (driver.length >= 1) {
          return res.status(400).json({
            status: 0,
            message: "Email is Already Exists!",
          });
        }
        // else if (driver.phoneNumber.length >= 1) {
        //   return res.status(400).json({
        //     status: 0,
        //     message: "Phone Number is Already Exists!",
        //   });
        // }
        else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(err).json({
                status: 0,
                message: "Bcrypt Hash Error",
              });
            } else {
              const verificationCode = Math.floor(
                100000 + Math.random() * 900000
              );

              const driver = new Driver({
                role: req.body.role,
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hash,
                identityNumber: req.body.identityNumber,
                driverLicense: req.body.driverLicense,
                bikeNumber: req.body.bikeNumber,
                address: req.body.address,
                verificationCode: verificationCode,
              });

              const token = jwt.sign(
                {
                  email: driver.email,
                  userId: driver._id,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "20hr",
                }
              );
              Driver.findByIdAndUpdate({ userToken: token });

              driver.userToken = token;
              driver.save();

              sendEmail(
                driver.email,
                driver.phoneNumber,
                verificationCode,
                "Email Verification"
              );

              return res.status(200).send({
                status: 1,
                message: "User verification code successfully sent to email.",
                data: {
                  verificationCode: driver.verificationCode,
                  userId: driver._id,
                },
                driver,
              });
            }
          });
        }
      }
    } else {
      if (!req.body.name) {
        return res.status(400).json({
          status: 0,
          message: "Name Field is required",
        });
      } else if (!req.body.email) {
        return res.status(400).json({
          status: 0,
          message: "Email Field is required",
        });
      } else if (!req.body.phoneNumber) {
        return res.status(400).json({
          status: 0,
          message: "Phone Number Field is required",
        });
      } else if (!req.body.password) {
        return res.status(400).json({
          status: 0,
          message: "Password Field is required",
        });
      } else {
        const user = await User.find({ email: req.body.email });
        if (user.length >= 1) {
          return res.status(400).json({
            status: 0,
            message: "Email is Already Exists!",
          });
        }
        // else if (user.phoneNumber.length >= 1) {
        //   return res.status(400).json({
        //     status: 0,
        //     message: "Phone Number is Already Exists!",
        //   });
        // }
        else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(err).json({
                status: 0,
                message: "Bcrypt Hash Error",
              });
            } else {
              const verificationCode = Math.floor(
                100000 + Math.random() * 900000
              );

              const user = new User({
                role: req.body.role,
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hash,
                address: req.body.address,
                verificationCode: verificationCode,
              });

              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user._id,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "20hr",
                }
              );
              User.findByIdAndUpdate({ userToken: token });

              user.userToken = token;
              user.save();

              sendEmail(
                user.email,
                user.phoneNumber,
                verificationCode,
                "Email Verification"
              );

              return res.status(200).send({
                status: 1,
                message: "User verification code successfully sent to email.",
                data: {
                  verificationCode: user.verificationCode,
                  userId: user._id,
                },
                user,
              });
            }
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = {
  register,
};
