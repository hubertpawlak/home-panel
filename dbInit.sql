-- PostgreSQL
CREATE TABLE IF NOT EXISTS "push" (
	"endpoint" TEXT NOT NULL,
	"p256dh" TEXT NOT NULL,
	"auth" TEXT NOT NULL,
	"ownerId" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT '(now() AT TIME ZONE ''utc''::text)',
	PRIMARY KEY ("endpoint")
);

CREATE TABLE "temperature_sensors" (
	"hwId" TEXT NOT NULL,
	"temperature" NUMERIC NULL DEFAULT NULL,
	"resolution" NUMERIC NULL DEFAULT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL DEFAULT '(now() AT TIME ZONE ''utc''::text)',
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT '(now() AT TIME ZONE ''utc''::text)',
	"name" TEXT NULL DEFAULT NULL,
	"updated_by" TEXT NULL DEFAULT NULL,
	PRIMARY KEY ("hwId")
);
