BEGIN{
	#id,name,description,image,restaruantId
	y=1;
	id_c=y++;
	name_c=y++;#1;
	description_c=y++;#2;
	y++;#3;
	restaurantId_c=y++;#4;
	FS=";";
	#CONVFMT = "%2.2f"
}
{
	print "create (_"$id_c":Plate{id:"$id_c",name:\""$name_c"\",description:\""$description_c"\"});"
	print "match (b:Restaurant),(p:Plate) where b.id = "$restaurantId_c" and p.id = "$id_c" create (b)-[:HAVE_PLATE]->(p);"
}
END{
}
