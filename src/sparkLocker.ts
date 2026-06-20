import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  PositionRegistered,
  FeesClaimed,
  FeeBpsUpdated,
  PlatformWalletSet,
  CharityWalletSet,
  LauncherSet,
  OwnershipTransferred,
  EmergencyWithdraw,
} from "../generated/SparkLocker/SparkLocker";
import { SparkLocker as SparkLockerContract } from "../generated/SparkLocker/SparkLocker";
import { SparkLaunchedToken, SparkFeeClaim, SparkLockerState } from "../generated/schema";

function getOrCreateLockerState(contractAddr: Address): SparkLockerState {
  const id = contractAddr as Bytes;
  let state = SparkLockerState.load(id);
  if (state != null) return state as SparkLockerState;

  // First time: read initial values from contract (set in constructor — no events emitted).
  const locker = SparkLockerContract.bind(contractAddr);

  state = new SparkLockerState(id);

  const ownerResult    = locker.try_owner();
  const platformResult = locker.try_platformWallet();
  const charityResult  = locker.try_charityWallet();
  const cBpsResult     = locker.try_creatorBps();
  const pBpsResult     = locker.try_platformBps();
  const chBpsResult    = locker.try_charityBps();

  state.owner          = ownerResult.reverted    ? Bytes.empty() : ownerResult.value;
  state.platformWallet = platformResult.reverted  ? Bytes.empty() : platformResult.value;
  state.charityWallet  = charityResult.reverted   ? Bytes.empty() : charityResult.value;
  state.creatorBps     = cBpsResult.reverted      ? BigInt.fromI32(7000) : cBpsResult.value;
  state.platformBps    = pBpsResult.reverted      ? BigInt.fromI32(2500) : pBpsResult.value;
  state.charityBps     = chBpsResult.reverted     ? BigInt.fromI32(500)  : chBpsResult.value;
  state.save();
  return state as SparkLockerState;
}

export function handlePositionRegistered(event: PositionRegistered): void {
  // Seize the first event to snapshot the locker's constructor-set state.
  getOrCreateLockerState(event.address);
}

export function handleFeesClaimed(event: FeesClaimed): void {
  const token = SparkLaunchedToken.load(event.params.token);
  if (token == null) return;

  const claimId = event.transaction.hash.concatI32(event.logIndex.toI32());
  const claim   = new SparkFeeClaim(claimId);
  claim.token     = event.params.token;
  claim.feeWallet = event.params.feeWallet;
  claim.creator0  = event.params.creator0;
  claim.creator1  = event.params.creator1;
  claim.platform0 = event.params.platform0;
  claim.platform1 = event.params.platform1;
  claim.charity0  = event.params.charity0;
  claim.charity1  = event.params.charity1;
  claim.timestamp   = event.block.timestamp;
  claim.blockNumber = event.block.number;
  claim.txHash      = event.transaction.hash;
  claim.save();

  token.totalCreatorFees0  = token.totalCreatorFees0.plus(event.params.creator0);
  token.totalCreatorFees1  = token.totalCreatorFees1.plus(event.params.creator1);
  token.totalPlatformFees0 = token.totalPlatformFees0.plus(event.params.platform0);
  token.totalPlatformFees1 = token.totalPlatformFees1.plus(event.params.platform1);
  token.totalCharityFees0  = token.totalCharityFees0.plus(event.params.charity0);
  token.totalCharityFees1  = token.totalCharityFees1.plus(event.params.charity1);
  token.claimCount         = token.claimCount.plus(BigInt.fromI32(1));
  token.save();
}

export function handleFeeBpsUpdated(event: FeeBpsUpdated): void {
  const state = getOrCreateLockerState(event.address);
  state.creatorBps  = event.params.creatorBps;
  state.platformBps = event.params.platformBps;
  state.charityBps  = event.params.charityBps;
  state.save();
}

export function handlePlatformWalletSet(event: PlatformWalletSet): void {
  const state = getOrCreateLockerState(event.address);
  state.platformWallet = event.params.wallet;
  state.save();
}

export function handleCharityWalletSet(event: CharityWalletSet): void {
  const state = getOrCreateLockerState(event.address);
  state.charityWallet = event.params.wallet;
  state.save();
}

export function handleLauncherSet(event: LauncherSet): void {
  const state = getOrCreateLockerState(event.address);
  state.launcher = event.params.launcher;
  state.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const state = getOrCreateLockerState(event.address);
  state.owner = event.params.newOwner;
  state.save();
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  const token = SparkLaunchedToken.load(event.params.token);
  if (token == null) return;
  token.lpWithdrawn = true;
  token.save();
}
