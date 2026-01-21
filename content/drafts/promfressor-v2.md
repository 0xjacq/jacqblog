# Promfressor : J'ai créé l'outil que j'aurais voulu avoir quand j'apprenais la compression

*Brouillon v2 — Approche storytelling*

---

## Accroche

Tu tournes un bouton. Le son change. Mais est-ce que c'est mieux ?

La compression audio, c'est ça. Des heures passées à ajuster des paramètres qu'on ne comprend pas vraiment. À espérer que quelque chose "sonne pro". Sans jamais savoir si on s'améliore ou si on empire les choses.

J'en avais marre. Alors j'ai construit un outil pour changer ça.

---

## Le problème

On a tous vécu ça.

Tu ouvres un compresseur dans ton DAW. Quatre boutons : Threshold, Ratio, Attack, Release. Tu lis un tuto. "Le threshold définit le seuil à partir duquel la compression s'applique."

Ok. Mais concrètement, ça veut dire quoi ?

Tu tournes le bouton. Le son change. Peut-être. Tu n'es pas sûr. Tu lis un autre tuto. Même explication, mêmes mots, même confusion.

Le problème n'est pas que la compression est compliquée. Le problème, c'est qu'on essaie d'apprendre un phénomène *sonore* avec des *mots*.

C'est comme apprendre à nager en lisant un livre.

---

## L'idée

Et si on pouvait **voir** ce qu'on entend ?

L'idée m'est venue en regardant un oscilloscope pour la première fois. Soudain, le son n'était plus invisible. Je pouvais observer les pics, les creux, la dynamique.

Pourquoi personne n'avait fait ça pour la compression ?

Un outil où chaque paramètre se voit en temps réel. Où tu entends ET tu observes. Où tu peux expérimenter sans risquer de casser quelque chose.

Pas un tuto. Pas une vidéo. Un laboratoire sonore.

---

## Ce que j'ai construit

Promfressor est une application web gratuite pour apprendre la compression audio.

Tu charges ta propre musique (ou tu utilises les exemples fournis). Tu manipules un vrai compresseur. Et tu vois exactement ce qui se passe.

**Une courbe de transfert en temps réel** — Un graphique qui montre la relation entre le son qui entre et le son qui sort. Quand tu bouges le threshold, la courbe change. Quand tu montes le ratio, la pente s'accentue. Plus besoin d'imaginer : tu vois.

**Des visualisations avant/après** — Deux vumètres côte à côte. Le signal original. Le signal compressé. La différence de niveau en direct.

**Un parcours progressif** — 9 modules qui t'emmènent du niveau zéro jusqu'à créer tes propres presets.

---

## Les 9 modules

Chaque module se concentre sur une seule idée. Une seule.

1. **Diagnostic** — Analyse ta musique. Où sont les problèmes de dynamique ?

2. **Threshold** — Le seuil. À partir de quel volume la compression démarre.

3. **Ratio** — L'intensité. Compression légère ou écrasement total ?

4. **Attack** — La vitesse de réaction. Garde le punch ou lisse les transitoires.

5. **Release** — Le relâchement. Court pour du groove. Long pour du naturel.

6. **Knee & Makeup** — Les finitions. Transitions douces et compensation de volume.

7. **Coloration** — L'effet sur le timbre. Pourquoi certaines compresseurs "sonnent" différemment.

8. **Recettes** — Des presets par genre. Funk, rock, pop. Écoute, compare, comprends.

9. **Passerelle DAW** — Traduis tes réglages vers ton logiciel habituel.

Tu ne passes au module suivant que quand tu as vraiment compris le précédent. Pas de précipitation. Pas de surcharge.

---

## Ce que ça change

J'ai construit Promfressor pour les autres. Mais c'est moi qui ai le plus appris.

En créant les visualisations, j'ai enfin compris ce que "soft knee" voulait vraiment dire. En programmant les modules sur l'attack, j'ai saisi pourquoi mes compressions sonnaient toujours "plates".

La magie opère quand tu vois le son se transformer en temps réel. Quand le pic de ta note de basse frappe le threshold et que tu observes la courbe réagir. Quand tu montes l'attack et que tu vois les transitoires réapparaître.

Ce n'est plus de la magie noire. C'est de la physique. Visible.

---

## Essaie par toi-même

Promfressor est gratuit et fonctionne directement dans ton navigateur. Pas d'installation. Pas de compte à créer.

Charge un fichier audio. Joue avec les paramètres. Regarde. Écoute.

En 20 minutes, tu comprendras mieux la compression qu'après des heures de tutos YouTube.

Le projet continue d'évoluer. D'autres modules arrivent. D'autres instruments aussi.

Mais le meilleur moment pour commencer à apprendre, c'est maintenant.

---

*[Lien vers Promfressor]*

---

## Notes de rédaction

### Checklist avant publication
- [ ] Relire à voix haute pour vérifier le rythme
- [ ] Faire lire par quelqu'un qui ne connaît pas la compression
- [ ] Ajouter le lien réel vers l'application
- [ ] Créer 2-3 captures d'écran clés
- [ ] Convertir en MDX avec frontmatter approprié

### Statistiques
- 0 bloc de code (vs 5 dans v1)
- Phrases courtes : ✓
- Une idée par paragraphe : ✓
- Jargon expliqué : ✓

### Frontmatter prévu
```yaml
---
title: "J'ai créé l'outil que j'aurais voulu avoir quand j'apprenais la compression"
date: "2026-01-XX"
description: "Comment Promfressor transforme l'apprentissage de la compression audio en expérience visuelle et interactive."
tags: ["audio", "musique", "pédagogie", "side-project"]
published: true
---
```
