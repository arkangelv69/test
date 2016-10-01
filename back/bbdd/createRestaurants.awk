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
