---
title: "Turning the Digital Wallet into a MyData Vault"
description: "I call this whole process the \"top-grafting-pear tactic\": on top of the existing MyData service, I stitched together the Mobile Citizen Digital Certificate and a third-party digital wallet, so that government documents can be downloaded, stored, and selectively disclosed by the person themselves, instead of being view-once-then-vanish."
pubDate: "2026-09-08"
tags: ["數位皮夾", "MyData", "資料保險箱", "個資保護", "行動自然人憑證", "有備而來"]
category: blog
author: mashbean
lang: en
translationOf: "2026-09-08-成功讓數位皮夾變成mydata的資料保險箱"
translatedBy: "Claude Opus 4.8"
translatedDate: 2026-09-09
draft: false
---

Turning the digital wallet into a MyData vault.

I call this whole process the "top-grafting-pear tactic." (Top-grafting is a Taiwanese orchard technique where you graft high-value pear shoots onto the branches of a hardier host tree, so the sturdy trunk you already have ends up bearing fruit it was never designed to grow.)

Before writing up these notes I was a little worried about offending colleagues, friends, and vendors who are still on active duty, but after some thought, and reading through the piece carefully, I figure it should be fine. It's all public information. Just treat me as an engaged citizen running a little public-code experiment, and please share in the joy of my successful build. This post is going to run a bit long, so bear with me :).

Disclosure: since leaving the Ministry of Digital Affairs (MODA), I have not taken part in any MODA-related tenders or roles. My rank was low enough that there is no revolving-door issue, but honestly, switching sides and going all-out is so much easier.

Back to the point.

I turned the digital wallet into a data vault, so from now on it can store government documents downloaded from MyData, including national ID data, household registration transcripts, land registry data, health insurance enrollment records, tax certificates, and so on. However many government documents MyData has, that's how many you can pull down. Right now there are 143 available to download.

This has boundless potential. Let me give a few timely examples:

Your little prince or princess is moving up to the junior high in your school district and needs to prove how long the family has been registered there. Just show part of the household registration transcript and you can confirm the child was registered in the district from birth (so competitive of them...).

A young friend in Greater Taipei is being crushed by rent and needs to apply for a housing subsidy, but has to prove they are not wealthy enough, which means income data. Just download personal income data through MyData, and the digital wallet can verify the income eligibility without revealing every single line item.

Need to show the police agency's certificate of good conduct? Save it into the digital wallet via MyData, and you can present it on the spot, even abroad. This is incredibly useful for anyone looking to emigrate, apply for permanent residence, get a work visa, or even just sign up for fast-track immigration clearance. I've done it myself once.

All of this data can now be stored safely inside the digital wallet, instead of scattered across your computer and phone.

You might wonder: isn't this just putting digital documents into an app? How hard can it be, and why hasn't the Taiwanese government offered something like this before? Back when I was involved in planning the Digital Certificate Wallet at the Ministry of Digital Affairs, I had the same question. But having gone through the whole journey, I now have a rough sense of how hard it is to provide even a plain "official" data vault.

Two years ago, there was a procurement item that planned to connect and reconcile the digital wallet with MyData. I don't know how far it got. But now, another year and a half on, the official wallet still doesn't have this feature. Probably ran into some cross-agency integration difficulty yet again.

＊

Let me first describe the problem MyData runs into, which stems from a built-in limitation in MyData's service architecture.

First, although MyData is called "My Data," its original goal was not to let citizens download their own data, but rather "with the citizen's consent, to let different agencies and companies obtain your data."

For example, to take out a loan, some bank needs your annual income. You can log in to MyData and consent, and then the Ministry of the Interior hands the data straight to the bank, without going through you. You only need to consent in advance. It's actually very convenient.

So I think MyData should be renamed YourData, because my data isn't in my hands, doesn't pass through my hands, and doesn't touch my lips (okay, that's a really old joke). The upside is convenience, and the documents aren't easily leaked (uh, assuming the household registration database or the bank's database don't leak...).

In digital policy terms, I'd guess this is the classic paternalist mindset: for the people's convenience, and to keep their data from being misused, you keep the people from touching the data at all. I once submitted a short paper on this, "From Household Registration to Fleeing Qin: The Development of Asian Identity Autonomy in the Digital Age," to a National Yang Ming Chiao Tung University journal. This approach isn't unique to Taiwan; many East Asian countries do the same.

Here there's an interesting counterexample. Two years ago, Golden Melody queen of song Christine Hsu (Hsu Ching-chun) was heading to the US to perform, but got stuck at customs, because her new passport had no entry-exit records, and the travel agency and her manager couldn't solve it on the spot. In the end, she cleverly used MyData to download an entry-exit certificate and successfully entered the country.

MODA held this up as an official showcase, part of its record of achievements. It also sparked a trend of people "flexing" their entry-exit records on social media.

＊

Luckily customs recognized that entry-exit record, otherwise Christine Hsu couldn't have entered the US, and her fans would have been so disappointed. I myself recently downloaded data from MyData as proof for a student loan application, and the bank recognized that data too.

After all this setup, why can't MyData integrate with the digital wallet?

Because these "documents," whether PDF files or ZIP files, have no digital signature. Neither the agency providing the data nor MODA, which runs the MyData platform, signs them, even though these agencies all have their own government certificates (GCA).

So these documents are actually easy to forge and misuse. You might ask: so just have the issuing agency enter a password with its certificate and sign it, like stamping a chop on a document you apply for at the counter, why can't something this simple be done?

The public sector doesn't think the way you do. The issuing agency might say: because it could be misused, I don't dare sign it, and besides, is there any budget for me to put out a tender to build signing? MODA would say: I just operate MyData, surely you can't ask me to vouch for it? (The above is just my own inner monologue speculating.)

Because the service was never meant for you to hold the documents in the first place, no thought was given to what scenarios or needs citizens might have if they did hold them.

For instance, on the application page for the entry-exit date certificate, the MyData site states very clearly that "once obtained, this personal document is for personal retention and reference only," and says nothing about using it, presenting it, or proving anything with it. Many other document pages carry the same warning.

If that were really the case, Christine Hsu couldn't have entered the US; and to push the logic further, if that were really the rule, MODA shouldn't have put out a press release, because wouldn't that be slapping its own face?

So we can guess it this way: "once obtained, this personal document is for personal retention and reference only" is defensive wording, something to pull out for defense if something goes wrong, but in ordinary times the citizen's own use of these documents is tacitly permitted, and it's not even merely tacit, because MODA's press release actively encouraged it. (See the press release: Golden Melody queen of song Christine Hsu praises the MyData platform, solving an urgent entry-exit problem through digital services.)

＊

On the premise of this tacit permission, we can go ahead and experiment with digital-wallet integration of MyData! I did two things.

One, I built a data-vault section for all the various MyData documents you can download, with every bit of information-security protection you'd expect. Two, I deeply integrated MyData, the Mobile Citizen Digital Certificate, and the digital wallet.

MyData can be opened inside the digital wallet app, because it's a PWA (works within a mobile browser interface). You enter your details, log in via the Mobile Citizen Digital Certificate app, then get redirected back to the digital wallet, and you can download the data. No need to manually move it out of the Downloads folder yourself, and data integrity is guaranteed (hashed with SHA256).

The digital wallet in this case is the self-built ["Bonds" ("come prepared") digital wallet](https://github.com/bonds-tw/backupTW-iOS), not the official "Digital Certificate Wallet." In my ideal world of great harmony, the digital wallet, the Mobile Citizen Digital Certificate, and MyData will one day be able to integrate into one (there are many good international examples, such as Ukraine's Diia).

The second feat is even more radical: I issued a "digital ID card" via MyData.

I pulled down the "household registration national ID card data" (only the person themselves can pull it, of course), then cleaned up the PDF's fields and issued it as a digital-wallet card (a Verifiable Credential, VC). This lets you build endless verification scenarios, such as "is this person Taiwanese," "is this person of legal age," "is this person who they claim to be."

The issuer is currently the wallet holder's own DID signature, plus the holder's own signature from the Mobile Citizen Digital Certificate; that's how the digital ID card was issued.

You ask why the issuer isn't the Ministry of the Interior? This is just a civic experiment, so of course there's no Ministry of the Interior. Who knows how long it'll take the Ministry to even consider this kind of solution; they've probably got PTSD from the New eID incident.

This creates a kind of multi-layered gap in trust. Because it's self-initiated, it's not on any trust list, which is a gap in the official digital-wallet system; second, the "household registration national ID card data" PDF is not signed by the Ministry of the Interior, which is a gap in electronic signatures; third, although MyData has a web certificate signature (presumably handled by TWNIC's company), it doesn't actively vouch for the integrity of the document from receipt to issuance.

But as long as even one party signs, I can use zero-knowledge-proof magic to establish the official validity of the "digital ID card," via techniques like zkPDF or zkTLS. You can find the details in my development report.

So for now the digital ID card can only be backed by a self-signed certificate. But the Mobile Citizen Digital Certificate is actually quite powerful, because after the amendment to the Electronic Signatures Act, the "digital signature" of the mobile certificate is equivalent to an expression of the person's intent, and carries legal force. The current digital ID card can only go this far.

Also, not every document passing through MyData lacks a digital signature. Back in 2022 the Examination Yuan officially announced that the electronic certificates for passing national exams, downloaded via MyData, carry the Examination Yuan's signature, so this is in fact doable. Unfortunately it doesn't cover earlier certificates, otherwise I could have played around with my physician national exam pass certificate.

So the bottleneck lies with the issuing agencies, not with MODA's MyData.

＊

I call the stitched-together-monster approach above the "top-grafting-pear tactic": on top of the existing MyData digital service, designing a new generation of digital infrastructure that fits personal digital autonomy, a digital wallet with data-vault capabilities.

Of course this digital wallet is 100% compatible with the official Digital Certificate Wallet, and the source code is public.

＊

That said, I can also imagine how hard it is for the official wallet to push something like this: first, there are too many mothers-in-law; second, cooperation between parallel units takes a huge amount of social lubrication plus budget; and third, even units within the same ministry are not default partners in cooperation, and many things need smoothing over.

Another is the build cost for issuing or verifying with a wallet. Quotes from the various ministries and their vendors are all over the place, ranging from five zeros to seven zeros. Even now I find it hard to understand why the price gap is so large; there are surely many considerations not fit to share with outsiders.

But this post isn't out to tackle the gamesmanship of IT procurement and the silo effect between units. That's a problem I'll chew on carefully after I head to Oxford next week.

＊

Back to the MyData vault. Once you have all these government documents, you can actually implement all sorts of application scenarios.

In "Please Present Your Wallet," I opened up more verification scenarios: "is the household registered in a certain city or county," "is income within a threshold," "was there labor insurance on a given date," and so on.

Truly boundless potential, and more importantly, this path has a far, far smaller boundary of personal-data leakage and authorization. This is really the concrete demonstration of the "minimal disclosure principle" in the Personal Data Protection Act.

That's all for today's sharing. As always, all the thinking, the design, and the source code are open-sourced and open. You're welcome to work, discuss, and contribute alongside me!

→ [Read the full development report: Integrating MyData: Realizing a Data Vault with the Digital Wallet](https://pro.mashbean.net/en/reports/2026-09-05-mydata-vault-in-the-digital-wallet/)
