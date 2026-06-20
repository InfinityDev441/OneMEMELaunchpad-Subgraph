import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  TokenLaunched,
  DexAdded,
  DexDisabled,
  QuoteTokenAdded,
  QuoteTokenDisabled,
} from "../generated/SparkLauncher/SparkLauncher";
import { SparkToken as SparkTokenContract } from "../generated/SparkLauncher/SparkToken";
import {
  SparkLaunchedToken,
  SparkDex,
  SparkQuoteToken,
} from "../generated/schema";

export function handleTokenLaunched(event: TokenLaunched): void {
  const sparkToken = new SparkLaunchedToken(event.params.token);

  const tokenContract  = SparkTokenContract.bind(event.params.token);
  const nameResult     = tokenContract.try_name();
  const symbolResult   = tokenContract.try_symbol();
  const metaResult     = tokenContract.try_metaURI();
  if (!nameResult.reverted)   sparkToken.name    = nameResult.value;
  if (!symbolResult.reverted) sparkToken.symbol  = symbolResult.value;
  if (!metaResult.reverted)   sparkToken.metaURI = metaResult.value;

  sparkToken.creator    = event.params.creator;
  sparkToken.factory    = event.params.factory;
  sparkToken.quoteToken = event.params.quoteToken;
  sparkToken.feeWallet  = event.params.feeWallet;
  sparkToken.pool       = event.params.pool;
  sparkToken.tokenId    = event.params.tokenId;

  // Derive positionManager from the registered DEX entry (written by handleDexAdded).
  const dex = SparkDex.load(event.params.factory);
  sparkToken.positionManager = dex != null
    ? dex.positionManager
    : Bytes.empty();

  sparkToken.totalCreatorFees0  = BigInt.fromI32(0);
  sparkToken.totalCreatorFees1  = BigInt.fromI32(0);
  sparkToken.totalPlatformFees0 = BigInt.fromI32(0);
  sparkToken.totalPlatformFees1 = BigInt.fromI32(0);
  sparkToken.totalCharityFees0  = BigInt.fromI32(0);
  sparkToken.totalCharityFees1  = BigInt.fromI32(0);
  sparkToken.claimCount         = BigInt.fromI32(0);
  sparkToken.lpWithdrawn        = false;

  sparkToken.createdAtTimestamp   = event.block.timestamp;
  sparkToken.createdAtBlockNumber = event.block.number;
  sparkToken.txHash               = event.transaction.hash;
  sparkToken.save();
}

export function handleDexAdded(event: DexAdded): void {
  let dex = SparkDex.load(event.params.factory);
  if (dex == null) {
    dex = new SparkDex(event.params.factory);
    dex.addedAtTimestamp   = event.block.timestamp;
    dex.addedAtBlockNumber = event.block.number;
  }
  dex.positionManager = event.params.positionManager;
  dex.router          = event.params.router;
  dex.enabled         = true;
  dex.save();
}

export function handleDexDisabled(event: DexDisabled): void {
  const dex = SparkDex.load(event.params.factory);
  if (dex == null) return;
  dex.enabled = false;
  dex.save();
}

export function handleQuoteTokenAdded(event: QuoteTokenAdded): void {
  let qt = SparkQuoteToken.load(event.params.token);
  if (qt == null) qt = new SparkQuoteToken(event.params.token);
  qt.launchFee = event.params.fee;
  qt.decimals  = event.params.decimals;
  qt.enabled   = true;
  qt.save();
}

export function handleQuoteTokenDisabled(event: QuoteTokenDisabled): void {
  const qt = SparkQuoteToken.load(event.params.token);
  if (qt == null) return;
  qt.enabled = false;
  qt.save();
}
