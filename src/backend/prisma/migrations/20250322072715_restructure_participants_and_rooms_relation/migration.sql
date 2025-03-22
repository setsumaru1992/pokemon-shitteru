/*
  Warnings:

  - You are about to drop the column `answeredAt` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `isCorrect` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `pokemonId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `userAnswer` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `quizConfig` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `roomCode` on the `rooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session_id]` on the table `participants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_code]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participant_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokemon_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_answer` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiz_config` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_code` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `answers` DROP FOREIGN KEY `answers_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `answers` DROP FOREIGN KEY `answers_pokemonId_fkey`;

-- DropForeignKey
ALTER TABLE `answers` DROP FOREIGN KEY `answers_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `participants` DROP FOREIGN KEY `participants_roomId_fkey`;

-- DropIndex
DROP INDEX `answers_participantId_fkey` ON `answers`;

-- DropIndex
DROP INDEX `answers_pokemonId_fkey` ON `answers`;

-- DropIndex
DROP INDEX `answers_roomId_fkey` ON `answers`;

-- DropIndex
DROP INDEX `participants_roomId_fkey` ON `participants`;

-- DropIndex
DROP INDEX `rooms_roomCode_key` ON `rooms`;

-- AlterTable
ALTER TABLE `answers` DROP COLUMN `answeredAt`,
    DROP COLUMN `isCorrect`,
    DROP COLUMN `participantId`,
    DROP COLUMN `pokemonId`,
    DROP COLUMN `roomId`,
    DROP COLUMN `userAnswer`,
    ADD COLUMN `answered_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_correct` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `participant_id` INTEGER NOT NULL,
    ADD COLUMN `pokemon_id` INTEGER NOT NULL,
    ADD COLUMN `room_id` INTEGER NOT NULL,
    ADD COLUMN `user_answer` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `participants` DROP COLUMN `joinedAt`,
    DROP COLUMN `roomId`,
    DROP COLUMN `sessionToken`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expires_at` DATETIME(3) NOT NULL,
    ADD COLUMN `session_id` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `rooms` DROP COLUMN `quizConfig`,
    DROP COLUMN `roomCode`,
    ADD COLUMN `quiz_config` JSON NOT NULL,
    ADD COLUMN `room_code` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `room_participants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `room_participants_room_id_participant_id_key`(`room_id`, `participant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `participants_session_id_key` ON `participants`(`session_id`);

-- CreateIndex
CREATE UNIQUE INDEX `rooms_room_code_key` ON `rooms`(`room_code`);

-- AddForeignKey
ALTER TABLE `room_participants` ADD CONSTRAINT `room_participants_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_participants` ADD CONSTRAINT `room_participants_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_pokemon_id_fkey` FOREIGN KEY (`pokemon_id`) REFERENCES `pokemons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
