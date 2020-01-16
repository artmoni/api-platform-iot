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