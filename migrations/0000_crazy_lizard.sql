CREATE TYPE "public"."role" AS ENUM('chairman', 'hod', 'staff');--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" varchar,
	"faculty_id" varchar,
	"date" timestamp NOT NULL,
	"is_present" boolean NOT NULL,
	"remarks" text,
	"uploaded_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" varchar,
	"details" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "colleges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"address" text,
	"principal_name" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" varchar NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"hod_id" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "faculty" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faculty_number" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"college_id" varchar NOT NULL,
	"department_id" varchar NOT NULL,
	"designation" text,
	"joined_year" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "faculty_faculty_number_unique" UNIQUE("faculty_number")
);
--> statement-breakpoint
CREATE TABLE "marks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" varchar NOT NULL,
	"subject" text NOT NULL,
	"semester" integer NOT NULL,
	"marks_obtained" numeric(5, 2),
	"total_marks" numeric(5, 2),
	"grade" text,
	"is_passed" boolean DEFAULT false,
	"uploaded_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admission_number" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"college_id" varchar NOT NULL,
	"department_id" varchar NOT NULL,
	"year" integer NOT NULL,
	"semester" integer NOT NULL,
	"gender" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "students_admission_number_unique" UNIQUE("admission_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"college_id" varchar,
	"department_id" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");