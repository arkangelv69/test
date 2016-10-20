#!/bin/bash
version=3.0.6
awk -f createRestaurants.awk restaurantes.csv | /usr/local/Cellar/neo4j/${version}/bin/neo4j-shell
awk -f createPlates.awk platos.csv | /usr/local/Cellar/neo4j/${version}/bin/neo4j-shell
awk -f createMenus.awk menus.csv | /usr/local/Cellar/neo4j/${version}/bin/neo4j-shell
awk -f createUsers.awk usuarios.csv | /usr/local/Cellar/neo4j/${version}/bin/neo4j-shell
