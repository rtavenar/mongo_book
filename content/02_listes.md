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

En MongoDB, un document est composé de couples clé/valeur. Une clé peut être considérée comme le nom d'une variable (attribut) à laquelle correspond une valeur pour un individu. L'attribut peut être de plusieurs types : chaîne de caractères, booléen, nombre, liste ou date. C'est aux attributs de type *liste* que nous nous intéressons ici. En MongoDB comme en python, une liste est, comme son nom l'indique, une série de valeurs, ces valeurs pouvant être de tous types. Une liste peut également contenir des sous-listes. Il est possible de réaliser plusieurs opérations sur les listes telles qu'obtenir sa taille, récupérer son minimum, son maximum, sa moyenne et autres. Il faut toutefois faire attention à certains "pièges" que nous exposerons.
 
Les exemples pour cette partie concernent les listes de notes des élèves de la collection notes de la base de données _etudiants_.

Exemple : on veut connaitre les notes de l'étudiant Paul et les sortir sous forme de liste.

```{code-cell}
db.notes.find(
    {"nom": "Paul"}, 
    {"notes": true}
)
```
On ressort une liste de 2 notes.

Tout d'abord nous commençons par donnée un exemple générale de requête avancée que l'on peut faire sur une liste.

Exemple : on veut savoir si l'étudiant nommé Paul a eu une note valant 12.

```{code-cell}
db.notes.find(
    {"nom": "Paul", "notes": 12}
)
```
La requête ressort un seul document : celui correspondant à l'étudiant nommé Paul de notre collection. Cela signifie que Paul a eu au moins une note égale à 12.
Néanmoins, l'objet retourné par la requête est l'ensemble du document. Toutes les notes de Paul sont données, même celles différentes de 12.

Voyons maintenant ce qui se passe lorsqu'on recherche les notes supérieures ou égales à 12.

```{code-cell}
db.notes.find(
    {"notes": {$gte: 12}}
)
```
Avec cette requête, nous obtenons 4 éléments correspondant aux 4 étudiants qui ont eu au moins une note supérieure ou égale à 12.

Nous ne sommes pas satisfaits : nous voudrions ressortir les individus qui n'ont que des notes supérieures ou égales à 12. Pour n'avoir que des notes au-dessus de 12, nous pouvons retirer tous les étudiants ayant eu des notes en dessous de 12. Pour ce faire, nous utilisons l'opérateur logique _$not_ qui retire les documents ne réalisant pas la condition demandée.

```{code-cell}
db.notes.find(
    {"notes":{$not: {$lt: 12}}}              /*Une condition : on enlève les étudiants qui ont au moins une note plus petite que 12*/
)
```
Problème : la requête nous renvoie également les étudiants qui n'ont pas eu de note. C'est logique, si Sophie n'a pas de note, on ne peut pas dire qu'elle ait déjà eu moins que 12. Nous allons donc retirer les étudiants sans notes.

Pour se faire, nous utilisons l'opérateur logique _$nor_ en listant les éléments à ne pas prendre en compte. Nous ne voulons pas que la liste _notes_ soit vide ou qu'elle comporte ne serait-ce qu'une note inférieure à 12.

```{code-cell}
db.notes.find(
    {$nor: 
        [{"notes": {$lt: 12}},               /*1ère condition : on retire ceux qui ont des notes en dessous de 12*/
        {"notes": {$size: 0}}]               /*2nde condition : on retire ceux qui n'ont pas de notes*/
    }
)
```
Nouveau problème : le document correspondant à l'étudiant Michel est renvoyé parce qu'il n'a pas de liste _notes_. Dans ces conditions, on remarque que les listes vides ou inexistantes sont retournées par les requêtes. Il est important de les enlever en rajoutant des conditions dans le _$nor_.

Il faut qu'on enlève les étudiants qui ont une liste _notes_ vide mais aussi ceux qui n'ont pas de liste du tout.

```{code-cell}
db.notes.find(
    {$nor: 
        [{"notes": {$lt: 12}},               /*1ère condition : on retire ceux qui ont des notes en dessous de 12*/
        {"notes": {$size: 0}},               /*2ème condition : on retire ceux qui n'ont pas de notes*/
        {"notes": {$exists: false}}]         /*3ème condition : on retire les documents ne possédant pas de liste "notes"*/
    }
)
```
Cette fois ci, c'est bon, on ne retourne plus que 2 étudiants qui n'ont que des notes au-dessus de 12.



## Notes / Brouillon :

Lorsqu'une liste n'existe pas, la condition posée dessus est automatiquement vérifiée.

Sans le $elemmatch, si les conditions sont vérifiées une à une, que ce soit par un élément de la liste ou grâce à plusieurs éléments distincts, alors le document est retourné.
Avec le $elemmatch, on regarde toutes les notes une par une et on ne retourne le document si et seulement si un élément de la liste est capable de vérifier toutes les conditions à lui tout seul.

Parler de l'attribut $size pour les listes
Est-ce qu'on s'intéresse à la création de liste en mode création de variables ?
