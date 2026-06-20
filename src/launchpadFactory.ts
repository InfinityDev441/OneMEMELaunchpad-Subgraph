import { BigInt, Bytes, ipfs, json, JSONValueKind } from "@graphprotocol/graph-ts";
import { Token as TokenContract } from "../generated/LaunchpadFactory/Token";
import { MemeToken } from "../generated/templates";
import {
  TokenCreated,
  DefaultParamsUpdated,
  CreationFeeUpdated,
  OwnershipTransferred,
  OwnershipTransferProposed,
  PlatformFeeUpdated,
  CharityFeeUpdated,
  VestingWalletUpdated,
  TimelockQueued,
  TimelockExecuted,
  TimelockCancelled,
} from "../generated/LaunchpadFactory/LaunchpadFactory";
import { Token, TimelockAction } from "../generated/schema";
import { getOrCreateFactory, detectTokenType } from "./utils";

function loadIpfsMetadata(token: Token, uri: string): void {
  const path = uri.startsWith("ipfs://") ? uri.slice(7) : uri;
  const data = ipfs.cat(path);
  if (!data) return; // truthy check — 'data != null' crashes AS compiler on Bytes | null

  const result = json.try_fromBytes(data as Bytes);
  if (result.isError) return;

  const obj = result.value.toObject();

  const descVal = obj.get("description");
  if (descVal && descVal.kind == JSONValueKind.STRING) token.description = descVal.toString();

  const imageVal = obj.get("image");
  if (imageVal && imageVal.kind == JSONValueKind.STRING) {
    let img = imageVal.toString();
    if (img.startsWith("ipfs://")) img = img.slice(7);
    token.image = img;
  }

  const websiteVal = obj.get("website");
  if (websiteVal && websiteVal.kind == JSONValueKind.STRING) token.website = websiteVal.toString();

  const twitterVal = obj.get("twitter");
  if (twitterVal && twitterVal.kind == JSONValueKind.STRING) token.twitter = twitterVal.toString();

  const telegramVal = obj.get("telegram");
  if (telegramVal && telegramVal.kind == JSONValueKind.STRING) token.telegram = telegramVal.toString();

  // Also check nested socials object (flat fields take priority)
  const socialsVal = obj.get("socials");
  if (socialsVal && socialsVal.kind == JSONValueKind.OBJECT) {
    const socials = socialsVal.toObject();
    if (!token.website) {
      const v = socials.get("website");
      if (v && v.kind == JSONValueKind.STRING) token.website = v.toString();
    }
    if (!token.twitter) {
      const v = socials.get("twitter");
      if (v && v.kind == JSONValueKind.STRING) token.twitter = v.toString();
    }
    if (!token.telegram) {
      const v = socials.get("telegram");
      if (v && v.kind == JSONValueKind.STRING) token.telegram = v.toString();
    }
  }
}

export function handleTokenCreated(event: TokenCreated): void {
  const tokenType = detectTokenType(event.transaction.input);

  const token = new Token(event.params.token);
  token.creator         = event.params.creator;
  token.totalSupply     = event.params.totalSupply;
  token.tokenType       = tokenType;
  token.virtualBNB      = event.params.virtualBNB;
  token.migrationTarget = event.params.migrationTarget;
  token.antibotEnabled  = event.params.antibotEnabled;
  token.tradingBlock    = event.params.tradingBlock;
  token.raisedBNB       = BigInt.fromI32(0);
  token.migrated        = false;
  token.buysCount       = BigInt.fromI32(0);
  token.sellsCount      = BigInt.fromI32(0);
  token.totalVolumeBNBBuy  = BigInt.fromI32(0);
  token.totalVolumeBNBSell = BigInt.fromI32(0);
  token.lastKnownPrice  = BigInt.fromI32(0); // seeded by handleTokenRegistered once the bonding curve registers it
  token.createdAtTimestamp   = event.block.timestamp;
  token.createdAtBlockNumber = event.block.number;
  token.txHash = event.transaction.hash;

  const tokenContract = TokenContract.bind(event.params.token);
  const nameResult    = tokenContract.try_name();
  const symbolResult  = tokenContract.try_symbol();
  if (!nameResult.reverted)   token.name   = nameResult.value;
  if (!symbolResult.reverted) token.symbol = symbolResult.value;

  const metaResult = tokenContract.try_metaURI();
  if (!metaResult.reverted && metaResult.value.length > 0) {
    const uri = metaResult.value;
    token.metaUri = uri;
    loadIpfsMetadata(token, uri);
  }

  token.save();
  MemeToken.create(event.params.token);

  const factory = getOrCreateFactory();
  factory.totalTokensCreated = factory.totalTokensCreated.plus(BigInt.fromI32(1));
  if (tokenType == "STANDARD")        factory.totalStandardTokens   = factory.totalStandardTokens.plus(BigInt.fromI32(1));
  else if (tokenType == "TAX")        factory.totalTaxTokens        = factory.totalTaxTokens.plus(BigInt.fromI32(1));
  else if (tokenType == "REFLECTION") factory.totalReflectionTokens = factory.totalReflectionTokens.plus(BigInt.fromI32(1));
  else                                factory.totalUnknownTokens    = factory.totalUnknownTokens.plus(BigInt.fromI32(1));
  factory.save();
}

export function handleDefaultParamsUpdated(event: DefaultParamsUpdated): void {
  const factory = getOrCreateFactory();
  factory.defaultVirtualBNB      = event.params.newVirtualBNB;
  factory.defaultMigrationTarget = event.params.newMigrationTarget;
  factory.save();
}

export function handleCreationFeeUpdated(event: CreationFeeUpdated): void {
  const factory = getOrCreateFactory();
  factory.creationFee = event.params.newFee;
  factory.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const factory = getOrCreateFactory();
  factory.owner = event.params.next;
  factory.save();
}

export function handleOwnershipTransferProposed(event: OwnershipTransferProposed): void {
  const factory = getOrCreateFactory();
  factory.pendingOwner = event.params.proposed;
  factory.save();
}

export function handlePlatformFeeUpdated(event: PlatformFeeUpdated): void {
  const factory = getOrCreateFactory();
  factory.platformFeeBps = event.params.feeBps;
  factory.save();
}

export function handleCharityFeeUpdated(event: CharityFeeUpdated): void {
  const factory = getOrCreateFactory();
  factory.charityFeeBps = event.params.feeBps;
  factory.save();
}

export function handleVestingWalletUpdated(event: VestingWalletUpdated): void {
  const factory = getOrCreateFactory();
  factory.vestingWallet = event.params.next;
  factory.save();
}

export function handleTimelockQueued(event: TimelockQueued): void {
  const id = event.params.actionId;
  let action = TimelockAction.load(id);
  if (action == null) {
    action = new TimelockAction(id);
  }
  action.factory      = getOrCreateFactory().id;
  action.executeAfter = event.params.executeAfter;
  action.executed  = false;
  action.cancelled = false;
  action.queuedAtTimestamp   = event.block.timestamp;
  action.queuedAtBlockNumber = event.block.number;
  action.queuedTxHash        = event.transaction.hash;
  action.save();
}

export function handleTimelockExecuted(event: TimelockExecuted): void {
  const action = TimelockAction.load(event.params.actionId);
  if (action == null) return;
  action.executed = true;
  action.executedTxHash = event.transaction.hash;
  action.save();
}

export function handleTimelockCancelled(event: TimelockCancelled): void {
  const action = TimelockAction.load(event.params.actionId);
  if (action == null) return;
  action.cancelled = true;
  action.cancelledTxHash = event.transaction.hash;
  action.save();
}
