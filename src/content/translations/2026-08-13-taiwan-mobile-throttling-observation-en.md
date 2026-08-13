---
title: "Measuring Taiwan’s Mobile Slowdown with OONI in Taipei"
description: "Sequential OONI, Tor, and Snowflake measurements from a Taiwan Mobile 4G hotspot in Taipei. Download fell from about 142 Mbit/s before the drill to 55 kbit/s at 15:08, while anonymity tools remained reachable with longer runtimes."
lead: "OONI is an open network-measurement project. At this Taipei observation point, Taiwan Mobile 4G download throughput remained about 99.96% below the pre-drill result eight minutes after the announced 15:00 end. The streaming test timed out, while Tor and Snowflake still connected with longer runtimes."
pubDate: "2026-08-13T16:05:00+08:00"
tags: ["Taiwan resilience", "network resilience", "OONI", "Tor", "Snowflake", "mobile networks"]
category: blog
author: mashbean
source: mashbean.net
contentType: observation-report
era: recent
lang: en
translationOf: taiwan-mobile-throttling-observation-zh
slug: taiwan-mobile-throttling-observation-en
draft: false
cover: images/posts/2026-08-13-taiwan-mobile-throttling-observation/ndt-comparison.svg
coverAlt: "Log-scale comparison of NDT download and upload throughput before and after Taiwan's mobile throttling drill"
---

## Executive summary

On 13 August 2026, Taiwan conducted its first large-scale mobile-network throttling exercise as part of a civil-resilience air-defence drill across seven northern municipalities. The announced window was 14:30–15:00 Asia/Taipei. Voice calls, SMS, text transmission, emergency numbers, and cell broadcast were expected to remain available, while high-bandwidth services would be constrained. Taiwan’s [Executive Yuan notice](https://www.ey.gov.tw/Page/9277F759E41CCD91/66c2bed1-6ca3-4c30-ba7c-4fa0f90e00ec) confirms the time and area. An [Anoni.net community measurement guide](https://anoni.net/docs/en/blog/2026/08/ooni-mobile-throttle-drill/) reports that the publicly stated mechanism was core-network rate limiting with a download ceiling written as `256KB`. The notation does not unambiguously specify `KB/s` or `kbit/s`, so this report preserves the source wording.

OONI stands for the Open Observatory of Network Interference, an open-source project for measuring internet performance and interference. NDT, the Network Diagnostic Test, measures download, upload, and latency. DASH, Dynamic Adaptive Streaming over HTTP, simulates adaptive video streaming. Tor is an anonymity network that routes traffic through multiple relays. Snowflake is a Tor pluggable transport that connects through short-lived proxies run by volunteers. An ASN, or Autonomous System Number, identifies the network operator carrying the measurement.

In Taipei, I connected a laptop to a 4G hotspot using the same Taiwan Mobile SIM and ran the tests sequentially. Every included measurement was confirmed as AS24158, Taiwan Mobile. The results follow.

- Pre-drill NDT at 14:16 measured **141,998 kbit/s** down. A post-window run beginning at 15:08 measured only **55.2 kbit/s** down, a **99.96% decrease**, or roughly **1/2,573** of the earlier speed.
- Post-window upload was **1,400 kbit/s**, approximately one tenth of the pre-drill 13,982 kbit/s. At this vantage point, downstream impairment was far stronger than upstream impairment.
- DASH beginning at 15:10 ran for 155 seconds, reported a median bitrate of 0, and ended with `generic_timeout_error`. High-bandwidth streaming remained unusable after the announced end.
- Across Tor tests at 14:25, 14:53, 15:15, and 15:21, directory ports remained 10/10 reachable, directory-authority OR ports remained 10/10, and obfs4 remained 4/14. Total test runtime increased from 69 seconds before the drill to 96 seconds near the end of the event and 124 seconds post-window, before falling to 78 seconds.
- Snowflake bootstrapped to 100% both before and after the drill. Bootstrap time rose from 6.68 to 17.29 seconds, showing a successful connection with a longer setup time.

At 14:35, the observer switched to Wi-Fi to avoid losing connectivity. The resulting NDT and DASH measurements originated from fixed-line AS3462 and were excluded. This report therefore has **no valid mobile performance measurement from the centre of the 30-minute window** and cannot reconstruct the full throttling curve. The evidence supports two narrower findings. Low-bandwidth circumvention tools were reachable near the end of the event, and severe downstream impairment persisted at this single mobile vantage point for at least eight minutes after the announced end.

![Log-scale comparison of NDT download and upload throughput before and after the announced drill window. Exact values are labelled.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/ndt-comparison.svg)

This visual uses a logarithmic scale to compare orders of magnitude. It contains two observations, which are insufficient for a continuous time series. The two NDT runs used different Measurement Lab (M-Lab) servers, so server path and radio conditions may contribute to the difference. The 2,573-fold download gap, the DASH timeout, and longer adjacent low-bandwidth tests all point in the same direction. Ordinary speed-test variance alone is unlikely to explain the combined pattern.

## Background and drill design

The Executive Yuan described the drill as a resilience exercise modelled on experience in Japan, South Korea, Nordic countries, and other democracies. It was intended to simulate constrained communications during natural disasters, large-scale cyberattacks, or compound emergencies. The northern exercise covered Keelung, Taipei, New Taipei, Taoyuan, Hsinchu City, Hsinchu County, and Yilan from 14:30 to 15:00.

Voice, SMS, text transmission, 110/119 emergency calls, and cell broadcasts were expected to remain operational. Video streaming, video calls, mobile payments, and cloud synchronization could be affected.

Because time, geography, and participating operators were announced in advance, the exercise offered an unusual quasi-experimental window for community measurement. The observation addressed four questions.

1. Would general throughput tests directly observe the throttle?
2. Would streaming traffic behave differently?
3. Could Tor and Snowflake establish connections under constrained bandwidth?
4. How quickly would service recover after 15:00?

Official information had its own quality issue. A few local-government pages published in June or early July still listed 13:30–14:00, while the 23 July Executive Yuan notice and newer local notices consistently listed 14:30–15:00. This report uses the later, mutually consistent schedule.

## Method

### Vantage point and safety gates

- The observation took place in Taipei; the exact location is withheld.
- The laptop connected only to a 4G phone hotspot using the designated SIM.
- The network was AS24158, Taiwan Mobile Co., Ltd.
- The tools were OONI Probe CLI/miniooni 3.30.0 and Tor 0.4.9.11.
- All scheduled and actual timestamps use Asia/Taipei.
- Every test ran sequentially to prevent bandwidth contention.
- Before each slot, the local workflow checked the default interface, ASN and operator, VPN, Tailscale, active utun interfaces, power, required commands, and OONI consent and upload state.

OONI classifies NDT and DASH as performance tests. Its Tor test checks reachability of directory authorities and obfs4 bridges. obfs4 is an obfuscation protocol designed to make Tor traffic harder to identify. The Snowflake test attempts to establish Tor over Snowflake and records bootstrap progress, meaning how far Tor has progressed in starting and connecting to its network. OONI’s [data interpretation guidance](https://ooni.org/documents/2021-ooni-partner-training-resources/interpreting-ooni-data.pdf) stresses that individual results need to be interpreted with network, time, and repeated-measurement context.

NDT is operated by Measurement Lab. M-Lab states that NDT collects the public IP address used during a test and publishes its research data. Neither this report nor the downloadable safe dataset exposes that address; the linked OONI measurements identify the ASN and network, not the raw personal IP. [M-Lab NDT documentation](https://www.measurementlab.net/tests/ndt/)

### Actual observation timeline

![Timeline of valid mobile observations in Taipei, the official drill window, and the lack of a valid mobile performance result at 14:35.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/timeline.svg)

The timeline shows two key boundaries. The 14:35 performance measurements used fixed-line Wi-Fi and were excluded. Post tests were brought forward because the observer needed to move, so the nominal 15:35 Tor measurement ran at 15:21. Both scheduled and actual timestamps remain in the metadata.

## Results

### NDT showed 55 kbit/s download at 15:08

| Metric       |        14:16 pre |     15:08 post |  Change |
| ------------ | ---------------: | -------------: | ------: |
| Download     | 141,997.8 kbit/s |    55.2 kbit/s | −99.96% |
| Upload       |  13,981.8 kbit/s | 1,399.7 kbit/s | −89.99% |
| Test runtime |             27 s |           94 s |    3.5× |
| Test traffic |         207.9 MB |        10.3 MB |       — |

Before the drill, the connection delivered approximately 142 Mbit/s down and 14 Mbit/s up. Post-window download was 55 kbit/s, below the order of magnitude suggested by the publicly written `256KB` figure. The source unit is ambiguous, and a single measurement is affected by TCP ramp-up, server choice, and transient radio conditions. The data cannot determine compliance with an exact technical threshold. It does show that **downstream service remained severely constrained at 15:08 and had not recovered in sync with the announced 15:00 end.**

The post NDT record reports ping and average RTT as zero, which conflicts with the visibly slow connection and other test behaviour. Those fields are treated as missing or unusable and provide no evidence about latency.

### DASH still timed out ten minutes after the announced end

The pre-drill DASH test completed in 18 seconds with a median bitrate of 75,283. The post-window run beginning at 15:10 lasted 155 seconds, returned a median bitrate of 0, and recorded `generic_timeout_error`. Together with NDT, this indicates that sustained downstream streaming was still not functioning normally around 15:10.

The OONI output used here did not expose a display unit for the DASH bitrate field that could be safely confirmed for this report. The raw value is therefore preserved without relabelling it as kbit/s.

### Tor and Snowflake remained reachable with longer runtimes

![Total runtime of Tor and Snowflake tests across the observation phases.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/circumvention-runtime.svg)

In all four valid Tor measurements, directory reachability remained 10/10 and directory-authority OR-port reachability remained 10/10. obfs4 remained 4/14 before, during, and after the exercise. There was no observed new loss of Tor directory/authority access or additional deterioration in the sampled obfs4 reachability attributable to the drill. Yet total test runtime increased near the end of the event and in the first post run.

Snowflake bootstrapped to 100% in both runs, while bootstrap time rose from 6.68 to 17.29 seconds and total runtime from 11 to 25 seconds. This establishes minimum reachability at those two moments. It does not show that long browsing sessions, calls, or large transfers would be usable under the same constrained conditions.

## Discussion

### 1. Recovery at this vantage point lagged the announced end

The drill was expected to slow the network. The most operationally useful finding concerns recovery after 15:00. Both the 15:08 NDT and 15:10 DASH measurements show persistent impairment. Possible mechanisms include staged removal of a core-network policy, an existing subscriber session or bearer not being refreshed, device-side state, or an unrelated transient radio/routing condition. One vantage point cannot distinguish among them. A future study can test whether the success criterion includes time-to-recovery after rate limits are lifted and whether operators monitor subscribers who recover late.

### 2. The downstream/upstream asymmetry deserves replication

Post-window download was about 0.039% of the pre-drill value; upload was about 10.0%. The asymmetry may reflect different downstream and upstream policies, or NDT dynamics under extremely constrained bandwidth. Future tests should repeat the same sequential post measurements at the same location and SIM to determine whether the asymmetry is reproducible.

### 3. Connection success leaves application quality unanswered

Successful Tor directory access and Snowflake bootstrap show that these tools could still establish connections under constrained bandwidth. Bootstrap is only a minimum viability threshold. Evaluating access to shelter information, message exchange, or practical use of an anonymous channel also requires the success rate for a small text page, time to first byte, full load time, and connection persistence.

## Limitations and uncertainty

- One location, SIM, operator, and device cannot represent Taipei, Taiwan Mobile, or all seven municipalities.
- There is no valid mobile NDT/DASH observation between 14:30 and 14:52, so the minimum value, shape, and exact policy threshold during the drill cannot be estimated.
- Signal level, band, serving cell, movement, and cell load were not independently recorded.
- The pre and post NDT runs used different M-Lab servers; results combine access, routing, and server conditions.
- The post NDT began at 15:08 and ended at 15:10; DASH then began at 15:10.
- Tor’s 4/14 obfs4 result covers the sampled bridges and cannot describe all obfs4 bridges.
- Tor and Snowflake success establishes short bootstrap/probe viability, not sustained application quality.
- Voice, SMS, CBS, emergency calls, payments, and specific messaging apps were not tested, so this report cannot verify official claims about them.

## What should happen next

A stronger future protocol should cover all three mobile operators, multiple locations, and independent SIMs; use an identical sequence at 14:25, 14:35, 14:45, 14:55, 15:05, and 15:15; record signal level and cell changes; treat failures as results; and use a local scheduler that does not depend on the observer’s connectivity. Recovery should have an explicit threshold, such as two consecutive NDT results returning to a stated percentage of baseline.

If authorities publish a technical target, they should use an unambiguous unit such as kbit/s or kB/s, specify downlink and uplink separately, define a restoration deadline, and publish aggregated recovery statistics from all three operators. A resilience assessment should cover the continuity of critical services, the measurable effects of degradation, restoration time, and the number of users who recover late.

## Data and reproducibility

- [Privacy-safe CSV without public IP addresses](/data/tw-resilience-20260813-safe-summary.csv)
- [OONI NDT pre measurement](https://explorer.ooni.org/m/20260813061630.660453_TW_ndt_f0b58c28cf0d8e2c)
- [OONI DASH pre measurement](https://explorer.ooni.org/m/20260813061648.989148_TW_dash_ffec009dc6d70372)
- [OONI Tor event-tail measurement](https://explorer.ooni.org/m/20260813065443.492387_TW_tor_63dd692bf6048e52)
- [OONI NDT post measurement](https://explorer.ooni.org/m/20260813071012.914204_TW_ndt_900e794545876315)
- [OONI DASH post measurement](https://explorer.ooni.org/m/20260813071246.770377_TW_dash_a5742736d0c1369b)
- [OONI Snowflake post measurement](https://explorer.ooni.org/m/20260813071907.092320_TW_torsf_5a031d34e6a94c20)

The safe CSV preserves municipality, scheduled and actual times, ASN, operator, test, status, traffic, OONI UID, Measurement URL, and requested result fields. It contains no public IP address. OONI data are cited under the project’s [CC BY-NC-SA 4.0 data licence](https://github.com/ooni/license/blob/master/data/LICENSE.md).

### Principal background sources

- Executive Yuan, “[Taiwan conducts its first mobile-network throttling exercise](https://www.ey.gov.tw/Page/9277F759E41CCD91/66c2bed1-6ca3-4c30-ba7c-4fa0f90e00ec),” 23 July 2026.
- National Communications Commission, “[2026 Urban Resilience (Air Defence) Exercise: Mobile Network Throttling](https://www.ey.gov.tw/File/681FE1D3848D02BC?A=C),” 23 July 2026.
- Taipei City Government, “[Taipei’s 2026 Urban Resilience Exercise](https://www.gov.taipei/News_Content.aspx?n=F0DDAF49B89E9413&s=3FDA1935C4C07DB3&sms=72544237BBE4C5F6).”
- Anoni.net, “[A pre-announced slowdown and a 30-minute OONI observation of northern Taiwan’s mobile network](https://anoni.net/docs/en/blog/2026/08/ooni-mobile-throttle-drill/).”
- OONI, “[Interpreting OONI data](https://ooni.org/documents/2021-ooni-partner-training-resources/interpreting-ooni-data.pdf).”
- Measurement Lab, “[NDT](https://www.measurementlab.net/tests/ndt/)” and “[Privacy Policy](https://www.measurementlab.net/privacy-v3/).”
