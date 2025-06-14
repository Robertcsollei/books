-- Create the gen_ulid() function
CREATE OR REPLACE FUNCTION gen_ulid() RETURNS char(26) AS $$
DECLARE
  v_time timestamp with time zone = NULL;
  v_secs bigint;
  v_msec bigint;
  v_usec bigint;
  v_timestamp bigint;
  v_timestamp_hex char(8);
  v_instance_hex char(18);
  v_ulid char(26);
BEGIN
  -- Get the current timestamp
  v_time := clock_timestamp();
  v_secs := EXTRACT(EPOCH FROM v_time);
  v_msec := EXTRACT(MILLISECONDS FROM v_time);
  v_usec := EXTRACT(MICROSECONDS FROM v_time);
  v_timestamp := (v_secs * 1000 + v_msec) * 1000 + (v_usec % 1000);
  v_timestamp_hex := lpad(to_hex(v_timestamp), 8, '0');
  -- Generate a random instance part
  v_instance_hex := lpad(to_hex((random() * 9223372036854775807)::bigint), 18, '0');
  -- Combine the parts
  v_ulid := v_timestamp_hex || v_instance_hex;
  RETURN v_ulid;
END;
$$ LANGUAGE plpgsql VOLATILE; 