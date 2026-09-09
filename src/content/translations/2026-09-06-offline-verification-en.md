---
title: "I Got Two Digital Wallets to Verify Each Other Offline! ✈️"
description: "Letting two digital wallets verify each other without any network connection. What do you do when the network goes down? Cut undersea cables, jammed base stations, a data-center fire—as long as your phone is still in your hand, your digital wallet is just fine. This is a dev-log of building offline verification, plus three small takeaways."
pubDate: "2026-09-06T12:47:00+08:00"
tags: ["數位皮夾", "離線驗證", "SD-JWT-VC", "零知識證明", "數位韌性", "有備而來"]
category: blog
author: mashbean
lang: en
translationOf: "2026-09-06-我用數位皮夾實現離線驗證了"
translatedBy: "Claude Opus 4.8"
translatedDate: 2026-09-09
draft: false
---

I got my digital wallet to do "offline verification"! ✈️ (that emoji means airplane mode)

Put simply, it lets two digital wallets verify each other without ever connecting to the internet.

Once a digital wallet supports offline verification, you could say it has evolved into the ultimate Blue-Eyes White Dragon of digital wallets.

＊

I still remember doing the early-stage research and drafting the tender specs at the Ministry of Digital Affairs two or three years ago, when I wrote the offline-verification requirement into the documents—I forget whether it was for vendors to actually build it or just to do a feasibility study. Either way, as of today, the official wallet still doesn't have this feature.

The good news, though, is that I went ahead and built it myself, and it wasn't even that hard—if even I can write it (I'm literally just a Vibe-coder), then official support should be just around the corner, right? Taiwan may need this especially, since it's better to be prepared: if the day comes when you need it, thank goodness, and if it never comes, all the better.

＊

A digital wallet that supports offline verification is an important piece of the digital-resilience puzzle, and it could even become a handy tool for collecting relief supplies when disaster strikes—after all, a fully offline digital-verification service is rare on the market, and no profit-driven company is going to build one.

Offline verification is actually where the name "Bonds" (有備而來, "come prepared") comes from: every service has to come prepared, digital-identity services included. After all, when a bear comes prepared—Winnie the Pooh has been eyeing us hungrily this whole time. (I've been milking this pun forever.)

Bonds is an experimental project to build the ideal digital wallet, using open source to prove, step by step, that a digital wallet done this way really works! I'm using that proof to advocate for the cause, and contributing the [source code](https://github.com/bonds-tw/backupTW-iOS). Today I'll share my dev notes on building offline verification.

＊

What do you do when the network goes down? Whether it's a severed undersea cable, a cut fiber line, a dismantled receiving station, a base station jammed for one reason or another, a data-center fire, and so on—internet access may be blocked, but as long as your phone is still with you, your digital wallet is just fine.

Even if your digital credentials are sitting safely inside your phone, if the verification service still has to reach a server (possibly overseas) at verification time, then you haven't actually achieved offline verification at all. When the network is unstable (like the base-station slowdowns during the recent urban-resilience drills), using a digital wallet runs into problems.

In fact, if you use the phone-number e-card in the official digital-credential wallet to pick up a parcel at a convenience store, the phone still has to connect back to the official server first—it isn't simply verified on the store's POS machine—though I'm not sure where the server actually sits. So the current convenience-store pickup solution isn't true offline verification.

The "Please Show Your Wallet" thing I released the day before yesterday isn't offline verification either, because it lives on Cloudflare, which would also be unreachable when the time comes.

When the network is down, you may well also need to collect supplies or prove some identity qualification. Beyond traditional physical documents, those of us who never let go of our phones are actually well suited to using a digital wallet to receive identity verification—and in many situations it may work even better than a paper document, because it can simultaneously log a record on the distributor's phone or computer.

But with no computer and no network, how do you verify? The best way in that case is to have phones with digital wallets scan and mutually recognize each other! So an ideal digital wallet should have, besides the ability to receive cards, the ability to issue cards. In some overseas cases, certain countries provide not only a digital wallet but also a companion verifier app for service providers.

That's why this time I built the "offline verification" feature, letting phones verify each other over a Bluetooth connection without ever going online (you could of course also use NFC, LAN WiFi, or a dynamic QR code?! But I haven't done those parts yet).

＊

To be blunt, it's really just porting the verification module onto the phone—not that hard. This time I experimented with a government-issued card (the phone-number verification card) and a self-issued digital ID, and separately tested both ordinary official verification (OIDC4VP) and privacy-preserving zero-knowledge-proof verification, and both succeeded (tears of joy)—the zero-knowledge proof was clearly much harder than ordinary verification.

Three small takeaways:

One, once a government-issued card is placed inside your phone, it really does create a certain degree of "digital resilience." Because the card is genuinely sitting right there in your own phone, if a government service fails, you can still verify with the card on your phone—or verify someone else (though the official wallet doesn't have this feature yet). At that point, building further services on top—say, disaster-relief payouts or on-site registration—becomes a very simple matter.

This approach is the payoff of "digital self-sovereignty," because it removes the need to depend on too many digital services, whether governmental or commercial. It quietly strengthens "digital sovereignty" too, because the state-issued card gains more uses and more backup redundancy. Self-sovereignty and sovereignty sound like a tongue-twister, but it's actually simple: self-sovereignty stresses the individual's own interests, while sovereignty stresses the nation's interests.

Two, having a good-enough, broadly applicable digital credential really matters—it lowers the barrier of "what to verify," otherwise the verifier and the person being verified have no idea what they're even supposed to verify with each other.

After a first pass at sorting this out, the needs that genuinely require verification really come down to just three groups: "not a child, Taiwanese, a real person" (attribute verification), "is this really the person" (legal-identity verification), and "have they already been verified before" (proof of uniqueness). Based on these three types, I still think a privacy-guaranteeing "ID card" is the best answer—though, given real-world constraints, the government probably won't do it this way.

So I used a combination punch of the Mobile Natural-Person Certificate plus MyData, doing it myself and issuing it myself; I'll write about this in a later article.

Three, offline "zero-knowledge proof" is achievable, and verification naturally takes more steps and is more complex than ordinary verification—but I'm quite puzzled: does on-site (offline) verification really need zero-knowledge proofs? Because the person is right there in front of you, so if the goal is full privacy, the face-to-face setting already carries plenty of risk. My preliminary takeaway is that for on-site verification, selective disclosure alone can cover most needs, which can dramatically lower the development difficulty and the computational overhead.

＊

As always, all the source code is already open. You can read the detailed development report in "The Hard Problem: Bonds." If all goes well, there should be 2-3 articles left, and then the fantastical journey of Bonds will come to an end.

→ [Read the full development report: When the Network Goes Down, Letting Digital Wallets Verify Each Other Offline](https://pro.mashbean.net/en/reports/2026-09-06-offline-wallet-verification/)
