---
title: "Achievement Unlocked: Zero-Knowledge Proofs in the Digital Wallet 🏆"
description: "Today I completed what I think of as the holy grail of digital identity services, and the piece of unfinished business I left behind at the Ministry of Digital Affairs last year: I got the digital wallet to support zero-knowledge proofs, made it actually work in production, and deployed it on Cloudflare while staying inside the free tier."
pubDate: "2026-09-05T00:54:00+08:00"
tags: ["數位皮夾", "零知識證明", "年齡驗證", "隱私", "Cloudflare", "有備而來"]
category: blog
author: mashbean
lang: en
translationOf: "2026-09-05-數位皮夾支援零知識證明成就達成"
translatedBy: "Claude Opus 4.8"
translatedDate: 2026-09-09
draft: false
---

Achievement Unlocked: Zero-Knowledge Proofs in the Digital Wallet 🏆

Today I completed what I think of as the holy grail of digital identity services, and the piece of unfinished business I left behind at the Ministry of Digital Affairs last year: I got the digital wallet to support zero-knowledge proofs (Zero Knowledge Proof), and I got it working in production. (Please, give me a hundred likes!)

Even better: I had assumed that a zero-knowledge proof verification service, given how computationally demanding the cryptographic challenges are, would be very hard to deploy on Cloudflare. To my surprise, after a bit of a struggle, I actually pulled it off, and kept it inside the free tier. Once again I can only marvel at how great Cloudflare's container service is, no need to run Docker yourself or anything like that.

So I can say with confidence that zero-knowledge proofs have entered the stage of commercial viability, and they can be deployed for free. One-click deployment is a little harder, but it should be doable, and that is simple enough, right?

This is part of the "Ready for Anything" (有備而來) experiment, whose goal is to build the ideal digital wallet through open source, and to conduct research and advocacy on digital identity policy. Zero-knowledge proofs (hereafter ZKP) are arguably the hardest nut to crack, and now that they are solved, there is a real chance of breaking the current standoff between the "identity-regulation camp" and the "free-speech camp."

＊

Having said all that, what on earth is a zero-knowledge proof? Let me explain with a simple, and urgently needed, example: online age verification. You can also picture it as the ID check at the door of a social platform.

Many countries have already passed laws mandating age verification, including the UK and Australia. The "identity-regulation camp" loudly applauds, believing it protects children; the "free-speech camp" rails against it nonstop, believing it violates privacy. That is because the age-verification process can leak personal data, and this is exactly where zero-knowledge proofs come into play.

Take the ordinary bank online-account-opening KYC process today: you have to upload your ID to prove who you are. If an adult website also demanded your ID, you would have to hand over every piece of data on the document to the other party, and then they could link your "personal data" with your "kinks" together, and walk off with your name without you ever knowing.

Now, the "Digital Credential Wallet" that Taiwan's Ministry of Digital Affairs provides supports Selective Disclosure. The wallet system breaks out every field on your credential into its own item, so you can provide just the date of birth on it, without providing any other data, and prove that you are an adult, so that your name is not dragged along with it.

But people who care even more about privacy will think: I do not even want to give up my birthday, so what then? This is where ZKP comes in. Through all sorts of mysterious, provable cryptographic machinery, ZKP lets you answer whether you are an adult (for example, whether you are older than 18) without ever revealing your birthday. You can see the flow on the demo page I built: the design is that you set a threshold, and then you can use the card you hold to verify it.

＊

That said, there are two practical difficulties right now.

One is that because ZKP requires a large amount of computation, both the phone and the verifier side (for example, my computer, or a server I set up) need considerable resources. Compared with "selective disclosure," the waiting time for the computation can range from a few seconds to tens of seconds, so making customers, citizens, and so on wait that long risks them losing patience.

User-experience design is the next hurdle ZKP has to clear, and honestly it makes me itch to dive in.

The second is that the cards the authorities have officially released so far, such as the phone-number verification card, the driver's license verification card, the business certificate verification card, and so on, none of them carry a date of birth, so there is no straightforward way to build age verification on them. Another issue is that these cards seem to be restricted to specific use cases (yes, I am still waiting on the operational guidelines to confirm this), though in my own experiments I have not run into too many restrictions. Actually, with a driver's license you can work backward from the "expiration date" to derive a person's birthday, because a driver's license expires on your 75th birthday.

To solve this problem, I actually designed my own "digital ID card" (I originally wanted to call it New-new-eID, but quite a few people told me the naming was a bit unlucky). This ID card is issued by pulling the national-ID data down from MyData and then signing it myself with the mobile Citizen Digital Certificate. I will share the process in a dedicated write-up later. For now let me just call it that: once you have the ID-card data, you can actually prove a lot of things, including whether you are an adult, whether you are Taiwanese, and even whether you are the person yourself.

And ZKP is well suited to answering these questions, while protecting privacy to the maximum.

＊

Back when I was in office last year, it was honestly a little hard to imagine that I could complete a ZKP verification experiment on my own. Over this past year, the infrastructure for digital identity has matured a great deal, and one part of that is how quickly ZKP has ripened. This time I used the open-source module from the Ethereum Foundation's ZKID group (special thanks to the EF's Vivian, Moven, Nicole, and Zoey). Around the same time, Google Wallet's team also open-sourced their own ZKP module, Longfellow, which I will test when I have time.

If I can finally connect this last mile on the road to privacy-preserving digital identity, I can reasonably predict that countries will gradually adopt ZKP services, because this kind of strong-privacy use case is a bit different from the selective disclosure I mentioned earlier. I feel like there is a comparison worth thinking through here, and I will write another article to analyze it later.

In any case, today's two big milestones are:

1. The digital wallet can now do not only selective disclosure, but also zero-knowledge proofs
2. Zero-knowledge proofs can be deployed for free on Cloudflare

Of course, both of the above are already open source, and anyone can use them for free.

If you are interested in the development journey and experimental data of getting the digital wallet to support ZKP, you are welcome to open up my "Hard Problems: Ready for Anything" series. That is all for today.

→ [Read the full development report: Making Zero-Knowledge Proofs Work in the Digital Wallet, and Deploying the Service to Cloudflare for Free](https://pro.mashbean.net/en/reports/2026-09-05-zero-knowledge-age-proof-from-phone-to-cloudflare/)
