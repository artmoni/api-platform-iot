# Capteur fermeture porte/fenêtre

## Description

Ce projet à pour objectif d'aider a l'économie d'energie en coupant les radiateurs d'une
habitation lorsqu'une fenêtre ou une porte est ouverte.

## Information général

* PAN  ID : 31415
  * Commande AT : ATID 31415
  
 ## End Device
 
* Pin D0 : Commisionning Button
  * Command AT : ATD0 1
  
* CE : Coordinator Enblaed -> Disable

## Coordinateur

* CE : Coordinator Enblaed -> Enable

## Environnement de développement

### Pré-requis

* Docker
* Docker-Compose
* nodejs
* npm/yarn
* [driver com/usb](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers)

### Etapes d'installation

1) Cloner le dépot git en faisant :
```git clone https://github.com/aydenhex/api-platform-iot.git```

2) Lancer le déploiement de l'application
```
cd api-platform-iot
docker-compose up
```

3) Vérifier que les containers sont bien lancés :
```docker ps```

#### Disclaimer !

Il est impossible pour le container docker possédant node.js d'accéder aux ports COM.

Pour résoudre ce probleme : 

 1) Installez  node.js sur votre machine (si ce n'est pas déjà fait).
    liens : https://nodejs.org/en/

 2) Ouvrez un terminal (Powershell ou CMD) en mode administateur.

 3) Accédez à votre dossier.

 4) lancez les commandes suivantes : 
    ```
    npm install
    npm start

    ```
 
## Bug Tips
#### postgres Docker image is not creating database with custom name


à partir de Windows family docker toolbox peut engendrer des problèmes avec le lancement de la base de données postgresql


Pour résoudre ce problème:

1) Supprimer le volume ou est stocké le container qui gère la base de donneée
```
docker volume rm <nom-du-volume>
```
2.supprimer tous les processus docker et redémarrer son docker

3.relancer vos container docker
```
docker-compose build
docker-compose up
```

#### Error: dupplicate mount point

Plusieurs  processus docker sont lancés sur la machines et engendre des conflits 

 Pour résoudre ce problème:
 1) Supprimer tous les processus Docker
 
 2) vérifier quel processus utilise le port 80
 ``
 netstat -ab
 ``
 3) Supprimer les processus qui engendre un conflit et redémarrer son docker
 
 
 
 ## Description fonctionnel
 
 L'application peut-être découpées en 4 élements :
 
 1. Le socket qui détecte l'ouverture et fermeture des portes
 
 2. L'API node.js  récupère, traite et stock ces données  
 
 3. La l'API php symfony qui s'occupe récupérer les données stocker et l'afficher dans la section client
 
 4. client react native affiche les données aux utilisateurs
 
 ## Amélioration
 
 1.Réalisation d'un timer qui calcul le temps d'ouverture des portes 