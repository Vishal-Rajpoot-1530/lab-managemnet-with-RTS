/*
  Warnings:

  - You are about to drop the `super_admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenant_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenant_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tenant_sessions` DROP FOREIGN KEY `tenant_sessions_tenant_id_fkey`;

-- DropForeignKey
ALTER TABLE `tenant_users` DROP FOREIGN KEY `tenant_users_tenant_id_fkey`;

-- DropTable
DROP TABLE `super_admins`;

-- DropTable
DROP TABLE `tenant_sessions`;

-- DropTable
DROP TABLE `tenant_users`;

-- DropTable
DROP TABLE `tenants`;
