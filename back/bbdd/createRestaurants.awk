# Autonomicas
#	1	CM/C1
#	2	cod_comunidad
#	3	cod_provincia
#	4	cod_circ
#	5	nombre
#	6	mesas totales
#	7	censo
#	8	censo escrutado
#	9	% censo escrutado
#	10	total votantes
#	11	% total votantes
#	12	abstencion
#	13	% abstencion
#	14	v_blanco
#	15	% v_blanco
#	16	v_nulos
#	17	% v_nulos
#	18	escannos juego

BEGIN{
	#id,Latitude,Longitude,Location,Nombre,Imagen
	y=1;
	id_c=y++;#1
	lat_c=y++;#2;
	lon_c=y++;#3;
	y++;#4;
	name_c=y++;#5;
	FS=";";
	#CONVFMT = "%2.2f"
}
{
	print "create (_"$id_c":Restaurant{id:"$id_c",name:\""$name_c"\",latitude:"$lat_c",longitude:"$lon_c"});"
}
END{
	print "CALL spatial.addPointLayer(\"Restaurants\");"
	print "MATCH (r:Restaurant) WITH collect(r) AS restaurants CALL spatial.addNodes(\"Restaurants\", restaurants) YIELD node RETURN count(*);"
}
