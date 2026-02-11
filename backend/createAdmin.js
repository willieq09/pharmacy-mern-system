require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const plainPassword = 'MySuperSecret123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password:', plainPassword);

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
};

createAdmin();
