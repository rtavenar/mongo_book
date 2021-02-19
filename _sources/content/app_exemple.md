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

# Annexe : Exemple de fichier

N'hésitez pas à vous inspirer de ce fichier pour vos propres réalisations
(vous pouvez télécharger le code source correspondant à l'aide du bouton dédié
en haut à droite de cette page).

Pour commencer, quelques exemples de syntaxe markdown (plus de détails
[là](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet),
par exemple) :

## Ceci est un titre de niveau 2

### Ceci est un titre de niveau 3

Ce texte est **en gras**, voire _en italique_.

## Un peu de maths

Vous pouvez utiliser des formules mathématiques $y = f(x)$, voire même :

$$
    y = f(x)
$$

## Un peu de code

De la même manière, vous pouvez avoir des morceaux de code `y = f(x)` au milieu
de votre texte, ou bien :

```python
def f(x):
    return 2 * x

print(f(2))
```

Lorsque vous voudrez présenter du code MongoDB, vous utiliserez la coloration
syntaxique correspondant au langage `javascript` :

```javascript
db.NYfood.find(
    {"cuisine": "Chinese", "borough": "Bronx"}
)
```

Vous remarquerez que ce code est mis en forme, mais pas exécuté.


On peut même imaginer mettre, en parallèle, la syntaxe MongoDB et son
équivalent SQL :

````{tabbed} MongoDB

```javascript
db.t.find(
    {"a": 1},
    {"b": true}
)
```
````

````{tabbed} Équivalent SQL

```sql
SELECT b
FROM t
WHERE a = 1
```

````

ou encore :

````{panels}
:column: col-4
:card: border-2

MongoDB
^^^
```javascript
db.t.find(
    {"a": 1},
    {"b": true}
)
```

---

Équivalent SQL
^^^
```sql
SELECT b
FROM t
WHERE a = 1
```

````




Malheureusement, dans ce cas de contenus disposés en onglets ou en "cartes",
on ne peut pas
insérer de code **exécutable** dans ces contenus
(voir [plus bas](sec:exec)).

## Mise en valeur

Vous pouvez également mettre en avant certains paragraphes :

```{admonition} Titre

Contenu
```

```{admonition} Titre
:class: tip

Contenu
```

```{margin}

Vous pouvez même écrire dans les marges !
```

Au passage, tous les caractères UTF-8 sont valides ⚠️🤣 (ce qui ne veut pas dire
que vous devez à tout prix en abuser :)


(sec:exec)=
## Et maintenant, la magie !

Mais le plus intéressant dans tout cela, c'est d'avoir des cellules de code
MongoDB qui seront exécutées à la volée :

```{code-cell}
use food
```

```{code-cell}
:tags: ["output_scroll"]
db.NYfood.find(
    {"cuisine": "Chinese", "borough": "Bronx"}
)
```

Ici, le résultat affiché est celui obtenu lorsque l'on exécute ces deux lignes
dans un client MongoDB.
