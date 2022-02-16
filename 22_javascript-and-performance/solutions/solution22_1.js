/* Pfade finden

Schreiben Sie die Funktion findPath, die wie diejenige aus Kapitel 7 versucht, den kürzesten Weg zwischen zwei Knoten in einem Graphen zu finden. Sie soll zwei GraphNode-Objekte (wie wir sie in diesem Kapitel verwendet haben) als Argumente entgegennehmen und entweder null zurückgeben, wenn kein Pfad zu finden ist, oder ein Array der Knoten, die einen Pfad durch den Graphen darstellen. Knoten, die in diesem Array nebeneinanderstehen, sollen durch eine Kante verbunden sein.

Ein guter Algorithmus, um einen Pfad in einem Graphen zu finden, sieht wie folgt aus:

1. Erstelle eine Arbeitsliste, die einen einzigen Pfad enthält, wobei dieser Pfad wiederum nur aus dem Startknoten besteht.
2. Beginne mit dem ersten Pfad in der Arbeitsliste.
3. Wenn der Knoten am Ende des aktuellen Pfades der Zielknoten ist, gibt den Pfad zurück.
4. Anderenfalls erstelle für jeden noch nicht untersuchten Nachbar des Knotens am Ende des Pfades (also für jeden Nachbar, der bei keinem der Pfade in der Arbeitsliste am Ende steht) einen neuen Pfad. Erweitere dazu den aktuellen Pfad um den Nachbar und füge ihn der Arbeitsliste hinzu.
5. Stehen mehrere Pfade in der Arbeitsliste, gehe zum nächsten Pfad über und fahre mit Schritt 3 fort.
6. Anderenfalls gibt es keinen Pfad.

Durch Auffächern vom Startknoten aus sorgt diese Vorgehensweise dafür, dass der Zielknoten immer über den kürzesten Pfad erreicht wird, da längere Pfade erst berücksichtigt werden, wenn die kürzeren bereits untersucht wurden.

Implementieren Sie dieses Programm und testen Sie es mit einigen einfachen Baumgraphen. Konstruieren Sie einen Graphen mit einer zyklischen Verbindung (z. B. indem Sie mit der Methode connect Kanten zu einem Baumgraphen hinzufügen) und prüfen Sie, ob Ihre Funktion den kürzesten Pfad findet, wenn es mehrere Möglichkeiten gibt. */

function findPath(a, b) {
  // Your code here...
}

let graph = treeGraph(4, 4);
let root = graph[0],
  leaf = graph[graph.length - 1];
console.log(findPath(root, leaf).length);
// → 4

leaf.connect(root);
console.log(findPath(root, leaf).length);
// → 2
