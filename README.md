# PIS-project

## Opis:

Ovaj discord bot dopusta kreaciju,dodjeljivanje i prikaz taskova koje određeni user treba napraviti. Također bot dolazi sa dashboardom s kojim admin/poslodavac može pregledavati statistiku,taskove,članove i također upravljati njima. 

## How to start:

1. create docker bridged network

```
docker network create PIS-projekt 
```

2. run mysql with docker

```
docker pull mysql
```

```
docker run --net PIS-projekt --name mysql -e MYSQL_ROOT_PASSWORD=passwordzabazu -e -p 3306:3306 -d mysql
```

3. run the bod and frontend with docker

```
docker build -t pis-projekt .  
```

```
docker run --net PIS-projekt --name backend -p 3000:3000 -d pis-projekt 
```
