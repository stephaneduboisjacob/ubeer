ALTER TABLE "regions"
ADD COLUMN "language_code" TEXT NOT NULL DEFAULT 'en';

UPDATE "regions"
SET "language_code" = 'fr'
WHERE lower("name") LIKE '%montréal%'
   OR lower("name") LIKE '%montreal%'
   OR lower("name") LIKE '%québec%'
   OR lower("name") LIKE '%quebec%';
