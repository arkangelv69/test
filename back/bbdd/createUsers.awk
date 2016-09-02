BEGIN{
	#id,deviceId,name,email,restaurantId,p1,p2,p3,p4,p5
	y=1;
	id_c=y++;
	deviceId_c=y++;
	name_c=y++;
	email_c=y++;
	restaurantId_c=y++;
	FS=";";
	#CONVFMT = "%2.2f"
}
{
	print "create (_"$id_c":User{id:"$id_c",deviceId:"$deviceId_c",name:\""$name_c"\",email:\""$email_c"\"});"
	if($restaurantId_c != 0){
		print "match (b:Restaurant),(u:User) where b.id = "$restaurantId_c" and u.id = "$id_c" create (u)-[:ADMIN]->(b);"
	}

 	i=y;
        while(i <= NF){
                pId_c=i;
		if($pId_c != 0){
			print "match (u:User),(p:Plate) where u.id = "$id_c" and p.id = "$pId_c" create (u)-[:LIKED]->(p);"
		}
		i++;
	}
	

}
END{
}
