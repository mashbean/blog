---
title: "Show Your Wallet"
description: "I built \"Show Your Wallet,\" a verification service that lets you deploy a digital-wallet verifier with one click. It's open source as of today (GPL-licensed), and it doesn't cost you a single cent."
pubDate: "2026-09-03T22:47:00+08:00"
tags: ["數位皮夾", "驗證器", "OpenID4VP", "個資保護", "開源", "Cloudflare", "有備而來"]
category: blog
author: mashbean
lang: en
translationOf: "2026-09-03-請出示皮夾"
translatedBy: "Claude Opus 4.8"
translatedDate: 2026-09-09
draft: false
---

Show Your Wallet

I built "Show Your Wallet," and with it I've realized a verification service for digital wallets that deploys in one click. It's open source as of today (under the [GPL license](https://github.com/mashbean/twdiw-vp-verifier-lite)).

Say you want to do age verification, or human verification, or something like that. Now it's a single-click deploy (or have your Agent do it for you), and in a few seconds you're up and running as a service provider that verifies digital-wallet credentials. No more shelling out big money to host your own server or build a Docker setup.

It doesn't even cost you a cent.

This is part of the "Bonds" (有備而來) experiment. Today I'm approaching it from the Verifier's point of view, with the goal of lowering the cost of becoming a verifier and doing a little something to grow the ecosystem. Every piece of this work draws on the source code and related documents I've published for the Ministry of Digital Affairs.

Once I got the hang of Cloudflare (strictly speaking, Cloudflare's Durable Objects), it turned out there was so much low-hanging fruit. I honestly could never have imagined that offering my own verification service could be this cheap.

In testing, the official wallet and my own hand-written wallet both verify successfully, and the cards inside the wallet can make their way over to my site for a spin, without any personal data being retained (but if you're really worried about it, just don't use it).

There are a few caveats, though.

One: deploying it doesn't make you an officially recognized verifier under the Ministry of Digital Affairs. You have to go through an official application process, otherwise the verification flow will flag you as an untrusted verifier (though I'm still waiting for the formal operating guidelines to come out, and I have no idea when they'll drop).

Two: it involves personal data, so you need to take good care of the data flow. That's why I wrote a module based on the requirements of the Republic of China's Personal Data Protection Act, which anyone building a verification service can adopt directly. As far as I know, the Ministry of Digital Affairs' own modules don't yet cover this piece.

Three: the official digital credential wallet currently follows a selective-disclosure standard, not zero-knowledge proofs, so there's still an exchange of personal data in the process. In practice, I've done my best to keep personal data inside your own browser; Cloudflare only sees metadata, and with persistence turned off, the data is destroyed after ten minutes at most. I learned a lot from this part, and came to understand just how much of a hassle it is to store personal data.

My guess is that a lot of verifiers don't have needs this heavy. They really only need to know whether the user is old enough, is a real person, or is Taiwanese. So the best design is one where you pass the test without any personal data needing to be retained. That way there's no possibility of a personal-data leak.

The AI put this well, so I'll quote it directly: whether the digital credential wallet can become public infrastructure depends on a second-layer ecosystem beyond the card-issuing app. Only when ordinary organizations can stand up a verifier using an open-source profile, rule out format problems, complete regression testing with clear error messages, and then enter formal service with data minimization and auditable governance, will the card go from a demo feature to a tool society can actually adopt.

→ [Read the full development report: Show Your Wallet: Turning Digital-Wallet Verification into a One-Click Open-Source Service](https://pro.mashbean.net/en/reports/2026-09-03-one-click-twdiw-vp-verifier-lite/)
