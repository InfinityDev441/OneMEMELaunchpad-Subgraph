# Query Examples

GraphQL query reference for the OneMEME Launchpad subgraph.  
All fields are verified against [`schema.graphql`](schema.graphql).  
Replace placeholder addresses (`0xTOKEN_ADDRESS`, etc.) with real checksummed hex.

BNB amounts are stored in wei — divide by `1e18` to get BNB.

---

## Table of contents

1. [Factory](#factory)
2. [Tokens](#tokens)
3. [Trades](#trades)
4. [Migrations](#migrations)
5. [Vesting](#vesting)
6. [Governance — Timelock actions](#governance--timelock-actions)
7. [Peripheral — BuyBack](#peripheral--buyback)
8. [Peripheral — Collector](#peripheral--collector)
9. [Peripheral — Vault](#peripheral--vault)
10. [Token Snapshots (OHLCV)](#token-snapshots-ohlcv)
11. [Holders](#holders)
12. [Trending Tokens](#trending-tokens)
13. [OneCoinLocker](#onecoinlocker)
14. [Spark](#spark)
15. [Analytics & combined queries](#analytics--combined-queries)
16. [Pagination](#pagination)

---

## Factory

The `Factory` entity is a singleton. Query it as a list and take the first result, or by its fixed `id`.

### Global stats

```graphql
{
  factories {
    totalTokensCreated
    totalStandardTokens
    totalTaxTokens
    totalReflectionTokens
    totalUnknownTokens
    totalBuys
    totalSells
    totalMigrations
    creationFee
    defaultVirtualBNB
    defaultMigrationTarget
    owner
  }
}
```

**Example response:**

```json
{
  "data": {
    "factories": [
      {
        "totalTokensCreated": "142",
        "totalStandardTokens": "89",
        "totalTaxTokens": "31",
        "totalReflectionTokens": "18",
        "totalUnknownTokens": "4",
        "totalBuys": "9871",
        "totalSells": "3204",
        "totalMigrations": "11",
        "creationFee": "100000000000000000",
        "defaultVirtualBNB": "1000000000000000000",
        "defaultMigrationTarget": "20000000000000000000",
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4"
      }
    ]
  }
}
```

### Factory with pending governance actions

```graphql
{
  factories {
    totalTokensCreated
    totalBuys
    totalSells
    totalMigrations
    creationFee
    defaultVirtualBNB
    defaultMigrationTarget
    timelockActions(where: { executed: false, cancelled: false }) {
      id
      executeAfter
      queuedAtTimestamp
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "factories": [
      {
        "totalTokensCreated": "142",
        "totalBuys": "9871",
        "totalSells": "3204",
        "totalMigrations": "11",
        "creationFee": "100000000000000000",
        "defaultVirtualBNB": "1000000000000000000",
        "defaultMigrationTarget": "20000000000000000000",
        "timelockActions": [
          {
            "id": "0x1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d",
            "executeAfter": "1700172800",
            "queuedAtTimestamp": "1700086400"
          }
        ]
      }
    ]
  }
}
```

---

## Tokens

### All tokens — newest first

```graphql
{
  tokens(orderBy: createdAtTimestamp, orderDirection: desc, first: 20) {
    id
    name
    symbol
    tokenType
    creator
    totalSupply
    raisedBNB
    migrationTarget
    migrated
    buysCount
    sellsCount
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "tokenType": "STANDARD",
        "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "totalSupply": "1000000000000000000000000000",
        "raisedBNB": "5200000000000000000",
        "migrationTarget": "20000000000000000000",
        "migrated": false,
        "buysCount": "84",
        "sellsCount": "21",
        "createdAtTimestamp": "1700086400"
      },
      {
        "id": "0x9988776655443322998877665544332299887766",
        "name": "DogeKing",
        "symbol": "DGKG",
        "tokenType": "TAX",
        "creator": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "totalSupply": "1000000000000000000000000000",
        "raisedBNB": "1800000000000000000",
        "migrationTarget": "20000000000000000000",
        "migrated": false,
        "buysCount": "33",
        "sellsCount": "7",
        "createdAtTimestamp": "1700000000"
      }
    ]
  }
}
```

### Single token — full detail

```graphql
{
  token(id: "0xTOKEN_ADDRESS") {
    id
    name
    symbol
    tokenType
    creator
    totalSupply
    virtualBNB
    migrationTarget
    antibotEnabled
    tradingBlock
    raisedBNB
    migrated
    pair
    migrationBNB
    migrationLiquidityTokens
    migratedAtTimestamp
    migratedAtBlockNumber
    buysCount
    sellsCount
    totalVolumeBNBBuy
    totalVolumeBNBSell
    createdAtTimestamp
    createdAtBlockNumber
    txHash
    metaUri
    description
    image
    website
    twitter
    telegram
  }
}
```

**Example response:**

```json
{
  "data": {
    "token": {
      "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      "name": "PepeMoon",
      "symbol": "PPEM",
      "tokenType": "STANDARD",
      "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
      "totalSupply": "1000000000000000000000000000",
      "virtualBNB": "1000000000000000000",
      "migrationTarget": "20000000000000000000",
      "antibotEnabled": true,
      "tradingBlock": "38120000",
      "raisedBNB": "5200000000000000000",
      "migrated": false,
      "pair": null,
      "migrationBNB": null,
      "migrationLiquidityTokens": null,
      "migratedAtTimestamp": null,
      "migratedAtBlockNumber": null,
      "buysCount": "84",
      "sellsCount": "21",
      "totalVolumeBNBBuy": "8400000000000000000",
      "totalVolumeBNBSell": "1050000000000000000",
      "createdAtTimestamp": "1700086400",
      "createdAtBlockNumber": "38120000",
      "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
      "metaUri": "ipfs://QmPepeMoonMetaXYZ123456789abcdef",
      "description": "The moon-bound Pepe token on OneMEME.",
      "image": "QmPepeMoonImageXYZ123456789abcdef",
      "website": "https://pepemoon.io",
      "twitter": "https://twitter.com/pepemoon",
      "telegram": "https://t.me/pepemoon"
    }
  }
}
```

### Token metadata (IPFS-resolved fields)

```graphql
{
  token(id: "0xTOKEN_ADDRESS") {
    id
    name
    symbol
    metaUri
    description
    image
    website
    twitter
    telegram
  }
}
```

**Example response:**

```json
{
  "data": {
    "token": {
      "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      "name": "PepeMoon",
      "symbol": "PPEM",
      "metaUri": "ipfs://QmPepeMoonMetaXYZ123456789abcdef",
      "description": "The moon-bound Pepe token on OneMEME.",
      "image": "QmPepeMoonImageXYZ123456789abcdef",
      "website": "https://pepemoon.io",
      "twitter": "https://twitter.com/pepemoon",
      "telegram": "https://t.me/pepemoon"
    }
  }
}
```

### Tokens with a website link (metadata resolved)

```graphql
{
  tokens(
    where: { website_not: null }
    orderBy: createdAtTimestamp
    orderDirection: desc
    first: 50
  ) {
    id
    name
    symbol
    metaUri
    description
    image
    website
    twitter
    telegram
    raisedBNB
    migrated
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "metaUri": "ipfs://QmPepeMoonMetaXYZ123456789abcdef",
        "description": "The moon-bound Pepe token on OneMEME.",
        "image": "QmPepeMoonImageXYZ123456789abcdef",
        "website": "https://pepemoon.io",
        "twitter": "https://twitter.com/pepemoon",
        "telegram": "https://t.me/pepemoon",
        "raisedBNB": "5200000000000000000",
        "migrated": false
      }
    ]
  }
}
```

### Tokens by creator

```graphql
{
  tokens(
    where: { creator: "0xCREATOR_ADDRESS" }
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    id
    name
    symbol
    tokenType
    raisedBNB
    migrationTarget
    migrated
    pair
    buysCount
    sellsCount
    totalVolumeBNBBuy
    totalVolumeBNBSell
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "tokenType": "STANDARD",
        "raisedBNB": "5200000000000000000",
        "migrationTarget": "20000000000000000000",
        "migrated": false,
        "pair": null,
        "buysCount": "84",
        "sellsCount": "21",
        "totalVolumeBNBBuy": "8400000000000000000",
        "totalVolumeBNBSell": "1050000000000000000",
        "createdAtTimestamp": "1700086400"
      }
    ]
  }
}
```

### Tokens still on the bonding curve (not yet migrated)

```graphql
{
  tokens(where: { migrated: false }, orderBy: raisedBNB, orderDirection: desc) {
    id
    name
    symbol
    tokenType
    raisedBNB
    migrationTarget
    antibotEnabled
    tradingBlock
    buysCount
    sellsCount
    creator
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "tokenType": "STANDARD",
        "raisedBNB": "5200000000000000000",
        "migrationTarget": "20000000000000000000",
        "antibotEnabled": true,
        "tradingBlock": "38120000",
        "buysCount": "84",
        "sellsCount": "21",
        "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "createdAtTimestamp": "1700086400"
      },
      {
        "id": "0x9988776655443322998877665544332299887766",
        "name": "DogeKing",
        "symbol": "DGKG",
        "tokenType": "TAX",
        "raisedBNB": "1800000000000000000",
        "migrationTarget": "20000000000000000000",
        "antibotEnabled": false,
        "tradingBlock": "0",
        "buysCount": "33",
        "sellsCount": "7",
        "creator": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "createdAtTimestamp": "1700000000"
      }
    ]
  }
}
```

### Tokens that have migrated to DEX

```graphql
{
  tokens(where: { migrated: true }, orderBy: migratedAtTimestamp, orderDirection: desc) {
    id
    name
    symbol
    tokenType
    pair
    migrationBNB
    migrationLiquidityTokens
    migratedAtTimestamp
    totalVolumeBNBBuy
    totalVolumeBNBSell
    buysCount
    sellsCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0x1122334455667788112233445566778811223344",
        "name": "ShibaRocket",
        "symbol": "SHRKT",
        "tokenType": "STANDARD",
        "pair": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
        "migrationBNB": "20000000000000000000",
        "migrationLiquidityTokens": "500000000000000000000000000",
        "migratedAtTimestamp": "1699950000",
        "totalVolumeBNBBuy": "32000000000000000000",
        "totalVolumeBNBSell": "8500000000000000000",
        "buysCount": "312",
        "sellsCount": "97"
      }
    ]
  }
}
```

### Tokens by type

```graphql
# tokenType: STANDARD | TAX | REFLECTION | UNKNOWN
{
  tokens(
    where: { tokenType: "TAX" }
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    id
    name
    symbol
    raisedBNB
    migrated
    creator
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0x9988776655443322998877665544332299887766",
        "name": "DogeKing",
        "symbol": "DGKG",
        "raisedBNB": "1800000000000000000",
        "migrated": false,
        "creator": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "createdAtTimestamp": "1700000000"
      }
    ]
  }
}
```

### Tokens near migration threshold (≥ 80 % filled)

Returns tokens whose `raisedBNB` is at least 80 % of `migrationTarget`.  
Since The Graph cannot compute ratios in a filter, the pattern is to filter by a known minimum `raisedBNB` value and sort descending — or use a client-side ratio check on results.

```graphql
# Fetch active tokens sorted by raisedBNB desc; filter client-side for raisedBNB / migrationTarget >= 0.8
{
  tokens(
    where: { migrated: false }
    orderBy: raisedBNB
    orderDirection: desc
    first: 50
  ) {
    id
    name
    symbol
    raisedBNB
    migrationTarget
    buysCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "raisedBNB": "17500000000000000000",
        "migrationTarget": "20000000000000000000",
        "buysCount": "210"
      },
      {
        "id": "0x9988776655443322998877665544332299887766",
        "name": "DogeKing",
        "symbol": "DGKG",
        "raisedBNB": "16200000000000000000",
        "migrationTarget": "20000000000000000000",
        "buysCount": "183"
      }
    ]
  }
}
```

### Fresh launches — tokens with zero trades yet

```graphql
{
  tokens(where: { buysCount: 0, migrated: false }, orderBy: createdAtTimestamp, orderDirection: desc) {
    id
    name
    symbol
    tokenType
    creator
    createdAtTimestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0x5566778899aabbcc5566778899aabbcc55667788",
        "name": "MoonFrog",
        "symbol": "MFRG",
        "tokenType": "STANDARD",
        "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "createdAtTimestamp": "1700090000",
        "txHash": "0xdead1234dead1234dead1234dead1234dead1234dead1234dead1234dead1234"
      }
    ]
  }
}
```

### Tokens with antibot enabled

```graphql
{
  tokens(where: { antibotEnabled: true }, orderBy: createdAtTimestamp, orderDirection: desc) {
    id
    name
    symbol
    tradingBlock
    createdAtBlockNumber
    raisedBNB
    migrated
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "tradingBlock": "38120005",
        "createdAtBlockNumber": "38120000",
        "raisedBNB": "5200000000000000000",
        "migrated": false
      }
    ]
  }
}
```

### Tokens created within a time range

```graphql
# Unix timestamps: 1700000000 to 1710000000
{
  tokens(
    where: {
      createdAtTimestamp_gte: "1700000000"
      createdAtTimestamp_lte: "1710000000"
    }
    orderBy: createdAtTimestamp
    orderDirection: asc
  ) {
    id
    name
    symbol
    tokenType
    creator
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0x9988776655443322998877665544332299887766",
        "name": "DogeKing",
        "symbol": "DGKG",
        "tokenType": "TAX",
        "creator": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "createdAtTimestamp": "1700000000"
      },
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "tokenType": "STANDARD",
        "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "createdAtTimestamp": "1700086400"
      }
    ]
  }
}
```

---

## Trades

### Recent trades across all tokens

```graphql
{
  trades(orderBy: timestamp, orderDirection: desc, first: 50) {
    id
    token { id name symbol }
    trader
    type
    bnbAmount
    tokenAmount
    tokensToDead
    raisedBNBAfter
    timestamp
    blockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "id": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd12340000",
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM"
        },
        "trader": "0xccddee001122ccddee001122ccddee001122ccdd",
        "type": "BUY",
        "bnbAmount": "200000000000000000",
        "tokenAmount": "4850000000000000000000000",
        "tokensToDead": "0",
        "raisedBNBAfter": "5200000000000000000",
        "timestamp": "1700086500",
        "blockNumber": "38120050",
        "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"
      },
      {
        "id": "0xbeef5678beef5678beef5678beef5678beef5678beef5678beef5678beef56780001",
        "token": {
          "id": "0x9988776655443322998877665544332299887766",
          "name": "DogeKing",
          "symbol": "DGKG"
        },
        "trader": "0x1234567890abcdef1234567890abcdef12345678",
        "type": "SELL",
        "bnbAmount": "150000000000000000",
        "tokenAmount": "3600000000000000000000000",
        "tokensToDead": "0",
        "raisedBNBAfter": "1800000000000000000",
        "timestamp": "1700086450",
        "blockNumber": "38120040",
        "txHash": "0xbeef5678beef5678beef5678beef5678beef5678beef5678beef5678beef5678"
      }
    ]
  }
}
```

### Trades on a specific token

```graphql
{
  trades(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: timestamp
    orderDirection: desc
    first: 100
  ) {
    type
    trader
    bnbAmount
    tokenAmount
    tokensToDead
    raisedBNBAfter
    timestamp
    blockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "type": "BUY",
        "trader": "0xccddee001122ccddee001122ccddee001122ccdd",
        "bnbAmount": "200000000000000000",
        "tokenAmount": "4850000000000000000000000",
        "tokensToDead": "0",
        "raisedBNBAfter": "5200000000000000000",
        "timestamp": "1700086500",
        "blockNumber": "38120050",
        "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"
      }
    ]
  }
}
```

### All trades by a specific wallet

```graphql
{
  trades(
    where: { trader: "0xTRADER_ADDRESS" }
    orderBy: timestamp
    orderDirection: desc
  ) {
    type
    token { id name symbol tokenType }
    bnbAmount
    tokenAmount
    tokensToDead
    raisedBNBAfter
    timestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "type": "BUY",
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM",
          "tokenType": "STANDARD"
        },
        "bnbAmount": "500000000000000000",
        "tokenAmount": "12000000000000000000000000",
        "tokensToDead": "0",
        "raisedBNBAfter": "5200000000000000000",
        "timestamp": "1700086500",
        "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"
      }
    ]
  }
}
```

### Buys only — sorted by BNB spent (largest first)

```graphql
{
  trades(
    where: { type: "BUY" }
    orderBy: bnbAmount
    orderDirection: desc
    first: 20
  ) {
    token { id name symbol }
    trader
    bnbAmount
    tokenAmount
    tokensToDead
    raisedBNBAfter
    timestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM"
        },
        "trader": "0xccddee001122ccddee001122ccddee001122ccdd",
        "bnbAmount": "2000000000000000000",
        "tokenAmount": "47000000000000000000000000",
        "tokensToDead": "0",
        "raisedBNBAfter": "12000000000000000000",
        "timestamp": "1700083200",
        "txHash": "0xface1234face1234face1234face1234face1234face1234face1234face1234"
      }
    ]
  }
}
```

### Sells only — sorted by BNB received (largest first)

```graphql
{
  trades(
    where: { type: "SELL" }
    orderBy: bnbAmount
    orderDirection: desc
    first: 20
  ) {
    token { id name symbol }
    trader
    bnbAmount
    tokenAmount
    raisedBNBAfter
    timestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM"
        },
        "trader": "0x1234567890abcdef1234567890abcdef12345678",
        "bnbAmount": "800000000000000000",
        "tokenAmount": "19000000000000000000000000",
        "raisedBNBAfter": "4400000000000000000",
        "timestamp": "1700085000",
        "txHash": "0xbeef5678beef5678beef5678beef5678beef5678beef5678beef5678beef5678"
      }
    ]
  }
}
```

### Large trades — whale filter (buys > 0.5 BNB)

`bnbAmount` is stored in wei (1 BNB = 1e18).

```graphql
{
  trades(
    where: { type: "BUY", bnbAmount_gt: "500000000000000000" }
    orderBy: bnbAmount
    orderDirection: desc
  ) {
    token { id name symbol }
    trader
    bnbAmount
    tokenAmount
    timestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM"
        },
        "trader": "0xccddee001122ccddee001122ccddee001122ccdd",
        "bnbAmount": "2000000000000000000",
        "tokenAmount": "47000000000000000000000000",
        "timestamp": "1700083200",
        "txHash": "0xface1234face1234face1234face1234face1234face1234face1234face1234"
      }
    ]
  }
}
```

### Trades with antibot penalty applied (tokensToDead > 0)

```graphql
{
  trades(
    where: { tokensToDead_gt: "0" }
    orderBy: timestamp
    orderDirection: desc
  ) {
    token { id name symbol }
    trader
    tokenAmount
    tokensToDead
    bnbAmount
    timestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM"
        },
        "trader": "0x9999888877776666999988887777666699998888",
        "tokenAmount": "10000000000000000000000000",
        "tokensToDead": "1000000000000000000000000",
        "bnbAmount": "400000000000000000",
        "timestamp": "1700120010",
        "txHash": "0x1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd"
      }
    ]
  }
}
```

### Trades within a time range

```graphql
{
  trades(
    where: {
      timestamp_gte: "1700000000"
      timestamp_lte: "1710000000"
    }
    orderBy: timestamp
    orderDirection: asc
  ) {
    type
    token { id name symbol }
    trader
    bnbAmount
    tokenAmount
    timestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "type": "BUY",
        "token": {
          "id": "0x9988776655443322998877665544332299887766",
          "name": "DogeKing",
          "symbol": "DGKG"
        },
        "trader": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "bnbAmount": "100000000000000000",
        "tokenAmount": "2400000000000000000000000",
        "timestamp": "1700000100"
      }
    ]
  }
}
```

---

## Migrations

### All migrations — newest first

```graphql
{
  migrations(orderBy: timestamp, orderDirection: desc) {
    id
    token { id name symbol tokenType creator }
    pair
    liquidityBNB
    liquidityTokens
    timestamp
    blockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "migrations": [
      {
        "id": "0xmigr1234migr1234migr1234migr1234migr1234migr1234migr1234migr12340000",
        "token": {
          "id": "0x1122334455667788112233445566778811223344",
          "name": "ShibaRocket",
          "symbol": "SHRKT",
          "tokenType": "STANDARD",
          "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4"
        },
        "pair": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
        "liquidityBNB": "20000000000000000000",
        "liquidityTokens": "500000000000000000000000000",
        "timestamp": "1699950000",
        "blockNumber": "38100000",
        "txHash": "0xdead5678dead5678dead5678dead5678dead5678dead5678dead5678dead5678"
      }
    ]
  }
}
```

### Migration for a specific token

```graphql
{
  migrations(where: { token: "0xTOKEN_ADDRESS" }) {
    pair
    liquidityBNB
    liquidityTokens
    timestamp
    blockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "migrations": [
      {
        "pair": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
        "liquidityBNB": "20000000000000000000",
        "liquidityTokens": "500000000000000000000000000",
        "timestamp": "1699950000",
        "blockNumber": "38100000",
        "txHash": "0xdead5678dead5678dead5678dead5678dead5678dead5678dead5678dead5678"
      }
    ]
  }
}
```

### Migrations sorted by liquidity BNB (largest first)

```graphql
{
  migrations(orderBy: liquidityBNB, orderDirection: desc, first: 20) {
    token { id name symbol tokenType }
    pair
    liquidityBNB
    liquidityTokens
    timestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "migrations": [
      {
        "token": {
          "id": "0x1122334455667788112233445566778811223344",
          "name": "ShibaRocket",
          "symbol": "SHRKT",
          "tokenType": "STANDARD"
        },
        "pair": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
        "liquidityBNB": "20000000000000000000",
        "liquidityTokens": "500000000000000000000000000",
        "timestamp": "1699950000"
      }
    ]
  }
}
```

---

## Vesting

### All active vesting schedules (not voided)

```graphql
{
  vestingSchedules(where: { voided: false }) {
    id
    token { id name symbol }
    beneficiary
    amount
    claimed
    createdAtTimestamp
    createdAtBlockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "vestingSchedules": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2f1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM"
        },
        "beneficiary": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "amount": "50000000000000000000000000",
        "claimed": "10000000000000000000000000",
        "createdAtTimestamp": "1700086400",
        "createdAtBlockNumber": "38120000",
        "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"
      }
    ]
  }
}
```

### Schedules for a specific beneficiary

```graphql
{
  vestingSchedules(where: { beneficiary: "0xBENEFICIARY_ADDRESS" }) {
    token { id name symbol tokenType }
    amount
    claimed
    voided
    burnedOnVoid
    createdAtTimestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "vestingSchedules": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM",
          "tokenType": "STANDARD"
        },
        "amount": "50000000000000000000000000",
        "claimed": "10000000000000000000000000",
        "voided": false,
        "burnedOnVoid": null,
        "createdAtTimestamp": "1700086400",
        "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"
      }
    ]
  }
}
```

### Schedules for a specific token

```graphql
{
  vestingSchedules(where: { token: "0xTOKEN_ADDRESS" }) {
    beneficiary
    amount
    claimed
    voided
    burnedOnVoid
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "vestingSchedules": [
      {
        "beneficiary": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "amount": "50000000000000000000000000",
        "claimed": "10000000000000000000000000",
        "voided": false,
        "burnedOnVoid": null,
        "createdAtTimestamp": "1700086400"
      }
    ]
  }
}
```

### Claim history for a beneficiary

```graphql
{
  vestingClaims(
    where: { schedule_: { beneficiary: "0xBENEFICIARY_ADDRESS" } }
    orderBy: timestamp
    orderDirection: desc
  ) {
    schedule { token { id name symbol } amount claimed }
    amount
    timestamp
    blockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "vestingClaims": [
      {
        "schedule": {
          "token": {
            "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
            "name": "PepeMoon",
            "symbol": "PPEM"
          },
          "amount": "50000000000000000000000000",
          "claimed": "10000000000000000000000000"
        },
        "amount": "10000000000000000000000000",
        "timestamp": "1700200000",
        "blockNumber": "38160000",
        "txHash": "0xclaim123claim123claim123claim123claim123claim123claim123claim123"
      }
    ]
  }
}
```

### All claims on a specific token

```graphql
{
  vestingClaims(
    where: { schedule_: { token: "0xTOKEN_ADDRESS" } }
    orderBy: timestamp
    orderDirection: desc
  ) {
    schedule { beneficiary amount claimed }
    amount
    timestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "vestingClaims": [
      {
        "schedule": {
          "beneficiary": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
          "amount": "50000000000000000000000000",
          "claimed": "10000000000000000000000000"
        },
        "amount": "10000000000000000000000000",
        "timestamp": "1700200000",
        "txHash": "0xclaim123claim123claim123claim123claim123claim123claim123claim123"
      }
    ]
  }
}
```

### Voided schedules

```graphql
{
  vestingSchedules(where: { voided: true }) {
    token { id name symbol }
    beneficiary
    amount
    claimed
    burnedOnVoid
    voidedTxHash
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "vestingSchedules": [
      {
        "token": {
          "id": "0x9988776655443322998877665544332299887766",
          "name": "DogeKing",
          "symbol": "DGKG"
        },
        "beneficiary": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "amount": "30000000000000000000000000",
        "claimed": "5000000000000000000000000",
        "burnedOnVoid": "25000000000000000000000000",
        "voidedTxHash": "0xvoid1234void1234void1234void1234void1234void1234void1234void1234",
        "createdAtTimestamp": "1700000000"
      }
    ]
  }
}
```

### Schedules with unclaimed balance (not voided, claimed < amount)

```graphql
# Fetches non-voided schedules where something has been claimed but not fully vested yet.
# Filter claimed_lt cannot express "claimed < amount" dynamically — fetch all and compute client-side.
{
  vestingSchedules(
    where: { voided: false }
    orderBy: amount
    orderDirection: desc
  ) {
    token { id name symbol }
    beneficiary
    amount
    claimed
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "vestingSchedules": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM"
        },
        "beneficiary": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "amount": "50000000000000000000000000",
        "claimed": "10000000000000000000000000",
        "createdAtTimestamp": "1700086400"
      }
    ]
  }
}
```

---

## Governance — Timelock actions

### Pending actions (queued, not yet executed or cancelled)

```graphql
{
  timelockActions(
    where: { executed: false, cancelled: false }
    orderBy: executeAfter
    orderDirection: asc
  ) {
    id
    executeAfter
    queuedAtTimestamp
    queuedAtBlockNumber
    queuedTxHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "timelockActions": [
      {
        "id": "0x1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d",
        "executeAfter": "1700172800",
        "queuedAtTimestamp": "1700086400",
        "queuedAtBlockNumber": "38120000",
        "queuedTxHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"
      }
    ]
  }
}
```

### Full timelock history — newest first

```graphql
{
  timelockActions(orderBy: queuedAtTimestamp, orderDirection: desc) {
    id
    executed
    cancelled
    executeAfter
    queuedAtTimestamp
    queuedAtBlockNumber
    queuedTxHash
    executedTxHash
    cancelledTxHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "timelockActions": [
      {
        "id": "0x1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d",
        "executed": true,
        "cancelled": false,
        "executeAfter": "1700172800",
        "queuedAtTimestamp": "1700086400",
        "queuedAtBlockNumber": "38120000",
        "queuedTxHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
        "executedTxHash": "0xexec5678exec5678exec5678exec5678exec5678exec5678exec5678exec5678",
        "cancelledTxHash": null
      },
      {
        "id": "0x5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b",
        "executed": false,
        "cancelled": true,
        "executeAfter": "1699900000",
        "queuedAtTimestamp": "1699800000",
        "queuedAtBlockNumber": "38000000",
        "queuedTxHash": "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
        "executedTxHash": null,
        "cancelledTxHash": "0xcanc9999canc9999canc9999canc9999canc9999canc9999canc9999canc9999"
      }
    ]
  }
}
```

### Executed actions only

```graphql
{
  timelockActions(where: { executed: true }, orderBy: queuedAtTimestamp, orderDirection: desc) {
    id
    executeAfter
    queuedAtTimestamp
    queuedTxHash
    executedTxHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "timelockActions": [
      {
        "id": "0x1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d",
        "executeAfter": "1700172800",
        "queuedAtTimestamp": "1700086400",
        "queuedTxHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
        "executedTxHash": "0xexec5678exec5678exec5678exec5678exec5678exec5678exec5678exec5678"
      }
    ]
  }
}
```

### Cancelled actions only

```graphql
{
  timelockActions(where: { cancelled: true }, orderBy: queuedAtTimestamp, orderDirection: desc) {
    id
    executeAfter
    queuedAtTimestamp
    queuedTxHash
    cancelledTxHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "timelockActions": [
      {
        "id": "0x5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b5e6f7a8b",
        "executeAfter": "1699900000",
        "queuedAtTimestamp": "1699800000",
        "queuedTxHash": "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
        "cancelledTxHash": "0xcanc9999canc9999canc9999canc9999canc9999canc9999canc9999canc9999"
      }
    ]
  }
}
```

---

## Peripheral — BuyBack

> Requires `subgraph.full.yaml` deployment.

### BuyBack contract state

```graphql
{
  buyBacks {
    id
    owner
    router
    buyToken
    cooldown
    lastBuyAt
    totalBNBSpent
    buybackCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "buyBacks": [
      {
        "id": "0xbbbb1111bbbb1111bbbb1111bbbb1111bbbb1111",
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "router": "0x10ed43c718714eb63d5aa57b78b54704e256024e",
        "buyToken": "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
        "cooldown": "3600",
        "lastBuyAt": "1700085000",
        "totalBNBSpent": "4500000000000000000",
        "buybackCount": "9"
      }
    ]
  }
}
```

### BuyBack state with full event history

```graphql
{
  buyBacks {
    id
    owner
    router
    buyToken
    cooldown
    lastBuyAt
    totalBNBSpent
    buybackCount
    events(orderBy: timestamp, orderDirection: desc, first: 20) {
      bnbSpent
      balanceBefore
      timestamp
      txHash
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "buyBacks": [
      {
        "id": "0xbbbb1111bbbb1111bbbb1111bbbb1111bbbb1111",
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "router": "0x10ed43c718714eb63d5aa57b78b54704e256024e",
        "buyToken": "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
        "cooldown": "3600",
        "lastBuyAt": "1700085000",
        "totalBNBSpent": "4500000000000000000",
        "buybackCount": "9",
        "events": [
          {
            "bnbSpent": "500000000000000000",
            "balanceBefore": "2000000000000000000",
            "timestamp": "1700085000",
            "txHash": "0xbuyb1234buyb1234buyb1234buyb1234buyb1234buyb1234buyb1234buyb1234"
          },
          {
            "bnbSpent": "500000000000000000",
            "balanceBefore": "2500000000000000000",
            "timestamp": "1700081400",
            "txHash": "0xbuyb5678buyb5678buyb5678buyb5678buyb5678buyb5678buyb5678buyb5678"
          }
        ]
      }
    ]
  }
}
```

### Recent buyback events

```graphql
{
  buyBackEvents(orderBy: timestamp, orderDirection: desc, first: 20) {
    buyback { id buyToken }
    bnbSpent
    balanceBefore
    timestamp
    blockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "buyBackEvents": [
      {
        "buyback": {
          "id": "0xbbbb1111bbbb1111bbbb1111bbbb1111bbbb1111",
          "buyToken": "0x1ce0c2827e2ef14d5c4f29a091d735a204794041"
        },
        "bnbSpent": "500000000000000000",
        "balanceBefore": "2000000000000000000",
        "timestamp": "1700085000",
        "blockNumber": "38119000",
        "txHash": "0xbuyb1234buyb1234buyb1234buyb1234buyb1234buyb1234buyb1234buyb1234"
      }
    ]
  }
}
```

### Largest buybacks by BNB spent

```graphql
{
  buyBackEvents(orderBy: bnbSpent, orderDirection: desc, first: 10) {
    buyback { id buyToken }
    bnbSpent
    balanceBefore
    timestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "buyBackEvents": [
      {
        "buyback": {
          "id": "0xbbbb1111bbbb1111bbbb1111bbbb1111bbbb1111",
          "buyToken": "0x1ce0c2827e2ef14d5c4f29a091d735a204794041"
        },
        "bnbSpent": "1000000000000000000",
        "balanceBefore": "5000000000000000000",
        "timestamp": "1699950000",
        "txHash": "0xbig1234big1234big1234big1234big1234big1234big1234big1234big1234"
      }
    ]
  }
}
```

---

## Peripheral — Collector

> Requires `subgraph.full.yaml` deployment.

### Collector state

```graphql
{
  collectors {
    id
    owner
    cr8
    mtn
    bb
    tw
    hk
    kjc
    totalDispersed
    disperseCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "collectors": [
      {
        "id": "0xcccc2222cccc2222cccc2222cccc2222cccc2222",
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "cr8": "0x1111111111111111111111111111111111111111",
        "mtn": "0x2222222222222222222222222222222222222222",
        "bb": "0xbbbb1111bbbb1111bbbb1111bbbb1111bbbb1111",
        "tw": "0x3333333333333333333333333333333333333333",
        "hk": "0x4444444444444444444444444444444444444444",
        "kjc": "0x5555555555555555555555555555555555555555",
        "totalDispersed": "12000000000000000000",
        "disperseCount": "24"
      }
    ]
  }
}
```

### Collector state with disperse history

```graphql
{
  collectors {
    id
    owner
    totalDispersed
    disperseCount
    disperses(orderBy: timestamp, orderDirection: desc, first: 20) {
      total
      timestamp
      txHash
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "collectors": [
      {
        "id": "0xcccc2222cccc2222cccc2222cccc2222cccc2222",
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "totalDispersed": "12000000000000000000",
        "disperseCount": "24",
        "disperses": [
          {
            "total": "500000000000000000",
            "timestamp": "1700085000",
            "txHash": "0xdisp1234disp1234disp1234disp1234disp1234disp1234disp1234disp1234"
          },
          {
            "total": "500000000000000000",
            "timestamp": "1700071200",
            "txHash": "0xdisp5678disp5678disp5678disp5678disp5678disp5678disp5678disp5678"
          }
        ]
      }
    ]
  }
}
```

### All disperse events — newest first

```graphql
{
  disperseEvents(orderBy: timestamp, orderDirection: desc) {
    collector { id }
    total
    timestamp
    blockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "disperseEvents": [
      {
        "collector": { "id": "0xcccc2222cccc2222cccc2222cccc2222cccc2222" },
        "total": "500000000000000000",
        "timestamp": "1700085000",
        "blockNumber": "38119000",
        "txHash": "0xdisp1234disp1234disp1234disp1234disp1234disp1234disp1234disp1234"
      }
    ]
  }
}
```

### Largest disperse events

```graphql
{
  disperseEvents(orderBy: total, orderDirection: desc, first: 10) {
    collector { id }
    total
    timestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "disperseEvents": [
      {
        "collector": { "id": "0xcccc2222cccc2222cccc2222cccc2222cccc2222" },
        "total": "1000000000000000000",
        "timestamp": "1699950000",
        "txHash": "0xbigd1234bigd1234bigd1234bigd1234bigd1234bigd1234bigd1234bigd1234"
      }
    ]
  }
}
```

---

## Peripheral — Vault

> Requires `subgraph.full.yaml` deployment.

### Vault state

```graphql
{
  vaultContracts {
    id
    proposalCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "vaultContracts": [
      {
        "id": "0xdddd3333dddd3333dddd3333dddd3333dddd3333",
        "proposalCount": "7"
      }
    ]
  }
}
```

### All proposals — newest first

```graphql
{
  vaultProposals(orderBy: createdAtTimestamp, orderDirection: desc) {
    id
    vault { id }
    proposalId
    to
    value
    data
    proposer
    confirmCount
    executed
    cancelled
    executedTxHash
    cancelledTxHash
    createdAtTimestamp
    createdAtBlockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "vaultProposals": [
      {
        "id": "0xdddd3333dddd3333dddd3333dddd3333dddd3333000000000000000000000000000000000000000000000000000000000000007",
        "vault": { "id": "0xdddd3333dddd3333dddd3333dddd3333dddd3333" },
        "proposalId": "7",
        "to": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "value": "1000000000000000000",
        "data": "0x",
        "proposer": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "confirmCount": 2,
        "executed": true,
        "cancelled": false,
        "executedTxHash": "0xexec5678exec5678exec5678exec5678exec5678exec5678exec5678exec5678",
        "cancelledTxHash": null,
        "createdAtTimestamp": "1700080000",
        "createdAtBlockNumber": "38117000",
        "txHash": "0xprop1234prop1234prop1234prop1234prop1234prop1234prop1234prop1234"
      }
    ]
  }
}
```

### Proposals awaiting execution (2-of-3 threshold met, not yet executed)

```graphql
{
  vaultProposals(
    where: { executed: false, cancelled: false, confirmCount_gte: 2 }
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    proposalId
    to
    value
    data
    proposer
    confirmCount
    createdAtTimestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "vaultProposals": [
      {
        "proposalId": "8",
        "to": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "value": "500000000000000000",
        "data": "0x",
        "proposer": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "confirmCount": 2,
        "createdAtTimestamp": "1700086400",
        "txHash": "0xprop5678prop5678prop5678prop5678prop5678prop5678prop5678prop5678"
      }
    ]
  }
}
```

### Proposals still collecting signatures (threshold not yet met)

```graphql
{
  vaultProposals(
    where: { executed: false, cancelled: false, confirmCount_lt: 2 }
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    proposalId
    to
    value
    proposer
    confirmCount
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "vaultProposals": [
      {
        "proposalId": "9",
        "to": "0x9988776655443322998877665544332299887766",
        "value": "0",
        "proposer": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "confirmCount": 1,
        "createdAtTimestamp": "1700090000"
      }
    ]
  }
}
```

### Executed proposals

```graphql
{
  vaultProposals(
    where: { executed: true }
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    proposalId
    to
    value
    data
    proposer
    createdAtTimestamp
    txHash
    executedTxHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "vaultProposals": [
      {
        "proposalId": "7",
        "to": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "value": "1000000000000000000",
        "data": "0x",
        "proposer": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "createdAtTimestamp": "1700080000",
        "txHash": "0xprop1234prop1234prop1234prop1234prop1234prop1234prop1234prop1234",
        "executedTxHash": "0xexec5678exec5678exec5678exec5678exec5678exec5678exec5678exec5678"
      }
    ]
  }
}
```

### Cancelled proposals

```graphql
{
  vaultProposals(
    where: { cancelled: true }
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    proposalId
    to
    value
    proposer
    createdAtTimestamp
    txHash
    cancelledTxHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "vaultProposals": [
      {
        "proposalId": "6",
        "to": "0x9988776655443322998877665544332299887766",
        "value": "0",
        "proposer": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "createdAtTimestamp": "1699900000",
        "txHash": "0xcanp1234canp1234canp1234canp1234canp1234canp1234canp1234canp1234",
        "cancelledTxHash": "0xcanc9999canc9999canc9999canc9999canc9999canc9999canc9999canc9999"
      }
    ]
  }
}
```

---

## Token Snapshots (OHLCV)

Per-block price/volume snapshots recorded each time a buy or sell occurs. One `TokenSnapshot` entity per (token, block) pair.

**Raw pool fields:** `openRaisedBNB` / `closeRaisedBNB` — the bonding-curve `raisedBNB` value before/after the first/last trade in the block.

**Spot price fields (wei, scaled ×1e18):** `openPrice`, `highPrice`, `lowPrice`, `closePrice` — derived from `BondingCurve.getSpotPrice(token)` using `(virtualBNB + raisedBNB) × 1e18 / bcTokensPool`. `openPrice` is the `lastKnownPrice` carried forward from the previous trade; `closePrice` is fetched post-trade.

### Recent snapshots for a token

```graphql
{
  tokenSnapshots(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: blockNumber
    orderDirection: desc
    first: 50
  ) {
    id
    blockNumber
    timestamp
    openPrice
    highPrice
    lowPrice
    closePrice
    openRaisedBNB
    closeRaisedBNB
    volumeBNB
    buyCount
    sellCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenSnapshots": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b200246f90",
        "blockNumber": "38120080",
        "timestamp": "1700086740",
        "openPrice": "1042000000000000",
        "highPrice": "1086000000000000",
        "lowPrice": "1042000000000000",
        "closePrice": "1086000000000000",
        "openRaisedBNB": "5000000000000000000",
        "closeRaisedBNB": "5200000000000000000",
        "volumeBNB": "200000000000000000",
        "buyCount": 1,
        "sellCount": 0
      },
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b200246f80",
        "blockNumber": "38120064",
        "timestamp": "1700086692",
        "openPrice": "1000000000000000",
        "highPrice": "1042000000000000",
        "lowPrice": "980000000000000",
        "closePrice": "1042000000000000",
        "openRaisedBNB": "4800000000000000000",
        "closeRaisedBNB": "5000000000000000000",
        "volumeBNB": "350000000000000000",
        "buyCount": 2,
        "sellCount": 1
      }
    ]
  }
}
```

### Snapshots in a block range

```graphql
{
  tokenSnapshots(
    where: {
      token: "0xTOKEN_ADDRESS"
      blockNumber_gte: "30000000"
      blockNumber_lte: "30001000"
    }
    orderBy: blockNumber
    orderDirection: asc
    first: 1000
  ) {
    blockNumber
    timestamp
    openRaisedBNB
    closeRaisedBNB
    volumeBNB
    buyCount
    sellCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenSnapshots": [
      {
        "blockNumber": "38120000",
        "timestamp": "1700086400",
        "openRaisedBNB": "1000000000000000000",
        "closeRaisedBNB": "1300000000000000000",
        "volumeBNB": "300000000000000000",
        "buyCount": 3,
        "sellCount": 0
      },
      {
        "blockNumber": "38120020",
        "timestamp": "1700086460",
        "openRaisedBNB": "1300000000000000000",
        "closeRaisedBNB": "1150000000000000000",
        "volumeBNB": "150000000000000000",
        "buyCount": 0,
        "sellCount": 1
      }
    ]
  }
}
```

### High-volume blocks — snapshots with most BNB traded

```graphql
{
  tokenSnapshots(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: volumeBNB
    orderDirection: desc
    first: 10
  ) {
    blockNumber
    timestamp
    volumeBNB
    buyCount
    sellCount
    openRaisedBNB
    closeRaisedBNB
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenSnapshots": [
      {
        "blockNumber": "38120030",
        "timestamp": "1700086490",
        "volumeBNB": "2000000000000000000",
        "buyCount": 4,
        "sellCount": 1,
        "openRaisedBNB": "3000000000000000000",
        "closeRaisedBNB": "4800000000000000000"
      }
    ]
  }
}
```

### Latest snapshot (current price proxy)

```graphql
{
  tokenSnapshots(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: blockNumber
    orderDirection: desc
    first: 1
  ) {
    blockNumber
    timestamp
    closePrice
    closeRaisedBNB
    volumeBNB
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenSnapshots": [
      {
        "blockNumber": "38120080",
        "timestamp": "1700086740",
        "closePrice": "1086000000000000",
        "closeRaisedBNB": "5200000000000000000",
        "volumeBNB": "200000000000000000"
      }
    ]
  }
}
```

### All snapshots across all tokens in a time window

```graphql
{
  tokenSnapshots(
    where: {
      timestamp_gte: "1700000000"
      timestamp_lte: "1700086400"
    }
    orderBy: volumeBNB
    orderDirection: desc
    first: 100
  ) {
    token { id name symbol }
    blockNumber
    timestamp
    volumeBNB
    buyCount
    sellCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenSnapshots": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM"
        },
        "blockNumber": "38120030",
        "timestamp": "1700086490",
        "volumeBNB": "2000000000000000000",
        "buyCount": 4,
        "sellCount": 1
      }
    ]
  }
}
```

---

## Holders

`Holder` entities track the current ERC-20 balance of every address that has ever received a token while it is on the bonding curve. Tracking stops once the token migrates to a DEX (to avoid indexing high-volume swap traffic).

### All holders of a token — sorted by balance

```graphql
{
  holders(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: balance
    orderDirection: desc
    first: 100
  ) {
    id
    address
    balance
    lastUpdatedBlock
    lastUpdatedTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "holders": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2f1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "address": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "balance": "50000000000000000000000000",
        "lastUpdatedBlock": "38120050",
        "lastUpdatedTimestamp": "1700086500"
      },
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2ccddee001122ccddee001122ccddee001122ccdd",
        "address": "0xccddee001122ccddee001122ccddee001122ccdd",
        "balance": "4850000000000000000000000",
        "lastUpdatedBlock": "38120050",
        "lastUpdatedTimestamp": "1700086500"
      }
    ]
  }
}
```

### Top 10 holders (whale list)

```graphql
{
  holders(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: balance
    orderDirection: desc
    first: 10
  ) {
    address
    balance
    lastUpdatedBlock
  }
}
```

**Example response:**

```json
{
  "data": {
    "holders": [
      {
        "address": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "balance": "50000000000000000000000000",
        "lastUpdatedBlock": "38120050"
      },
      {
        "address": "0xccddee001122ccddee001122ccddee001122ccdd",
        "balance": "4850000000000000000000000",
        "lastUpdatedBlock": "38120050"
      }
    ]
  }
}
```

### Holder count for a token (via token entity)

```graphql
{
  token(id: "0xTOKEN_ADDRESS") {
    id
    name
    symbol
    holders {
      id
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "token": {
      "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      "name": "PepeMoon",
      "symbol": "PPEM",
      "holders": [
        { "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2f1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4" },
        { "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2ccddee001122ccddee001122ccddee001122ccdd" }
      ]
    }
  }
}
```

### Single wallet — all tokens held (pre-migration positions)

```graphql
{
  holders(
    where: { address: "0xWALLET_ADDRESS" }
    orderBy: balance
    orderDirection: desc
    first: 50
  ) {
    token { id name symbol raisedBNB migrated }
    balance
    lastUpdatedBlock
    lastUpdatedTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "holders": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM",
          "raisedBNB": "5200000000000000000",
          "migrated": false
        },
        "balance": "50000000000000000000000000",
        "lastUpdatedBlock": "38120050",
        "lastUpdatedTimestamp": "1700086500"
      }
    ]
  }
}
```

### Holders updated in last N blocks

```graphql
{
  holders(
    where: {
      token: "0xTOKEN_ADDRESS"
      lastUpdatedBlock_gte: "30000000"
    }
    orderBy: lastUpdatedBlock
    orderDirection: desc
    first: 50
  ) {
    address
    balance
    lastUpdatedBlock
    lastUpdatedTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "holders": [
      {
        "address": "0xccddee001122ccddee001122ccddee001122ccdd",
        "balance": "4850000000000000000000000",
        "lastUpdatedBlock": "38120050",
        "lastUpdatedTimestamp": "1700086500"
      }
    ]
  }
}
```

### Token with snapshot and holder data combined

```graphql
{
  token(id: "0xTOKEN_ADDRESS") {
    id
    name
    symbol
    raisedBNB
    migrated
    metaUri
    description
    image
    website
    twitter
    telegram
    snapshots(orderBy: blockNumber, orderDirection: desc, first: 20) {
      blockNumber
      timestamp
      openRaisedBNB
      closeRaisedBNB
      volumeBNB
      buyCount
      sellCount
    }
    holders(orderBy: balance, orderDirection: desc, first: 20) {
      address
      balance
      lastUpdatedBlock
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "token": {
      "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      "name": "PepeMoon",
      "symbol": "PPEM",
      "raisedBNB": "5200000000000000000",
      "migrated": false,
      "metaUri": "ipfs://QmPepeMoonMetaXYZ123456789abcdef",
      "description": "The moon-bound Pepe token on OneMEME.",
      "image": "QmPepeMoonImageXYZ123456789abcdef",
      "website": "https://pepemoon.io",
      "twitter": "https://twitter.com/pepemoon",
      "telegram": "https://t.me/pepemoon",
      "snapshots": [
        {
          "blockNumber": "38120080",
          "timestamp": "1700086740",
          "openRaisedBNB": "5000000000000000000",
          "closeRaisedBNB": "5200000000000000000",
          "volumeBNB": "200000000000000000",
          "buyCount": 1,
          "sellCount": 0
        }
      ],
      "holders": [
        {
          "address": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
          "balance": "50000000000000000000000000",
          "lastUpdatedBlock": "38120050"
        },
        {
          "address": "0xccddee001122ccddee001122ccddee001122ccdd",
          "balance": "4850000000000000000000000",
          "lastUpdatedBlock": "38120050"
        }
      ]
    }
  }
}
```

---

## Trending Tokens

`TokenPeriodStats` tracks buy/sell volume and trade counts in five rolling windows: `5m`, `45m`, `1h`, `1d`, `7d`. Each entity covers one (token, period, bucket) combination. Query the current bucket by filtering `periodStart` to find the bucket that contains now.

### Top trending tokens — 5 min window

```graphql
# Replace BUCKET_START with: Math.floor(Date.now() / 1000 / 300) * 300
{
  tokenPeriodStats(
    where: { period: "5m", periodStart: "BUCKET_START" }
    orderBy: volumeBNB
    orderDirection: desc
    first: 20
  ) {
    token { id name symbol raisedBNB migrated }
    volumeBNB
    buyVolumeBNB
    sellVolumeBNB
    buysCount
    sellsCount
    openRaisedBNB
    closeRaisedBNB
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenPeriodStats": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM",
          "raisedBNB": "5200000000000000000",
          "migrated": false
        },
        "volumeBNB": "550000000000000000",
        "buyVolumeBNB": "400000000000000000",
        "sellVolumeBNB": "150000000000000000",
        "buysCount": "4",
        "sellsCount": "1",
        "openRaisedBNB": "5000000000000000000",
        "closeRaisedBNB": "5200000000000000000"
      },
      {
        "token": {
          "id": "0x9988776655443322998877665544332299887766",
          "name": "DogeKing",
          "symbol": "DGKG",
          "raisedBNB": "1800000000000000000",
          "migrated": false
        },
        "volumeBNB": "200000000000000000",
        "buyVolumeBNB": "200000000000000000",
        "sellVolumeBNB": "0",
        "buysCount": "2",
        "sellsCount": "0",
        "openRaisedBNB": "1600000000000000000",
        "closeRaisedBNB": "1800000000000000000"
      }
    ]
  }
}
```

### Top trending tokens — 1 hour window

```graphql
# Replace BUCKET_START with: Math.floor(Date.now() / 1000 / 3600) * 3600
{
  tokenPeriodStats(
    where: { period: "1h", periodStart: "BUCKET_START" }
    orderBy: volumeBNB
    orderDirection: desc
    first: 20
  ) {
    token { id name symbol raisedBNB migrated }
    volumeBNB
    buyVolumeBNB
    sellVolumeBNB
    buysCount
    sellsCount
    openRaisedBNB
    closeRaisedBNB
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenPeriodStats": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM",
          "raisedBNB": "5200000000000000000",
          "migrated": false
        },
        "volumeBNB": "4100000000000000000",
        "buyVolumeBNB": "3500000000000000000",
        "sellVolumeBNB": "600000000000000000",
        "buysCount": "35",
        "sellsCount": "8",
        "openRaisedBNB": "1000000000000000000",
        "closeRaisedBNB": "5200000000000000000"
      }
    ]
  }
}
```

### Top trending tokens — 24 hour window

```graphql
# Replace BUCKET_START with: Math.floor(Date.now() / 1000 / 86400) * 86400
{
  tokenPeriodStats(
    where: { period: "1d", periodStart: "BUCKET_START" }
    orderBy: volumeBNB
    orderDirection: desc
    first: 20
  ) {
    token { id name symbol raisedBNB migrated }
    volumeBNB
    buyVolumeBNB
    sellVolumeBNB
    buysCount
    sellsCount
    openRaisedBNB
    closeRaisedBNB
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenPeriodStats": [
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM",
          "raisedBNB": "5200000000000000000",
          "migrated": false
        },
        "volumeBNB": "8400000000000000000",
        "buyVolumeBNB": "7000000000000000000",
        "sellVolumeBNB": "1400000000000000000",
        "buysCount": "84",
        "sellsCount": "21",
        "openRaisedBNB": "0",
        "closeRaisedBNB": "5200000000000000000"
      }
    ]
  }
}
```

### Top trending tokens — 7 day window

```graphql
# Replace BUCKET_START with: Math.floor(Date.now() / 1000 / 604800) * 604800
{
  tokenPeriodStats(
    where: { period: "7d", periodStart: "BUCKET_START" }
    orderBy: volumeBNB
    orderDirection: desc
    first: 20
  ) {
    token { id name symbol raisedBNB migrated }
    volumeBNB
    buyVolumeBNB
    sellVolumeBNB
    buysCount
    sellsCount
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenPeriodStats": [
      {
        "token": {
          "id": "0x1122334455667788112233445566778811223344",
          "name": "ShibaRocket",
          "symbol": "SHRKT",
          "raisedBNB": "0",
          "migrated": true
        },
        "volumeBNB": "40500000000000000000",
        "buyVolumeBNB": "32000000000000000000",
        "sellVolumeBNB": "8500000000000000000",
        "buysCount": "312",
        "sellsCount": "97"
      },
      {
        "token": {
          "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
          "name": "PepeMoon",
          "symbol": "PPEM",
          "raisedBNB": "5200000000000000000",
          "migrated": false
        },
        "volumeBNB": "8400000000000000000",
        "buyVolumeBNB": "7000000000000000000",
        "sellVolumeBNB": "1400000000000000000",
        "buysCount": "84",
        "sellsCount": "21"
      }
    ]
  }
}
```

### All period stats for a specific token

```graphql
{
  tokenPeriodStats(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: periodStart
    orderDirection: desc
    first: 50
  ) {
    period
    periodStart
    volumeBNB
    buyVolumeBNB
    sellVolumeBNB
    buysCount
    sellsCount
    openRaisedBNB
    closeRaisedBNB
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenPeriodStats": [
      {
        "period": "5m",
        "periodStart": "1700086800",
        "volumeBNB": "200000000000000000",
        "buyVolumeBNB": "200000000000000000",
        "sellVolumeBNB": "0",
        "buysCount": "2",
        "sellsCount": "0",
        "openRaisedBNB": "5000000000000000000",
        "closeRaisedBNB": "5200000000000000000"
      },
      {
        "period": "1h",
        "periodStart": "1700085600",
        "volumeBNB": "4100000000000000000",
        "buyVolumeBNB": "3500000000000000000",
        "sellVolumeBNB": "600000000000000000",
        "buysCount": "35",
        "sellsCount": "8",
        "openRaisedBNB": "1000000000000000000",
        "closeRaisedBNB": "5200000000000000000"
      },
      {
        "period": "1d",
        "periodStart": "1700006400",
        "volumeBNB": "8400000000000000000",
        "buyVolumeBNB": "7000000000000000000",
        "sellVolumeBNB": "1400000000000000000",
        "buysCount": "84",
        "sellsCount": "21",
        "openRaisedBNB": "0",
        "closeRaisedBNB": "5200000000000000000"
      }
    ]
  }
}
```

### Token 24 h history — all hourly buckets

```graphql
{
  tokenPeriodStats(
    where: { token: "0xTOKEN_ADDRESS", period: "1h" }
    orderBy: periodStart
    orderDirection: desc
    first: 24
  ) {
    periodStart
    volumeBNB
    buyVolumeBNB
    sellVolumeBNB
    buysCount
    sellsCount
    openRaisedBNB
    closeRaisedBNB
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokenPeriodStats": [
      {
        "periodStart": "1700085600",
        "volumeBNB": "4100000000000000000",
        "buyVolumeBNB": "3500000000000000000",
        "sellVolumeBNB": "600000000000000000",
        "buysCount": "35",
        "sellsCount": "8",
        "openRaisedBNB": "1000000000000000000",
        "closeRaisedBNB": "5200000000000000000"
      },
      {
        "periodStart": "1700082000",
        "volumeBNB": "2100000000000000000",
        "buyVolumeBNB": "2100000000000000000",
        "sellVolumeBNB": "0",
        "buysCount": "21",
        "sellsCount": "0",
        "openRaisedBNB": "0",
        "closeRaisedBNB": "1000000000000000000"
      }
    ]
  }
}
```

---

## OneCoinLocker

The `OneCoinLocker` indexes token locks created through `1CoinLocker.sol`. Each lock has an owner, a token, a cliff or linear vesting schedule, and a withdrawal/transfer history.

### All locks — newest first

```graphql
{
  locks(orderBy: createdAtTimestamp, orderDirection: desc, first: 20) {
    id
    lockId
    locker { id fee }
    owner
    token
    amount
    withdrawn
    lockDate
    startTime
    endTime
    lockType
    isLP
    description
    renounced
    createdAtTimestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "locks": [
      {
        "id": "0x6c6e9740753d9f6c1e5d61c8bc0f34e37590f6c500000000000000000000000000000000001",
        "lockId": "1",
        "locker": { "id": "0x6c6e9740753d9f6c1e5d61c8bc0f34e37590f6c5", "fee": "10000000000000000" },
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "token": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "amount": "100000000000000000000000000",
        "withdrawn": "0",
        "lockDate": "1700086400",
        "startTime": "0",
        "endTime": "1731622400",
        "lockType": "Cliff",
        "isLP": false,
        "description": "Team tokens",
        "renounced": false,
        "createdAtTimestamp": "1700086400",
        "txHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"
      }
    ]
  }
}
```

### Locks for a specific token

```graphql
{
  locks(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    lockId
    owner
    amount
    withdrawn
    lockDate
    endTime
    lockType
    isLP
    renounced
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "locks": [
      {
        "lockId": "1",
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "amount": "100000000000000000000000000",
        "withdrawn": "0",
        "lockDate": "1700086400",
        "endTime": "1731622400",
        "lockType": "Cliff",
        "isLP": false,
        "renounced": false,
        "createdAtTimestamp": "1700086400"
      }
    ]
  }
}
```

### Active locks held by a wallet

```graphql
{
  locks(
    where: { owner: "0xWALLET_ADDRESS", renounced: false }
    orderBy: endTime
    orderDirection: asc
  ) {
    lockId
    token
    amount
    withdrawn
    lockDate
    endTime
    lockType
    isLP
  }
}
```

**Example response:**

```json
{
  "data": {
    "locks": [
      {
        "lockId": "1",
        "token": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "amount": "100000000000000000000000000",
        "withdrawn": "0",
        "lockDate": "1700086400",
        "endTime": "1731622400",
        "lockType": "Cliff",
        "isLP": false
      }
    ]
  }
}
```

### LP locks only

```graphql
{
  locks(
    where: { isLP: true }
    orderBy: createdAtTimestamp
    orderDirection: desc
    first: 20
  ) {
    lockId
    owner
    token
    amount
    withdrawn
    endTime
    renounced
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "locks": [
      {
        "lockId": "5",
        "owner": "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaab",
        "token": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
        "amount": "50000000000000000",
        "withdrawn": "0",
        "endTime": "1763158400",
        "renounced": false,
        "createdAtTimestamp": "1700172800"
      }
    ]
  }
}
```

### Lock with withdrawal history

```graphql
{
  lock(id: "0xLOCK_ENTITY_ID") {
    lockId
    owner
    token
    amount
    withdrawn
    endTime
    lockType
    withdrawals(orderBy: timestamp, orderDirection: desc) {
      amount
      nativeFee
      timestamp
      txHash
    }
    transfers(orderBy: timestamp, orderDirection: desc) {
      from
      to
      timestamp
      txHash
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "lock": {
      "lockId": "1",
      "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
      "token": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      "amount": "100000000000000000000000000",
      "withdrawn": "20000000000000000000000000",
      "endTime": "1731622400",
      "lockType": "Linear",
      "withdrawals": [
        {
          "amount": "20000000000000000000000000",
          "nativeFee": "10000000000000000",
          "timestamp": "1715000000",
          "txHash": "0xwith1234with1234with1234with1234with1234with1234with1234with1234"
        }
      ],
      "transfers": []
    }
  }
}
```

### Locker contract state

```graphql
{
  lockers {
    id
    totalLocks
    activeLocks
    fee
  }
}
```

**Example response:**

```json
{
  "data": {
    "lockers": [
      {
        "id": "0x6c6e9740753d9f6c1e5d61c8bc0f34e37590f6c5",
        "totalLocks": "42",
        "activeLocks": "38",
        "fee": "10000000000000000"
      }
    ]
  }
}
```

---

## Spark

The Spark system lets anyone launch an ownerless ERC-20 token with a permanent Uniswap V3 full-range LP position locked inside SparkLocker. Swap fees accrue to the LP NFT and can be claimed and split between the creator, platform, and charity.

### All launched tokens — newest first

```graphql
{
  sparkLaunchedTokens(orderBy: createdAtTimestamp, orderDirection: desc, first: 20) {
    id
    name
    symbol
    metaURI
    creator
    factory
    positionManager
    quoteToken
    feeWallet
    pool
    tokenId
    claimCount
    totalCreatorFees0
    totalCreatorFees1
    totalPlatformFees0
    totalPlatformFees1
    totalCharityFees0
    totalCharityFees1
    createdAtTimestamp
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "sparkLaunchedTokens": [
      {
        "id": "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
        "name": "SparkPepe",
        "symbol": "SPPE",
        "metaURI": "ipfs://QmSparkPepeMetaXYZ",
        "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "factory": "0x1f98431c8ad98523631ae4a59f267346ea31f984",
        "positionManager": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
        "quoteToken": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "feeWallet": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "pool": "0x1234abcd1234abcd1234abcd1234abcd1234abcd",
        "tokenId": "12345",
        "claimCount": "3",
        "totalCreatorFees0": "450000000000000000",
        "totalCreatorFees1": "900000000000000000",
        "totalPlatformFees0": "160000000000000000",
        "totalPlatformFees1": "320000000000000000",
        "totalCharityFees0": "32000000000000000",
        "totalCharityFees1": "64000000000000000",
        "createdAtTimestamp": "1700086400",
        "txHash": "0xlaun1234laun1234laun1234laun1234laun1234laun1234laun1234laun1234"
      }
    ]
  }
}
```

### Single Spark token — full detail with fee claims

```graphql
{
  sparkLaunchedToken(id: "0xTOKEN_ADDRESS") {
    id
    name
    symbol
    metaURI
    creator
    factory
    positionManager
    quoteToken
    feeWallet
    pool
    tokenId
    claimCount
    totalCreatorFees0
    totalCreatorFees1
    totalPlatformFees0
    totalPlatformFees1
    totalCharityFees0
    totalCharityFees1
    createdAtTimestamp
    txHash
    feeClaims(orderBy: timestamp, orderDirection: desc, first: 20) {
      id
      feeWallet
      creator0
      creator1
      platform0
      platform1
      charity0
      charity1
      timestamp
      txHash
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "sparkLaunchedToken": {
      "id": "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
      "name": "SparkPepe",
      "symbol": "SPPE",
      "metaURI": "ipfs://QmSparkPepeMetaXYZ",
      "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
      "factory": "0x1f98431c8ad98523631ae4a59f267346ea31f984",
      "positionManager": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
      "quoteToken": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      "feeWallet": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
      "pool": "0x1234abcd1234abcd1234abcd1234abcd1234abcd",
      "tokenId": "12345",
      "claimCount": "3",
      "totalCreatorFees0": "450000000000000000",
      "totalCreatorFees1": "900000000000000000",
      "totalPlatformFees0": "160000000000000000",
      "totalPlatformFees1": "320000000000000000",
      "totalCharityFees0": "32000000000000000",
      "totalCharityFees1": "64000000000000000",
      "createdAtTimestamp": "1700086400",
      "txHash": "0xlaun1234laun1234laun1234laun1234laun1234laun1234laun1234laun1234",
      "feeClaims": [
        {
          "id": "0xclaim111claim111claim111claim111claim111claim111claim111claim11100",
          "feeWallet": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
          "creator0": "150000000000000000",
          "creator1": "300000000000000000",
          "platform0": "53000000000000000",
          "platform1": "107000000000000000",
          "charity0": "10000000000000000",
          "charity1": "21000000000000000",
          "timestamp": "1700200000",
          "txHash": "0xclaim111claim111claim111claim111claim111claim111claim111claim111"
        }
      ]
    }
  }
}
```

### Tokens launched by a specific creator

```graphql
{
  sparkLaunchedTokens(
    where: { creator: "0xCREATOR_ADDRESS" }
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    id
    name
    symbol
    quoteToken
    pool
    claimCount
    totalCreatorFees0
    totalCreatorFees1
    createdAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "sparkLaunchedTokens": [
      {
        "id": "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
        "name": "SparkPepe",
        "symbol": "SPPE",
        "quoteToken": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "pool": "0x1234abcd1234abcd1234abcd1234abcd1234abcd",
        "claimCount": "3",
        "totalCreatorFees0": "450000000000000000",
        "totalCreatorFees1": "900000000000000000",
        "createdAtTimestamp": "1700086400"
      }
    ]
  }
}
```

### All fee claims — newest first

```graphql
{
  sparkFeeClaims(orderBy: timestamp, orderDirection: desc, first: 50) {
    id
    token { id name symbol }
    feeWallet
    creator0
    creator1
    platform0
    platform1
    charity0
    charity1
    timestamp
    blockNumber
    txHash
  }
}
```

**Example response:**

```json
{
  "data": {
    "sparkFeeClaims": [
      {
        "id": "0xclaim111claim111claim111claim111claim111claim111claim111claim11100",
        "token": {
          "id": "0xaaaa1111aaaa1111aaaa1111aaaa1111aaaa1111",
          "name": "SparkPepe",
          "symbol": "SPPE"
        },
        "feeWallet": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "creator0": "150000000000000000",
        "creator1": "300000000000000000",
        "platform0": "53000000000000000",
        "platform1": "107000000000000000",
        "charity0": "10000000000000000",
        "charity1": "21000000000000000",
        "timestamp": "1700200000",
        "blockNumber": "38160000",
        "txHash": "0xclaim111claim111claim111claim111claim111claim111claim111claim111"
      }
    ]
  }
}
```

### SparkLocker configuration state

```graphql
{
  sparkLockerStates {
    id
    owner
    launcher
    platformWallet
    charityWallet
    creatorBps
    platformBps
    charityBps
  }
}
```

**Example response:**

```json
{
  "data": {
    "sparkLockerStates": [
      {
        "id": "0xbbbb2222bbbb2222bbbb2222bbbb2222bbbb2222",
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "launcher": "0xcccc3333cccc3333cccc3333cccc3333cccc3333",
        "platformWallet": "0x1111222233334444111122223333444411112222",
        "charityWallet": "0x5555666677778888555566667777888855556666",
        "creatorBps": "7000",
        "platformBps": "2500",
        "charityBps": "500"
      }
    ]
  }
}
```

### Registered DEXes on SparkLauncher

```graphql
{
  sparkDexes(where: { enabled: true }) {
    id
    positionManager
    router
    enabled
    addedAtTimestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "sparkDexes": [
      {
        "id": "0x1f98431c8ad98523631ae4a59f267346ea31f984",
        "positionManager": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
        "router": "0xe592427a0aece92de3edee1f18e0157c05861564",
        "enabled": true,
        "addedAtTimestamp": "1700000000"
      }
    ]
  }
}
```

### Accepted quote tokens

```graphql
{
  sparkQuoteTokens(where: { enabled: true }) {
    id
    launchFee
    decimals
    enabled
  }
}
```

**Example response:**

```json
{
  "data": {
    "sparkQuoteTokens": [
      {
        "id": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "launchFee": "100000000000000000",
        "decimals": 18,
        "enabled": true
      }
    ]
  }
}
```

---

## Analytics & combined queries

### Token with full trade, vesting, and migration detail

```graphql
{
  token(id: "0xTOKEN_ADDRESS") {
    name
    symbol
    tokenType
    creator
    totalSupply
    raisedBNB
    migrationTarget
    migrated
    pair
    migrationBNB
    migrationLiquidityTokens
    migratedAtTimestamp
    buysCount
    sellsCount
    totalVolumeBNBBuy
    totalVolumeBNBSell
    createdAtTimestamp
    metaUri
    description
    image
    website
    twitter
    telegram
    trades(orderBy: timestamp, orderDirection: desc, first: 50) {
      type
      trader
      bnbAmount
      tokenAmount
      tokensToDead
      raisedBNBAfter
      timestamp
      txHash
    }
    vestingSchedules {
      beneficiary
      amount
      claimed
      voided
      burnedOnVoid
    }
    migrations {
      pair
      liquidityBNB
      liquidityTokens
      timestamp
      txHash
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "token": {
      "name": "ShibaRocket",
      "symbol": "SHRKT",
      "tokenType": "STANDARD",
      "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
      "totalSupply": "1000000000000000000000000000",
      "raisedBNB": "0",
      "migrationTarget": "20000000000000000000",
      "migrated": true,
      "pair": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
      "migrationBNB": "20000000000000000000",
      "migrationLiquidityTokens": "500000000000000000000000000",
      "migratedAtTimestamp": "1699950000",
      "buysCount": "312",
      "sellsCount": "97",
      "totalVolumeBNBBuy": "32000000000000000000",
      "totalVolumeBNBSell": "8500000000000000000",
      "createdAtTimestamp": "1699800000",
      "metaUri": "ipfs://QmShibaRocketMetaABC",
      "description": "To the moon on a rocket.",
      "image": "QmShibaRocketImageABC",
      "website": "https://shibarocket.io",
      "twitter": "https://twitter.com/shibarocket",
      "telegram": null,
      "trades": [
        {
          "type": "BUY",
          "trader": "0xccddee001122ccddee001122ccddee001122ccdd",
          "bnbAmount": "500000000000000000",
          "tokenAmount": "12000000000000000000000000",
          "tokensToDead": "0",
          "raisedBNBAfter": "19800000000000000000",
          "timestamp": "1699949900",
          "txHash": "0xlast1234last1234last1234last1234last1234last1234last1234last1234"
        }
      ],
      "vestingSchedules": [
        {
          "beneficiary": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
          "amount": "50000000000000000000000000",
          "claimed": "50000000000000000000000000",
          "voided": false,
          "burnedOnVoid": null
        }
      ],
      "migrations": [
        {
          "pair": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
          "liquidityBNB": "20000000000000000000",
          "liquidityTokens": "500000000000000000000000000",
          "timestamp": "1699950000",
          "txHash": "0xdead5678dead5678dead5678dead5678dead5678dead5678dead5678dead5678"
        }
      ]
    }
  }
}
```

### Creator portfolio — all tokens with volume stats

```graphql
{
  tokens(
    where: { creator: "0xCREATOR_ADDRESS" }
    orderBy: totalVolumeBNBBuy
    orderDirection: desc
  ) {
    id
    name
    symbol
    tokenType
    raisedBNB
    migrationTarget
    migrated
    pair
    buysCount
    sellsCount
    totalVolumeBNBBuy
    totalVolumeBNBSell
    createdAtTimestamp
    vestingSchedules {
      beneficiary
      amount
      claimed
      voided
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0x1122334455667788112233445566778811223344",
        "name": "ShibaRocket",
        "symbol": "SHRKT",
        "tokenType": "STANDARD",
        "raisedBNB": "0",
        "migrationTarget": "20000000000000000000",
        "migrated": true,
        "pair": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
        "buysCount": "312",
        "sellsCount": "97",
        "totalVolumeBNBBuy": "32000000000000000000",
        "totalVolumeBNBSell": "8500000000000000000",
        "createdAtTimestamp": "1699800000",
        "vestingSchedules": [
          {
            "beneficiary": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
            "amount": "50000000000000000000000000",
            "claimed": "50000000000000000000000000",
            "voided": false
          }
        ]
      },
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "tokenType": "STANDARD",
        "raisedBNB": "5200000000000000000",
        "migrationTarget": "20000000000000000000",
        "migrated": false,
        "pair": null,
        "buysCount": "84",
        "sellsCount": "21",
        "totalVolumeBNBBuy": "8400000000000000000",
        "totalVolumeBNBSell": "1050000000000000000",
        "createdAtTimestamp": "1700086400",
        "vestingSchedules": [
          {
            "beneficiary": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
            "amount": "50000000000000000000000000",
            "claimed": "10000000000000000000000000",
            "voided": false
          }
        ]
      }
    ]
  }
}
```

### Top 10 tokens by total BNB buy volume

```graphql
{
  tokens(orderBy: totalVolumeBNBBuy, orderDirection: desc, first: 10) {
    id
    name
    symbol
    tokenType
    totalVolumeBNBBuy
    totalVolumeBNBSell
    buysCount
    sellsCount
    migrated
    creator
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0x1122334455667788112233445566778811223344",
        "name": "ShibaRocket",
        "symbol": "SHRKT",
        "tokenType": "STANDARD",
        "totalVolumeBNBBuy": "32000000000000000000",
        "totalVolumeBNBSell": "8500000000000000000",
        "buysCount": "312",
        "sellsCount": "97",
        "migrated": true,
        "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4"
      },
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "tokenType": "STANDARD",
        "totalVolumeBNBBuy": "8400000000000000000",
        "totalVolumeBNBSell": "1050000000000000000",
        "buysCount": "84",
        "sellsCount": "21",
        "migrated": false,
        "creator": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4"
      }
    ]
  }
}
```

### Top 10 tokens by trade count (most active)

```graphql
{
  tokens(orderBy: buysCount, orderDirection: desc, first: 10) {
    id
    name
    symbol
    tokenType
    buysCount
    sellsCount
    totalVolumeBNBBuy
    raisedBNB
    migrated
  }
}
```

**Example response:**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0x1122334455667788112233445566778811223344",
        "name": "ShibaRocket",
        "symbol": "SHRKT",
        "tokenType": "STANDARD",
        "buysCount": "312",
        "sellsCount": "97",
        "totalVolumeBNBBuy": "32000000000000000000",
        "raisedBNB": "0",
        "migrated": true
      }
    ]
  }
}
```

### Activity leaderboard — top traders by trade count

```graphql
# The Graph does not aggregate across entities natively.
# Fetch all trades for a token and aggregate trader counts client-side.
{
  trades(
    where: { token: "0xTOKEN_ADDRESS" }
    orderBy: timestamp
    orderDirection: desc
    first: 1000
  ) {
    trader
    type
    bnbAmount
    tokenAmount
    timestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "trades": [
      {
        "trader": "0xccddee001122ccddee001122ccddee001122ccdd",
        "type": "BUY",
        "bnbAmount": "200000000000000000",
        "tokenAmount": "4850000000000000000000000",
        "timestamp": "1700086500"
      },
      {
        "trader": "0x1234567890abcdef1234567890abcdef12345678",
        "type": "SELL",
        "bnbAmount": "150000000000000000",
        "tokenAmount": "3600000000000000000000000",
        "timestamp": "1700086450"
      }
    ]
  }
}
```

### Migration pipeline — factory overview

```graphql
{
  factories {
    totalTokensCreated
    totalMigrations
  }
  activeBonding: tokens(where: { migrated: false }, orderBy: raisedBNB, orderDirection: desc, first: 10) {
    id
    name
    symbol
    raisedBNB
    migrationTarget
    buysCount
  }
  recentMigrations: migrations(orderBy: timestamp, orderDirection: desc, first: 5) {
    token { id name symbol }
    pair
    liquidityBNB
    timestamp
  }
}
```

**Example response:**

```json
{
  "data": {
    "factories": [
      {
        "totalTokensCreated": "142",
        "totalMigrations": "11"
      }
    ],
    "activeBonding": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "raisedBNB": "5200000000000000000",
        "migrationTarget": "20000000000000000000",
        "buysCount": "84"
      }
    ],
    "recentMigrations": [
      {
        "token": {
          "id": "0x1122334455667788112233445566778811223344",
          "name": "ShibaRocket",
          "symbol": "SHRKT"
        },
        "pair": "0xcafe1234cafe1234cafe1234cafe1234cafe1234",
        "liquidityBNB": "20000000000000000000",
        "timestamp": "1699950000"
      }
    ]
  }
}
```

### Governance dashboard — factory config and pending actions

```graphql
{
  factories {
    creationFee
    defaultVirtualBNB
    defaultMigrationTarget
    owner
    timelockActions(where: { executed: false, cancelled: false }) {
      id
      executeAfter
      queuedAtTimestamp
      queuedTxHash
    }
  }
}
```

**Example response:**

```json
{
  "data": {
    "factories": [
      {
        "creationFee": "100000000000000000",
        "defaultVirtualBNB": "1000000000000000000",
        "defaultMigrationTarget": "20000000000000000000",
        "owner": "0xf1f2f3f4f5f6f7f8f1f2f3f4f5f6f7f8f1f2f3f4",
        "timelockActions": [
          {
            "id": "0x1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d1a2b3c4d",
            "executeAfter": "1700172800",
            "queuedAtTimestamp": "1700086400",
            "queuedTxHash": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"
          }
        ]
      }
    ]
  }
}
```

---

## Pagination

The Graph uses `first` (page size) and `skip` (offset) for pagination, or cursor-based pagination via `id_gt` / `timestamp_gt` filters (preferred for large datasets).

### Offset-based (simple, avoid for > 5 000 results)

```graphql
# Page 1
{
  trades(orderBy: timestamp, orderDirection: desc, first: 50, skip: 0) {
    id type trader bnbAmount timestamp
  }
}

# Page 2
{
  trades(orderBy: timestamp, orderDirection: desc, first: 50, skip: 50) {
    id type trader bnbAmount timestamp
  }
}
```

**Example response (page 1):**

```json
{
  "data": {
    "trades": [
      {
        "id": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd12340000",
        "type": "BUY",
        "trader": "0xccddee001122ccddee001122ccddee001122ccdd",
        "bnbAmount": "200000000000000000",
        "timestamp": "1700086500"
      }
    ]
  }
}
```

### Cursor-based (scalable — use for large result sets)

Use the last returned `id` or `timestamp` as the cursor for the next page.

```graphql
# First page
{
  trades(orderBy: timestamp, orderDirection: desc, first: 50) {
    id
    type
    trader
    bnbAmount
    timestamp
  }
}

# Next page — pass the timestamp of the last result as the cursor
{
  trades(
    where: { timestamp_lt: "LAST_TIMESTAMP" }
    orderBy: timestamp
    orderDirection: desc
    first: 50
  ) {
    id
    type
    trader
    bnbAmount
    timestamp
  }
}
```

**Example response (first page):**

```json
{
  "data": {
    "trades": [
      {
        "id": "0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd12340000",
        "type": "BUY",
        "trader": "0xccddee001122ccddee001122ccddee001122ccdd",
        "bnbAmount": "200000000000000000",
        "timestamp": "1700086500"
      },
      {
        "id": "0xbeef5678beef5678beef5678beef5678beef5678beef5678beef5678beef56780001",
        "type": "SELL",
        "trader": "0x1234567890abcdef1234567890abcdef12345678",
        "bnbAmount": "150000000000000000",
        "timestamp": "1700086450"
      }
    ]
  }
}
```

### Cursor-based pagination for tokens

```graphql
# First page
{
  tokens(orderBy: createdAtTimestamp, orderDirection: desc, first: 20) {
    id name symbol raisedBNB migrated createdAtTimestamp
  }
}

# Next page
{
  tokens(
    where: { createdAtTimestamp_lt: "LAST_TIMESTAMP" }
    orderBy: createdAtTimestamp
    orderDirection: desc
    first: 20
  ) {
    id name symbol raisedBNB migrated createdAtTimestamp
  }
}
```

**Example response (first page):**

```json
{
  "data": {
    "tokens": [
      {
        "id": "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        "name": "PepeMoon",
        "symbol": "PPEM",
        "raisedBNB": "5200000000000000000",
        "migrated": false,
        "createdAtTimestamp": "1700086400"
      },
      {
        "id": "0x9988776655443322998877665544332299887766",
        "name": "DogeKing",
        "symbol": "DGKG",
        "raisedBNB": "1800000000000000000",
        "migrated": false,
        "createdAtTimestamp": "1700000000"
      }
    ]
  }
}
```
