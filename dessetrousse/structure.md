# structure des données pour les évènements

## requirements et final states

### explications :

Chaque requirement ne concerne qu'une seule table du monde
Chaque requirement est un objet javascript qui possède 2 propriétés : _item_ et _conditions_. 

La propriété __item__ permet de repérer l'item considéré dans la table du monde à partir d'une valeur spécifique d'une de ses propriétés. Il s'agira en général de son identifiant (son nom par exemple). Cette propriété item est donnée sous la forme d'un objet javascript qui possède lui-même 3 propriétés : _key_, _prop_ et _valeur_.

La propriété _key_ a pour valeur le nom de la table du monde à laquelle appartient l'item
le propriété _prop_ a pour valeur le nom de la propriété de l'item qu'on analyse (ce sera en général in ID)
la propriété _valeur_ a pour valeur la valeur cherchée de la propriété qui permettra de sélectionner l'item considéré


la propriété __conditions__ est une liste (un Array javascript) qui contient toutes les conditions que doit remplir l'item considéré pour que l'évènement puisse se produire.
Chaque condition est donnée sous la forme d'un objet javascript qui comporte 3 propriétés : _prop_, _type_ et _valeur_. Cela signifie que la propriété _prop_ de l'item doit avoir la valeur demandée en fonction du type d'opération. Par exemple, si _type_ vaut "=", il faudra que la propriété ait la valeur indiquée. Si le type est ">", il faudra que la valeur de la propriété soit supérieure à la valeur de la condition. Si la valeur de la propriété est une liste, le type "a" vérifie que la valeur de la condition se trouve dans la liste. 

la propriété _type_ ne peut avoir que les valeurs suivantes : "=", ">", ">=", "<", "<=", "a", "!=" ("!=" signifie "différent de")

Il est fréquent que la valeur à considérer, dans l'item ou la condition, n'est pas connue au moment de la description de l'évènement. La propriété valeur de l'item ou de la condition sera alors également un objet Javascript. Deux cas de figure peuvent se présenter :
1) la valeur à considérer peut être celle d'un paramètre passé à l'évènement au moment où il doit avoir lieu. On note cette situation sous la forme __{"para":x}__  indiquant que la valeur qui sera utilisée sera celle du paramètre n°x fourni à l'évènement (par exemple pour un évènement mute(A) dont la fonction est mute et à qui on doit fournir le paramètre A au moment de l'exécution, l'indication {"para":1} fera référence à A)
2) La valeur à considérer est celle d'un autre item que celui considéré dans le requirement. on utilisera la notation __{"item":x,"prop":"toto"}__ où x est le numéro d'un item requirement déjà indiqué dans l'évènement et "toto" la propriété testée dans cet item. Attention, la numérotation débute à 0 : l'item concerné par le 1° requirement
Il faut bien faire attention à l'ordre dans lequel on introduit les items dans le champ omeka requirements car la notation fait référence à des items déjà introduits, pas à ceux qui suivent sur les lignes en dessous. 

__{"item":{"key":"toto","prop":"toto","valeur":"toto"}, "conditions":[{"prop":"toto","type":"toto","valeur":"toto"}]}__

Si votre requirement a plusieurs conditions, mettre autant de {prop, type, valeur} que nécessaire en les séparant par une virgule. Ex avec 2 conditions :
{"item":{"key":"toto","prop":"toto","valeur":"toto"}, "conditions":[{"prop":"toto","type":"toto","valeur":"toto"}, {"prop":"toto","type":"toto","valeur":"toto"}]}

Dans cette notation : 
* derrière "key", remplacer "toto" par le nom de la table du monde de l'item considéré (ex "Character")
* derrière "pro" : remplacer "toto" par le label de la propriété concernée (ex : "ID-E" ou "selector" ou "inside" ou "alive" )
* derrière "valeur" : remplacer "toto" par l'une des solutions suivantes :
	** un nombre (sans guillemets) si la valeur de la propriété est numérique et déjà connue
	** un booléen true ou false (sans guillements) si la valeur de la propriété est booléenne et déjà connue
	** {"para":x}
	** {"item":x,"prop":"toto"}	
* derrière type, remplacer "toto" par l'une des opérations suivantes : "=", ">", ">=", "<", "<=", "a", "!="


### les finalStates.

Leur structure est très voisine de celle des requirements, elles utilisent les mêmes notations et on remplit également un final state par ligne, le final state correspondant aux modifications à apporter à une table spécifique du monde. La seule différence avec la notation des requirements, est que le terme "conditions" est remplacé par le terme "valeurs". Un finalState ne modifiant qu'une seule valeur d'un item s'écrira donc :

__{"item": {"key":"toto", "prop":"toto", "valeur":"toto"}}, "valeurs":[{"prop":"toto", "type":"toto", "valeur": "toto"}]}__

La notation {"item":x,"prop":"toto"} fait ici référence au numéro de l'item du final state, pas à un requirement


## types séquence et choix

### type séquence

une séquence peut comporter des requirements de la séquence, qui sont des requirements supplémentaires qui doivent être appliqués au 1° évènement de la séquence, et des final states qui sont dfes final states supplémentaires du dernier évènement. On remplit normalement ces 2 champs. Il est possible que la séquence ne nécessite aucun de ces champs.

Le champ tablesParameters contient la liste de tous les arguments nécessaires à toutes les fonctions de la séquence. Il a la forme :

__["toto","toto"]__   où chaque "toto" a une valeur bien définie

Le champ séquence comporte la liste des évènemùents à effectuer dans l'ordre indiqué. Elle est indiquée sur une seule ligne. Il est possible que la séquence ne comporte qu'un seul évènement, cela arrive lorsque la séquence est en fait un cas particulier d'un autre évènement (quel qu'en soit le type), en général lorsqu'un paramètre est prédéfini. Chaque évènement est repéré par un objet qui possède 2 propriétés : _fonction_, dont la valeur est la valeur de la function de l'évènement impliqué, et _arguments_ qui comporte la liste des arguments nécessaire à l'évènement impliqué. Le modèle général de ce champ est

__[{"fonction":"toto","arguments":["toto","toto"]}]__   Dans cette expression les "toto" des arguments sont, soit des valeurs bien définies, soit des expressions du type __{"para":x}__ où x renvoie au xème argument du champ tablesParameters

Si la séquence comporte plusieurs évènements à la suite, son modèle sera le suivant, dans lequel chaque évènement est décrit par un {}, les objets étant sdéparés par une virgule

__[{"fonction":"toto","arguments":["toto","toto"]}, {"fonction":"toto","arguments":["toto","toto"]}]__

### type choix
Les champs requirements et finalStates des évènements de ce type se remplissent de la même façon que pour le type séquence

Chaque branche possible fait l'objet d'une ligne du champ "branches". Chaque branche est décrite par un objet qui comporte 2 prpriétés : _sequence_ et _proba_ La valeur de _proba_ est toujours 1. La valeur de _sequence_ est celle d'un type séquence

Le moule d'une branche est donc (avec ici une séquence de 2 évènements

__{"sequence": [{"fonction":"toto","arguments":["toto","toto"]}, {"fonction":"toto","arguments":["toto","toto"], "proba":1}__

