import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';   

const generateToken = (id) => {
  return jwt.sign(
    {
      id},process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export const registerUser = async (req, res) => {

    const { fullname, email, password,profileImageUrl } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = User.create({
            fullname,
            email,
            password,
            profileImageUrl
        });
        res.status(201).josn({
            id:(await user)._id,
            user,
            token:generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error' });  
        }
  
}

export const loginUser = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({
            id:user._id,
            user,
            token:generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}