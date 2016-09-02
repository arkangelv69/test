#!/bin/bash
awk -f createRestaurants.awk restaurantes.csv | /usr/local/Cellar/neo4j/3.0.4/bin/neo4j-shell
awk -f createPlates.awk platos.csv | /usr/local/Cellar/neo4j/3.0.4/bin/neo4j-shell
awk -f createMenus.awk menus.csv | /usr/local/Cellar/neo4j/3.0.4/bin/neo4j-shell

