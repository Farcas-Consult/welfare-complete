import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { User } from "../modules/auth/entities/user.entity";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    // Wait a bit for database connection to be fully established
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    try {
      // Check if admin user already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { role: "admin" },
      });

      if (existingAdmin) {
        this.logger.log("Admin user already exists. Skipping seed.");
        return;
      }

      // Get admin credentials from environment variables or use defaults
      const adminUsername =
        this.configService.get<string>("ADMIN_USERNAME") || "admin";
      const adminEmail =
        this.configService.get<string>("ADMIN_EMAIL") || "admin@welfare.com";
      const adminPassword =
        this.configService.get<string>("ADMIN_PASSWORD") || "Admin@123";

      // Check if a user with this username or email already exists
      const existingUser = await this.userRepository.findOne({
        where: [{ username: adminUsername }, { email: adminEmail }],
      });

      if (existingUser) {
        this.logger.warn(
          `User with username "${adminUsername}" or email "${adminEmail}" already exists. Skipping admin seed.`
        );
        return;
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      const adminUser = this.userRepository.create({
        username: adminUsername,
        email: adminEmail,
        passwordHash,
        role: "admin",
        isActive: true,
        emailVerified: true, // Auto-verify admin email
      });

      await this.userRepository.save(adminUser);

      this.logger.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     ✅ Admin User Created Successfully! ✅                    ║
║                                                              ║
║     Username: ${adminUsername.padEnd(47)}║
║     Email:    ${adminEmail.padEnd(47)}║
║     Password: ${adminPassword.padEnd(47)}║
║                                                              ║
║     ⚠️  Please change the password after first login!        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
      `);
    } catch (error) {
      this.logger.error("Failed to seed admin user:", error);
      // Don't throw - allow app to continue even if seed fails
    }
  }
}
