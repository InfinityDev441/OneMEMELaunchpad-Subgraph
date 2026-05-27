import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  LockCreated,
  LockEdited,
  LockDescriptionChanged,
  Withdrawn,
  LockExtended,
  LockTransferred,
  LockRenounced,
  FeeUpdated,
} from "../generated/OneCoinLocker/OneCoinLocker";
import { Locker, Lock, LockWithdrawal, LockTransfer } from "../generated/schema";

function getOrCreateLocker(address: Bytes): Locker {
  let locker = Locker.load(address);
  if (locker == null) {
    locker = new Locker(address);
    locker.totalLocks  = BigInt.fromI32(0);
    locker.activeLocks = BigInt.fromI32(0);
    locker.fee         = BigInt.fromI32(0);
    locker.save();
  }
  return locker as Locker;
}

function lockId(lockerAddress: Bytes, id: BigInt): Bytes {
  return lockerAddress.concatI32(id.toI32());
}

export function handleLockCreated(event: LockCreated): void {
  const locker = getOrCreateLocker(event.address);

  const id   = lockId(event.address, event.params.lockId);
  const lock = new Lock(id);
  lock.locker              = event.address;
  lock.lockId              = event.params.lockId;
  lock.owner               = event.params.owner;
  lock.token               = event.params.token;
  lock.amount              = event.params.amount;
  lock.withdrawn           = BigInt.fromI32(0);
  lock.lockDate            = event.block.timestamp;
  lock.startTime           = event.params.startTime;
  lock.endTime             = event.params.endTime;
  lock.lockType            = event.params.lockType == 0 ? "Cliff" : "Linear";
  lock.isLP                = event.params.isLP;
  lock.description         = "";
  lock.renounced           = false;
  lock.createdAtTimestamp  = event.block.timestamp;
  lock.createdAtBlockNumber = event.block.number;
  lock.txHash              = event.transaction.hash;
  lock.save();

  locker.totalLocks  = locker.totalLocks.plus(BigInt.fromI32(1));
  locker.activeLocks = locker.activeLocks.plus(BigInt.fromI32(1));
  locker.save();
}

export function handleLockEdited(event: LockEdited): void {
  const id   = lockId(event.address, event.params.lockId);
  const lock = Lock.load(id);
  if (lock == null) return;

  lock.amount  = event.params.newAmount;
  lock.endTime = event.params.newEndTime;
  lock.save();
}

export function handleLockDescriptionChanged(event: LockDescriptionChanged): void {
  const id   = lockId(event.address, event.params.lockId);
  const lock = Lock.load(id);
  if (lock == null) return;

  lock.description = event.params.description;
  lock.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  const id   = lockId(event.address, event.params.lockId);
  const lock = Lock.load(id);
  if (lock == null) return;

  lock.withdrawn = lock.withdrawn.plus(event.params.amount);
  lock.save();

  const wId      = event.transaction.hash.concatI32(event.logIndex.toI32());
  const withdrawal = new LockWithdrawal(wId);
  withdrawal.lock      = id;
  withdrawal.owner     = event.params.owner;
  withdrawal.amount    = event.params.amount;
  withdrawal.nativeFee = event.params.nativeFee;
  withdrawal.timestamp  = event.block.timestamp;
  withdrawal.blockNumber = event.block.number;
  withdrawal.txHash    = event.transaction.hash;
  withdrawal.save();

  if (lock.withdrawn >= lock.amount) {
    const locker = getOrCreateLocker(event.address);
    locker.activeLocks = locker.activeLocks.minus(BigInt.fromI32(1));
    locker.save();
  }
}

export function handleLockExtended(event: LockExtended): void {
  const id   = lockId(event.address, event.params.lockId);
  const lock = Lock.load(id);
  if (lock == null) return;

  lock.endTime = event.params.newEndTime;
  lock.save();
}

export function handleLockTransferred(event: LockTransferred): void {
  const id   = lockId(event.address, event.params.lockId);
  const lock = Lock.load(id);
  if (lock == null) return;

  lock.owner = event.params.to;
  lock.save();

  const tId      = event.transaction.hash.concatI32(event.logIndex.toI32());
  const transfer = new LockTransfer(tId);
  transfer.lock        = id;
  transfer.from        = event.params.from;
  transfer.to          = event.params.to;
  transfer.timestamp   = event.block.timestamp;
  transfer.blockNumber = event.block.number;
  transfer.txHash      = event.transaction.hash;
  transfer.save();
}

export function handleLockRenounced(event: LockRenounced): void {
  const id   = lockId(event.address, event.params.lockId);
  const lock = Lock.load(id);
  if (lock == null) return;

  lock.owner     = null;
  lock.renounced = true;
  lock.save();

  const locker = getOrCreateLocker(event.address);
  locker.activeLocks = locker.activeLocks.minus(BigInt.fromI32(1));
  locker.save();
}

export function handleFeeUpdated(event: FeeUpdated): void {
  const locker = getOrCreateLocker(event.address);
  locker.fee = event.params.newFee;
  locker.save();
}
