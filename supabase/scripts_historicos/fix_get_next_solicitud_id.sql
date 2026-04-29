create or replace function public.get_next_solicitud_id() 
returns bigint 
language plpgsql 
security definer -- ¡CRUCIAL! Esto permite que la función se ejecute con permisos de administrador
set search_path = '' -- Fix para el warning: Function Search Path Mutable
as $$
declare next_id bigint;
begin -- Intentar actualizar el contador existente
update public.counters
set current_value = current_value + 1
where name = 'solicitud_id'
returning current_value into next_id;
-- Si no existe el contador, crearlo
if not found then
insert into public.counters (name, current_value)
values ('solicitud_id', 1)
returning current_value into next_id;
end if;
return next_id;
end;
$$;