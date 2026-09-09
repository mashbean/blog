---
title: "I Built a Monitoring Dashboard for the Digital Wallet Ecosystem — and Found Official Sheep, Dolly, and Fries Cards? XD"
description: "After casually finishing a one-click-deployable card-issuing module, 'Please Accept This Card,' I also pulled together the official public information scattered all over the place into a daily-updated 'Digital Credential Wallet Ecosystem Monitoring Dashboard' — and along the way dug up a pile of fascinating findings from the revocation lists."
pubDate: "2026-09-10"
tags: ["數位皮夾", "監測儀表板", "請收下卡片", "撤銷清單", "信任清單", "有備而來"]
category: blog
author: mashbean
lang: en
translationOf: "2026-09-10-監測儀表板與請收下卡片"
translatedBy: "Claude Opus 4.8"
translatedDate: 2026-09-10
draft: false
---

I finished the digital wallet's "Monitoring Dashboard" and "Please Accept This Card" — and accidentally found official Sheep cards, Dolly cards, Fries cards? XD

After finishing the one-click-deployable "Please Present Your Wallet," I also casually built the issuing module for "Please Accept This Card." It, too, can be deployed with one click, hooks into your existing database, and — because it also runs entirely on Cloudflare — costs zero to set up.

Honestly I wasn't that interested at first; I couldn't be bothered to build the "Please Accept Your Wallet" side, because it drags in modules for issuance, trust lists, revocation lists, and so on. And the Ministry of Digital Affairs' official "Digital Credential Wallet" app can't take cards privately issued by third parties unless you've applied for a formal integration, which makes it a bit of a hassle. (The Bonds app, on the other hand, can take them natively — though I'm still weighing whether it'll formally launch.)

But a Facebook friend reached out, sincerely wanting to solve some genuine occupational-safety-service problems. Even though I suggested he just contact the wallet's official customer support directly (that's literally their job!), I was also curious how much it would actually cost, in practice, to issue cards. It turned out that, not counting labor (and not counting AI tokens), you can push it down to zero dollars — so I just open-sourced the service on the side.

That's not actually what I want to share today, though. Having gone through the whole cycle, I realized the information the government releases is tucked away in all sorts of places, and even the official site doesn't bring together everything I think should be disclosed and integrated in one spot. So I just went ahead and built one. I made a:

Digital Credential Wallet Ecosystem "Monitoring Dashboard"

Could this win a hackathon prize? XD

The dashboard updates daily, tracking API health, the trust list, the on-chain synchronization of the trust list, the revocation lists, plus the last GitHub update times and the status of Issue responses.

＊

Let me start with the fun stuff — I made some interesting discoveries once it was done.

The revocation lists reveal a remarkable amount of interesting information.

For instance, the phone-number verification cards from the three big telecoms all have large numbers of revocation records. The champion is Taiwan Mobile, which has already revoked 9,536 cards; Chunghwa and FarEasTone combined don't even add up to half of Taiwan Mobile's total. From this we can reverse-engineer just how large Taiwan Mobile's issuance volume is (they even issue cards for monthly-plan numbers).

The driver's-license verification card yields no reachable revocation list.

Then I unexpectedly caught this outfit, Jcard (a limited company), which had issued a bunch of "Zhongxinxing Village Blossom" cards — access cards, membership cards, loyalty-stamp cards. No idea what game they're playing. Jcard is backed by Acer investment, and it feels like the digital wallet deliberately sought out a physical venue to partner with (?), with Jcard as the IT service provider. But the revocation count is 0, so my guess is the service hasn't formally launched yet.

My only impression of Jcard is their metaverse NFTs that basically nobody was buying — but is anyone even still talking about NFTs these days?

Beyond that, the revocation lists show that many universities support diploma/degree-certificate cards in the digital wallet, including NTU, NCKU, and NTUST. Even my alma mater, China Medical University, turns out to issue digital staff-ID cards. When did China Medical get this advanced? I had no idea. Nice!

There are also cards I haven't been paying much attention to but that may already be live: the business certificate (工商憑證), the Ministry of Education's student-aid system login ID, and Chunghwa Telecom's enterprise-branch visitor card.

And finally there's a batch that's a little absurd — and that I don't think should be on the revocation list at all. These must be test cards: there's a Sheep card (sheep), a Dolly card (dolly), a Cookies card (cookies), and a Fries card? (fires). (Dolly, of course, being the cloned sheep — cute.)

Doesn't the Digital Credential Wallet have a sandbox test environment? Why would these silly-looking test cards show up on the "production" system's revocation list? It really feels like they should be cleaned out. Even though the revocation list isn't public (though I think it should be), and having them sit on the production revocation list is harmless, it's a bit off-putting (that's Taiwanese: 礙虐) all the same.

Otherwise it looks a lot like a software engineer who made the rookie mistake of accidentally mixing STAGING and PROD together. Yeah... I myself came up through meteor-driven, cowboy-coding development. I've deployed to PROD thinking it was STAGING before, leaving my teammate drenched in cold sweat, and I've shipped bugs too. Who hasn't shipped a bug?

Also, I recall the digital wallet has an IV&V (Independent Verification & Validation) vendor — no idea whether that's still the case — and this really should've gotten a thorough going-over (that's Taiwanese: 抓龍, "dragon-catching," i.e. a proper once-over) before launch.

＊

Now for some serious stuff.

Thinking about it, I was honestly a bit surprised that this public information still didn't have a single public web page presenting it. I took a look, figured it wasn't hard anyway, and just knocked out the whole package.

I really hope the official site has this too, because in digital trust — beyond machine-verifiability — human readability is a crucial piece. At the very least, this public data ought to be deployed somewhere human-readable on a gov.tw domain.

For example, the did:key public keys of the issuers in the official trust list need to be presented in full. Because when the wallet reads the interaction between an issuer and a verifier, it needs to know whether the counterparty is genuine. Right now the official wallet app interacts with these "whitelisted" parties in an internally locked-down way.

But if we ever want to achieve cross-border mutual verification of credentials, the maintenance cost of this whitelist model will climb by orders of magnitude. To pick an example at random: next year the wallets of every EU member state go live, and their trust lists will all be public (following the existing electronic-signature framework). If a Taiwanese wallet wanted to accept an EU "Please Present Your Wallet," in practice today you'd get a warning — never mind not being able to receive the other party's card at all.

On top of that, once you have a trust list, the revocation list follows. Say you had a driver's-license verification card, but your license got revoked for drunk driving — that voided record then shows up on the revocation list. The revocation list is important, because a verifier can't just trust your driver's license from your wallet alone (proving you once held it doesn't mean it's currently valid); they need one more step to confirm it hasn't been revoked, before a car-rental company will dare rent to you.

But the government actually doesn't publish the revocation lists — there's nowhere they're announced. I dug them out of already-issued cards. Concretely, the method is: walk the official trust list once a day, request each issuer's OID4VCI metadata to get its card types, then read out and tally the revocation list behind each card type one by one.

Finally I pulled it all together into a dashboard. Thoughtful enough, right?

So API health, the trust list, and the revocation list are a three-pronged combo meal — all three have to be disclosed together for the picture to be complete. Also, the Ministry of Digital Affairs' current trust list is actually preserved on a blockchain — currently only on Arbitrum. The dashboard also compares whether the on-chain trust list matches the official centralized store.

That said, my personal suggestion is: Ethereum mainnet is already very cheap now, so there's really no need to put this on the second-layer Arbitrum — and since it's EVM, it's guaranteed compatible; migrating over is just a flick of the fingers. I could even write my own smart contract to pull the official data and deploy an on-chain trust list myself, and it wouldn't cost much — but then it'd lose the whole point of being "officially operated."

＊

That's roughly it — building the dashboard turned up a lot of interesting discoveries.

Last, I also added a section for monitoring Issues. The reason is I want to know when the government will respond, because there really are some security risks that need fixing XD — nothing very critical, but leaving them unfixed leaves me a little uneasy. After all, the selective disclosure right now doesn't fully count as genuine selective disclosure. Thanks to the Agent for catching it; I hadn't spotted it myself either. (See the issue for details.)

This counts as one concrete test of the public-code spirit: to really count as public code, someone actually has to maintain the source — otherwise it's just bait and switch (掛羊頭賣狗肉, "hang out a sheep's head but sell dog meat").

Speaking of which, code written by an individual can't actually be contributed to the Ministry of Digital Affairs' current public-code platform, because to be eligible you have to be a government agency, or a vendor commissioned or subsidized by the government. So I can't even log in.

I'd originally thought I'd license it under the infectious copyleft GPL and see what would happen using GPL on the public-code platform. That was the plan I was looking forward to.

That's about it for today. I've now rounded out the "free one-click card issuance" and "monitoring dashboard" features, and the whole digital-wallet exploration journey is complete. See you next time.

＊

## Further reading

- Full development report: [Ecosystem Monitoring Dashboard: turning the trust and revocation data the government never disclosed into a daily-updated board](https://pro.mashbean.net/en/reports/2026-09-10-twdiw-ecosystem-monitor/) (pro.mashbean.net)
- Issuer-side report: [Please Accept This Card: turning digital wallet card issuance into a one-click-deployable open-source service](https://pro.mashbean.net/en/reports/2026-09-09-one-click-twdiw-vc-issuer-lite/)
- Monitoring dashboard: [issuer.mashbean.net/monitor](https://issuer.mashbean.net/monitor)
- Source code: [mashbean/twdiw-vc-issuer-lite](https://github.com/mashbean/twdiw-vc-issuer-lite) (GPL-3.0)
