---
jupytext:
  cell_metadata_filter: -all
  formats: md:myst
  text_representation:
    extension: .md
    format_name: myst
    format_version: 0.12
    jupytext_version: 1.9.1
kernelspec:
  display_name: IMongo
  language: ''
  name: imongo
---

# Les index

* Auteurs/trices : Adrien VIGUE, Etienne BARON, Camille MONOT

Ce chapitre traite de :
* Index + requêtes textuelles + requêtes géographiques


## A quoi servent-ils ?

Les index prennent en charge l'exécution efficace des requêtes dans MongoDB. Sans index, MongoDB doit effectuer une analyse de collection , c'est-à-dire analyser chaque document d'une collection, pour sélectionner les documents qui correspondent à l'instruction de requête. Si un index approprié existe pour une requête, MongoDB peut utiliser l'index pour limiter le nombre de documents qu'il doit inspecter. Les index de MongoDB sont similaires aux index d'autres systèmes de base de données. MongoDB définit les index au niveau de la collection et prend en charge les index sur n'importe quel champ ou sous-champ des documents dans une collection MongoDB. Finalement, les index sont un moyen de trouver rapidement du contenu dans une base de données.

## Quand les utiliser ?

On met en place des index à chaque fois qu'on s'attend à avoir beaucoup de requêtes sur une clé (resp. un ensemble de clés). 
Par exemple, on souhaite récuperer les notes d'un étudiant à l'aide de son numéro étudiant. Il faudra alors mettre un index sur la clé "numéro étudiant" afin des réaliser des requetes efficaces pour retrouver toutes les informations de l'étudiant en fonction de son numéro.


⚠️ **Attention :** On ne peut pas toujours utiliser des index. En effet,...

## Syntaxe adaptée

```javascript
db.collec.createIndex({"cle":1})
```
