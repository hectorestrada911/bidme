/*
  Warnings:

  - Made the column `userId` on table `Request` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,
    "deadline" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "category" TEXT NOT NULL DEFAULT 'Other',
    "userId" TEXT NOT NULL,
    "acceptedOfferId" TEXT,
    CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("acceptedOfferId", "budget", "category", "createdAt", "deadline", "description", "id", "quantity", "status", "title", "updatedAt", "userId") SELECT "acceptedOfferId", "budget", "category", "createdAt", "deadline", "description", "id", "quantity", "status", "title", "updatedAt", "userId" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE UNIQUE INDEX "Request_acceptedOfferId_key" ON "Request"("acceptedOfferId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
