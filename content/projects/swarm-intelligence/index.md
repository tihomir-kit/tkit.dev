---
title: Swarm Intelligence
date: 2012
tags: ["canvas", "html5", "javascript"]
---

HTML5 Canvas particle animation. Animated particles follow each other using one of three currently implemented algorithms:
<ul>
	<li><strong>swarm</strong> – each particle targets a random particle from the swarm and follows it for next 5000-10000 canvas refresh cycles. after that, it randomly finds a new one and follows it for next 5000-10000 refresh cycles and so on</li>
	<li><strong>tail</strong> – each particle targets a different random particle on each canvas refresh cycle and follows it for a single refresh cycle after which it targets a new random particle and then follows than one for a single refresh cycle and so on</li>
	<li><strong>lead</strong> – all particles follow the same (single) particle which moves randomly inside the canvas a bit faster than all the other particles</li>
</ul>