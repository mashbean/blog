---
title: "Still at 55 kbit/s After the Drill: Observing Taiwan’s 2026 Mobile Throttling Exercise"
description: "A sequential OONI, Tor, and Snowflake observation from one Taiwan Mobile 4G hotspot in New Taipei: download fell from about 142 Mbit/s before the drill to 55 kbit/s at 15:08; Tor and Snowflake remained reachable but slower."
lead: "This is a single-vantage-point observation, not a carrier ranking or a nationwide estimate. The main finding is that eight minutes after the announced 15:00 end, NDT download throughput on AS24158 remained about 99.96% below the pre-drill measurement, and DASH subsequently timed out. Tor and Snowflake could still connect, but took longer."
pubDate: "2026-08-13T16:05:00+08:00"
tags: ["Taiwan resilience", "network resilience", "OONI", "Tor", "Snowflake", "mobile networks"]
category: blog
author: mashbean
source: mashbean.net
contentType: observation-report
era: recent
lang: en
slug: taiwan-mobile-throttling-observation-en
draft: false
cover: images/posts/2026-08-13-taiwan-mobile-throttling-observation/ndt-comparison.svg
coverAlt: "Log-scale comparison of NDT download and upload throughput before and after Taiwan's mobile throttling drill"
---

[正體中文版 →](/blog/2026/0813-16xy2v/)

## Executive summary

On 13 August 2026, Taiwan conducted its first large-scale mobile-network throttling exercise as part of a civil-resilience air-defence drill across seven northern municipalities. The announced window was 14:30–15:00 Asia/Taipei. The exercise was designed as degradation rather than a total shutdown: voice calls, SMS, text transmission, emergency numbers, and cell broadcast were expected to remain available, while high-bandwidth services would be affected. Taiwan’s [Executive Yuan notice](https://www.ey.gov.tw/Page/9277F759E41CCD91/66c2bed1-6ca3-4c30-ba7c-4fa0f90e00ec) confirms the time and area. An [Anoni.net community measurement guide](https://anoni.net/docs/en/blog/2026/08/ooni-mobile-throttle-drill/) reports that the publicly stated mechanism was core-network rate limiting with a download ceiling written as `256KB`. Because that notation does not unambiguously specify `KB/s` or `kbit/s`, this report preserves the source wording rather than silently converting it.

From New Taipei, I connected a laptop to a 4G hotspot using the same Taiwan Mobile SIM and ran OONI NDT, DASH, Tor, and Tor Snowflake tests sequentially. Every included measurement was confirmed as AS24158, Taiwan Mobile. The results were:

- Pre-drill NDT at 14:16 measured **141,998 kbit/s** down. A post-window run beginning at 15:08 measured only **55.2 kbit/s** down: a **99.96% decrease**, or roughly **1/2,573** of the earlier speed.
- Post-window upload was **1,400 kbit/s**, approximately one tenth of the pre-drill 13,982 kbit/s. At this vantage point, downstream impairment was far stronger than upstream impairment.
- DASH beginning at 15:10 ran for 155 seconds, reported a median bitrate of 0, and ended with `generic_timeout_error`. High-bandwidth streaming remained unusable after the announced end.
- Across Tor tests at 14:25, 14:53, 15:15, and 15:21, directory ports remained 10/10 reachable, directory-authority OR ports remained 10/10, and obfs4 remained 4/14. Total test runtime increased from 69 seconds before the drill to 96 seconds near the end of the event and 124 seconds post-window, before falling to 78 seconds.
- Snowflake bootstrapped to 100% both before and after the drill. Bootstrap time rose from 6.68 to 17.29 seconds: usable, but slower.

The central limitation is consequential. At 14:35, the observer switched to Wi-Fi to avoid losing connectivity. The resulting NDT and DASH measurements originated from fixed-line AS3462 and were excluded. This report therefore has **no valid mobile performance measurement from the centre of the 30-minute window**. It cannot reconstruct the full throttling curve. It supports a narrower conclusion: low-bandwidth circumvention tools were reachable near the end of the event, and severe downstream impairment persisted at this single mobile vantage point for at least eight minutes after the announced end.

![Log-scale comparison of NDT download and upload throughput before and after the announced drill window. Exact values are labelled.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/ndt-comparison.svg)

This visual is a comparison of orders of magnitude, not a continuous time series. The two NDT runs used different M-Lab servers, so server path and radio conditions may contribute to the difference. Even so, the 2,573-fold download gap, the DASH timeout, and longer adjacent low-bandwidth tests all point in the same direction; ordinary speed-test variance alone is not a convincing explanation.

## Background: a pre-announced exercise in degradation, not disconnection

The Executive Yuan described the drill as a resilience exercise modelled on experience in Japan, South Korea, Nordic countries, and other democracies. It was intended to simulate constrained communications during natural disasters, large-scale cyberattacks, or compound emergencies. The northern exercise covered Keelung, Taipei, New Taipei, Taoyuan, Hsinchu City, Hsinchu County, and Yilan from 14:30 to 15:00.

The government stressed that this was not a total internet shutdown. Voice, SMS, text transmission, 110/119 emergency calls, and cell broadcasts were expected to remain operational; video streaming, video calls, mobile payments, and cloud synchronization could be affected.

Because time, geography, and participating operators were announced in advance, the exercise offered an unusual quasi-experimental window for community measurement. The questions were broader than whether the network “felt slow”:

1. Would general throughput tests directly observe the throttle?
2. Would streaming traffic behave differently?
3. Could Tor and Snowflake establish connections under constrained bandwidth?
4. How quickly would service recover after 15:00?

Official information had its own quality issue. A few local-government pages published in June or early July still listed 13:30–14:00, while the 23 July Executive Yuan notice and newer local notices consistently listed 14:30–15:00. This report uses the later, mutually consistent schedule.

## Method

### Vantage point and safety gates

- Location: New Taipei; exact location withheld.
- Access: laptop connected only to a 4G phone hotspot using the designated SIM.
- Network: AS24158, Taiwan Mobile Co., Ltd.
- Tools: OONI Probe CLI/miniooni 3.30.0 and Tor 0.4.9.11.
- Time: all scheduled and actual timestamps use Asia/Taipei.
- Execution: every test ran sequentially to prevent bandwidth contention between measurements.
- Preflight: before each slot, the local workflow checked the default interface, ASN/operator, VPN, Tailscale, active utun interfaces, power, required commands, and OONI consent/upload state.

OONI classifies NDT and DASH as performance tests. Its Tor test checks reachability of directory authorities and obfs4 bridges. The Snowflake test attempts to establish Tor over Snowflake and records bootstrap progress. OONI’s [data interpretation guidance](https://ooni.org/documents/2021-ooni-partner-training-resources/interpreting-ooni-data.pdf) stresses that individual results need to be interpreted with network, time, and repeated-measurement context.

NDT is operated by Measurement Lab. M-Lab states that NDT collects the public IP address used during a test and publishes its research data. Neither this report nor the downloadable safe dataset exposes that address; the linked OONI measurements identify the ASN and network, not the raw personal IP. [M-Lab NDT documentation](https://www.measurementlab.net/tests/ndt/)

### Actual observation timeline

![Timeline of valid mobile observations, the official drill window, and the excluded AS3462 fixed-line measurements.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/timeline.svg)

The timeline shows two key boundaries. First, the 14:35 performance measurements were contaminated by fixed-line Wi-Fi and cannot be used. Second, post tests were brought forward because the observer needed to move; the nominal 15:35 Tor measurement actually ran at 15:21. Both scheduled and actual timestamps remain in the metadata.

## Results

### NDT: download was still 55 kbit/s at 15:08

| Metric       |        14:16 pre |     15:08 post |  Change |
| ------------ | ---------------: | -------------: | ------: |
| Download     | 141,997.8 kbit/s |    55.2 kbit/s | −99.96% |
| Upload       |  13,981.8 kbit/s | 1,399.7 kbit/s | −89.99% |
| Test runtime |             27 s |           94 s |    3.5× |
| Test traffic |         207.9 MB |        10.3 MB |       — |

Before the drill, the connection delivered approximately 142 Mbit/s down and 14 Mbit/s up. Post-window download was 55 kbit/s, below the order of magnitude suggested by the publicly written `256KB` figure. However, the source unit is ambiguous and a single measurement is affected by TCP ramp-up, server choice, and transient radio conditions. The defensible conclusion is not that an operator missed an exact technical target. It is that **at 15:08, downstream service remained severely constrained and had not recovered in sync with the announced 15:00 end.**

The post NDT record reports ping and average RTT as zero, which conflicts with the visibly slow connection and other test behaviour. Those fields are treated as missing/unusable rather than evidence of zero latency.

### DASH: streaming still timed out ten minutes after the announced end

The pre-drill DASH test completed in 18 seconds with a median bitrate of 75,283. The post-window run beginning at 15:10 lasted 155 seconds, returned a median bitrate of 0, and recorded `generic_timeout_error`. Together with NDT, this indicates that sustained downstream streaming was still not functioning normally around 15:10.

The OONI output used here did not expose a display unit for the DASH bitrate field that could be safely confirmed for this report. The raw value is therefore preserved without relabelling it as kbit/s.

### Tor and Snowflake: reachable, but slower

![Total runtime of Tor and Snowflake tests across the observation phases.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/circumvention-runtime.svg)

In all four valid Tor measurements, directory reachability remained 10/10 and directory-authority OR-port reachability remained 10/10. obfs4 remained 4/14 before, during, and after the exercise. There was no observed new loss of Tor directory/authority access or additional deterioration in the sampled obfs4 reachability attributable to the drill. Yet total test runtime increased near the end of the event and in the first post run.

Snowflake bootstrapped to 100% in both runs, while bootstrap time rose from 6.68 to 17.29 seconds and total runtime from 11 to 25 seconds. This establishes minimum reachability at those two moments. It does not show that long browsing sessions, calls, or large transfers would be usable under the same constrained conditions.

## Discussion

### 1. Recovery at this vantage point lagged the announced end

The most operationally useful finding is not that the network slowed during a throttling drill—that was the design—but what happened after 15:00. Both the 15:08 NDT and 15:10 DASH measurements show persistent impairment. Possible mechanisms include staged removal of a core-network policy, an existing subscriber session or bearer not being refreshed, device-side state, or an unrelated transient radio/routing condition. One vantage point cannot distinguish among them. It can, however, motivate a testable question: **Does the success criterion include time-to-recovery after rate limits are lifted, and do operators monitor the long tail of subscribers that recover late?**

### 2. The downstream/upstream asymmetry deserves replication

Post-window download was about 0.039% of the pre-drill value; upload was about 10.0%. The asymmetry may reflect different downstream and upstream policies, or NDT dynamics under extremely constrained bandwidth. Future tests should repeat the same sequential post measurements at the same location and SIM to determine whether the asymmetry is reproducible.

### 3. “Can connect” is not the same as “usable service”

Successful Tor directory access and Snowflake bootstrap show that constrained bandwidth did not equal blocking of those tools. Bootstrap is only a minimum viability threshold. If resilience means people can actually retrieve shelter information, exchange messages, or use an anonymous channel, future protocols should measure success rate for a small text page, time to first byte, full load time, and connection persistence.

### 4. The contaminated 14:35 measurements are a data-governance result

The two 14:35 measurements uploaded successfully to OONI, but their ASN was AS3462, Chunghwa Telecom fixed-line access. Including them would produce 77 Mbit/s NDT download and a DASH bitrate of 87,589, falsely suggesting the mobile throttle did not occur. The lesson is simple: **ASN, access type, and actual start time are part of the result, not optional annotations.** The measurements are retained for audit but marked `included_in_mobile_analysis=false` in the public dataset.

## Limitations and uncertainty

- One location, SIM, operator, and device cannot represent New Taipei, Taiwan Mobile, or all seven municipalities.
- There is no valid mobile NDT/DASH observation between 14:30 and 14:52, so the minimum value, shape, and exact policy threshold during the drill cannot be estimated.
- Signal level, band, serving cell, movement, and cell load were not independently recorded.
- The pre and post NDT runs used different M-Lab servers; results combine access, routing, and server conditions.
- The post NDT began at 15:08 and ended at 15:10; DASH then began at 15:10.
- Tor’s 4/14 obfs4 result is a sample of reachability, not the availability of all obfs4 bridges.
- Tor and Snowflake success establishes short bootstrap/probe viability, not sustained application quality.
- Voice, SMS, CBS, emergency calls, payments, and specific messaging apps were not tested, so this report cannot verify official claims about them.

## What should happen next

A stronger future protocol should cover all three mobile operators, multiple locations, and independent SIMs; use an identical sequence at 14:25, 14:35, 14:45, 14:55, 15:05, and 15:15; record signal level and cell changes; treat failures as results; and use a local scheduler that does not depend on the observer’s connectivity. Recovery should have an explicit threshold, such as two consecutive NDT results returning to a stated percentage of baseline.

If authorities publish a technical target, they should use an unambiguous unit such as kbit/s or kB/s, specify downlink and uplink separately, define a restoration deadline, and publish aggregated recovery statistics from all three operators. Resilience is not only whether critical services remain up; it is also whether degradation is measurable, reversible on time, and free of a long tail of users left behind.

## Data and reproducibility

- [Privacy-safe CSV without public IP addresses](/data/tw-resilience-20260813-safe-summary.csv)
- [OONI NDT pre measurement](https://explorer.ooni.org/m/20260813061630.660453_TW_ndt_f0b58c28cf0d8e2c)
- [OONI DASH pre measurement](https://explorer.ooni.org/m/20260813061648.989148_TW_dash_ffec009dc6d70372)
- [OONI Tor event-tail measurement](https://explorer.ooni.org/m/20260813065443.492387_TW_tor_63dd692bf6048e52)
- [OONI NDT post measurement](https://explorer.ooni.org/m/20260813071012.914204_TW_ndt_900e794545876315)
- [OONI DASH post measurement](https://explorer.ooni.org/m/20260813071246.770377_TW_dash_a5742736d0c1369b)
- [OONI Snowflake post measurement](https://explorer.ooni.org/m/20260813071907.092320_TW_torsf_5a031d34e6a94c20)

The safe CSV preserves scheduled and actual times, ASN, operator, test, status, traffic, OONI UID, Measurement URL, and requested result fields. It contains no public IP address. OONI data are cited under the project’s [CC BY-NC-SA 4.0 data licence](https://github.com/ooni/license/blob/master/data/LICENSE.md).

### Principal background sources

- Executive Yuan, “[Taiwan conducts its first mobile-network throttling exercise](https://www.ey.gov.tw/Page/9277F759E41CCD91/66c2bed1-6ca3-4c30-ba7c-4fa0f90e00ec),” 23 July 2026.
- National Communications Commission, “[2026 Urban Resilience (Air Defence) Exercise: Mobile Network Throttling](https://www.ey.gov.tw/File/681FE1D3848D02BC?A=C),” 23 July 2026.
- New Taipei City Government, “[2026 Urban Resilience Exercise](https://www.tax.ntpc.gov.tw/cp-2399-20772-6e7ae-1.html).”
- Anoni.net, “[A pre-announced slowdown: measuring the 30-minute northern Taiwan mobile throttle with OONI](https://anoni.net/docs/en/blog/2026/08/ooni-mobile-throttle-drill/).”
- OONI, “[Interpreting OONI data](https://ooni.org/documents/2021-ooni-partner-training-resources/interpreting-ooni-data.pdf).”
- Measurement Lab, “[NDT](https://www.measurementlab.net/tests/ndt/)” and “[Privacy Policy](https://www.measurementlab.net/privacy-v3/).”

---

The observation, interpretation, and publication are led and signed by mashbean. Codex assisted with environment setup, data preparation, charting, and bilingual drafting. Every result was cross-checked against public OONI measurements, the privacy-safe local summary, and official notices.
