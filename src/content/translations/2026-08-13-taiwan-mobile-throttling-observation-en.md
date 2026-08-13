---
title: "Measuring Taiwan’s Mobile Slowdown with OONI in Taipei"
description: "Sequential tests on a Taiwan Mobile 4G hotspot in Taipei. Download measured 55 kbit/s at 15:08 and 30 Mbit/s at 17:47; Tor and Snowflake connected throughout."
lead: "Taiwan’s announced throttling drill ended at 15:00. At this Taipei observation point, Taiwan Mobile 4G still measured only 55 kbit/s at 15:08 and the streaming test timed out at 15:10. A complete retest at 17:47 measured 30 Mbit/s and completed DASH, Tor, and Snowflake."
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
coverAlt: "Comparison of NDT download and upload throughput on Taipei 4G before the drill, eight minutes after the announced end, and at 17:47"
---

## Executive summary

Taiwan’s mobile-network throttling drill ended at 15:00 on 13 August 2026. At this Taiwan Mobile 4G observation point in Taipei, download still measured 55.2 kbit/s at 15:08, and the streaming test beginning at 15:10 timed out.

A complete retest at 17:47 measured 30.1 Mbit/s down and completed the streaming, Tor, and Snowflake tests. The observation indicates that the slowdown persisted beyond the announced end and that usable transfer capacity returned later.

This report covers one SIM, one observation point, and several measurement times. It cannot represent all of Taipei or establish the exact recovery time.

![NDT download and upload throughput on Taipei 4G before the drill, after the announced end, and during the later retest. The chart uses a logarithmic scale with exact values labelled.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/ndt-comparison.svg)

The three NDT runs show a clear sequence. Throughput was high before the drill, downstream service remained extremely constrained eight minutes after the announced end, and the 17:47 retest returned to a functional transfer rate. The tests used different Measurement Lab (M-Lab) servers, and signal strength and serving-cell state were not independently recorded. The chart supports order-of-magnitude and usability comparisons, not a continuous cell-throughput curve.

## Background and drill design

The Executive Yuan described the exercise as a simulation of constrained communications during natural disasters, large-scale cyberattacks, or compound emergencies. The northern exercise covered Keelung, Taipei, New Taipei, Taoyuan, Hsinchu City, Hsinchu County, and Yilan. Voice, SMS, text transmission, 110/119 emergency calls, and cell broadcasts were expected to remain operational. Video streaming, video calls, mobile payments, and cloud synchronization could be affected.

Taiwan’s [Executive Yuan notice](https://www.ey.gov.tw/Page/9277F759E41CCD91/66c2bed1-6ca3-4c30-ba7c-4fa0f90e00ec) confirms the time and area. An [Anoni.net community measurement guide](https://anoni.net/docs/en/blog/2026/08/ooni-mobile-throttle-drill/) records the published download ceiling as `256KB`. The source notation does not clearly distinguish `KB/s` from `kbit/s`, so this report preserves it as written.

Because the time, geography, and participating operators were announced in advance, the exercise offered an unusual window for community measurement. This observation addressed three questions.

1. When did the mobile connection recover enough to complete performance tests after the announced end?
2. Did general throughput and streaming workloads recover in the same direction?
3. Could Tor and Snowflake establish connections under constrained bandwidth?

Official information contained a schedule discrepancy. A few earlier local-government pages listed 13:30–14:00, while the 23 July Executive Yuan notice and newer local notices consistently listed 14:30–15:00. This report uses the later schedule.

## Method

### Measurement tools

OONI stands for the Open Observatory of Network Interference, an open-source project for measuring internet performance and interference. NDT, the Network Diagnostic Test, measures download, upload, and latency. DASH, Dynamic Adaptive Streaming over HTTP, simulates adaptive video streaming.

Tor is an anonymity network that routes traffic through multiple relays. Snowflake is a Tor pluggable transport that connects through short-lived proxies run by volunteers. An ASN, or Autonomous System Number, identifies the network operator carrying a measurement.

### Vantage point and safety gates

- The observation took place in Taipei; the exact location is withheld.
- The laptop connected only to a 4G phone hotspot using the same Taiwan Mobile SIM.
- Included measurements used AS24158, Taiwan Mobile Co., Ltd.
- The tools were OONI Probe CLI/miniooni 3.30.0 and Tor 0.4.9.11.
- All timestamps use Asia/Taipei.
- NDT, DASH, Tor, and Snowflake ran sequentially to prevent bandwidth contention.
- Before each slot, the workflow checked the default interface, ASN, operator, VPN, Tailscale, active utun interfaces, required commands, and OONI consent and upload state.

OONI’s Tor test checks reachability of directory authorities and obfs4 bridges. obfs4 is an obfuscation protocol designed to make Tor traffic harder to identify. The Snowflake test records bootstrap progress, meaning how far Tor has progressed in starting and connecting to its network. OONI’s [data interpretation guidance](https://ooni.org/documents/2021-ooni-partner-training-resources/interpreting-ooni-data.pdf) recommends reading individual results together with network, time, and repeated-measurement context.

NDT is operated by M-Lab. M-Lab stores the public IP address and time associated with a test in its public research dataset. Neither this report nor the downloadable safe dataset exposes that address. [M-Lab NDT documentation](https://www.measurementlab.net/tests/ndt/)

### Actual observation timeline

![Timeline of valid mobile observations in Taipei, the official drill window, impaired post-window tests, and the complete 17:47 retest.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/timeline.svg)

The NDT and DASH runs at 14:35 used a fixed-line exit and were excluded from the mobile analysis. The valid event-window mobile result is the 14:53 Tor measurement. Post-window tests ran from 15:08 to 15:23, followed by a complete retest from 17:47 to 17:49. The safe dataset retains scheduled time, actual time, status, and exclusion reason.

## Results

### Download still measured 55 kbit/s at 15:08

| Metric       |  14:16 pre-drill | 15:08 post-window | 17:47 later retest |
| ------------ | ---------------: | ----------------: | -----------------: |
| Download     | 141,997.8 kbit/s |       55.2 kbit/s |    30,131.6 kbit/s |
| Upload       |  13,981.8 kbit/s |    1,399.7 kbit/s |    20,310.0 kbit/s |
| Ping         |          27.6 ms |       unavailable |            23.0 ms |
| Average RTT  |          66.0 ms |       unavailable |            46.1 ms |
| Test runtime |             27 s |              94 s |               25 s |
| Test traffic |         207.9 MB |           10.3 MB |            72.4 MB |

At 15:08, download was about 0.039% of the pre-drill result and upload was about 10.0%. Downstream impairment was far stronger. At 17:47, download measured 30.1 Mbit/s and upload measured 20.3 Mbit/s, with NDT completing in 25 seconds. Download had increased 546-fold and upload 14.5-fold from the first post-window result.

The 15:08 record reports both ping and average RTT as zero, conflicting with test runtime and the other fields. This report treats those values as missing. All three runs report zero retransmit rate; that field alone cannot explain the throughput difference.

### Streaming changed from timeout to completion

| Time               | DASH median bitrate | Connect latency | Test runtime | Result                  |
| ------------------ | ------------------: | --------------: | -----------: | ----------------------- |
| 14:16 pre-drill    |              75,283 |         0.184 s |         18 s | completed               |
| 15:10 post-window  |                   0 |               0 |        155 s | `generic_timeout_error` |
| 17:47 later retest |              31,644 |         0.033 s |         31 s | completed               |

The 17:47 DASH test completed successfully, with median bitrate at about 42% of the single pre-drill value. The OONI output used here does not expose a display unit that can be safely confirmed for this bitrate field, so the table preserves the raw values. Completion supports restored streaming-test functionality; server path and radio conditions still affect the numeric comparison.

### Tor and Snowflake established connections throughout

![Total runtime of Tor and Snowflake tests before, during, and after the drill, including the later complete retest.](/images/posts/2026-08-13-taiwan-mobile-throttling-observation/circumvention-runtime.svg)

All five valid Tor measurements reported directory reachability of 10/10, directory-authority OR-port reachability of 10/10, and obfs4 reachability of 4/14. Runtime rose from 69 seconds before the drill to 96 seconds near the end of the event and 124 seconds at 15:15, then fell to 78 seconds at 15:21 and 67 seconds at 17:48. Reachability counts remained stable while runtime increased around the event and returned close to the pre-drill value later.

Snowflake reached 100% bootstrap in all three runs. Bootstrap time was 6.68 seconds before the drill, 17.29 seconds at 15:18, and 12.78 seconds at 17:49. Total runtime was 11, 25, and 16 seconds. These results establish that Tor over Snowflake could connect at those moments. They do not cover sustained browsing, calls, or large transfers.

## Discussion

### 1. Restoration time belongs in resilience criteria

The announced window ended at 15:00. This observation still showed clear impairment through 15:12 and functional NDT and DASH results at 17:47. The measurements bound recovery to 15:12:48–17:47:30. The interval remains wide, yet it demonstrates that an announced end time and an individual subscriber’s experienced recovery can diverge. Future exercises should publish a restoration criterion and report the long tail of subscriber recovery.

### 2. Functional recovery and baseline equivalence are separate questions

At 17:47, download was far above the 55 kbit/s throttle-level result and DASH completed, supporting functional recovery. Download was 21% of the single pre-drill result and DASH median bitrate was about 42%. One vantage point, different servers, and unrecorded radio conditions prevent direct attribution of those ratios to residual throttling. Confirming full restoration would require a fixed device and position with at least two consecutive results near a defined baseline threshold.

### 3. Anonymity tools crossed the minimum viability threshold

Tor directory access and Snowflake bootstrap succeeded near the end of the event and afterward. The constrained network still allowed these tools to establish connections, while longer runtimes meant longer waits. Evaluating access to shelter information, message exchange, or practical use of an anonymous channel also requires small text-page success rates, time to first byte, full load time, and connection persistence.

## Limitations and uncertainty

- One location, SIM, operator, and device cannot represent Taipei, Taiwan Mobile, or all seven municipalities.
- There is no valid mobile NDT/DASH observation from 14:30 to 14:52, so the event-window minimum and throttle curve cannot be estimated.
- There are no observations between 15:12 and 17:47, leaving the precise recovery time unknown.
- Signal level, band, serving cell, movement, and cell load were not independently recorded.
- The three NDT runs used different M-Lab servers, combining access, routing, and server conditions.
- Tor’s 4/14 obfs4 result covers the sampled bridges and cannot describe every obfs4 bridge.
- Tor and Snowflake success establishes short probe and bootstrap viability, without measuring sustained application quality.
- Voice, SMS, cell broadcast, emergency calls, payments, and specific messaging apps were outside the test scope.

## What should happen next

A stronger protocol should cover all three mobile operators, multiple locations, and independent SIMs. During the event, each site should use the same NDT, DASH, Tor, and Snowflake sequence. After the announced end, NDT and DASH should repeat every five minutes until two consecutive sets return to a defined share of baseline. Each result should include signal strength, radio band, and serving-cell changes. Local scheduling should continue through connectivity loss, and failed tests should remain in the dataset.

Official technical guidance should use an unambiguous unit such as kbit/s or kB/s, state downlink and uplink targets separately, define a restoration deadline, and publish aggregated recovery statistics for all three operators. Communications resilience reporting should cover service continuity, degradation magnitude, and restoration time.

## Data and reproducibility

- [Privacy-safe CSV without public IP addresses](/data/tw-resilience-20260813-safe-summary.csv)
- [OONI pre-drill NDT](https://explorer.ooni.org/m/20260813061630.660453_TW_ndt_f0b58c28cf0d8e2c)
- [OONI pre-drill DASH](https://explorer.ooni.org/m/20260813061648.989148_TW_dash_ffec009dc6d70372)
- [OONI event-tail Tor](https://explorer.ooni.org/m/20260813065443.492387_TW_tor_63dd692bf6048e52)
- [OONI post-window NDT](https://explorer.ooni.org/m/20260813071012.914204_TW_ndt_900e794545876315)
- [OONI post-window DASH](https://explorer.ooni.org/m/20260813071246.770377_TW_dash_a5742736d0c1369b)
- [OONI post-window Snowflake](https://explorer.ooni.org/m/20260813071907.092320_TW_torsf_5a031d34e6a94c20)
- [OONI later NDT retest](https://explorer.ooni.org/m/20260813094754.898729_TW_ndt_cf8f4c65b6ae8943)
- [OONI later DASH retest](https://explorer.ooni.org/m/20260813094825.972501_TW_dash_ab089891a91a0dc8)
- [OONI later Tor retest](https://explorer.ooni.org/m/20260813094933.137105_TW_tor_7b4125a3dedb80b5)
- [OONI later Snowflake retest](https://explorer.ooni.org/m/20260813094949.832048_TW_torsf_4b722809f5e0c27a)

The safe CSV preserves municipality, scheduled and actual times, ASN, operator, test, status, traffic, and requested result fields. It contains no public IP address, OONI UID, or Measurement URL. OONI data are cited under the project’s [CC BY-NC-SA 4.0 data licence](https://github.com/ooni/license/blob/master/data/LICENSE.md).

### Principal background sources

- Executive Yuan, “[Taiwan conducts its first mobile-network throttling exercise](https://www.ey.gov.tw/Page/9277F759E41CCD91/66c2bed1-6ca3-4c30-ba7c-4fa0f90e00ec),” 23 July 2026.
- National Communications Commission, “[2026 Urban Resilience Air Defence Exercise Mobile Network Throttling](https://www.ey.gov.tw/File/681FE1D3848D02BC?A=C),” 23 July 2026.
- Taipei City Government, “[Taipei’s 2026 Urban Resilience Exercise](https://www.gov.taipei/News_Content.aspx?n=F0DDAF49B89E9413&s=3FDA1935C4C07DB3&sms=72544237BBE4C5F6).”
- Anoni.net, “[A pre-announced slowdown and a 30-minute OONI observation of northern Taiwan’s mobile network](https://anoni.net/docs/en/blog/2026/08/ooni-mobile-throttle-drill/).”
- OONI, “[Interpreting OONI data](https://ooni.org/documents/2021-ooni-partner-training-resources/interpreting-ooni-data.pdf).”
- Measurement Lab, “[NDT](https://www.measurementlab.net/tests/ndt/)” and “[Privacy Policy](https://www.measurementlab.net/privacy-v3/).”
