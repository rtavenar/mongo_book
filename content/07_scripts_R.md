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
  display_name: R
  language: R
  name: ir
---

(sec:mongolite)=
# Requêtes depuis R : `mongolite`

* Auteurs/trices : **Yolan PERONNET, Faisal JAYOUZI, Paul LANCELIN**

Le chapitre suivant a pour objectif d'explorer le package mongolite permettant d'effectuer des requêtes MongoDB depuis R. La rédaction du tutoriel suivant trouve sa source dans la documentation rédigée par l'auteur du package mongolite, Jeroen Ooms. Celle-ci est accessible à l'adresse suivante : [https://jeroen.github.io/mongolite/](https://jeroen.github.io/mongolite/ "Documentation de mongolite (R)")

## Installation du package mongolite et connexion à un serveur MongoDB

### Installation et chargement du package mongolite

Les packages binaires de mongolite peuvent être installés directement depuis le CRAN via la manipulation suivante à partir de la barre d'outils :

---

**Tools -> Install Packages... -> mongolite -> Install**

*Insérer images*

---

Ou via la commande suivante à exécuter dans la console ou depuis un script R :

```r
install.packages("mongolite")
```

Vous pouvez également installer la version de développement, qui contient les dernières fonctionnalités. Pour cela, exécutez la commande suivante :

```r
devtools::install_github("jeroen/mongolite")
```

```{admonition} Astuce
:class: tip

 L'installation et le chargement du package devtools au préalable sera nécessaire pour cette dernière exécution.
```

Une fois le package installé, il vous suffira de le charger dans votre envionnement de travail R via la commande suivante à exécuter dans la console ou depuis un script R :

```r
library(mongolite)
```

### Connexion à une collection d'une base de données présente sur un serveur MongoDB

Après avoir chargé les packages nécessaires dans votre environnement R, vous pourrez vous connecter à une collection d'une base de données présente sur un serveur MongoDB à partir d'un lien URI, du nom de la base de données, et du nom de la collection à laquelle on souhaite accéder. Pour ce faire, il suffit d'utiliser la fonction *mongo()* de la librairie *mongolite* de la manière suivante :

```r
coll <- mongo(collection="ma_collection", db="ma_BDD",
            url="mon_uri",
            verbose=TRUE)
```

La fonction *mongo()* prend en entrée les arguments suivants :
- collection : nom de la collection à laquelle se connecter. La valeur par défaut est "test"
- db : nom de la base de données à laquelle se connecter. La valeur par défaut est "test".
- url : adresse du serveur MongoDB au format URI standard.
- verbose : si TRUE, émet une sortie supplémentaire
- options : options de connexion supplémentaires telles que les clés et certificats SSL que nous ne developperons pas dans ce tutoriel.

```{admonition} Remarque  

La fonction mongo() prend obligatoirement en entrée le nom d'une collection d'une base de données. Nous comprenons alors que mongolite nous permet seulement d'intéragir avec une collection d'une base données, et non pas avec la base tout entière. Ici nous aurons donc qu'un seul objet pointant sur une collection avec laquelle intéragir. Nous n'aurons donc pas comme sur python et sa librarie pymongo d'objets clients et d'objets base de données. 
``` 

```{admonition} Astuce
:class: tip

L'adresse URI à spécifier dans le paramètre URL définit l'adresse du serveur et des options de connexion supplémentaires. Parmi ces options, nous pouvons notamment retrouver des mots de passe que nous vous conseillons, à l'opposé de ce qui a été fait ce tutoriel pour des fins pédagogiques, de lire dans des fichiers externes afin d'en préserver leur confidentialité. Afin d'obtenir plus de précisions sur le format exact de l'URI attendu (authentification, tunnel SSH, options SSL et options de réplique), nous vous renvoyons à la documentation.
```
Pour ce qui est de sa sortie, la fonction mongo() renvoie un objet propre à sa librairie mère, une "Mongo collection", qui, comme nous l'avons vu précédemment, pointe sur une collection d'une base de données. Regardons de plus près à quoi correspond ce type d'objet sur un exemple concret. Ici nous nous connectons à la collection "NYfood" d'une base de données "food" contenant de nombreuses informations sur les restaurants de New-York. 

```{code-cell} R
library(mongolite)
coll <- mongo(collection="NYfood", db="food",url = "mongodb://localhost:27017/food", verbose=TRUE)
print(coll)
```

Nous constatons alors que la "Mongo collection" est un environnement contenant les informations de la collection "NYfood" avec lequel nous pouvons intéragir via de nombreuses méthodes. Chacune de ces méthodes s'appliquera sur une "Mongo collection" à l'aide d'un "$" et permettra d'effectuer l'équivalent d'une requête MondoDB sur une collection. Par exemple, pour faire une simple requête find en NoSQL récupérant tous les documents d'une collection, il suffira d'écrire :

```r
coll$find()
```

Ou encore pour affichez la liste des index de la collection NYfood, il suffira d'écrire :

```r
coll$index()
```

L'objet des prochaines sections de ce chapitre sera alors d'explorer ces différentes méthodes et de voir les requêtes auxquelles elles sont équivelentes en NoSQL. Nous reviendrons notamment sur les objets renvoyés par ces différentes méthodes. Toutefois, nous pouvons d'ores et déjà remarquer qu'une méthode "find" renvoie la collection complète dans un "data frame" ce qui, dans des cas de grands volumes de données, pourrait entrainer des saturations de mémoire de votre machine. Nous verrons par la suite que pour s'affranchir de ce problème, nous pourrons utiliser une méthode "iterate", similaire à la méthode "find", renvoyant non plus un "data frame", mais un "Mongo iterator". Un "Mongo iterator" est un objet propre à mongolite permettant de ne pas stocker explicitement en mémoire le résultat d'une requête mais d'en conserver un itérateur.

