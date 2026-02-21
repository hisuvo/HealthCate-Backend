/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender, Role } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedSuperAdmin = async () => {
  try {
    // setp-1:Fiend first super-admin in exists
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        email: Role.SUPERADMIN,
      },
    });

    if (isSuperAdminExist) {
      console.log("Super admin already exists. Skipping seeding super admin.");
      return;
    }

    // Create user using better-auth
    const superAdminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.SUPER_ADMIN_EMAIL,
        password: envVars.SUPER_ADMIN_PASSWORD,
        name: "Super Admin",
        role: Role.SUPERADMIN,
        needPasswordChange: false,
        rememberMe: false,
      },
    });

    await prisma.$transaction(async (tx) => {
      // user email verification user true
      await tx.user.update({
        where: {
          id: superAdminUser.user.id,
        },
        data: {
          emailVerified: true,
        },
      });

      // crete super admin account in admin
      await tx.admin.create({
        data: {
          userId: superAdminUser.user.id,
          name: "Super Admin",
          email: envVars.SUPER_ADMIN_EMAIL,
          gender: Gender.MALE,
        },
      });
    });

    // retrived admin data from admin
    const superAdmin = await prisma.admin.findFirst({
      where: {
        email: envVars.SUPER_ADMIN_EMAIL,
      },
      include: {
        user: true,
      },
    });

    // console.log("Super Admin Created ", superAdmin);
  } catch (error: any) {
    console.error("Error seeding super admin: ", error);

    await prisma.user.delete({
      where: {
        email: envVars.SUPER_ADMIN_EMAIL,
      },
    });
  }
};
