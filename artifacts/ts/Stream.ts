/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
  addStdIdToFields,
  encodeContractFields,
} from "@alephium/web3";
import { default as StreamContractJson } from "../Stream.ral.json";
import { getContractByCodeHash } from "./contracts";
import { StreamConfig, AllStructs } from "./types";

// Custom types for the contract
export namespace StreamTypes {
  export type Fields = {
    factoryContractId: HexString;
    creator: Address;
    recipient: Address;
    tokenId: HexString;
    amount: bigint;
    config: StreamConfig;
    withdrawnAmount: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getStreamDetails: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<[Address, Address, HexString, StreamConfig]>;
    };
    getLockedAmount: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getAvailableAmount: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<StreamInstance, StreamTypes.Fields> {
  encodeFields(fields: StreamTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as StreamTypes.Fields;
  }

  consts = { StreamError: { NotAuthorized: BigInt(0) } };

  at(address: string): StreamInstance {
    return new StreamInstance(address);
  }

  tests = {
    getStreamDetails: async (
      params: Omit<
        TestContractParamsWithoutMaps<StreamTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<
      TestContractResultWithoutMaps<[Address, Address, HexString, StreamConfig]>
    > => {
      return testMethod(
        this,
        "getStreamDetails",
        params,
        getContractByCodeHash
      );
    },
    getLockedAmount: async (
      params: Omit<
        TestContractParamsWithoutMaps<StreamTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getLockedAmount", params, getContractByCodeHash);
    },
    getAvailableAmount: async (
      params: Omit<
        TestContractParamsWithoutMaps<StreamTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getAvailableAmount",
        params,
        getContractByCodeHash
      );
    },
    addWithdrawnAmount: async (
      params: TestContractParamsWithoutMaps<
        StreamTypes.Fields,
        { value: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "addWithdrawnAmount",
        params,
        getContractByCodeHash
      );
    },
    destroyStream: async (
      params: Omit<
        TestContractParamsWithoutMaps<StreamTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "destroyStream", params, getContractByCodeHash);
    },
  };
}

// Use this object to test and deploy the contract
export const Stream = new Factory(
  Contract.fromJson(
    StreamContractJson,
    "",
    "7d7e88b23ee716f5756632b93c213c231aa256ba981d999d4d3398421b5e055c",
    AllStructs
  )
);

// Use this class to interact with the blockchain
export class StreamInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<StreamTypes.State> {
    return fetchContractState(Stream, this);
  }

  methods = {
    getStreamDetails: async (
      params?: StreamTypes.CallMethodParams<"getStreamDetails">
    ): Promise<StreamTypes.CallMethodResult<"getStreamDetails">> => {
      return callMethod(
        Stream,
        this,
        "getStreamDetails",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getLockedAmount: async (
      params?: StreamTypes.CallMethodParams<"getLockedAmount">
    ): Promise<StreamTypes.CallMethodResult<"getLockedAmount">> => {
      return callMethod(
        Stream,
        this,
        "getLockedAmount",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getAvailableAmount: async (
      params?: StreamTypes.CallMethodParams<"getAvailableAmount">
    ): Promise<StreamTypes.CallMethodResult<"getAvailableAmount">> => {
      return callMethod(
        Stream,
        this,
        "getAvailableAmount",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends StreamTypes.MultiCallParams>(
    calls: Calls
  ): Promise<StreamTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      Stream,
      this,
      calls,
      getContractByCodeHash
    )) as StreamTypes.MultiCallResults<Calls>;
  }
}
