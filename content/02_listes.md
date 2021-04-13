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

# Attributs de type liste

* Auteurs/trices : **Malo REYNES, Lucas ROBIN, Fiona TUFFIN**

Ce chapitre traite des attributs de type liste et des différents types de requêtes que l'on peut vouloir faire sur de tels attributs

## Introduction 

En MongoDB, un document est composé de couples clé/valeur. Une clé peut être considérée comme le nom d'une variable (attribut) à laquelle correspond une valeur pour un individu. L'attribut peut être de plusieurs types : chaîne de caractères, booléen, nombre, liste ou date. C'est aux attributs de type *liste* que nous nous intéressons ici. En MongoDB comme en python, une liste est, comme son nom l'indique, une série de valeurs, ces valeurs pouvant être de tous types. Une liste peut également contenir des sous-listes. Il est possible de réaliser plusieurs opérations sur une liste telles qu'obtenir sa taille, récupérer son minimum, son maximum, sa moyenne et autres. Il faut toutefois faire attention à certains "pièges" que nous exposerons.
 
Les exemples pour cette partie concernent les listes de notes des élèves de la collection `notes` de la base de données `etudiants`.

```{code-cell, echo=FALSE}
use etudiants
```

## Fonctionnement des listes en MongoDB

Afin de mieux appréhender les listes en MongoDB, nous allons suivre un exemple au cours du quel, étape par étape, nous expliquerons notre démarche. Nous souhaitons connaître les étudiants ayant toutes leurs notes supérieures ou égales à 12.

> Remarque : les notes sont implémentées sous forme de liste dans la base de données (attribut _notes_). Parmi les 7 étudiants, un ne possède pas d'attribut _notes_ et un autre à ce même attribut vide (liste contenant 0 élément). Nous allons donc traiter ces cas particuliers.

#### Opérateur $size
Introduisons tout d'abord un élément utile pour comprendre le fonctionnement des listes : l'opérateur _$size_. Il renvoie les documents dont la taille (nombre d'éléments de la liste) vérifie la condition donnée.
```{code-cell}
db.notes.find(
    {"notes": {$size: 2}}                     /*Listes de 2 éléments*/
)
```
Attention, cet opérateur n'est pas compatible avec les intervalles de valeurs. On ne peut pas écrire le code suivant (qui renvoie une erreur) :
```{code-cell}
db.notes.find(
    {"notes": {$size: {$lte: 2}}}             /*Ne fonctionne pas !!!*/
)
```
Il faudra plutôt écrire :
```{code-cell}
db.notes.find(
    {$or : 
        [{"notes": {$size: 2}},
        {"notes": {$size: 1}},
        {"notes": {$size: 0}}]
    }
)
```

Exemple : on veut connaitre les notes de l'étudiant nommé Paul.

```{code-cell}
db.notes.find(
    {"nom": "Paul"}, 
    {"notes": true}
)
```
Une liste de 2 notes est retournée. Plus précisement, c'est le contenu de l'attribut _notes_ qui est donné.

Exemple : on veut savoir si l'étudiant Paul a eu au moins une note égale à 12.

```{code-cell}
db.notes.find(
    {"nom": "Paul", "notes": 12}
)
```
La requête ressort un seul document : celui correspondant à l'étudiant Paul de notre collection. Cela signifie donc que Paul a eu au moins une note égale à 12.
Néanmoins, l'objet retourné par la requête est l'ensemble du document. Toutes les notes de Paul sont données, même celles différentes de 12.

Voyons maintenant ce qui se passe lorsqu'on recherche les notes supérieures ou égales à 12.

```{code-cell}
db.notes.find(
    {"notes": {$gte: 12}}
)
```
Avec cette requête, nous obtenons 4 éléments correspondant aux 4 étudiants qui ont eu au moins une note supérieure ou égale à 12.

Nous voudrions maintenant ressortir les individus qui n'ont **que** des notes supérieures ou égales à 12. Pour cela, nous pouvons retirer tous les étudiants ayant eu des notes en dessous de 12. Pour ce faire, nous utilisons l'opérateur logique _$not_ qui retire les documents ne réalisant pas la condition demandée.

```{code-cell}
db.notes.find(
    {"notes":{$not: {$lt: 12}}}              /*Une condition : on enlève les étudiants qui ont au moins une note plus petite que 12*/
)
```
Problème : la requête nous renvoie également les étudiants qui n'ont pas eu de note. C'est logique : si Sophie n'a pas de note, on ne peut pas dire qu'elle ait déjà eu moins que 12. Nous allons donc retirer les étudiants sans notes.

Pour se faire, nous utilisons l'opérateur logique _$nor_ en listant les éléments à ne pas prendre en compte. Nous ne voulons pas que la liste _notes_ soit vide ou qu'elle comporte ne serait-ce qu'une note inférieure à 12.

```{code-cell}
db.notes.find(
    {$nor: 
        [{"notes": {$lt: 12}},               /*1ère condition : on retire ceux qui ont des notes en dessous de 12*/
        {"notes": {$size: 0}}]               /*2nde condition : on retire ceux qui n'ont pas de notes*/
    }
)
```
Nouveau problème : le document correspondant à l'étudiant Michel est renvoyé parce qu'il n'a pas d'attribut _notes_. Dans ces conditions, on remarque que les listes vides ou inexistantes sont retournées par les requêtes. Il est important de les enlever en rajoutant une condition dans le _$nor_.

Il faut donc retirer les étudiants qui ont une liste _notes_ vide mais aussi ceux qui n'ont pas de liste du tout.

```{code-cell}
db.notes.find(
    {$nor: 
        [{"notes": {$exists: false}},         /*1ère condition : on retire les documents ne possédant pas de liste "notes"*/
        {"notes": {$lt: 12}},                 /*2ème condition : on retire ceux qui ont des notes en dessous de 12*/
        {"notes": {$size: 0}}]                /*3ème condition : on retire ceux qui n'ont pas de notes*/
    }
)
```
Cette fois, on ne retourne plus que 2 étudiants qui n'ont que des notes au-dessus de 12.

## Particularité du travail sur des listes 

Lorsque nous faisons des requêtes sur un attribut d'un autre type qu'une liste, un seul élement est soumis à l'ensemble de nos conditions.
Dans l'exemple ci-dessous, la clé _nom_ renvoie une chaine de caractères, qui est un élément unique. Cet élément est soumis à deux conditions afin d'obtenir les noms qui commencent par la lettre M.

```{code-cell}
:tags: [output_scroll]

db.notes.find(                                /*Cette requête nous renvoie les noms dont la première lettre est comprise >= à M et < à N, donc M*/
    {"nom": 
        {$gte: "M", $lt: "N"}
    }
)
```

Avec les listes, c'est différent. Chaque élément contenu dans la liste est testé par les conditions. Voyons le fonctionnement d'une requête sur une liste avec plusieurs conditions : 

```{code-cell}
:tags: [output_scroll]

db.notes.find(
    {"notes": 
        {$gt: 13, $lte: 10}
    }
)
```
Cette requête teste pour chaque élément de la liste un à un : 
  - La condition <math>></math> 13;
  - La condition <math>≤</math> 10;  
  
Si chacune des conditions est vérifiée au moins une fois, la liste complète est renvoyée. En clair, si au moins un élément de la liste est <math>></math> 13 et au moins un élément est <math>≤</math> 10, les conditions sont considérées comme validées.

Ainsi, à la liste "[1,5,7,10,12,14,3]" correspond :  
  - [F,F,F,F,F,T,F] pour la première condition
  - [T,T,T,T,F,F,T] pour la seconde
Les conditions sont toutes respectées au moins une fois, la liste complète est donc renvoyée. 

Ainsi, nous ne testons pas simultanément les deux conditions sur chaque nombre. Aucun nombre x ne vérifie x<math>></math> 12 et x <math>≤</math> 10. Cela est contre-intuitif, il faut faire attention.

Mais alors, comment pouvons-nous justement tester une double condition sur chaque élement de la liste ? Pour cela, nous allons faire appel à l'opérateur `$elemMatch`.

## Opérateur $elemMatch

Avec _$elemMatch_, on retourne les documents dont au moins un élément de la liste vérifie toutes les conditions.

### Cas de conditions simultanement non réalisables

Testez votre intuition ! D'après vous, que ressortira cette requête ? 
```{code-cell}
db.notes.find(
    {"notes": 
        {$elemMatch: 
            {$gt: 13, $lte: 10}
        }
    }
)
```
Contrairement à la requête précedente, cette requête teste les élements de la liste un à un. Ainsi, aucun élement ne vérifie ces deux conditions simultanement. Aucun élément n'est donc retourné par cette requête.

### Cas de conditions simultanement réalisables

Avec la requête suivante, nous cherchons à savoir quels étudiants ont au moins une note comprise entre 9 et 13.
```{code-cell}
:tags: [output_scroll]
db.notes.find(
    {"notes": 
        {$elemMatch: 
            {$gt: 9, $lt: 13}
        }
    }
)
```
Attention : on renvoie bien ici les listes dont **au moins une valeur** vérifie l'ensemble des conditions ! Les notes validant les deux conditions sont 10, 11 et 12. Par exemple, la liste [1,3,8,11,15] sera retournée mais la liste [1,3,8,15] ne le sera pas.

Comment obtenir les étudiants dont **toutes** les notes vérifient les conditions simultanement ? Cela est réalisable grâce à l'opérateur _$nor_ vu plus tôt :

```{code-cell}
db.notes.find(
    {$nor: 
        [{"notes": {$exists: false}},         /*1ère condition : on retire les documents ne possédant pas de liste "notes"*/
        {"notes": {$size: 0}},                /*2ème condition : on retire ceux qui n'ont pas de notes*/
        {"notes": {$lte: 9}},                 /*3ème condition : on retire les étudiants qui ont des notes en dessous de 10*/
        {"notes": {$gte: 13}}]                /*4ème condition : on retire ceux qui ont des notes au dessus de 12*/
    }
)
```

## Récapitulatif

- _Je souhaite que **toutes les conditions** soient vérifiées **au moins une fois** par les éléments de ma liste, comment faire ?_
> Code "classique".

Sans _$elemMatch_, si les conditions sont vérifiées une à une, que ce soit par un élément de la liste ou grâce à plusieurs éléments distincts, alors le document est retourné.

- _Je souhaite que **toutes les conditions** soient **simultanement** vérifiées par **au moins un élément** de ma liste, comment faire ?_
> Utilisation de l'opérateur _$elemMtach_.

Avec _$elemMatch_, on regarde tous les éléments de la liste un par un et on retourne le document si et seulement si au moins un élément est capable de vérifier toutes les conditions à lui tout seul.

- _Je souhaite que **toutes les conditions** soient vérifiées par **tous les éléments** de ma liste, comment faire ?_
> Utilisation de l'opérateur _$nor_.

Avec _$nor_, on liste les conditions que nous ne souhaitons pas retourner. Ainsi, on ne récupère pas les éléments qui valident des conditions. Il faut notamment penser à retirer les éléments vides avec _{$size: 0}_ et les éléments inexistants avec _{$exists: false}_.
