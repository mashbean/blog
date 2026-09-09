---
title: "Experiment: Receiving Official Government Mail in a Digital Wallet"
description: "Stitching a digital wallet, a mobile Natural Person Certificate, and a physical Natural Person Certificate driver together to test whether ordinary citizens could receive electronic official mail—and to spell out exactly where the line falls between what works and what doesn't yet."
pubDate: "2026-09-01T22:52:54+08:00"
tags: ["數位皮夾", "自然人憑證", "電子公文", "數位公共建設", "有備而來"]
category: blog
author: mashbean
lang: en
translationOf: "2026-09-01-實驗用數位皮夾收公文"
translatedBy: "Claude Opus 4.8"
translatedDate: 2026-09-09
draft: false
---

> This is a development write-up and a record of my own thinking. The article was drafted by an Agent.

On my AI blog ["Wicked Problems"](https://pro.mashbean.net/), I've opened a new section called "Ready in Advance" to document my process of building, hacking on, and developing my ideal version of a digital wallet.

Since there's no pressure to ship and no official baggage, I get to develop by whatever means necessary—which means there's a very high chance the result becomes a Frankenstein's monster—while writing up my notes along the way. The goal is to make the case for better digital public services.

And because the [source code for the "Ready in Advance" app](https://github.com/bonds-tw/backupTW-iOS) and the [source code for the research articles](https://github.com/mashbean/blog-pro) behind these posts are both open-sourced in sync, I can speak with full confidence about what works and what doesn't.

Today is the first post, titled ["What if you could receive electronic official mail with a Natural Person Certificate?"](https://pro.mashbean.net/reports/2026-09-01-natural-person-certificate-official-documents/).

## The Last Mile of E-Government

Here's the background: ordinary people currently have no cross-agency, universal channel for receiving electronic official mail—we still have to receive physical letters. Government agencies, companies, and civic organizations, on the other hand, can already take part in electronic official-document exchange. Letting natural persons receive electronic official mail too could be called the last mile of e-government.

There are plenty of overseas cases to show this is a necessary—and genuinely achievable—piece of digital public infrastructure; the full article also gathers together how various countries do it.

Back in 2024, when I served on the Executive Yuan's Youth Advisory Committee, committee member Chien-ying actually raised a related idea. See Proposal 10: ["Building a platform for ordinary citizens to receive electronic official mail using the Natural Person Certificate"](https://advisory.yda.gov.tw/proposals-detail/316). From the several rounds of agency replies before and after, you can see the same old back-and-forth over who's responsible for what.

But the outcome was good. The National Archives Administration folded the "G2C Citizen Official-Document Electronic Exchange Service" into the Ministry of Digital Affairs' "Smart Government Digital Navigation Development Plan (2026–2030)," and stated that the service is expected to go live by ROC year 117—that is, 2028.

## First, Build a Frankenstein's Monster

From my own vantage point, the existing digital public infrastructure is actually already quite complete. The pieces that are most missing—the exchange mechanism and the governance framework—are things I can't touch right now, let alone the question of how rights and obligations get assigned in cross-agency cooperation. So what I *can* do is first develop a "Frankenstein's monster" to prove out feasibility.

I stitched the "digital wallet" together with the "mobile Natural Person Certificate," and also hooked up the driver for the physical Natural Person Certificate, giving the digital wallet the ability to receive an official document and sign for it.

The Natural Person Certificate obviously can't receive official mail on its own, because it's an identity and signing tool, not a receiving container. The digital wallet can't do it alone either: a single decentralized identifier address (`did:key`) doesn't automatically acquire the legal effect—under the Electronic Signatures Act—of proving that the person expressed their own intent.

But, Pen-Pineapple-Apple-Pen—bring them together, and problem solved!

So I made it possible to sign with both the mobile and the physical Natural Person Certificate, then jump back into the third-party digital wallet "Ready in Advance" and receive a self-generated synthetic electronic official document.

This set of test data borrows the component names and division of labor from the official spec—EN (the envelope file), DI (the document body file), and ESW (the encrypted exchange form file)—but it is **not the official test suite provided by the National Archives Administration, and it has not passed official DTD/Schema, signature, encryption, or G2C integration validation**. There's currently no publicly available official sandbox test data to be found, so both the app and the article clearly label it as self-made synthetic data with no legal effect.

Finally, since I already come with the built-in temperament of a client-side commissioning party, I also took a stab at drafting the standards and acceptance items based on some digital-public-infrastructure principles. If the stars align, feel free to take a look, ha.

As for the other services in the images—MyData data vault, a digital national ID card that implements zero-knowledge proofs, third-party-wallet convenience-store pickup, and so on—I'll share those in future articles, so stay tuned!

→ [Read the full development report: What if you could receive electronic official mail with a Natural Person Certificate?](https://pro.mashbean.net/en/reports/2026-09-01-natural-person-certificate-official-documents/)
