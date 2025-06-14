const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, CommunityMember, LocalAuthority, SystemAdministrator } = require('../models');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password, userRole, ...profileData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        $or: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      userRole,
      firstName: profileData.firstName,
      lastName: profileData.lastName
    });

    // Create role-specific profile
    switch (userRole) {
      case 'CommunityMember':
        await CommunityMember.create({
          userId: user.userId,
          ...profileData
        });
        break;
      case 'LocalAuthority':
        await LocalAuthority.create({
          userId: user.userId,
          department: profileData.department,
          areaOfResponsibility: profileData.areaOfResponsibility,
          contactEmail: profileData.contactEmail
        });
        break;
      case 'SystemAdministrator':
        await SystemAdministrator.create({
          userId: user.userId,
          adminLevel: profileData.adminLevel || 'Support'
        });
        break;
    }

    const token = generateToken(user.userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        userRole: user.userRole,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" });
    }

    // NEW: Restrict login to 'LocalAuthority' and 'SystemAdministrator' roles
    // Adjust this array based on who you want to allow logging into the admin panel
    const allowedLoginRoles = ["LocalAuthority", "SystemAdministrator"];
    if (!allowedLoginRoles.includes(user.userRole)) {
      return res
        .status(403)
        .json({
          error: "Access denied. You do not have permission to log in here.",
        });
    }

    // Update last login
    await user.update({ lastLoginDate: new Date() });

    const token = generateToken(user.userId);

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        userRole: user.userRole, // Ensure userRole is returned
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        { model: CommunityMember, as: 'communityMember' },
        { model: LocalAuthority, as: 'localAuthority' },
        { model: SystemAdministrator, as: 'systemAdministrator' }
      ]
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

module.exports = { register, login, getProfile };
