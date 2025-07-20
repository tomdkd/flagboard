CREATE TABLE "tenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"legal_name" text NOT NULL,
	"siret" text,
	"address" text,
	"city" text,
	"postal_code" text,
	"country" text,
	"phone" text,
	"website" text,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tenants_uuid_unique" UNIQUE("uuid")
);
