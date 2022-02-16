/* Zeitmessung

Messen Sie mit Date.now(), wie lange Ihre Funktion findPath braucht, um in einem komplizierteren Graphen einen Pfad zu finden. Da treeGraph die Wurzel an den Anfang des Graphen-Arrays legt und ein Blatt ans Ende, können Sie Ihrer Funktion auf folgende Weise eine nichttriviale Aufgabe erteilen:

let graph = treeGraph(6, 6);
console.log(findPath(graph[0], graph[graph.length - 1]).length);
// → 6

Konstruieren Sie einen Testfall mit einer Laufzeit von etwa einer halben Sekunde. Seien Sie vorsichtig, wenn Sie größere Zahlen an treeGraph übergeben. Da die Größe des Graphen exponentiell zunimmt, können Sie den Graphen dadurch leicht so groß machen, dass es sehr viel Zeit und Arbeitsspeicher erfordert, um darin einen Pfad zu finden. */
