-- modulo bias is not a concern here as it is used for non-unique default names
CREATE OR REPLACE FUNCTION generate_insecure_short_key(size INT) RETURNS TEXT AS $$
DECLARE
    characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    bytes BYTEA := gen_random_bytes(size);
    l INT := length(characters);
    i INT := 0;
    output TEXT := '';
BEGIN
    WHILE i < size LOOP
        output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
        i := i + 1;
    END LOOP;
    RETURN output;
END;
$$ LANGUAGE plpgsql VOLATILE;

create table "public"."uds_sensors" (
    "id" text not null,
    "name" text not null default ('sensor_' || generate_insecure_short_key(6)),
    "hardware_type" text not null,
    "source_type" text not null,
    "temperature" double precision,
    "resolution" double precision,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "updated_by" text
);

alter table "public"."uds_sensors" enable row level security;

CREATE UNIQUE INDEX uds_sensors_pkey ON public.uds_sensors USING btree (id);

alter table "public"."uds_sensors" add constraint "uds_sensors_pkey" PRIMARY KEY using index "uds_sensors_pkey";

create policy "deny"
on "public"."uds_sensors"
as permissive
for all
to public
using (false);

CREATE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."uds_sensors" FOR EACH ROW WHEN (NEW.name = OLD.name) EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

create table "public"."uds_upses" (
    "id" text not null,
    "name" text not null default ('ups_' || generate_insecure_short_key(6)),
    "hardware_type" text not null,
    "source_type" text not null,
    "battery_charge" smallint,
    "battery_charge_low" smallint,
    "battery_runtime" bigint,
    "battery_runtime_low" bigint,
    "input_frequency" double precision,
    "input_voltage" double precision,
    "output_frequency" double precision,
    "output_frequency_nominal" double precision,
    "output_voltage" double precision,
    "output_voltage_nominal" double precision,
    "ups_load" smallint,
    "ups_power" int,
    "ups_power_nominal" int,
    "ups_realpower" int,
    "ups_status" text,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "updated_by" text
);

alter table "public"."uds_upses" enable row level security;

CREATE UNIQUE INDEX uds_upses_pkey ON public.uds_upses USING btree (id);

alter table "public"."uds_upses" add constraint "uds_upses_pkey" PRIMARY KEY using index "uds_upses_pkey";

create policy "deny"
on "public"."uds_upses"
as permissive
for all
to public
using (false);

CREATE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."uds_upses" FOR EACH ROW WHEN (NEW.name = OLD.name) EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

drop trigger if exists "handle_updated_at" on "public"."temperature_sensors";

drop policy "deny" on "public"."temperature_sensors";

alter table "public"."temperature_sensors" drop constraint "temperature_sensors_pkey";

drop index if exists "public"."temperature_sensors_pkey";

drop table "public"."temperature_sensors";
