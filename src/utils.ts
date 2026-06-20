import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Factory } from "../generated/schema";

// Singleton ID for the Factory entity — not an actual address, just a stable key.
export const FACTORY_ID = Bytes.fromUTF8("factory");

// Function selectors — verified against deployed Factory 0xA78df27496825B29CbdCD3778e6bc375a646Ae04.
export const SELECTOR_CREATE_TOKEN = "6b948c92"; // createToken (STANDARD)
export const SELECTOR_CREATE_TT    = "917a6333"; // createTT    (TAX)
export const SELECTOR_CREATE_RFL   = "13b0f58a"; // createRFL   (REFLECTION)

export function getOrCreateFactory(): Factory {
  let factory = Factory.load(FACTORY_ID);
  if (factory == null) {
    factory = new Factory(FACTORY_ID);
    factory.totalTokensCreated    = BigInt.fromI32(0);
    factory.totalStandardTokens   = BigInt.fromI32(0);
    factory.totalTaxTokens        = BigInt.fromI32(0);
    factory.totalReflectionTokens = BigInt.fromI32(0);
    factory.totalUnknownTokens    = BigInt.fromI32(0);
    factory.totalBuys             = BigInt.fromI32(0);
    factory.totalSells            = BigInt.fromI32(0);
    factory.totalMigrations       = BigInt.fromI32(0);
    factory.creationFee           = BigInt.fromI32(0);
    factory.defaultVirtualBNB     = BigInt.fromI32(0);
    factory.defaultMigrationTarget= BigInt.fromI32(0);
    factory.owner                 = Bytes.empty();
    factory.platformFeeBps        = BigInt.fromI32(0);
    factory.charityFeeBps         = BigInt.fromI32(0);
    factory.save();
  }
  return factory as Factory;
}

export function detectTokenType(txInput: Bytes): string {
  if (txInput.length < 4) return "UNKNOWN";
  const selector = txInput.toHexString().slice(2, 10).toLowerCase();
  if (selector == SELECTOR_CREATE_TOKEN) return "STANDARD";
  if (selector == SELECTOR_CREATE_TT)   return "TAX";
  if (selector == SELECTOR_CREATE_RFL)  return "REFLECTION";
  return "UNKNOWN";
}
