# Capteur fermeture porte/fenêtre

## Description

Ce projet à pour objectif d'aider a l'économie d'energie en coupant les radiateurs d'une
habitation lorsqu'une fenêtre ou une porte est ouverte.

## Information général

PAN  ID :
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
