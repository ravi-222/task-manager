import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 10;

function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError(500, "JWT secret not configured");

  const expiresIn = (process.env.JWT_EXPIRES_IN || "24h") as string & jwt.SignOptions["expiresIn"];
  return jwt.sign({ userId }, secret, { expiresIn });
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await userRepository.create({
      ...input,
      password: hashedPassword,
    });

    const token = generateToken(user.id);
    return { user, token };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = generateToken(user.id);

    // Don't return password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  },
};
