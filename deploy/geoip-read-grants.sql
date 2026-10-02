GRANT CONNECT ON DATABASE geoip_database TO ubeer;
GRANT USAGE ON SCHEMA public TO ubeer;
GRANT SELECT ON TABLE public.city_blocks_ipv4 TO ubeer;
GRANT SELECT ON TABLE public.city_blocks_ipv6 TO ubeer;
GRANT SELECT ON TABLE public.city_locations TO ubeer;
