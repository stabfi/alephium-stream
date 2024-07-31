/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Address, HexString, Val, Struct } from "@alephium/web3";
import { default as allStructsJson } from "../structs.ral.json";
export const AllStructs = allStructsJson.map((json) => Struct.fromJson(json));
export interface StreamConfig extends Record<string, Val> {
  kind: bigint;
  isCancelable: boolean;
  startTimestamp: bigint;
  endTimestamp: bigint;
  unlockInterval: bigint;
  unlockPercentage: bigint;
  unlockSteps: HexString;
}
