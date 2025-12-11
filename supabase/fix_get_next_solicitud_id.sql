-- Función segura para obtener el siguiente ID de solicitud
create or replace function public.get_next_solicitud_id() returns bigint language plpgsql security definer -- ¡CRUCIAL! Esto permite que la función se ejecute con permisos de administrador
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