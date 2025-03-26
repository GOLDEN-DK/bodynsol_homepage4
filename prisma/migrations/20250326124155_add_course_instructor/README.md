# Migration `20250326124155_add_course_instructor`

This migration has been created manually at 20250326124155_add_course_instructor.

## Changes

- Create the `course_instructor` table
- Create the `Application` table
- Add the relationships between models

## SQL

```sql
-- CreateTable
CREATE TABLE "course_instructor" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "role" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "course_instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "scheduleId" TEXT,
  "koreanName" TEXT NOT NULL,
  "englishName" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "gender" TEXT,
  "age" TEXT,
  "occupation" TEXT,
  "region" TEXT,
  "pilatesExperience" TEXT,
  "question" TEXT,
  "paymentMethod" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_instructor_courseId_teacherId_key" ON "course_instructor"("courseId", "teacherId");

-- CreateIndex
CREATE INDEX "course_instructor_courseId_idx" ON "course_instructor"("courseId");

-- CreateIndex
CREATE INDEX "course_instructor_teacherId_idx" ON "course_instructor"("teacherId");

-- CreateIndex
CREATE INDEX "Application_courseId_idx" ON "Application"("courseId");

-- AddForeignKey
ALTER TABLE "course_instructor" ADD CONSTRAINT "course_instructor_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_instructor" ADD CONSTRAINT "course_instructor_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "edu_teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```
