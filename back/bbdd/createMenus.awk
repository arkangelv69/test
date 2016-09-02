BEGIN{
	#id,name,active,restaruantId,p1aId,p1bId,p2aId,p2bId,p3aId,p3bId
	y=1;
	id_c=y++;
	name_c=y++;
	active_c=y++;
	restaurantId_c=y++;
	FS=";";
	#CONVFMT = "%2.2f"
}
{
	print "create (_"$id_c":Menu{id:"$id_c",name:\""$name_c"\"});"
	print "match (b:Restaurant),(m:Menu) where b.id = "$restaurantId_c" and m.id = "$id_c" create (b)-[:HAVE_MENU{active:"$active_c"}]->(m);"
	
 	i=y;
        while(i <= NF){
                pId_c=i;
		if($pId_c != 0){
			print "match (m:Menu),(p:Plate) where m.id = "$id_c" and p.id = "$pId_c" create (m)-[:HAVE_PLATE]->(p);"
		}
		i++;
	}
	

}
END{
}
