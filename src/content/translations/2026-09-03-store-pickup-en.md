---
title: "I Picked Up a Convenience-Store Parcel with My Own Digital Wallet"
description: "Two days ago, receiving an official document with a digital wallet used mock data; this time it was for real. I used my own wallet to receive a telecom e-card, opened a QR code, and picked up a parcel at 7-Eleven — and along the way I unpack why the official wallet is designed to keep the App, the trust layer, and the capability layer separate."
pubDate: "2026-09-03T11:50:00+08:00"
tags: ["數位皮夾", "門號電子卡", "超商取貨", "OIDC4VP", "有備而來"]
category: blog
author: mashbean
lang: en
translationOf: "2026-09-03-成功用自己寫的數位皮夾實現超商取貨"
translatedBy: "Claude Opus 4.8"
translatedDate: 2026-09-09
draft: false
---

I pulled off a convenience-store parcel pickup with a digital wallet I wrote myself 🎉

Two days ago, receiving an official document with a digital wallet used mock data. Today it was the real thing. I successfully used my home-brewed wallet to receive a telecom e-card, then opened a QR code and picked up a parcel at 7-Eleven!

You can read the full process in the development report, but basically it's just an open-access API — not that hard. (After all, even I managed to write it.)

Still, after all this experimenting, I'm increasingly of the view that "Bonds" is better off not going onto the App Store, because some of the risks feel like the government hasn't patched them up yet — and staying off the store lets me experiment with a few things.

Being able to pick up a parcel at a convenience store means a few things:

First, the telecom e-card can be placed into a third-party wallet, which means the trust mechanism doesn't run through a closed App. Instead, once your SIM card is proven, it's issued to the holder's side using a genuine decentralized identifier (DID) issuance standard, as shown in the image. This deserves a huge round of applause — it really matters for a future open ecosystem.

Second, the telecom e-card can be successfully presented and verified (over OIDC4VP), which means this verification process also runs on a genuine standard, as shown in the image. That means there's no wallet locking things down in the middle — also super. (That said, the VP standard was actually updated to a final version last July, and the Ministry of Digital Affairs hasn't updated to it yet.)

Third, this confirmed something I hadn't quite figured out: why is the holder able to produce a QR code at all? As far as I know, under the OIDC4VP standard, it shouldn't really be possible for the user to present the content themselves — after all, the whole point is selective disclosure, and if you present it yourself, isn't that no longer selective disclosure?

The original flow is that the VP verification module isn't inside the convenience store's POS machine (if it had been designed that way, maybe it wouldn't have launched this fast and become a political win?). Instead, there's a virtual server room that verifies your name and the last three digits for you first, and then hands you a QR code encrypted with time-limited, valuable information (though I've already run the QR in the image through AI to obfuscate it into mush, to prevent abuse), which the POS machine's server side can read.

So you could say this latter stretch has almost nothing to do with the digital wallet's presentation side — it's a flow the Ministry of Digital Affairs developed on its own, and the detailed relationship can be seen in Figure 3. But it's open source too, which is genuinely commendable of them.

There's a second "that said": actually, plenty of countries have similar QR-code presentation designs, like Japan's My Number and Korea's mobile ID, but these too have nothing to do with the digital wallet standard. Clearly there's demand for it in the East.

So after this test, you can see that the official digital credential wallet's source code (including the App) and the trust layer (who can issue, who can verify) are kept separate — not welded together — which is really good. That the official design has come this far honestly brings a tear to my eye.

Next post, I'll write about the digital ID card issuance experience that the government could never actually pull off.

→ [Read the full development report: Fully Reproducing a Digital-Wallet Convenience-Store Pickup with "Bonds"](https://pro.mashbean.net/en/reports/2026-09-02-telecom-credential-convenience-store-pickup/)
