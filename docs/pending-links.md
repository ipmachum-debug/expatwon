# Links held back, and why

A guide may not link to one that publishes later: the link would be dead from
the moment the first guide goes out, and `lint-data` refuses it.

That rule has a failure mode. When a scheduled guide is the only thing
standing between a link and the reader, the easy fix is to drag the scheduled
guide forward — and then publishing order is being set by a link rather than
by what readers are searching for. It happened once already: the whole queue
reordered around one link.

So the other fix is recorded here instead. The link comes out, the guide keeps
its place in the queue, and the entry below says to put the link back once the
target is live. `lint-data` reads this file and fails the build when a target
has published, so the reminder arrives by itself rather than depending on
anyone remembering.

Format, one per line, inside the table:

| in this guide | restore this link | where |
| --- | --- | --- |
| what-korean-banks-ask-about-money-from-abroad | sending-money-into-korea-routes-and-real-cost | Last section, after "the documents the bank will want, and the tax position." — the route and cost side of receiving money |
