/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  ExecutableScript,
  ExecuteScriptParams,
  ExecuteScriptResult,
  Script,
  SignerProvider,
  HexString,
} from "@alephium/web3";
import { getContractByCodeHash } from "./contracts";
import { default as CancelStreamScriptJson } from "../scripts/CancelStream.ral.json";
import { default as CreateCustomStreamScriptJson } from "../scripts/CreateCustomStream.ral.json";
import { default as CreateIntervalStreamScriptJson } from "../scripts/CreateIntervalStream.ral.json";
import { default as CreateLinearStreamScriptJson } from "../scripts/CreateLinearStream.ral.json";
import { default as TransferStreamScriptJson } from "../scripts/TransferStream.ral.json";
import { default as WithdrawStreamScriptJson } from "../scripts/WithdrawStream.ral.json";
import { StreamConfig, AllStructs } from "./types";

export const CancelStream = new ExecutableScript<{
  factory: HexString;
  id: bigint;
}>(
  Script.fromJson(CancelStreamScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const CreateCustomStream = new ExecutableScript<{
  factory: HexString;
  tokenId: HexString;
  amount: bigint;
  recipient: Address;
  isCancelable: boolean;
  isTransferable: boolean;
  startTimestamp: bigint;
  unlockSteps: HexString;
}>(
  Script.fromJson(CreateCustomStreamScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const CreateIntervalStream = new ExecutableScript<{
  factory: HexString;
  tokenId: HexString;
  amount: bigint;
  recipient: Address;
  isCancelable: boolean;
  isTransferable: boolean;
  startTimestamp: bigint;
  unlockInterval: bigint;
  unlockPercentage: bigint;
}>(
  Script.fromJson(CreateIntervalStreamScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const CreateLinearStream = new ExecutableScript<{
  factory: HexString;
  tokenId: HexString;
  amount: bigint;
  recipient: Address;
  isCancelable: boolean;
  isTransferable: boolean;
  startTimestamp: bigint;
  endTimestamp: bigint;
}>(
  Script.fromJson(CreateLinearStreamScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const TransferStream = new ExecutableScript<{
  factory: HexString;
  id: bigint;
  newRecipient: Address;
}>(
  Script.fromJson(TransferStreamScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const WithdrawStream = new ExecutableScript<{
  factory: HexString;
  id: bigint;
  amount: bigint;
}>(
  Script.fromJson(WithdrawStreamScriptJson, "", AllStructs),
  getContractByCodeHash
);
