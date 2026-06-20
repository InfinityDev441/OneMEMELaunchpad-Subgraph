# OneMEME Launchpad — Subgraph

[![Network: BSC](https://img.shields.io/badge/Network-BNB%20Smart%20Chain-yellow)](https://www.bnbchain.org/)
[![Network: Ethereum](https://img.shields.io/badge/Network-Ethereum-blue)](https://ethereum.org/)
[![The Graph](https://img.shields.io/badge/The%20Graph-Subgraph-blue)](https://thegraph.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

The Graph subgraph for the [OneMEME Launchpad](https://github.com/timedbase/OneMEMELaunchpad-Core) on BNB Smart Chain and Ethereum. Indexes token launches, bonding-curve trades, DEX migrations, creator vesting, token locking (OneCoinLocker), and the Spark V3-LP launch system.

---

## Repository layout

```
abis/
├── BondingCurve.json           getSpotPrice() + trade/migrate events
├── LaunchpadFactory.json
├── MemeToken.json              Transfer event ABI for the dynamic template
├── OneCoinLocker.json
├── SparkLauncher.json
├── SparkLocker.json
├── SparkToken.json             name / symbol / metaURI view calls
├── Token.json                  minimal ERC-20 view calls
├── VestingWallet.json
└── peripheral/
    ├── Collector.json
    ├── OneMEMEBB.json
    └── Vault.json
src/
├── bondingCurve.ts             buy / sell / migrate / register handlers + per-block OHLCV snapshots
├── launchpadFactory.ts         token creation, governance, timelock handlers
├── locker.ts                   OneCoinLocker lock/withdraw/transfer handlers
├── memeToken.ts                Transfer handler for MemeToken dynamic template (holder tracking)
├── sparkLauncher.ts            SparkLauncher token launch + DEX/quote-token admin handlers
├── sparkLocker.ts              SparkLocker fee-claim + governance handlers
├── utils.ts                    Factory singleton + token-type detection
├── vestingWallet.ts            vesting schedule + claim handlers
└── peripheral/
    ├── collector.ts            disperse + recipient handlers
    ├── oneMEMEBB.ts            buyback event handlers
    └── vault.ts                multisig proposal lifecycle handlers
schema.graphql                  all GraphQL entities
subgraph.bsc.yaml               BSC manifest
subgraph.ethereum.yaml          Ethereum mainnet manifest
```

---

## Manifests

Two chain-specific manifests share the same schema and mappings.

| Manifest | Network | Notes |
|---|---|---|
| `subgraph.bsc.yaml` | BNB Smart Chain | default target |
| `subgraph.ethereum.yaml` | Ethereum mainnet | same data sources, different addresses |

Each manifest includes: LaunchpadFactory · BondingCurve · VestingWallet · OneCoinLocker · SparkLauncher · SparkLocker + the MemeToken dynamic template.

> **Note:** Peripheral contracts (OneMEMEBB, Collector, Vault) have mappings in `src/peripheral/` but are not included in the active manifests.

---

## Setup

### 1 — Install

```bash
npm install
```

### 2 — Fill in contract addresses

The following contracts already have addresses in the manifests. Before deploying, verify them and fill in the two **TODO** Spark placeholders:

#### BSC (`subgraph.bsc.yaml`)

| Contract | Address | Status |
|---|---|---|
| `LaunchpadFactory` | `0xB9d4d353C53D83159758a3B5787e744B9F999463` | deployed |
| `BondingCurve` | `0xbB843b111639B9F19E575e3804b7c006eE1F80a9` | deployed |
| `VestingWallet` | `0x1fFBE03316743187fCEC8eA41fd76f8Ada74658C` | deployed |
| `OneCoinLocker` | `0x6C6e9740753d9F6C1E5D61C8bc0f34E37590f6C5` | deployed |
| `SparkLauncher` | `0x327A4d9360a96fe0d782235D35927A7Ea0a85b52` | deployed |
| `SparkLocker` | `0xae04d8C894162213dcDE6e9bA4f5a42eE00f5950` | deployed |

#### Ethereum (`subgraph.ethereum.yaml`)

| Contract | Address | Status |
|---|---|---|
| `LaunchpadFactory` | `0xe51D92fA3C1C78A9D3B11618fb0bEA319727e2eA` | deployed |
| `BondingCurve` | `0xA78df27496825B29CbdCD3778e6bc375a646Ae04` | deployed |
| `VestingWallet` | `0xe9F35abA5B0926258bE6EBbc17546B02704fB91C` | deployed |
| `OneCoinLocker` | `0xD7F53605d58057D8f96337dF606638c3e79B9867` | deployed |
| `SparkLauncher` | `0x058AC204CFbC39fBC1b21f417093a9AE6E238454` | deployed |
| `SparkLocker` | `0x0978D78dFBE7D76d06cB6267dEf2857685Aaa507` | deployed |


### 3 — Build & deploy

```bash
# BSC (default)
npm run codegen
npm run build
npm run deploy

# Ethereum
npm run codegen:ethereum
npm run build:ethereum
npm run deploy:ethereum

# Local Graph node
npm run create-local
npm run deploy-local
```

---

## Schema

### Core entities

| Entity | Description |
|---|---|
| `Factory` | Singleton. Global stats (`totalTokensCreated`, per-type counters, `totalBuys/Sells/Migrations`) and current factory settings (creation fee, default params, owner). |
| `Token` | One per launched token. ERC-20 metadata, bonding-curve params, live `raisedBNB`, trade counts, migration state, and `lastKnownPrice` (current spot price in wei, updated after every trade). |
| `Trade` | One per `TokenBought` or `TokenSold` event. `type` is `BUY` or `SELL`. |
| `Migration` | One per `TokenMigrated` event. Stores the PancakeSwap pair address and liquidity amounts. |
| `VestingSchedule` | One per token × beneficiary. Tracks `amount`, `claimed`, `voided`, `burnedOnVoid`, and `voidedTxHash`. |
| `VestingClaim` | One per `Claimed` event. Linked to its `VestingSchedule`. |
| `TimelockAction` | One per timelocked governance action. Stores `queuedTxHash`, `executedTxHash`, and `cancelledTxHash` for full provenance. Re-queuing resets `executed`/`cancelled`. |
| `TokenSnapshot` | One per (token, block). Per-block OHLCV: `openPrice`, `highPrice`, `lowPrice`, `closePrice` (actual spot price in wei), plus `openRaisedBNB`, `closeRaisedBNB`, `volumeBNB`, `buyCount`, `sellCount`. |
| `TokenPeriodStats` | Time-bucketed stats per (token, period, bucket). Five windows: `5m`, `45m`, `1h`, `1d`, `7d`. Includes the same OHLCV price fields as `TokenSnapshot`. |
| `Holder` | One per (token, address). ERC-20 balance tracked via `Transfer` events while the token is in the bonding-curve phase (`migrated = false`). |

### OneCoinLocker entities

| Entity | Description |
|---|---|
| `Locker` | Singleton per deployed contract. Tracks `totalLocks`, `activeLocks`, and current `fee`. |
| `Lock` | One per `LockCreated` event. Tracks owner, token, amount, lock type (`Cliff` / `Linear`), timeouts, and withdrawal progress. |
| `LockWithdrawal` | One per `Withdrawn` event. |
| `LockTransfer` | One per `LockTransferred` event. |

### Spark entities

| Entity | Description |
|---|---|
| `SparkLaunchedToken` | One per `TokenLaunched` event. Ownerless ERC-20 with a full-range Uniswap V3 LP permanently locked in SparkLocker. Stores ERC-20 metadata, pool/LP-NFT info, and cumulative fee totals split across creator / platform / charity for both token0 and token1. |
| `SparkFeeClaim` | One per `FeesClaimed` event. Records the per-claim breakdown for all six fee buckets plus the `feeWallet` that triggered the claim. |
| `SparkLockerState` | Singleton per deployed SparkLocker contract. Initialized on the first event via contract calls; updated by governance events. Stores owner, wallets, and fee basis-points (default: creator 70 % / platform 25 % / charity 5 %). |
| `SparkDex` | One per `DexAdded` event (keyed by V3 factory address). Stores `positionManager`, `router`, and enabled state. |
| `SparkQuoteToken` | One per `QuoteTokenAdded` event. Stores `launchFee`, `decimals`, and enabled state. |

### Peripheral entities *(not in active manifests)*

| Entity | Description |
|---|---|
| `BuyBack` | Singleton per contract. Tracks `router`, `buyToken`, `cooldown`, cumulative BNB spent, and `lastBuyAt`. |
| `BuyBackEvent` | One per `BoughtBack` event. |
| `Collector` | Singleton per contract. Tracks six recipient addresses and cumulative BNB dispersed. |
| `DisperseEvent` | One per `Dispersed` event. |
| `VaultContract` | Singleton per contract. Tracks proposal count. |
| `VaultProposal` | One per `Proposed` event. Tracks `confirmCount`, `executed`, `cancelled`, `executedTxHash`, and `cancelledTxHash`. |

---

## OHLCV price implementation

`TokenSnapshot` and `TokenPeriodStats` expose four spot-price fields in addition to the raw `raisedBNB` pool values:

| Field | Description |
|---|---|
| `openPrice` | Spot price at the start of the block/bucket — the `lastKnownPrice` persisted from the previous trade |
| `highPrice` | Running maximum spot price seen within the block/bucket |
| `lowPrice` | Running minimum spot price seen within the block/bucket |
| `closePrice` | Spot price after the last trade, fetched from `BondingCurve.getSpotPrice(token)` |

Prices are in wei, scaled ×1e18:

```
spotPrice = (virtualBNB + raisedBNB) × 1e18 / bcTokensPool
```

`Token.lastKnownPrice` is seeded at `TokenRegistered` time and updated after every buy/sell so consecutive blocks always have a valid open price even without an inter-block snapshot.

---

## Token type detection

The factory exposes three creation functions (`createToken`, `createTT`, `createRFL`) that all emit the same `TokenCreated` event. The subgraph recovers the token type by reading the first 4 bytes of `event.transaction.input` (the ABI function selector):

| Selector | Function | `tokenType` |
|---|---|---|
| `0x6b948c92` | `createToken` | `STANDARD` |
| `0x917a6333` | `createTT` | `TAX` |
| `0x13b0f58a` | `createRFL` | `REFLECTION` |

Tokens created via a proxy or multicall that wraps the factory will produce `UNKNOWN`.

---

## Query examples

See [QueryExamples.md](QueryExamples.md) for the full query reference covering all entities, filter patterns, and combined queries.

---

## Core contract reference

See [OneMEMELaunchpad-Core](https://github.com/timedbase/OneMEMELaunchpad-Core) for full contract documentation, deployment instructions, and bonding-curve mechanics.

---

## License

[MIT](LICENSE)
